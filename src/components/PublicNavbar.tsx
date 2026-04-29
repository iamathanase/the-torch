import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sprout } from "lucide-react";

interface NavbarProps {
  hideOnTop?: boolean;
}

const PublicNavbar = ({ hideOnTop = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(!hideOnTop);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (hideOnTop) {
        setIsVisible(scrollY > 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnTop]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/public/about" },
    { label: "Products", path: "/public/browse" },
    { label: "Learning", path: "/public/learn" },
    { label: "Contact", path: "/public/contact" },
  ];

  const isPublicPage = location.pathname.startsWith("/public") || location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md border-b border-slate-200"
          : hideOnTop
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <img src="/logooo.png" alt="The Torch" className="h-10 w-10" />
            <span className="font-bold text-xl text-slate-900">The Torch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 ${
                  location.pathname === link.path
                    ? "bg-green-50 text-green-700 font-semibold"
                    : isScrolled || isVisible
                    ? "text-slate-700 hover:bg-slate-100 hover:text-green-600"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isPublicPage && (
              <Link to="/">
                <Button
                  variant="outline"
                  className={`${
                    isScrolled
                      ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  Back to Site
                </Button>
              </Link>
            )}
            <Link to="/auth/login">
              <Button
                variant="outline"
                className={`${
                  isScrolled
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                Log In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/auth/register" className="md:hidden">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Sign Up
              </Button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled || isVisible
                  ? "text-slate-900 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-in slide-in-from-top">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200">
              <Link
                to="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
