import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useOnlineStatus } from '@/context/OnlineStatusContext';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Search } from 'lucide-react';
import { User } from '@/data/types';
import { useNavigate } from 'react-router-dom';

export default function Browse() {
  const { user } = useAuth();
  const { users } = useData();
  const { isUserOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Browse Users</h1>
          <p className="mt-2 text-base text-muted-foreground">Discover and connect with farmers, customers, vendors, and gardeners.</p>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <Users className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground font-medium">Admin Access Required</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Only administrators can browse all users.</p>
        </div>
      </div>
    );
  }

  // Filter users
  const filteredUsers = users.filter(u => {
    if (u.id === user!.id) return false; // Exclude current user
    
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleMessageUser = (targetUser: User) => {
    // Navigate to messages and pass the user ID to open direct message
    navigate('/dashboard/messages', { state: { directMessageUserId: targetUser.id } });
  };

  const roles = ['farmer', 'customer', 'vendor', 'gardener', 'admin', 'ai'];
  const roleColors: Record<string, string> = {
    farmer: 'bg-green-100 text-green-800',
    customer: 'bg-blue-100 text-blue-800',
    vendor: 'bg-purple-100 text-purple-800',
    gardener: 'bg-emerald-100 text-emerald-800',
    admin: 'bg-red-100 text-red-800',
    ai: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Browse Users</h1>
        <p className="mt-2 text-base text-muted-foreground">Discover and connect with farmers, customers, vendors, and gardeners.</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Role Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedRole === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-muted'
            }`}
          >
            All Users
          </button>
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                selectedRole === role
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {role === 'ai' ? '🤖 AI' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <Users className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground font-medium">No users found.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(u => (
            <div
              key={u.id}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                    alt={u.name}
                    className="h-16 w-16 rounded-full"
                  />
                  {isUserOnline(u.id) && (
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${roleColors[u.role] || 'bg-gray-100'}`}>
                      {u.role === 'ai' ? '🤖 AI Assistant' : u.role}
                    </span>
                    {u.verified && (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  {u.bio && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{u.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="hero"
                  onClick={() => handleMessageUser(u)}
                  className="flex-1 gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
