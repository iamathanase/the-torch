import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ShoppingBasket, Users, BookOpen, ArrowRight, Leaf, TrendingUp, Award } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [statsData, setStatsData] = useState({ farmers: 0, products: 0, users: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    // Animate stats - updated for The Torch initiative
    const animateValue = (target: number, callback: (n: number) => void, duration: number) => {
      let current = 0;
      const step = target / (duration / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          callback(target);
          clearInterval(timer);
        } else {
          callback(Math.floor(current));
        }
      }, 30);
    };

    animateValue(250, (v) => setStatsData(p => ({...p, farmers: v})), 1500);
    animateValue(1200, (v) => setStatsData(p => ({...p, products: v})), 1500);
    animateValue(800, (v) => setStatsData(p => ({...p, users: v})), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white">
      <PublicNavbar hideOnTop={true} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-farmer.jpg" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div
              className={`transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white/90 text-sm font-semibold mb-6 backdrop-blur-sm">
                🌾 Empowering Agricultural Communities
              </span>
            </div>

            <h1
              className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight text-white transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              The Torch: <span className="text-yellow-300">Growing Food Security</span>
            </h1>

            <p
              className={`text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              A digital marketplace and learning platform connecting farmers, vendors, and communities in Uganda and South Sudan. Access markets, learn sustainable farming techniques, and build lasting food security.
            </p>

            <div
              className={`flex gap-4 justify-center flex-wrap transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Welcome!',
                    text: 'Let\'s get you started with The Torch. Ready to join our agricultural community?',
                    icon: 'info',
                    confirmButtonText: 'Get Started',
                    confirmButtonColor: '#059669',
                    showCancelButton: true,
                    cancelButtonText: 'Maybe Later'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/auth/register');
                    }
                  });
                }}
                size="lg"
                className="bg-white text-green-600 hover:bg-slate-100 shadow-lg hover:shadow-xl font-semibold"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Browse Products',
                    text: 'Explore fresh agricultural products from our trusted farmers and vendors.',
                    icon: 'info',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#059669',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/dashboard/browse');
                    }
                  });
                }}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-emerald-600 hover:text-white hover:border-emerald-600 backdrop-blur-sm font-semibold bg-transparent"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 lg:py-12 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard value={statsData.farmers} label="Trained Farmers" suffix="+" />
            <StatCard value={statsData.products} label="Products Traded" suffix="+" />
            <StatCard value={statsData.users} label="Community Members" suffix="+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              OUR MISSION
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Building Food Security Together</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The Torch empowers refugee and IDP communities through agricultural education and digital marketplace access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard
              icon={ShoppingBasket}
              title="Direct Market Access"
              description="Connect farmers to customers without middlemen, enabling fair pricing and sustainable income"
            />
            <FeatureCard
              icon={Leaf}
              title="Sustainable Farming"
              description="Learn low-cost techniques, water conservation, and climate-appropriate crop selection"
            />
            <FeatureCard
              icon={Users}
              title="Community Support"
              description="Join networks of farmers and agricultural professionals sharing knowledge and resources"
            />
            <FeatureCard
              icon={BookOpen}
              title="Continuous Learning"
              description="Access training materials and expert resources to improve agricultural practices"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gradient-to-r from-white via-emerald-50 to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Featured Products</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover fresh produce and agricultural products from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard image="/appleBest.jpeg" name="Fresh Apples" price="₵350/kg" />
            <ProductCard image="/ripe tomatoes.jpeg" name="Ripe Tomatoes" price="₵250/kg" />
            <ProductCard image="/carrots.webp" name="Carrots" price="₵200/kg" />
            <ProductCard image="/red chilli.jpg" name="Red Chilli" price="₵500/kg" />
            <ProductCard image="/fresh maize.webp" name="Fresh Maize" price="₵150/kg" />
            <ProductCard image="/fresh plantain.webp" name="Fresh Plantain" price="₵135/kg" />
            <ProductCard image="/Groundnut.webp" name="Groundnuts" price="₵315/kg" />
            <ProductCard image="/grains.jpeg" name="Grains Mix" price="₵290/kg" />
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/dashboard/browse')}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gradient-to-b from-teal-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">Our Commitment to Communities</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <BenefitCard
              icon={Award}
              title="Food Security"
              description="Help 40-60 households achieve food independence through practical agricultural training and sustainable practices"
            />
            <BenefitCard
              icon={TrendingUp}
              title="Economic Opportunity"
              description="Enable farmers to access markets, sell directly to customers, and generate sustainable income from their produce"
            />
            <BenefitCard
              icon={Leaf}
              title="Knowledge Sharing"
              description="Continuous peer-to-peer learning and community support enabling lasting agricultural expertise within communities"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join The Torch Community Today</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Access markets, learn sustainable farming practices, and build a secure future for your family and community.
          </p>
          <Button
            onClick={() => navigate('/auth/register')}
            size="lg"
            className="bg-white text-green-600 hover:bg-slate-100 shadow-lg hover:shadow-xl font-semibold"
          >
            Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
                <li><button onClick={() => navigate('/dashboard/browse')} className="hover:text-green-400">Browse Products</button></li>
                <li><button onClick={() => navigate('/dashboard/learn')} className="hover:text-green-400">Learning Hub</button></li>
                <li><button onClick={() => navigate('/auth/register')} className="hover:text-green-400">Join Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button className="hover:text-green-400">About Us</button></li>
                <li><button className="hover:text-green-400">Contact</button></li>
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

function StatCard({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-all">
      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-600 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sprout;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-green-200 hover:shadow-lg transition-all group">
      <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
        <Icon className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="font-semibold text-slate-900 mb-2 text-lg">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}

function ProductCard({ image, name, price }: { image: string; name: string; price: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 h-32 flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
        <p className="text-green-600 font-bold text-lg">{price}</p>
      </div>
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Award;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-green-100 rounded-2xl">
          <Icon className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 mb-3 text-xl">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
