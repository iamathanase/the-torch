import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useOnlineStatus } from "@/context/OnlineStatusContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, CheckCheck, Clock, Dot, Zap, Paperclip, Users } from "lucide-react";
import { Message } from "@/data/types";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Swal from 'sweetalert2';

export default function Messages() {
  const { user } = useAuth();
  const { messages, markMessageAsRead, deleteMessage, updateMessageDeliveryStatus, sendMessage, users } = useData();
  const { isUserOnline } = useOnlineStatus();
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  
  const myMessages = messages.filter((m) => m.toId === user!.id || m.fromId === user!.id);
  const unreadMessages = myMessages.filter((m) => !m.read && m.toId === user!.id);

  // Handle direct message from Browse page
  useEffect(() => {
    if (location.state?.directMessageUserId) {
      setSelectedConversationId(location.state.directMessageUserId);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Group messages by conversation
  const conversations = myMessages.reduce((acc, msg) => {
    const otherPersonId = msg.fromId === user!.id ? msg.toId : msg.fromId;
    const otherPersonName = msg.fromId === user!.id ? msg.toName : msg.fromName;
    const key = otherPersonId;
    
    if (!acc[key]) {
      acc[key] = { personId: otherPersonId, personName: otherPersonName, messages: [], lastMessage: msg };
    }
    acc[key].messages.push(msg);
    acc[key].lastMessage = msg;
    return acc;
  }, {} as Record<string, any>);

  const conversationList = Object.values(conversations).sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  // Auto-mark messages as delivered when viewed
  useEffect(() => {
    if (selectedConversationId) {
      const conversationMessages = myMessages.filter(m => {
        const otherId = m.fromId === user!.id ? m.toId : m.fromId;
        return otherId === selectedConversationId && m.toId === user!.id && m.deliveryStatus !== 'read';
      });
      
      conversationMessages.forEach(msg => {
        if (msg.deliveryStatus === 'sent' || msg.deliveryStatus === 'delivered') {
          updateMessageDeliveryStatus(msg.id, 'received');
          
          // Auto-read after 1 second
          setTimeout(() => {
            markMessageAsRead(msg.id);
          }, 1000);
        }
      });
    }
  }, [selectedConversationId, myMessages, markMessageAsRead, updateMessageDeliveryStatus, user]);

  const getDeliveryIcon = (deliveryStatus: string, isRead: boolean) => {
    if (isRead || deliveryStatus === 'read') return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
    if (deliveryStatus === 'received') return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
    if (deliveryStatus === 'delivered') return <Check className="h-3.5 w-3.5 text-gray-400" />;
    if (deliveryStatus === 'sent') return <Clock className="h-3.5 w-3.5 text-gray-300" />;
    return null;
  };

  const getStatusLabel = (deliveryStatus: string, isRead: boolean): string => {
    if (isRead || deliveryStatus === 'read') return 'Read';
    if (deliveryStatus === 'received') return 'Received';
    if (deliveryStatus === 'delivered') return 'Delivered';
    if (deliveryStatus === 'sent') return 'Sent';
    return '';
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
      
      const diffInHours = diffInMinutes / 60;
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      
      const diffInDays = diffInHours / 24;
      if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const selectedConversation = selectedConversationId 
    ? conversations[selectedConversationId]
    : null;

  const selectedUser = selectedConversationId
    ? users.find(u => u.id === selectedConversationId)
    : null;

  // Filter conversations based on search
  const filteredConversations = conversationList.filter(conv =>
    conv.personName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessageText.trim() && !attachmentFile) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    if (!selectedConversationId) {
      toast.error('Please select a conversation');
      return;
    }

    const now = new Date().toISOString();
    const newMsg: Message = {
      id: String(Date.now()),
      fromId: user!.id,
      fromName: user!.name,
      toId: selectedConversationId,
      toName: selectedUser?.name || 'Unknown',
      content: newMessageText.trim(),
      read: false,
      deliveryStatus: 'sent',
      sentAt: now,
      createdAt: now,
      attachments: attachmentFile ? [{
        id: `attach-${Date.now()}`,
        userId: user!.id,
        fileName: attachmentFile.name,
        fileSize: attachmentFile.size,
        fileType: attachmentFile.type,
        fileUrl: attachmentPreview || '',
        uploadedAt: now,
        purpose: 'message',
      }] : undefined,
      uploadedAt: new Date().toISOString(),
    };

    try {
      await sendMessage(newMsg);
      setNewMessageText('');
      setAttachmentFile(null);
      setAttachmentPreview(null);
      toast.success('Message sent!');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleNewMessage = async () => {
    const availableUsers = users.filter(u => u.id !== user!.id);
    
    if (availableUsers.length === 0) {
      toast.error('No users available to message');
      return;
    }

    const { value: selectedUserId } = await Swal.fire({
      title: 'Start New Conversation',
      html: `
        <select id="user-select" class="swal2-input">
          <option value="">Select a user...</option>
          ${availableUsers.map(u => `
            <option value="${u.id}">${u.name} (${u.role})</option>
          `).join('')}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Start Chat',
      preConfirm: () => {
        const select = document.getElementById('user-select') as HTMLSelectElement;
        return select.value;
      }
    });

    if (selectedUserId) {
      setSelectedConversationId(selectedUserId);
      toast.success('Conversation started!');
    }
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setAttachmentFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachmentPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }

    toast.success(`File attached: ${file.name}`);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">Messages</h1>
          <p className="mt-2 text-base text-muted-foreground">Connect with your community. Message anyone directly!</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadMessages.length > 0 && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <p className="text-sm font-semibold text-primary">{unreadMessages.length} unread</p>
            </div>
          )}
          <Button variant="hero" onClick={handleNewMessage} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {myMessages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground font-medium">No messages yet.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Click "New Message" above or visit the Browse page to find users and start messaging!</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button variant="hero" onClick={handleNewMessage} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              New Message
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/browse'} className="gap-2">
              <Users className="h-4 w-4" />
              Browse Users
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="border border-border rounded-lg bg-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-lg mb-3">Conversations</h2>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.personId}
                    onClick={() => setSelectedConversationId(conv.personId)}
                    className={`w-full p-4 border-b border-border/50 text-left hover:bg-muted/50 transition-all ${
                      selectedConversationId === conv.personId ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.personName}`}
                          alt={conv.personName}
                          className="h-10 w-10 rounded-full"
                        />
                        {isUserOnline(conv.personId) && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{conv.personName}</p>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{formatTime(conv.lastMessage.createdAt)}</p>
                      </div>
                      {conv.messages.some((m: Message) => !m.read && m.toId === user!.id) && (
                        <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="lg:col-span-2 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.personName}`}
                      alt={selectedConversation.personName}
                      className="h-10 w-10 rounded-full"
                    />
                    {isUserOnline(selectedConversation.personId) && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConversation.personName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Dot className={`h-2 w-2 ${isUserOnline(selectedConversation.personId) ? 'text-green-500' : 'text-gray-400'}`} />
                      {isUserOnline(selectedConversation.personId) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {selectedUser?.isAI && (
                  <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    <Zap className="h-3 w-3" />
                    AI Assistant
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="overflow-y-auto flex-1 p-4 space-y-3">
                {selectedConversation.messages.map((m: Message) => (
                  <div 
                    key={m.id}
                    className={`flex gap-3 ${m.fromId === user!.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        m.fromId === user!.id
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{m.content}</p>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {m.attachments.map((att) => (
                            <div key={att.id} className="text-xs">
                              {att.fileType.startsWith('image/') ? (
                                <img
                                  src={att.fileUrl}
                                  alt={att.fileName}
                                  className="max-w-[200px] h-auto rounded"
                                />
                              ) : (
                                <a
                                  href={att.fileUrl}
                                  download={att.fileName}
                                  className="flex items-center gap-1 underline hover:no-underline"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  {att.fileName}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        m.fromId === user!.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span>{formatTime(m.sentAt)}</span>
                        {m.fromId === user!.id && (
                          getDeliveryIcon(m.deliveryStatus, m.read)
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {m.fromId === user!.id && (
                        <span className="text-xs text-muted-foreground text-right">{getStatusLabel(m.deliveryStatus, m.read)}</span>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          Swal.fire({
                            title: 'Delete Message?',
                            text: 'This message will be permanently deleted.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#dc2626',
                            cancelButtonColor: '#6b7280',
                            confirmButtonText: 'Yes, Delete'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteMessage(m.id);
                              toast.success('Message deleted');
                            }
                          });
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4 space-y-3">
                {attachmentPreview && (
                  <div className="relative">
                    <img
                      src={attachmentPreview}
                      alt="Attachment preview"
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                    <button
                      onClick={() => {
                        setAttachmentFile(null);
                        setAttachmentPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
                {attachmentFile && !attachmentPreview && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm">
                    <Paperclip className="h-4 w-4" />
                    <span className="flex-1 truncate">{attachmentFile.name}</span>
                    <button
                      onClick={() => {
                        setAttachmentFile(null);
                        setAttachmentPreview(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={handleAttachmentSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <div className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </div>
                  </label>
                  <Button type="submit" variant="hero" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 border border-dashed border-border rounded-lg bg-card/50 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
