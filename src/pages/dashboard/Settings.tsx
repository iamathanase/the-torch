import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Settings updated");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Account Information</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.name} 
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email} 
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Role</label>
              <input 
                type="text" 
                defaultValue={user?.role} 
                disabled 
                className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm font-medium text-muted-foreground capitalize cursor-not-allowed" 
              />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-6 w-full sm:w-auto">Save Changes</Button>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Notification Preferences</h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Email notifications for new orders</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Get notified when someone buys from you</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Email notifications for messages</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Get notified when you receive messages</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Weekly sales report</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Receive a summary of your sales every week</p>
              </div>
            </label>
          </div>
          <Button onClick={handleSave} className="mt-6 w-full sm:w-auto">Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}
