import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, TrendingUp, PieChart, Target, Wallet, Users } from 'lucide-react';
import logoImage from '../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface PricingItem {
  title: string;
  price: string;
  desc: string;
}

type DropdownType = 'features' | 'pricing' | 'mobile-features' | 'mobile-pricing' | '';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>('');
  const [scrolled, setScrolled] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdown: DropdownType): void => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };

  const featuresItems: FeatureItem[] = [
    { icon: <TrendingUp className="w-4 h-4" />, title: 'Expense Tracking', desc: 'Track your daily expenses' },
    { icon: <PieChart className="w-4 h-4" />, title: 'Budget Planning', desc: 'Create smart budgets' },
    { icon: <Target className="w-4 h-4" />, title: 'Goal Setting', desc: 'Set financial goals' },
    { icon: <Wallet className="w-4 h-4" />, title: 'Portfolio Management', desc: 'Manage investments' },
    { icon: <Users className="w-4 h-4" />, title: 'AI Chatbot', desc: 'Get personalized financial advice' }
  ];

  const pricingItems: PricingItem[] = [
    { title: 'Free', price: '$0', desc: 'Basic tracking features' },
    { title: 'Pro', price: '$9.99', desc: 'Advanced analytics' },
    { title: 'Premium', price: '$19.99', desc: 'Full feature access' }
  ];

  const navigationLinks: { label: string; path: string }[] = [
    { label: 'Blogs', path: '/blogs' },
    { label: 'About', path: '/about' },
    { label: 'Chatbot', path: '/chatbot' },
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const handleAuth = (action: 'login' | 'signup'): void => {
    console.log(`${action} clicked`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black backdrop-blur-md border-b border-yellow-500/20' : 'bg-black'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="relative group cursor-pointer">
            <div className="relative p-3 px-5 rounded-xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 group-hover:border-transparent overflow-hidden">
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-spin" style={{
                  background: 'conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #92400e, #fbbf24)',
                  animation: 'spin 3s linear infinite'
                }}></div>
                <div className="absolute inset-[2px] rounded-xl bg-gray-900/95 backdrop-blur-sm"></div>
              </div>

              <div className="relative flex items-center space-x-3 z-10">
                <div className="relative">
                  <img
                    src={logoImage}
                    alt="Coinly Logo"
                    className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute -inset-1 bg-yellow-400/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent font-['Inter'] tracking-tight group-hover:from-yellow-300 group-hover:to-yellow-200 transition-all duration-300">
                  Coinly
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('features')}
                className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'features' ? 'rotate-180' : ''
                }`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-yellow-500/20 shadow-2xl transition-all duration-300 ${
                activeDropdown === 'features' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
              }`}>
                <div className="p-4 space-y-3">
                  {featuresItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-500/10 transition-colors duration-200 cursor-pointer group"
                    >
                      <div className="text-yellow-400 mt-1 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-200">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('pricing')}
                className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                <span>Pricing</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'pricing' ? 'rotate-180' : ''
                }`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-yellow-500/20 shadow-2xl transition-all duration-300 ${
                activeDropdown === 'pricing' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
              }`}>
                <div className="p-4 space-y-2">
                  {pricingItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg hover:bg-yellow-500/10 transition-colors duration-200 cursor-pointer group border border-transparent hover:border-yellow-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-200">{item.title}</h4>
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            {navigationLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleAuth('login')}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => handleAuth('signup')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 rounded-lg mt-2 backdrop-blur-sm">
            {/* Mobile Features */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-features')}
                className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'mobile-features' ? 'rotate-180' : ''
                }`} />
              </button>
              {activeDropdown === 'mobile-features' && (
                <div className="pl-4 space-y-2">
                  {featuresItems.map((item, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200 w-full text-left"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Pricing */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-pricing')}
                className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
              >
                <span>Pricing</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'mobile-pricing' ? 'rotate-180' : ''
                }`} />
              </button>
              {activeDropdown === 'mobile-pricing' && (
                <div className="pl-4 space-y-2">
                  {pricingItems.map((item, index) => (
                    <div key={index} className="px-3 py-2 text-sm w-full text-left text-gray-300">
                      <div className="flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="text-yellow-400">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            {navigationLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="block px-3 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 w-full text-left"
              >
                {label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => handleAuth('login')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => handleAuth('signup')}
                className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
