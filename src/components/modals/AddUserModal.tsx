import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { User } from '@/data/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { addUser } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer' as User['role'],
    verified: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    const newUser: User = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      verified: formData.verified,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addUser(newUser);
    toast.success('User added successfully!');
    setFormData({
      name: '',
      email: '',
      role: 'customer',
      verified: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
              <option value="vendor">Equipment Vendor</option>
              <option value="gardener">Gardening Enthusiast</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="rounded border-border"
            />
            <label htmlFor="verified" className="text-sm font-medium">Mark as verified</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSubmit} className="flex-1">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
