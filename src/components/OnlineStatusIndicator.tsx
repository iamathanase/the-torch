import { useOnlineStatus } from '@/context/OnlineStatusContext';
import { Dot } from 'lucide-react';

interface OnlineStatusIndicatorProps {
  userId: string;
  userName?: string;
  showLastSeen?: boolean;
}

export default function OnlineStatusIndicator({
  userId,
  userName,
  showLastSeen = false,
}: OnlineStatusIndicatorProps) {
  const { isUserOnline, getLastSeen, userStatuses } = useOnlineStatus();
  const isOnline = isUserOnline(userId);
  const userStatus = userStatuses[userId];
  const lastSeen = getLastSeen(userId);

  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return '';
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

  const getStatusColor = () => {
    if (isOnline) return 'text-green-500';
    if (userStatus?.status === 'away') return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-2">
      <Dot className={`h-3 w-3 ${getStatusColor()}`} />
      {userName && (
        <span className="text-sm font-medium">{userName}</span>
      )}
      {showLastSeen && (
        <span className="text-xs text-muted-foreground">
          {isOnline ? 'Online' : `Offline • ${formatLastSeen(lastSeen)}`}
        </span>
      )}
    </div>
  );
}
