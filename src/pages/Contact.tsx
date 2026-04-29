import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, Mail, Phone, MapPin, Send } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Swal.fire({
        title: 'Success!',
        text: 'Message sent! We\'ll get back to you soon.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#059669'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send message. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-teal-50 to-white">
      <PublicNavbar />
      {/* Navigation removed - using PublicNavbar instead */}
      {/*<nav className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="grid h-9 w-9 place-items-center rounded-sm bg-harvest text-harvest-foreground">
              <Sprout className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="font-display text-2xl font-bold text-foreground">The Torch</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm">
            <button onClick={() => navigate('/')} className="hover:text-harvest transition-colors">Home</button>
            <button onClick={() => navigate('/public/about')} className="hover:text-harvest transition-colors">About</button>
            <button onClick={() => navigate('/public/browse')} className="hover:text-harvest transition-colors">Products</button>
            <button className="text-harvest font-semibold">Contact</button>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/auth/login')} variant="outline" size="sm">
              Log In
            </Button>
            <Button
              onClick={() => navigate('/auth/register')}
              className="bg-harvest hover:bg-harvest/90 text-harvest-foreground"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <section className="relative h-96 bg-gradient-to-br from-green-600 to-emerald-600 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/2397220/pexels-photo-2397220.jpeg?w=1200&h=400&fit=crop" 
          alt="Contact Us" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-emerald-600/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <ContactInfoCard
            icon={Mail}
            title="Email"
            description="support@thetorch.com"
            link="mailto:support@thetorch.com"
          />
          <ContactInfoCard
            icon={Phone}
            title="Phone"
            description="+1 (555) 123-4567"
            link="tel:+15551234567"
          />
          <ContactInfoCard
            icon={MapPin}
            title="Location"
            description="1 University Avenue, Berekuso, Accra, Ghana"
            link="#"
          />
        </div>

        {/* Contact Form */}
        <div className="bg-background rounded-lg border border-border/50 p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-harvest/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-harvest/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Message subject"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-harvest/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-harvest/50 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-harvest hover:bg-harvest/90 text-harvest-foreground font-semibold"
            >
              {loading ? 'Sending...' : 'Send Message'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12">Find answers to common questions about The Torch platform</p>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem
              question="How long does it take to get a response?"
              answer="We typically respond to inquiries within 24-48 hours during business days. For urgent matters, contact us by phone."
            />
            <FAQItem
              question="Can I join The Torch as a seller?"
              answer="Yes! We welcome farmers, vendors, and agricultural businesses. Sign up on our platform and complete seller verification to start selling."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept mobile money (MTN, Vodafone), bank transfers, and digital payment methods for convenient transactions."
            />
            <FAQItem
              question="Is my data secure on The Torch?"
              answer="Absolutely. We use industry-standard encryption and security measures to protect your personal and financial information."
            />
            <FAQItem
              question="Do I need to pay to join?"
              answer="Registration is free! You only pay when you make transactions. Sellers may have optional premium features."
            />
            <FAQItem
              question="How do I track my orders?"
              answer="You can track all orders in real-time from your dashboard. You'll receive SMS updates on each step of the delivery process."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-harvest to-harvest/80 text-harvest-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join The Torch?</h2>
          <p className="text-lg mb-8 opacity-90">
            Sign up today to start buying and selling agricultural products.
          </p>
          <Button
            onClick={() => navigate('/auth/register')}
            size="lg"
            className="bg-harvest-foreground text-harvest hover:bg-harvest-foreground/90"
          >
            Create Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
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

function ContactInfoCard({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: any;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <a href={link} className="bg-background rounded-lg border border-border/50 p-6 hover:border-harvest/50 hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-harvest/10 rounded-lg">
          <Icon className="h-6 w-6 text-harvest" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </a>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-background rounded-lg border border-border/50 p-6 hover:border-harvest/50 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between font-semibold text-foreground"
      >
        {question}
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <p className="text-muted-foreground mt-4">{answer}</p>}
    </div>
  );
}
