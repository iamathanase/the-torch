import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useOnlineStatus } from "@/context/OnlineStatusContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, CheckCheck, Clock, Dot } from "lucide-react";
import { Message } from "@/data/types";
import SendMessageModal from "@/components/modals/SendMessageModal";

export default function Messages() {
  const { user } = useAuth();
  const { messages, markMessageAsRead, deleteMessage, updateMessageDeliveryStatus } = useData();
  const { isUserOnline } = useOnlineStatus();
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  const myMessages = messages.filter((m) => m.toId === user!.id || m.fromId === user!.id);
  const unreadMessages = myMessages.filter((m) => !m.read && m.toId === user!.id);

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

  return (
    <div className="space-y-8 h-screen flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">Messages</h1>
          <p className="mt-2 text-base text-muted-foreground">Real-time messaging with read receipts and delivery status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="hero" onClick={() => setShowSendModal(true)} className="gap-2">
            <Send className="h-4 w-4" />
            Send Message
          </Button>
          {unreadMessages.length > 0 && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <p className="text-sm font-semibold text-primary">{unreadMessages.length} unread</p>
            </div>
          )}
        </div>
      </div>

      {myMessages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground font-medium">No messages yet.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Start by sending a message to someone!</p>
          <Button variant="hero" onClick={() => setShowSendModal(true)} className="mt-4 gap-2">
            <Send className="h-4 w-4" />
            Send Your First Message
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="border border-border rounded-lg bg-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {conversationList.map((conv) => (
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
              ))}
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
                        onClick={() => deleteMessage(m.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 border border-dashed border-border rounded-lg bg-card/50 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      )}

      <SendMessageModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} />
    </div>
  );
}
