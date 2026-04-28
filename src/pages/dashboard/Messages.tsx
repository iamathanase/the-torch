import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const { messages, markMessageAsRead } = useData();
  
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

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">Messages</h1>
          <p className="mt-2 text-base text-muted-foreground">Stay connected with buyers and sellers.</p>
        </div>
        {unreadMessages.length > 0 && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
            <p className="text-sm font-semibold text-primary">{unreadMessages.length} unread</p>
          </div>
        )}
      </div>

      {myMessages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground font-medium">No messages yet.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Messages from other users will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
            {myMessages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col gap-3 rounded-lg border p-4 transition-all ${m.read 
                  ? 'border-border/60 bg-card hover:shadow-sm' 
                  : 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {m.fromId === user!.id ? `To: ${m.toName}` : `From: ${m.fromName}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{m.createdAt}</p>
                  </div>
                  {!m.read && (
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground">{m.content}</p>
                {!m.read && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => markMessageAsRead(m.id)}
                    className="w-fit"
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border/60 bg-card p-4 h-fit">
            <h3 className="font-semibold text-foreground mb-3">Conversations</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {conversationList.map((conv) => (
                <div key={conv.personId} className="p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                  <p className="font-medium text-sm text-foreground">{conv.personName}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{conv.lastMessage.content}</p>
                  {!conv.lastMessage.read && conv.lastMessage.toId === user!.id && (
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
