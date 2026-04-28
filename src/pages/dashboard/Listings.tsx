import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";

export default function Listings() {
  const { user } = useAuth();
  const { products, deleteProduct } = useData();
  
  const myListings = products.filter((p) => p.sellerId === user!.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">My Listings</h1>
          <p className="mt-2 text-base text-muted-foreground">Manage your products and inventory.</p>
        </div>
        <Button variant="hero" className="whitespace-nowrap">+ Add New Listing</Button>
      </div>

      {myListings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No listings yet.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Start by creating your first product listing.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myListings.map((p) => (
            <div key={p.id} className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:shadow-sm">
              <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-primary">₵{p.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{p.stock} in stock · {p.sold} sold</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/60 p-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => deleteProduct(p.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
