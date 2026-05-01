import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/types";
import AddProductModal from "@/components/modals/AddProductModal";
import EditProductModal from "@/components/modals/EditProductModal";
import Swal from 'sweetalert2';

export default function Listings() {
  const { user } = useAuth();
  const { products, deleteProduct, refreshProducts } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Refresh products when component mounts
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);
  
  const myListings = products.filter((p) => p.sellerId === user!.id);

  let pageTitle = "My Listings";
  let pageDescription = "Manage your products and inventory.";
  let addButtonText = "+ Add New Listing";

  if (user!.role === "farmer") {
    pageTitle = "My Farm Products";
    pageDescription = "Manage your harvest and farm products.";
    addButtonText = "+ Add Produce";
  } else if (user!.role === "vendor") {
    pageTitle = "Equipment Inventory";
    pageDescription = "Manage your farming equipment and tools.";
    addButtonText = "+ Add Equipment";
  } else if (user!.role === "gardener") {
    pageTitle = "My Gardening Products";
    pageDescription = "Manage your gardening supplies and products.";
    addButtonText = "+ Add Product";
  }

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone. Your product will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    });
    
    if (result.isConfirmed) {
      try {
        await deleteProduct(productId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your product has been deleted successfully.',
          confirmButtonColor: '#059669',
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product. Please try again.',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-base text-muted-foreground">{pageDescription}</p>
        </div>
        <Button variant="hero" className="whitespace-nowrap" onClick={handleAddClick}>
          {addButtonText}
        </Button>
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
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditProductModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} product={editingProduct} />
    </div>
  );
}
