import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddUserModal from "@/components/modals/AddUserModal";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

export default function Users() {
  const { user, users } = useAuth();
  const { deleteUser } = useData();
  const [showAddModal, setShowAddModal] = useState(false);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === user.id) {
      toast.error("Cannot delete your own account");
      return;
    }
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteUser(userId);
      toast.success("User deleted successfully!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">Users</h1>
          <p className="mt-2 text-base text-muted-foreground">Manage all users on the platform.</p>
        </div>
        <Button variant="hero" onClick={() => setShowAddModal(true)} className="gap-2 whitespace-nowrap">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{u.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                <td className="px-6 py-4 text-sm capitalize">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    u.verified 
                      ? 'bg-green-100/80 text-green-700' 
                      : 'bg-yellow-100/80 text-yellow-700'
                  }`}>
                    {u.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    disabled={u.id === user.id}
                    className="gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
