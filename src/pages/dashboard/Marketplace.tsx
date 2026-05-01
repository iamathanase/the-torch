import { useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const { products, refreshProducts } = useData();
  
  // Refresh products when component mounts
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);
  
  const topProducts = products.slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Browse Market</h1>
        <p className="mt-2 text-base text-muted-foreground">Discover products from sellers across FarmDialogue.</p>
      </div>

      <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-8">
        <div className="mx-auto max-w-sm text-center">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Full Marketplace Coming Soon</h2>
          <p className="mt-3 text-base text-muted-foreground">
            We're building an amazing marketplace experience where you can discover and purchase products from trusted sellers. The full version will feature advanced search, filters, ratings, and more!
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="soft"><Link to="/dashboard/listings">View all listings</Link></Button>
            <Button asChild variant="hero"><Link to="/dashboard/learn">Learn farming</Link></Button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Featured Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Popular items from our sellers</p>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topProducts.map((product) => (
            <div 
              key={product.id}
              className="rounded-lg border border-border/60 bg-card overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="overflow-hidden h-40">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-primary">₵{product.price.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium">{product.sold} sold</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{product.stock} in stock</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
