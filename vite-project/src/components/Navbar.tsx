import React, { useState, useEffect } from 'react';
import {
  ChevronDown, Menu, X, TrendingUp, PieChart, Target,
  Wallet, Users,
} from 'lucide-react';
import logoImage from '../assets/images/coin.png';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdown: string) =>
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);

  const featuresItems = [
    { icon: <TrendingUp className="w-4 h-4" />, title: 'Expense Tracking', desc: 'Track your daily expenses' },
    { icon: <PieChart className="w-4 h-4" />, title: 'Budget Planning', desc: 'Create smart budgets' },
    { icon: <Target className="w-4 h-4" />, title: 'Goal Setting', desc: 'Set financial goals' },
    { icon: <Wallet className="w-4 h-4" />, title: 'Portfolio Management', desc: 'Manage investments' },
    { icon: <Users className="w-4 h-4" />, title: 'AI Chatbot', desc: 'Get personalized financial advice' },
  ];

  const pricingItems = [
    { title: 'Free', price: '$0', desc: 'Basic tracking features' },
    { title: 'Pro', price: '$9.99', desc: 'Advanced analytics' },
    { title: 'Premium', price: '$19.99', desc: 'Full feature access' },
  ];

  const navigationLinks = [
    { label: 'Blogs', path: '/blogs' },
    { label: 'About', path: '/about' },
    { label: 'Chatbot', path: '/chatbot' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAuth = (action: 'login' | 'signup') => {
    if (action === 'login') {
      handleGoogleLogin(); // Popup directly
    } else {
      navigate('/signup'); // Navigate for email signup
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-green-400/20' : 'bg-black'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="group flex-shrink-0">
            <div className="relative p-3 px-5 rounded-xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 group-hover:border-transparent overflow-hidden">
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 rounded-xl animate-spin"
                  style={{
                    background: 'conic-gradient(from 0deg, #22c55e, #16a34a, #15803d, #22c55e)',
                    animation: 'spin 3s linear infinite',
                  }}
                ></div>
                <div className="absolute inset-[2px] rounded-xl bg-gray-900/95 backdrop-blur-sm"></div>
              </div>
              <div className="relative flex items-center space-x-3 z-10">
                <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-cursiva bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent tracking-tight">Coinly</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Dropdowns */}
            <div className="relative">
              <button onClick={() => toggleDropdown('features')} className="text-sm text-gray-300 hover:text-green-400 flex items-center gap-1">Features <ChevronDown size={16} /></button>
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 border border-green-400/20 rounded-lg shadow-lg z-40">
                  <div className="p-2">
                    {featuresItems.map((item, i) => (
                      <div key={i} className="flex items-start p-2 rounded hover:bg-green-400/10">
                        <div className="text-green-400">{item.icon}</div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => toggleDropdown('pricing')} className="text-sm text-gray-300 hover:text-green-400 flex items-center gap-1">Pricing <ChevronDown size={16} /></button>
              {activeDropdown === 'pricing' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 border border-green-400/20 rounded-lg shadow-lg z-40">
                  <div className="p-2">
                    {pricingItems.map((item, i) => (
                      <div key={i} className="p-2 hover:bg-green-400/10 rounded">
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.price} - {item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navigationLinks.map(link => (
              <Link key={link.label} to={link.path} className="text-sm text-gray-300 hover:text-green-400">{link.label}</Link>
            ))}

            {/* Auth section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">Logout</button>
                  <span className="text-sm text-green-400">Hello, {user.displayName?.split(' ')[0] || 'User'}</span>
                  <img src={user.photoURL || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                </>
              ) : (
                <>
                  <button onClick={() => handleAuth('login')} className="text-sm text-gray-300 hover:text-green-400">Login</button>
                  <button onClick={() => handleAuth('signup')} className="bg-gradient-to-r from-green-400 to-green-500 text-black px-4 py-2 rounded-lg hover:from-green-500 hover:to-green-600 text-sm">Sign up</button>
                </>
              )}
            </div>
          </div>

          {/* Mobile toggle with user image */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <img src={user.photoURL || '/default-profile.png'} alt="User" className="w-8 h-8 rounded-full object-cover" />
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 border-t border-green-400/20">
          <div className="p-4 space-y-2">
            <button onClick={() => toggleDropdown('mobile-features')} className="w-full text-left text-gray-300 hover:text-green-400">Features</button>
            {activeDropdown === 'mobile-features' && (
              <div className="ml-4 space-y-2">{featuresItems.map((item, i) => (
                <div key={i} className="text-sm text-gray-300">{item.title}</div>
              ))}</div>
            )}

            <button onClick={() => toggleDropdown('mobile-pricing')} className="w-full text-left text-gray-300 hover:text-green-400">Pricing</button>
            {activeDropdown === 'mobile-pricing' && (
              <div className="ml-4 space-y-2">{pricingItems.map((item, i) => (
                <div key={i} className="text-sm text-gray-300">{item.title}</div>
              ))}</div>
            )}

            {navigationLinks.map(link => (
              <Link key={link.label} to={link.path} className="block text-gray-300 hover:text-green-400">{link.label}</Link>
            ))}

            <div className="pt-4 border-t border-green-400/20">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400">Hello, {user.displayName?.split(' ')[0] || 'User'}</span>
                    <img src={user.photoURL || '/default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  </div>
                  <button onClick={handleLogout} className="block w-full mt-2 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600">Logout</button>
                </div>
              ) : (
                <>
                  <button onClick={() => handleAuth('login')} className="block w-full text-left text-gray-300 hover:text-green-400">Login</button>
                  <button onClick={() => handleAuth('signup')} className="block w-full mt-2 bg-gradient-to-r from-green-400 to-green-500 text-black px-3 py-1.5 rounded hover:from-green-500 hover:to-green-600">Sign up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
