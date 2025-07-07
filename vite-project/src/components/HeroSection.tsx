import  { useState, useEffect } from 'react';
import coinImage from '../assets/images/coin.png';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  PieChart, 
  Bot, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const CoinlyHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: DollarSign, title: 'Expense Tracking', desc: 'Track your daily expenses' },
    { icon: TrendingUp, title: 'Budget Planning', desc: 'Create smart budgets' },
    { icon: Target, title: 'Goal Setting', desc: 'Set financial goals' },
    { icon: PieChart, title: 'Portfolio Management', desc: 'Manage investments' },
    { icon: Bot, title: 'AI Chatbot', desc: 'Get personalized financial advice' }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Neon Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Mouse Follower Glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >

              
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight"
              >
                Take Control of Your
                <motion.span
                  className="block bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent"
                  style={{ fontFamily: 'cursive' }}
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(34, 197, 94, 0.5)',
                      '0 0 40px rgba(34, 197, 94, 0.8)',
                      '0 0 20px rgba(34, 197, 94, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Finances with
                </motion.span>
               <span className="text-9xl text-amber-400 font-cursiva flex items-center gap-4">
  <img src={coinImage} alt="Coin icon" className="w-28 h-28" />
  Coinly
</span>

              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
              >
                Transform your financial future with smart tracking, AI-powered insights, 
                and personalized budgeting tools designed for the modern investor.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-green-400/50 transition-all duration-300"
                >
                  <feature.icon className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-8 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span>AI-Powered</span>
              </div>
              <div>10k+ Users</div>
              <div>⭐ 4.9/5 Rating</div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Dashboard Mockup */}
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 1, -1, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-6 shadow-2xl"
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-400 rounded-lg"></div>
                    <div className="text-white font-semibold">Dashboard</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-green-400 text-2xl font-bold mb-2">$24,580</div>
                    <div className="text-gray-400 text-sm">Total Balance</div>
                    <div className="mt-3 h-16 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg flex items-end justify-around p-2">
                      {[40, 65, 45, 70, 55, 80, 60].map((height, i) => (
                        <motion.div
                          key={i}
                          className="bg-green-400 rounded-sm"
                          style={{ width: '8px' }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-blue-400 text-2xl font-bold mb-2">$3,240</div>
                    <div className="text-gray-400 text-sm">This Month</div>
                    <div className="mt-3 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 rounded-full border-4 border-gray-700"
                        style={{
                          background: `conic-gradient(#22c55e 0deg 216deg, #374151 216deg 360deg)`
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="space-y-3">
                  {[
                    { name: 'Coffee Shop', amount: '-$4.50', positive: false },
                    { name: 'Salary Deposit', amount: '+$3,200', positive: true },
                    { name: 'Grocery Store', amount: '-$67.30', positive: false }
                  ].map((transaction, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.2 }}
                      className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.positive ? 'bg-green-400/20' : 'bg-red-400/20'
                        }`}>
                          <DollarSign className={`w-5 h-5 ${
                            transaction.positive ? 'text-green-400' : 'text-red-400'
                          }`} />
                        </div>
                        <div className="text-white text-sm">{transaction.name}</div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.positive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                +15.3% ↗
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-gray-900 border border-green-400 text-green-400 px-4 py-2 rounded-full text-sm font-semibold"
              >
                AI Insights Ready
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Get Started Button - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-8 right-8 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-green-400 to-green-600 text-black px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-green-400/25 transition-all duration-300 flex items-center space-x-3"
          >
            <span>Get Started</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          {/* Button Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-50 -z-10"></div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-400 hidden lg:block"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </div>
  );
};

export default CoinlyHero;