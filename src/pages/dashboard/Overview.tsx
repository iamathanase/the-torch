import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/dashboard/StatCard";
import { Package, ShoppingBasket, MessageSquare, TrendingUp, Sprout, Users, BookOpen, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Overview() {
  const { user, users } = useAuth();
  const { products, orders, messages, lessons } = useData();

  const myListings = products.filter((p) => p.sellerId === user!.id);
  const myOrdersAsBuyer = orders.filter((o) => o.buyerId === user!.id);
  const myOrdersAsSeller = orders.filter((o) => o.sellerId === user!.id);
  const myMessages = messages.filter((m) => m.toId === user!.id);
  const revenue = myOrdersAsSeller.reduce((s, o) => s + o.total, 0);
  const spent = myOrdersAsBuyer.reduce((s, o) => s + o.total, 0);

  let stats: { icon: any; label: string; value: string; delta?: string }[] = [];
  if (user!.role === "admin") {
    stats = [
      { icon: Users, label: "Total users", value: String(users.length) },
      { icon: Package, label: "Active listings", value: String(products.length) },
      { icon: ShoppingBasket, label: "Total orders", value: String(orders.length) },
      { icon: BookOpen, label: "Lessons published", value: String(lessons.length) },
    ];
  } else if (user!.role === "customer") {
    stats = [
      { icon: ShoppingBasket, label: "Orders placed", value: String(myOrdersAsBuyer.length) },
      { icon: Coins, label: "Total spent", value: `₵${spent.toLocaleString()}` },
      { icon: MessageSquare, label: "Unread messages", value: String(myMessages.filter((m) => !m.read).length) },
      { icon: BookOpen, label: "Lessons available", value: String(lessons.length) },
    ];
  } else {
    stats = [
      { icon: Package, label: "Active listings", value: String(myListings.length) },
      { icon: ShoppingBasket, label: "Orders received", value: String(myOrdersAsSeller.length), delta: "+2 this week" },
      { icon: TrendingUp, label: "Revenue", value: `₵${revenue.toLocaleString()}` },
      { icon: MessageSquare, label: "Unread messages", value: String(myMessages.filter((m) => !m.read).length) },
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{user!.role} dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Good day, {user!.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-base text-muted-foreground">Here's what's happening in your corner of FarmDialogue.</p>
        </div>
        <div className="flex gap-3">
          {(user!.role === "farmer" || user!.role === "vendor" || user!.role === "gardener") && (
            <Button asChild variant="hero"><Link to="/dashboard/listings">+ New listing</Link></Button>
          )}
          <Button asChild variant="soft"><Link to="/dashboard/marketplace">Browse market</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col rounded-lg border border-border/60 bg-card">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="font-display text-2xl font-semibold">Recent orders</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/orders">View all</Link></Button>
          </div>
          <ul className="divide-y divide-border">
            {orders.slice(0, 8).map((o) => (
              <li key={o.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/20">
                <img src={o.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{o.productTitle}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.buyerName} → {o.sellerName} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">₵{o.total.toLocaleString()}</p>
                  <p className="text-xs capitalize text-muted-foreground">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Keep learning</h2>
          <p className="mt-1 text-sm text-muted-foreground">Picked for your role.</p>
          <ul className="mt-6 space-y-4">
            {lessons.slice(0, 3).map((l) => (
              <li key={l.id}>
                <Link to={`/dashboard/learn`} className="group block">
                  <p className="font-semibold text-foreground transition-colors group-hover:text-primary-glow">{l.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.category} · {l.durationMin} min</p>
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="soft" className="mt-6 w-full"><Link to="/dashboard/learn"><Sprout className="mr-2 h-4 w-4" /> Open Learning Hub</Link></Button>
        </div>
      </div>
    </div>
  );
}
