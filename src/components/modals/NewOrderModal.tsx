import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Order, Product } from '@/data/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  productId?: string;
}

export default function NewOrderModal({ isOpen, onClose, product, productId = '' }: NewOrderModalProps) {
  const { user } = useAuth();
  const { products, addOrder, refreshProducts } = useData();
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(product?.id || productId);
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens with a new product
  useEffect(() => {
    if (isOpen && product) {
      setSelectedProductId(product.id);
      setQuantity('1');
    }
  }, [isOpen, product]);

  const selectedProduct = product || products.find(p => p.id === selectedProductId);
  const total = selectedProduct ? selectedProduct.price * Number(quantity) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) {
      toast.error('Please select product and quantity');
      return;
    }

    if (!selectedProduct) {
      toast.error('Product not found');
      return;
    }

    if (Number(quantity) > selectedProduct.stock) {
      toast.error('Not enough stock available');
      return;
    }

    const newOrder: Order = {
      id: String(Date.now()),
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      productImage: selectedProduct.image,
      buyerId: user!.id,
      buyerName: user!.name,
      sellerId: selectedProduct.sellerId,
      sellerName: selectedProduct.sellerName,
      quantity: Number(quantity),
      total: total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIsSubmitting(true);
    try {
      await addOrder(newOrder);
      
      // Show success toast with action to view orders
      toast.success('Order placed successfully! 🎉', {
        description: 'Your order has been submitted and is pending confirmation.',
        action: {
          label: 'View Orders',
          onClick: () => navigate('/dashboard/orders')
        },
        duration: 5000,
      });
      
      // Refresh products to update stock
      await refreshProducts();
      
      // Reset form
      setSelectedProductId('');
      setQuantity('1');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const availableProducts = products.filter(p => p.stock > 0 && p.sellerId !== user!.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Place Order</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!product && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a product...</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} - ₵{p.price.toLocaleString()} ({p.stock} available)
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedProduct && (
            <div className="rounded-lg border border-border/60 p-3 bg-muted/30">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-32 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{selectedProduct.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{selectedProduct.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>From: <span className="font-semibold">{selectedProduct.sellerName}</span></span>
                <span className="text-primary font-bold">₵{selectedProduct.price.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 100}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {selectedProduct && (
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedProduct.stock} available
              </p>
            )}
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold text-primary">₵{total.toLocaleString()}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="hero" 
              onClick={handleSubmit} 
              disabled={!selectedProductId || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
