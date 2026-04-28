import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Order } from '@/data/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
}

export default function NewOrderModal({ isOpen, onClose, productId = '' }: NewOrderModalProps) {
  const { user } = useAuth();
  const { products, addOrder } = useData();
  const [selectedProductId, setSelectedProductId] = useState(productId);
  const [quantity, setQuantity] = useState('1');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const total = selectedProduct ? selectedProduct.price * Number(quantity) : 0;

  const handleSubmit = (e: React.FormEvent) => {
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

    addOrder(newOrder);
    toast.success('Order placed successfully!');
    setSelectedProductId(productId);
    setQuantity('1');
    onClose();
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

          {selectedProduct && (
            <div className="rounded-lg border border-border/60 p-3 bg-muted/30">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-32 object-cover rounded-md mb-3" />
              <p className="text-sm text-muted-foreground mb-2">{selectedProduct.description}</p>
              <p className="text-sm">
                From: <span className="font-semibold">{selectedProduct.sellerName}</span>
              </p>
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
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold text-primary">₵{total.toLocaleString()}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSubmit} disabled={!selectedProductId} className="flex-1">
              Place Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
