import { useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Star, ShoppingCart, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewOrderModal from "@/components/modals/NewOrderModal";
import { Product } from "@/data/types";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const { user } = useAuth();
  const { products, refreshProducts, loadingProducts } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Refresh products when component mounts
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "agricultural", label: "Agricultural" },
    { value: "equipment", label: "Equipment" },
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "tools", label: "Tools" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Browse Market</h1>
          <p className="mt-2 text-base text-muted-foreground">Discover and purchase products from sellers across FarmDialogue.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/orders')}
          className="gap-2"
        >
          <Package className="h-4 w-4" />
          View My Orders
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loadingProducts ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">No products found.</p>
          <p className="mt-2 text-sm text-muted-foreground/60">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filters." 
              : "Check back later for new products."}
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="rounded-lg border border-border/60 bg-card overflow-hidden hover:shadow-md transition-all group flex flex-col"
              >
                <div className="overflow-hidden h-48">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground capitalize">{product.category}</p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Seller: {product.sellerName}
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-primary">₵{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium">{product.sold || 0} sold</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => handleBuyClick(product)}
                      disabled={product.stock === 0 || product.sellerId === user?.id}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.sellerId === user?.id ? 'Your Product' : product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <NewOrderModal 
          isOpen={showOrderModal} 
          onClose={() => {
            setShowOrderModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
