import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Order } from "@/data/types";
import { toast } from "sonner";

const statuses: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [tab, setTab] = useState<"buying" | "selling">("buying");
  const list = orders.filter((o) => (tab === "buying" ? o.buyerId === user!.id : o.sellerId === user!.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Orders</h1>
        <p className="mt-2 text-base text-muted-foreground">Track everything you are buying and selling.</p>
      </div>
      
      <div className="flex gap-2 border-b border-border">
        {(["buying", "selling"] as const).map((t) => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize transition-all ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t === "buying" ? "Purchasing" : "Selling"}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No {tab} orders yet.</p>
          <p className="mt-2 text-xs text-muted-foreground/60">Get started by browsing the marketplace or listing your products.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <div key={o.id} className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-sm sm:flex-row sm:items-center">
              <img src={o.productImage} alt={o.productTitle} className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{o.productTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tab === "buying" ? `from ${o.sellerName}` : `to ${o.buyerName}`} · {o.date} · qty {o.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-primary">₵{o.total.toLocaleString()}</p>
                </div>
                {tab === "selling" ? (
                  <select
                    value={o.status}
                    onChange={(e) => { 
                      updateOrderStatus(o.id, e.target.value as Order["status"]); 
                      toast.success("Order status updated"); 
                    }}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium capitalize transition-all hover:border-primary/50"
                  >
                    {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    o.status === "delivered" ? "bg-green-100/80 text-green-700" :
                    o.status === "shipped" ? "bg-blue-100/80 text-blue-700" :
                    o.status === "confirmed" ? "bg-purple-100/80 text-purple-700" :
                    o.status === "pending" ? "bg-yellow-100/80 text-yellow-700" :
                    "bg-red-100/80 text-red-700"
                  }`}>
                    {o.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
