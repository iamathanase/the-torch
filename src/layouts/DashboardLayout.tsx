import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, ShoppingBasket, Package, BookOpen, MessageSquare, Users, Settings, LogOut, Sprout, Moon, Sun, Bell } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);
  
  if (!user) return <Navigate to="/login" replace />;

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isSeller = user.role === "farmer" || user.role === "vendor" || user.role === "gardener";
  const isAdmin = user.role === "admin";

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "/dashboard/marketplace", icon: ShoppingBasket, label: "Browse market" },
    isSeller && { to: "/dashboard/listings", icon: Package, label: "My listings" },
    { to: "/dashboard/orders", icon: Package, label: "Orders" },
    { to: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { to: "/dashboard/learn", icon: BookOpen, label: "Learning hub" },
    isAdmin && { to: "/dashboard/users", icon: Users, label: "Users" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ].filter(Boolean) as { to: string; icon: typeof LayoutDashboard; label: string; end?: boolean }[];

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border/60 py-4">
            <NavLink to="/" className="flex items-center gap-2.5 px-2">
              <span className="grid h-9 w-9 place-items-center rounded-sm bg-harvest text-harvest-foreground">
                <Sprout className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-display text-xl text-sidebar-foreground group-data-[collapsible=icon]:hidden">The Torch</span>
            </NavLink>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((it) => (
                    <SidebarMenuItem key={it.to}>
                      <SidebarMenuButton asChild>
                        <NavLink to={it.to} end={it.end}
                          className={({ isActive }) =>
                            `flex items-center gap-2 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`
                          }>
                          <it.icon className="h-4 w-4" />
                          <span>{it.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border/60 p-3">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
              <Avatar className="h-9 w-9"><AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">{initials}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="truncate text-xs capitalize text-sidebar-foreground/60">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="rounded-sm p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="w-full lg:ml-64 transition-all duration-300">
          <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6 relative z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, <span className="text-foreground">{user.name.split(" ")[0]}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>
              <div className="flex items-center gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-harvest text-harvest-foreground text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent transition-colors" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </button>
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-56px)] w-full overflow-x-hidden p-5 md:p-8"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
