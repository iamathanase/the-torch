import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Users() {
  const { user, users } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Users</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage all users on the platform.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
