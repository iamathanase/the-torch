import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, BookOpen, Award, Users, ArrowRight, Clock, BarChart } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import Swal from 'sweetalert2';
export default function Learning() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'Organic Farming Basics',
      description: 'Learn the fundamentals of organic farming and sustainable practices',
      level: 'Beginner',
      duration: '4 weeks',
      students: '2,340',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      title: 'Soil Management & Health',
      description: 'Master soil testing, composting, and nutrient management',
      level: 'Intermediate',
      duration: '6 weeks',
      students: '1,890',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=400&h=250&fit=crop',
    },
    {
      id: 3,
      title: 'Crop Rotation Strategies',
      description: 'Optimize yields with effective crop rotation planning',
      level: 'Intermediate',
      duration: '4 weeks',
      students: '1,245',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/2248507/pexels-photo-2248507.jpeg?w=400&h=250&fit=crop',
    },
    {
      id: 4,
      title: 'Pest Management',
      description: 'Identify and manage common pests using organic methods',
      level: 'Beginner',
      duration: '3 weeks',
      students: '3,120',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/3763020/pexels-photo-3763020.jpeg?w=400&h=250&fit=crop',
    },
    {
      id: 5,
      title: 'Vegetable Growing Guide',
      description: 'Complete guide to growing popular vegetables year-round',
      level: 'Beginner',
      duration: '5 weeks',
      students: '2,890',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/5473950/pexels-photo-5473950.jpeg?w=400&h=250&fit=crop',
    },
    {
      id: 6,
      title: 'Advanced Farming Techniques',
      description: 'Learn latest technologies and methods for modern farming',
      level: 'Advanced',
      duration: '8 weeks',
      students: '890',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=400&h=250&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-white">
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
            <button onClick={() => navigate('/public/contact')} className="hover:text-harvest transition-colors">Contact</button>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-12 animate-slide-down">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Learning Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Expand your farming knowledge with expert-led courses and resources designed to help you succeed
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={BookOpen}
            title="Comprehensive Courses"
            description="Learn from industry experts with structured, hands-on courses"
          />
          <FeatureCard
            icon={Award}
            title="Earn Certificates"
            description="Complete courses and earn recognized certificates to boost credibility"
          />
          <FeatureCard
            icon={Users}
            title="Join Community"
            description="Connect with other learners and share experiences"
          />
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-4xl font-bold text-foreground mb-4 animate-slide-down">Available Courses</h2>
        <p className="text-muted-foreground mb-12 animate-slide-up">Start learning today with our curated selection of agriculture courses</p>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={course.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CourseCard {...course} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-200 p-12 mt-20 text-center hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Learn?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up now to unlock all courses and start your learning journey with The Torch
          </p>
          <Button
            onClick={() => navigate('/auth/register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105"
            size="lg"
          >
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <StatBox number="50+" label="Expert Courses" />
            <StatBox number="15K+" label="Active Learners" />
            <StatBox number="4.8★" label="Average Rating" />
            <StatBox number="100%" label="Satisfaction Rate" />
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

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-emerald-200 p-6 text-center hover:border-emerald-400 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-2 text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function CourseCard({ title, description, level, duration, students, rating, image }: any) {
  return (
    <div className="bg-white rounded-lg border border-emerald-200 overflow-hidden hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
            {level}
          </span>
        </div>
        <h3 className="font-semibold text-foreground mb-2 text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="space-y-2 mb-4 pb-4 border-b border-emerald-200 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {students} enrolled
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            {rating} ⭐
          </div>
        </div>

        <Button onClick={() => navigate('/auth/register')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105">
          View Course
        </Button>
      </div>
    </div>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="animate-slide-up">
      <p className="text-4xl font-bold text-emerald-100 mb-2">{number}</p>
      <p className="text-emerald-100 text-lg">{label}</p>
    </div>
  );
}
