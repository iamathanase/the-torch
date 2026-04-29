import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, ShoppingBasket, Package, BookOpen, MessageSquare, Users, Settings, LogOut, Sprout, Moon, Sun, Bell, Menu, X } from "lucide-react";
import Swal from 'sweetalert2';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleSwitcher from "@/components/RoleSwitcher";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/auth/login');
      }
    });
  };

  // Protected by ProtectedRoute, so user is guaranteed to be non-null
  const isSeller = user!.role === "farmer" || user!.role === "vendor" || user!.role === "gardener";
  const isAdmin = user!.role === "admin";

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { to: "/dashboard/marketplace", icon: ShoppingBasket, label: "Browse market" },
    { to: "/dashboard/browse", icon: Users, label: "Browse people" },
    isSeller && { to: "/dashboard/listings", icon: Package, label: "My listings" },
    { to: "/dashboard/orders", icon: Package, label: "Orders" },
    { to: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { to: "/dashboard/learn", icon: BookOpen, label: "Learning hub" },
    isAdmin && { to: "/dashboard/users", icon: Users, label: "Manage users" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ].filter(Boolean) as { to: string; icon: typeof LayoutDashboard; label: string; end?: boolean }[];

  const initials = user!.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:bg-slate-950">
        <Sidebar className="border-r border-emerald-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900 hidden lg:flex">
          <SidebarHeader className="border-b border-emerald-200 dark:border-slate-700 py-4 bg-gradient-to-r from-emerald-500 to-green-600">
            <NavLink to="/" className="flex items-center gap-2.5 px-2">
              <span className="grid h-9 w-9 place-items-center rounded-sm bg-white text-emerald-600 shadow-md">
                <Sprout className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-display text-lg font-bold text-white group-data-[collapsible=icon]:hidden">The Torch</span>
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
                            `flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium ${isActive ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400"}`
                          }>
                          <it.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{it.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-emerald-200 dark:border-slate-700 p-3 bg-emerald-50 dark:bg-slate-900">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
              <Avatar className="h-9 w-9"><AvatarFallback className="bg-emerald-600 text-white text-xs font-semibold">{initials}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user!.name}</p>
                <p className="truncate text-xs capitalize text-emerald-600 dark:text-emerald-400 font-semibold">{user!.role}</p>
              </div>
              <button onClick={handleLogout} className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="w-full transition-all duration-300">
          <header className="flex h-14 items-center justify-between border-b border-emerald-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 md:px-6 relative z-40">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 transition-colors text-emerald-600 dark:text-emerald-400"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:inline">Welcome, <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user!.name.split(" ")[0]}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <RoleSwitcher />
              <button 
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <div className="flex items-center gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user!.avatar} alt={user!.name} />
                  <AvatarFallback className="bg-emerald-600 text-white text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                </button>
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-56px)] w-full overflow-x-hidden p-5 md:p-8 max-w-7xl mx-auto"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
