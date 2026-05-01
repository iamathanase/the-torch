import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ArrowRight, Search, ShoppingCart } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Browse() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    { id: 1, name: 'Fresh Tomatoes', price: '₵250/kg', category: 'produce', image: '/ripe tomatoes.jpeg', seller: 'Local Farmers' },
    { id: 2, name: 'Fresh Carrots', price: '₵200/kg', category: 'produce', image: '/carrots.webp', seller: 'Local Farmers' },
    { id: 3, name: 'Red Chilli Peppers', price: '₵500/kg', category: 'produce', image: '/red chilli.jpg', seller: 'Spice Growers' },
    { id: 4, name: 'Fresh Maize', price: '₵150/kg', category: 'grains', image: '/fresh maize.webp', seller: 'Grain Cooperatives' },
    { id: 5, name: 'Fresh Plantain', price: '₵135/kg', category: 'produce', image: '/fresh plantain.webp', seller: 'Banana Growers' },
    { id: 6, name: 'Groundnuts', price: '₵315/kg', category: 'crops', image: '/Groundnut.webp', seller: 'Legume Farmers' },
    { id: 7, name: 'Leafy Greens', price: '₵120/bundle', category: 'produce', image: '/leafy greens.jpeg', seller: 'Vegetable Farmers' },
    { id: 8, name: 'Mixed Grains', price: '₵290/kg', category: 'grains', image: '/grains.jpeg', seller: 'Grain Cooperatives' },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'produce', name: 'Fresh Produce' },
    { id: 'grains', name: 'Grains' },
    { id: 'crops', name: 'Crops' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-teal-50 to-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">Browse Our Products</h1>
            <p className="text-lg text-slate-600">Explore quality agricultural products from trusted sellers</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Search
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-green-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">No products found</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Want to Buy or Sell?</h2>
            <p className="text-slate-600 mb-6">
              Create an account to place orders or start selling your agricultural products
            </p>
            <Button
              onClick={() => navigate('/auth/register')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logooo.png" alt="The Torch" className="h-10 w-10" />
                <span className="font-bold text-lg">The Torch</span>
              </div>
              <p className="text-slate-400 text-sm">Growing the agricultural community together.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/public/browse')} className="hover:text-green-400">Browse Products</button></li>
                <li><button onClick={() => navigate('/public/learn')} className="hover:text-green-400">Learning Hub</button></li>
                <li><button onClick={() => navigate('/auth/register')} className="hover:text-green-400">Join Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/public/about')} className="hover:text-green-400">About Us</button></li>
                <li><button onClick={() => navigate('/public/contact')} className="hover:text-green-400">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-slate-400">
            <p>&copy; 2026 The Torch. All rights reserved. Growing Agriculture Together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ name, price, category, image, seller }: any) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-green-300 hover:shadow-lg transition-all group">
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-40 flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
        <p className="text-sm text-slate-600 mb-3">{seller}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">{price}</span>
        </div>
        <Button
          onClick={() => navigate('/auth/login')}
          size="sm"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}
