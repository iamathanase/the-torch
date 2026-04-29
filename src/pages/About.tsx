import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ArrowRight, Users, Leaf, Target, Heart } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

export default function About() {
  const navigate = useNavigate();

  const team = [
    {
      name: 'Athanase Abayo',
      role: 'Lead Developer',
      bio: 'Passionate about building scalable agricultural solutions',
      image: '/athanase.png',
      linkedin: 'https://www.linkedin.com/in/athanase002/',
    },
    {
      name: 'Adelard Borauzima',
      role: 'Business Lead',
      bio: 'Experienced in agricultural business and community building',
      image: '/adelard.png',
      linkedin: 'https://www.linkedin.com/in/adelard-borauzima-a6875b2ab/',
    },
    {
      name: 'Mabity Mambu',
      role: 'Product Manager',
      bio: 'Focused on user experience and product innovation',
      image: '/mambu.png',
      linkedin: 'https://www.linkedin.com/in/mabinty-mambu-9b53b03a0/',
    },
    {
      name: 'Ben Riak Changdar',
      role: 'Community Manager',
      bio: 'Building and nurturing our farming community',
      image: '/ben.png',
      linkedin: 'https://www.linkedin.com/in/ben-riak-changdar/',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 animate-slide-down">About The Torch</h1>
          <p className="text-xl text-slate-600 max-w-2xl animate-slide-up">
            A 6-month agricultural education and digital marketplace initiative empowering 40-60 refugee and IDP households in Uganda and South Sudan to achieve food security and economic opportunity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                OUR PURPOSE
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 hover:text-emerald-600 transition-colors duration-300">Empowering Communities Through Agriculture</h2>
              <p className="text-slate-600 mb-4 text-lg leading-relaxed">
                The Torch combines practical agricultural training with digital marketplace access. We teach sustainable, low-cost farming techniques suited to local climates while providing direct pathways to markets. This two-part approach builds lasting food security and economic independence.
              </p>
              <p className="text-slate-600 mb-4 text-lg leading-relaxed">
                <strong>Core Focus Areas:</strong>
              </p>
              <ul className="text-slate-600 mb-8 text-lg leading-relaxed space-y-2 ml-4">
                <li>• Low-cost farming techniques accessible to resource-limited communities</li>
                <li>• Sustainable water use and conservation practices</li>
                <li>• Climate-appropriate crop selection and cultivation</li>
                <li>• Direct market access for fair pricing and sustainable income</li>
              </ul>
              <Button
                onClick={() => {
                  Swal.fire({
                    title: 'Join The Initiative',
                    text: 'Create your account and start your journey with The Torch today!',
                    icon: 'success',
                    confirmButtonText: 'Join Now',
                    confirmButtonColor: '#059669',
                    showCancelButton: true,
                    cancelButtonText: 'Learn More'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/auth/register');
                    }
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Join The Initiative <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-8 overflow-hidden h-96 animate-slide-in-right hover:shadow-2xl transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=500&h=400&fit=crop" 
                alt="Sustainable Farming" 
                className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16 animate-slide-down">Our Guiding Principles</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <ValueCard
              icon={Leaf}
              title="Sustainability"
              description="Teaching and promoting climate-appropriate, low-cost farming practices for long-term food security"
            />
            <ValueCard
              icon={Users}
              title="Community-Centered"
              description="Building local capacity through train-the-trainer models and peer-to-peer knowledge sharing"
            />
            <ValueCard
              icon={Target}
              title="Direct Market Access"
              description="Connecting farmers directly to buyers, eliminating middlemen and ensuring fair pricing"
            />
            <ValueCard
              icon={Heart}
              title="Real Impact"
              description="Building lasting food security and income independence for refugee and IDP communities"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16 animate-slide-down">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-slate-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="text-white font-semibold text-sm hover:underline">LinkedIn →</span>
                  </a>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="animate-slide-up">
              <p className="text-5xl font-bold mb-2 text-emerald-100">2,500+</p>
              <p className="text-emerald-100 text-lg">Active Farmers</p>
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <p className="text-5xl font-bold mb-2 text-emerald-100">5,000+</p>
              <p className="text-emerald-100 text-lg">Products Listed</p>
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <p className="text-5xl font-bold mb-2 text-emerald-100">10K+</p>
              <p className="text-emerald-100 text-lg">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            JOIN OUR COMMUNITY
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-slide-up">Ready to Be Part of the Story?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
            Join thousands of farmers and agricultural enthusiasts on The Torch and transform your agricultural future.
          </p>
          <Button
            onClick={() => navigate('/auth/register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-2xl font-semibold transition-all duration-300 hover:scale-105 animate-slide-up"
            size="lg"
            style={{animationDelay: '0.2s'}}
          >
            Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
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
                <li><button onClick={() => navigate('/public/browse')} className="hover:text-emerald-400 transition-colors">Browse Products</button></li>
                <li><button onClick={() => navigate('/public/learn')} className="hover:text-emerald-400 transition-colors">Learning Hub</button></li>
                <li><button onClick={() => navigate('/auth/register')} className="hover:text-emerald-400 transition-colors">Join Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/public/about')} className="hover:text-emerald-400 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/public/contact')} className="hover:text-emerald-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
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

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Leaf;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200 p-6 text-center hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2 text-lg">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
