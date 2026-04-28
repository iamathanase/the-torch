import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/dashboard/StatCard";
import { Package, ShoppingBasket, MessageSquare, TrendingUp, Sprout, Users, BookOpen, Coins, BarChart3, Activity, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Overview() {
  const { user } = useAuth();
  const { products, orders, messages, lessons } = useData();

  const myListings = products.filter((p) => p.sellerId === user!.id);
  const myOrdersAsBuyer = orders.filter((o) => o.buyerId === user!.id);
  const myOrdersAsSeller = orders.filter((o) => o.sellerId === user!.id);
  const myMessages = messages.filter((m) => m.toId === user!.id);
  const revenue = myOrdersAsSeller.reduce((s, o) => s + o.total, 0);
  const spent = myOrdersAsBuyer.reduce((s, o) => s + o.total, 0);

  let stats: { icon: any; label: string; value: string; delta?: string }[] = [];
  let roleTitle = "";
  let roleDescription = "";

  if (user!.role === "admin") {
    roleTitle = "Admin Dashboard";
    roleDescription = "Manage users, listings, orders, and platform content.";
    stats = [
      { icon: Users, label: "Total users", value: "0" },
      { icon: Package, label: "Active listings", value: String(products.length) },
      { icon: ShoppingBasket, label: "Total orders", value: String(orders.length) },
      { icon: BookOpen, label: "Lessons published", value: String(lessons.length) },
    ];
  } else if (user!.role === "customer") {
    roleTitle = "Shopper Dashboard";
    roleDescription = "Discover products, track orders, and learn new skills.";
    stats = [
      { icon: ShoppingBasket, label: "Orders placed", value: String(myOrdersAsBuyer.length) },
      { icon: Coins, label: "Total spent", value: `₵${spent.toLocaleString()}` },
      { icon: MessageSquare, label: "Unread messages", value: String(myMessages.filter((m) => !m.read).length) },
      { icon: BookOpen, label: "Lessons available", value: String(lessons.length) },
    ];
  } else if (user!.role === "farmer") {
    roleTitle = "Farmer Dashboard";
    roleDescription = "Manage your farm, sell produce, and connect with buyers.";
    stats = [
      { icon: Package, label: "Active listings", value: String(myListings.length) },
      { icon: ShoppingBasket, label: "Orders received", value: String(myOrdersAsSeller.length), delta: "+2 this week" },
      { icon: TrendingUp, label: "Revenue", value: `₵${revenue.toLocaleString()}` },
      { icon: MessageSquare, label: "Unread messages", value: String(myMessages.filter((m) => !m.read).length) },
    ];
  } else if (user!.role === "vendor") {
    roleTitle = "Equipment Vendor Dashboard";
    roleDescription = "Sell farming equipment and tools to agricultural professionals.";
    stats = [
      { icon: BarChart3, label: "Active products", value: String(myListings.length) },
      { icon: Activity, label: "Sales this month", value: String(myOrdersAsSeller.length), delta: "+5 new" },
      { icon: Coins, label: "Total revenue", value: `₵${revenue.toLocaleString()}` },
      { icon: Award, label: "Top product", value: myListings.length > 0 ? myListings[0].title.substring(0, 12) : "—" },
    ];
  } else if (user!.role === "gardener") {
    roleTitle = "Gardening Enthusiast Dashboard";
    roleDescription = "Learn gardening techniques, share tips, and grow your skills.";
    stats = [
      { icon: BookOpen, label: "Lessons completed", value: String(Math.floor(lessons.length * 0.6)) },
      { icon: Sprout, label: "Favorite courses", value: String(Math.floor(lessons.length * 0.4)) },
      { icon: MessageSquare, label: "Community messages", value: String(myMessages.filter((m) => !m.read).length) },
      { icon: Users, label: "Connections", value: "0" },
    ];
  } else {
    stats = [
      { icon: Package, label: "Active listings", value: String(myListings.length) },
      { icon: ShoppingBasket, label: "Orders received", value: String(myOrdersAsSeller.length) },
      { icon: TrendingUp, label: "Revenue", value: `₵${revenue.toLocaleString()}` },
      { icon: MessageSquare, label: "Unread messages", value: String(myMessages.filter((m) => !m.read).length) },
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{roleTitle}</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Good day, {user!.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-base text-muted-foreground">{roleDescription}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {(user!.role === "farmer" || user!.role === "vendor" || user!.role === "gardener") && (
            <Button asChild variant="hero"><Link to="/dashboard/listings">+ Add {user!.role === "vendor" ? "Equipment" : "Listing"}</Link></Button>
          )}
          {user!.role === "customer" && (
            <Button asChild variant="hero"><Link to="/dashboard/marketplace">Start Shopping</Link></Button>
          )}
          {user!.role === "admin" && (
            <Button asChild variant="hero"><Link to="/dashboard/users">Manage Users</Link></Button>
          )}
          {user!.role === "gardener" && (
            <Button asChild variant="hero"><Link to="/dashboard/learn">Browse Courses</Link></Button>
          )}
          <Button asChild variant="soft"><Link to="/dashboard/messages">Messages</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Role-specific content sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Farmer Dashboard */}
        {user!.role === "farmer" && (
          <>
            <div className="lg:col-span-2 flex flex-col rounded-lg border border-border/60 bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="font-display text-2xl font-semibold">Recent harvest sales</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/dashboard/orders">View all</Link></Button>
              </div>
              <ul className="divide-y divide-border">
                {myOrdersAsSeller.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/20">
                    <img src={o.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{o.productTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Customer: {o.buyerName} · {o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-primary">₵{o.total.toLocaleString()}</p>
                      <Badge variant={o.status === 'delivered' ? 'default' : o.status === 'shipped' ? 'secondary' : 'outline'}>{o.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-2xl font-semibold">Farm tips</h2>
              <p className="mt-1 text-sm text-muted-foreground">Seasonal guidance for farmers.</p>
              <ul className="mt-6 space-y-4">
                {lessons.filter(l => l.category === "Organic Farming" || l.category === "Soil" || l.category === "Water").slice(0, 3).map((l) => (
                  <li key={l.id}>
                    <Link to={`/dashboard/learn`} className="group block">
                      <p className="font-semibold text-foreground transition-colors group-hover:text-primary-glow">{l.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.level} · {l.durationMin} min</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full"><Link to="/dashboard/learn"><Sprout className="mr-2 h-4 w-4" /> Farming Academy</Link></Button>
            </div>
          </>
        )}

        {/* Customer Dashboard */}
        {user!.role === "customer" && (
          <>
            <div className="lg:col-span-2 flex flex-col rounded-lg border border-border/60 bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="font-display text-2xl font-semibold">Your orders</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/dashboard/orders">View all</Link></Button>
              </div>
              <ul className="divide-y divide-border">
                {myOrdersAsBuyer.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/20">
                    <img src={o.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{o.productTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">From {o.sellerName} · {o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-primary">₵{o.total.toLocaleString()}</p>
                      <Badge variant={o.status === 'delivered' ? 'default' : o.status === 'shipped' ? 'secondary' : 'outline'}>{o.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-2xl font-semibold">Recommended for you</h2>
              <p className="mt-1 text-sm text-muted-foreground">Based on your interests.</p>
              <ul className="mt-6 space-y-4">
                {products.slice(0, 3).map((p) => (
                  <li key={p.id}>
                    <Link to={`/dashboard/marketplace`} className="group block">
                      <p className="font-semibold text-foreground transition-colors group-hover:text-primary-glow">{p.title}</p>
                      <p className="mt-0.5 text-xs text-primary font-semibold">₵{p.price.toLocaleString()}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="hero" className="mt-6 w-full"><Link to="/dashboard/marketplace">Continue shopping</Link></Button>
            </div>
          </>
        )}

        {/* Equipment Vendor Dashboard */}
        {user!.role === "vendor" && (
          <>
            <div className="lg:col-span-2 flex flex-col rounded-lg border border-border/60 bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="font-display text-2xl font-semibold">Equipment orders</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/dashboard/orders">View all</Link></Button>
              </div>
              <ul className="divide-y divide-border">
                {myOrdersAsSeller.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/20">
                    <img src={o.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{o.productTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Buyer: {o.buyerName} · {o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-primary">₵{o.total.toLocaleString()}</p>
                      <Badge variant={o.status === 'delivered' ? 'default' : o.status === 'shipped' ? 'secondary' : 'outline'}>{o.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-2xl font-semibold">Top sellers resources</h2>
              <p className="mt-1 text-sm text-muted-foreground">Business growth tips.</p>
              <ul className="mt-6 space-y-4">
                {lessons.filter(l => l.category === "Business" || l.category === "Marketing").slice(0, 3).map((l) => (
                  <li key={l.id}>
                    <Link to={`/dashboard/learn`} className="group block">
                      <p className="font-semibold text-foreground transition-colors group-hover:text-primary-glow">{l.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.level} · {l.durationMin} min</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full"><Link to="/dashboard/learn">Business Academy</Link></Button>
            </div>
          </>
        )}

        {/* Gardening Enthusiast Dashboard */}
        {user!.role === "gardener" && (
          <>
            <div className="lg:col-span-2 flex flex-col rounded-lg border border-border/60 bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="font-display text-2xl font-semibold">Your learning journey</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/dashboard/learn">View all courses</Link></Button>
              </div>
              <ul className="divide-y divide-border">
                {lessons.slice(0, 6).map((l) => (
                  <li key={l.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Sprout className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{l.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.level} · {l.durationMin} min</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{l.category}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-display text-2xl font-semibold">Community garden</h2>
              <p className="mt-1 text-sm text-muted-foreground">Connect with fellow gardeners.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="font-semibold text-foreground">Active gardeners online</p>
                  <p className="mt-1 text-2xl font-bold text-primary">0</p>
                </div>
                <div className="rounded-lg bg-secondary/20 p-4">
                  <p className="font-semibold text-foreground">Community topics</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">24</p>
                </div>
              </div>
              <Button asChild variant="hero" className="mt-6 w-full"><Link to="/dashboard/messages">Join discussions</Link></Button>
            </div>
          </>
        )}

        {/* Default/Fallback */}
        {!["farmer", "customer", "vendor", "gardener", "admin"].includes(user!.role) && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
