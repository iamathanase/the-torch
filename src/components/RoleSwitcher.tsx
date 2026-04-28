import { useAuth } from "@/context/AuthContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const roleUsers = [
  { id: '1', name: 'Farmer', role: 'farmer', user: 'John Doe' },
  { id: '2', name: 'Customer', role: 'customer', user: 'Jane Smith' },
  { id: '3', name: 'Equipment Vendor', role: 'vendor', user: 'David Wilson' },
  { id: '7', name: 'Gardening Enthusiast', role: 'gardener', user: 'Ama Mensah' },
  { id: '3', name: 'Admin', role: 'admin', user: 'Admin User' },
];

export default function RoleSwitcher() {
  const { user, users, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSwitch = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/20"
      >
        <span className="capitalize">{user?.role}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border/60 bg-card shadow-lg">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Test as:</p>
            {roleUsers.map((roleUser) => {
              const userObj = users.find(u => u.id === roleUser.id);
              return (
                userObj && (
                  <button
                    key={roleUser.id}
                    onClick={() => handleRoleSwitch(roleUser.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      user?.id === roleUser.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-secondary/20'
                    }`}
                  >
                    <div className="font-medium capitalize">{roleUser.name}</div>
                    <div className="text-xs text-muted-foreground">{roleUser.user}</div>
                  </button>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
