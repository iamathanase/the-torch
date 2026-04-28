import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Message } from '@/data/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
}

export default function SendMessageModal({
  isOpen,
  onClose,
  recipientId = '',
}: SendMessageModalProps) {
  const { user } = useAuth();
  const { sendMessage, users } = useData();
  const [content, setContent] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(recipientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedUserId) {
      toast.error('Please select recipient and enter message');
      return;
    }

    const recipient = users.find(u => u.id === selectedUserId);
    if (!recipient) {
      toast.error('Recipient not found');
      return;
    }

    const newMessage: Message = {
      id: String(Date.now()),
      fromId: user!.id,
      fromName: user!.name,
      toId: selectedUserId,
      toName: recipient.name,
      content: content.trim(),
      read: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    sendMessage(newMessage);
    toast.success('Message sent successfully!');
    setContent('');
    setSelectedUserId(recipientId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Send Message</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Send to</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select recipient...</option>
              {users
                .filter(u => u.id !== user!.id)
                .map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSubmit} className="flex-1">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
