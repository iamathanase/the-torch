import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/hero-farmer.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 text-white text-center px-8">
          <div className="mb-8">
            <img src="/logooo.png" alt="The Torch" className="h-16 mx-auto mb-6 drop-shadow-lg" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome to The Torch</h2>
          <p className="text-lg text-green-100 mb-8">
            Building Food Security Through Agricultural Education & Digital Marketplace
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                <span className="text-green-900 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold">Access Quality Products</p>
                <p className="text-sm text-green-100">From local farmers and producers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                <span className="text-green-900 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold">Learn & Grow</p>
                <p className="text-sm text-green-100">Educational courses on sustainable farming</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                <span className="text-green-900 font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold">Support Communities</p>
                <p className="text-sm text-green-100">Helping refugee and IDP farmers thrive</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logooo.png" alt="The Torch" className="h-10" />
            <h1 className="text-2xl font-bold text-slate-900">The Torch</h1>
          </div>
        </div>

        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
          <p className="text-slate-600">Access your account to continue</p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <span className="text-red-600 text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-red-800 font-medium text-sm">Login Error</p>
              <p className="text-red-700 text-sm">{displayError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50"
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-slate-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-green-600 hover:text-green-700 font-semibold">
              Create one now
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500 font-semibold mb-3 uppercase">Demo Credentials</p>
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-4">
            <p><span className="font-semibold">Admin:</span> admin@thetorch.com / password123</p>
            <p><span className="font-semibold">Farmer:</span> farmer@thetorch.com / password123</p>
            <p><span className="font-semibold">Buyer:</span> buyer@thetorch.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
