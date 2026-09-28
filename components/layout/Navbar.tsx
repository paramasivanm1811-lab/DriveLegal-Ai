"use client";

import Link from "next/link";
import { ShieldAlert, MapPin, BookOpen, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[var(--color-brand-dark)] text-white sticky top-0 z-50 border-b border-[var(--color-brand-gray-light)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <ShieldAlert className="w-8 h-8 text-[var(--color-brand-green-light)]" />
          <span className="text-xl font-bold tracking-tight">Drive<span className="text-[var(--color-brand-green-light)]">Legal TN</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/calculator" className="text-sm font-medium hover:text-[var(--color-brand-green-light)] flex items-center gap-2 transition-colors">
            <MapPin className="w-4 h-4" /> Challan Calculator
          </Link>
          <Link href="/laws" className="text-sm font-medium hover:text-[var(--color-brand-green-light)] flex items-center gap-2 transition-colors">
            <BookOpen className="w-4 h-4" /> Law Database
          </Link>
          <Link href="/chat" className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <MessageSquare className="w-4 h-4" /> AI Chatbot
          </Link>
        </nav>

        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-[var(--color-brand-green-light)] hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--color-brand-gray)] border-t border-[var(--color-brand-gray-light)] overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link 
                href="/calculator" 
                onClick={() => setIsOpen(false)}
                className="text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 hover:text-[var(--color-brand-green-light)] flex items-center gap-3 transition-all"
              >
                <MapPin className="w-5 h-5 text-[var(--color-brand-green-light)]" /> Challan Calculator
              </Link>
              <Link 
                href="/laws" 
                onClick={() => setIsOpen(false)}
                className="text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 hover:text-[var(--color-brand-green-light)] flex items-center gap-3 transition-all"
              >
                <BookOpen className="w-5 h-5 text-[var(--color-brand-green-light)]" /> Law Database
              </Link>
              <Link 
                href="/chat" 
                onClick={() => setIsOpen(false)}
                className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white px-4 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <MessageSquare className="w-5 h-5" /> AI Chatbot
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
