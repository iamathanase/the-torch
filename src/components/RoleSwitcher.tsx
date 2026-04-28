import { useAuth } from "@/context/AuthContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function RoleSwitcher() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
            <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Current Role:</p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors bg-primary/10 text-primary font-semibold capitalize"
            >
              {user?.role}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
