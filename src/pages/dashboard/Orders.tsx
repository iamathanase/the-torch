import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Order } from "@/data/types";
import NewOrderModal from "@/components/modals/NewOrderModal";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

const statuses: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, cancelOrder } = useData();
  const [tab, setTab] = useState<"buying" | "selling">("buying");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const list = orders.filter((o) => (tab === "buying" ? o.buyerId === user!.id : o.sellerId === user!.id));

  const isSeller = user!.role === "farmer" || user!.role === "vendor" || user!.role === "gardener";
  const isCustomer = user!.role === "customer";

  let pageTitle = "Orders";
  let pageDescription = "Track your purchases and sales.";

  if (user!.role === "farmer") {
    pageTitle = "Farm Orders";
    pageDescription = "Manage your harvest sales and supplier purchases.";
  } else if (user!.role === "vendor") {
    pageTitle = "Equipment Orders";
    pageDescription = "Track equipment sales and manage customer orders.";
  } else if (user!.role === "gardener") {
    pageTitle = "Gardening Orders";
    pageDescription = "Track your gardening supplies purchases.";
  } else if (user!.role === "customer") {
    pageTitle = "My Purchases";
    pageDescription = "View and track all your orders.";
  }

  const handleCancelOrder = (orderId: string, orderStatus: Order["status"]) => {
    if (orderStatus === "delivered" || orderStatus === "cancelled") {
      toast.error("Cannot cancel this order");
      return;
    }
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(orderId);
      toast.success("Order cancelled successfully");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-base text-muted-foreground">{pageDescription}</p>
        </div>
        {isCustomer && (
          <Button variant="hero" onClick={() => setShowNewOrderModal(true)} className="gap-2 whitespace-nowrap">
            <ShoppingCart className="h-4 w-4" />
            Place Order
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 border-b border-border">
        <button 
          onClick={() => setTab("buying")} 
          className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize transition-all ${tab === "buying" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {isCustomer ? "My Orders" : "Purchasing"}
        </button>
        {isSeller && (
          <button 
            onClick={() => setTab("selling")} 
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize transition-all ${tab === "selling" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {user!.role === "farmer" ? "Sales" : user!.role === "vendor" ? "Sales" : "Sales"}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No {tab} orders yet.</p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            {tab === "buying" 
              ? "Start by placing an order from the marketplace." 
              : "Get started by listing your products."}
          </p>
          {isCustomer && tab === "buying" && (
            <Button 
              variant="hero" 
              onClick={() => setShowNewOrderModal(true)} 
              className="mt-4 gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Place Your First Order
            </Button>
          )}
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
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-primary">₵{o.total.toLocaleString()}</p>
                </div>
                {tab === "selling" ? (
                  <div className="flex gap-2">
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
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      o.status === "delivered" ? "bg-green-100/80 text-green-700" :
                      o.status === "shipped" ? "bg-blue-100/80 text-blue-700" :
                      o.status === "confirmed" ? "bg-purple-100/80 text-purple-700" :
                      o.status === "pending" ? "bg-yellow-100/80 text-yellow-700" :
                      "bg-red-100/80 text-red-700"
                    }`}>
                      {o.status}
                    </span>
                    {o.status !== "delivered" && o.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(o.id, o.status)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewOrderModal isOpen={showNewOrderModal} onClose={() => setShowNewOrderModal(false)} />
    </div>
  );
}
