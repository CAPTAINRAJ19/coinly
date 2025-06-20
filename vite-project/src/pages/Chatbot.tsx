import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  MessageCircle, 
  Sparkles, 
  Bot, 
  User, 
  Zap,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download
} from "lucide-react";

// Type for each chat message
type Message = {
  role: "user" | "bot";
  text: string;
};

// Common predefined Q&A
const predefinedResponses: Record<string, string> = {
  "how to add an expense?": "Go to Dashboard > Add Expense, enter details, and click Save.",
  "how to view spending reports?": "Navigate to Analytics > Reports for a category-wise breakdown.",
  "can i export my data?": "Yes! Go to Settings > Export to download your transactions.",
  "what is coinly?": "Coinly is your personal finance tracker to manage spending, budgeting, and goals.",
};

// Secure API key from .env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const lowerInput = input.trim().toLowerCase();

    // Predefined static response
    if (predefinedResponses[lowerInput]) {
      setTimeout(() => {
        const reply: Message = {
          role: "bot",
          text: predefinedResponses[lowerInput],
        };
        setMessages((prev) => [...prev, reply]);
      }, 800);
      setInput("");
      return;
    }

    // Call Gemini API for dynamic response
    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          })
        }
      );

      const data = await res.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      const aiResponse: Message = { role: "bot", text: botText };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Gemini API Error: ", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error: Unable to get a response from Gemini API." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUserMessage();
  };

  const quickQuestions = [
    { text: "What is Coinly?", icon: DollarSign },
    { text: "How to add an expense?", icon: TrendingUp },
    { text: "How to view spending reports?", icon: BarChart3 },
    { text: "Can I export my data?", icon: Download }
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const userMessageVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 p-4 flex items-center justify-center">
      <motion.div 
        className="w-full max-w-4xl bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 px-8 py-6 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute -left-4 -bottom-4 w-24 h-24 bg-green-400/30 rounded-full blur-xl"
            animate={{ 
              scale: [1, 0.8, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>

          <div className="relative flex items-center gap-4">
            <motion.div 
              className="p-3 bg-black/20 rounded-2xl backdrop-blur-sm border border-emerald-400/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-8 h-8" />
            </motion.div>
            <div>
              <motion.h2 
                className="text-3xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Coinly Assistant
              </motion.h2>
              <motion.p 
                className="text-emerald-100 text-sm flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Zap className="w-4 h-4" />
                Your intelligent finance companion
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="h-[500px] p-6 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-800/30">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 shadow-lg shadow-emerald-500/25"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold text-emerald-400 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Welcome to Coinly Assistant!
                </motion.h3>
                
                <motion.p 
                  className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  I'm here to help you master your personal finances. Ask me anything about expenses, budgeting, or financial insights!
                </motion.p>
                
                {/* Quick Questions */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <p className="text-sm font-medium text-emerald-300 mb-4 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick questions to get started:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {quickQuestions.map((question, idx) => {
                      const IconComponent = question.icon;
                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleQuickQuestion(question.text)}
                          className="px-5 py-3 text-sm bg-gray-800/80 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400/50 transition-all duration-300 text-gray-200 hover:text-emerald-300 flex items-center gap-3 justify-start group"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
                        >
                          <IconComponent className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                          {question.text}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                className={`mb-6 flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
                variants={msg.role === "user" ? userMessageVariants : messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Avatar */}
                <motion.div 
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400/50 shadow-lg shadow-emerald-500/25" 
                      : "bg-gradient-to-r from-gray-700 to-gray-600 border-emerald-500/30 shadow-lg shadow-gray-700/50"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-emerald-300" />
                  )}
                </motion.div>

                {/* Message Bubble */}
                <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}>
                  <motion.div 
                    className={`px-6 py-4 rounded-2xl shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-tr-md border border-emerald-400/30 shadow-emerald-500/25"
                        : "bg-gray-800/90 border border-emerald-500/20 text-gray-100 rounded-tl-md shadow-gray-900/50 backdrop-blur-sm"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </motion.div>
                  <p className={`text-xs text-gray-500 mt-2 px-2 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}>
                    {msg.role === "user" ? "You" : "Coinly AI"}
                  </p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                className="mb-6 flex items-start gap-3"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-emerald-500/30 shadow-lg shadow-gray-700/50 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="bg-gray-800/90 border border-emerald-500/20 text-gray-100 rounded-2xl rounded-tl-md px-6 py-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-emerald-300 text-sm font-medium">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          className="p-6 bg-gray-900/80 backdrop-blur-sm border-t border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <motion.input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-6 py-4 border border-emerald-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 bg-gray-800/90 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300"
                placeholder="Ask me anything about Coinly or your finances..."
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            <motion.button
              onClick={handleUserMessage}
              disabled={loading || !input.trim()}
              className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border border-emerald-400/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Chatbot; 