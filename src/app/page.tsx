"use client"

import { FaArrowRight, FaWandMagicSparkles, FaCode, FaLayerGroup, FaBolt } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#131314] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">C</div>
          <span>AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Feature</a>
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-all">
          Masuk
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"
        >
          <FaWandMagicSparkles /> Ollama Deepseek R1 Model 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent"
        >
          Build Your Future <br /> with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          A chat platform to support your productivity, coding, and creativity in one simple interface.
        </motion.p>

        {/* Tombol Utama Menuju Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/chats">
            <button className="group relative px-8 py-4 bg-blue-600 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
              <div className="relative z-10 flex items-center gap-3">
                Start Chat Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </motion.div>

        {/* Bento Grid Mini (Fitur) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full">
          {[
            { icon: <FaCode />, title: "Coding Assistant", desc: "Write and debug code in seconds." },
            { icon: <FaLayerGroup />, title: "Context Aware", desc: "AI remembers previous conversations accurately." },
            { icon: <FaBolt />, title: "Ultra Fast", desc: "Instant responses with very low latency." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-[#1e1f20] border border-gray-800 text-left hover:border-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-blue-500 text-xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Ringkas */}
      <footer className="border-t border-gray-800 py-12 text-center text-gray-500 text-sm">
        © 2026 C-AI.
      </footer>
    </div>
  );
};

export default HomePage;