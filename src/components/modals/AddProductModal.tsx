import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Product } from '@/data/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { user } = useAuth();
  const { addProduct } = useData();
  const [imagePreview, setImagePreview] = useState<string>('https://images.unsplash.com/photo-1488459716781-6519754d04d5?w=400&h=300&fit=crop');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: 'agricultural',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (_file: File, preview: string) => {
    setImagePreview(preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill all fields');
      return;
    }

    const newProduct: Product = {
      id: String(Date.now()),
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image: imagePreview,
      images: imagePreview ? [imagePreview] : [],
      sellerId: user!.id,
      sellerName: user!.name,
      stock: Number(formData.stock),
      sold: 0,
      createdAt: new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    toast.success('Product added successfully!');
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: 'agricultural',
    });
    setImagePreview('https://images.unsplash.com/photo-1488459716781-6519754d04d5?w=400&h=300&fit=crop');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*"
              maxSize={5}
              label="Upload Product Image"
              preview={imagePreview}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Fresh Tomatoes"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₵)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="agricultural">Agricultural</option>
              <option value="equipment">Equipment</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="tools">Tools</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSubmit} className="flex-1">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
