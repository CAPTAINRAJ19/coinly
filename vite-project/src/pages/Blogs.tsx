import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  User, 
  Calendar, 
  BookOpen, 
  X, 
  Plus,
  TrendingUp,
  DollarSign,
  BarChart3,
  Eye
} from 'lucide-react';

type Blog = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

const Blogs: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.post(
        'http://localhost:5000/api/blogs',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setContent('');
      // Refetch blogs after posting
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header Section */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Coinly Financial Insights
            </h1>
          </motion.div>
          <p className="text-gray-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Share your finance knowledge and discover market insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Blog Form */}
        <AnimatePresence>
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PenTool className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-semibold text-white">Create New Financial Insight</h2>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <BookOpen className="w-4 h-4" />
                      Article Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Top 5 Investment Strategies for 2025"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <PenTool className="w-4 h-4" />
                      Content
                    </label>
                    <textarea
                      placeholder="Share your financial insights, market analysis, or investment tips..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-700/50 text-white placeholder-gray-400 resize-none"
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Publish Insight
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 text-center"
            >
              <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-800 rounded-2xl p-8">
                <DollarSign className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-orange-300 text-lg font-medium">
                  Please log in to share your financial insights with the Coinly community
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blogs Grid */}
        <div className="mb-8">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
          >
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Latest Financial Insights
            <span className="text-sm font-normal text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {blogs.length} articles
            </span>
          </motion.h3>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.map((blog: Blog, index: number) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 overflow-hidden hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-colors">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {formatDate(blog.createdAt)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {blog.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300 font-medium">{blog.author}</span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {blog.content.slice(0, 120)}...
                </p>
                
                <motion.button
                  onClick={() => setSelectedBlog(blog)}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group/btn"
                >
                  <Eye className="w-4 h-4" />
                  Read Full Article
                  <span className="text-lg group-hover/btn:translate-x-1 transition-transform">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No articles yet</h3>
            <p className="text-gray-500">Be the first to share your financial insights!</p>
          </motion.div>
        )}
      </div>

      {/* Modal for full blog view */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Financial Insight</span>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {selectedBlog.title}
                </h2>
                
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 font-medium">{selectedBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{formatDate(selectedBlog.createdAt)}</span>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
                    {selectedBlog.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;