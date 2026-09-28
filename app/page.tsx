"use client";

import Link from "next/link";
import { Calculator, BookOpen, MessageSquare, Phone, AlertTriangle, ChevronRight, ShieldAlert, FileText, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

export default function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const { laws, fetchLaws } = useStore();

  useEffect(() => {
    fetchLaws();
  }, [fetchLaws]);

  // Combine fallback/default tips with dynamic database laws
  const baseItems = [
    "📢 Helmet mandatory for pillion riders across all TN districts (Sec 129 MV Act).",
    "⚠️ Zero tolerance special drive against drunk driving in Chennai and urban hubs.",
    "ℹ️ Citizens can pay traffic fines online via the official national eChallan portal."
  ];

  const dbItems = laws
    .slice(0, 3)
    .map(law => `🚨 Active Regulation: ${law.title} in ${law.district} - Fine: ${law.penalty}`);

  const tickerItems = dbItems.length > 0 ? [...dbItems, ...baseItems] : [
    "🚨 New speed limits active on ECR from this week.",
    ...baseItems
  ];

  useEffect(() => {
    if (tickerItems.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  return (
    <div className="flex flex-col flex-1">
      {/* Live Ticker */}
      <div className="bg-red-600 text-white text-sm py-2 px-4 flex items-center overflow-hidden">
        <span className="font-bold whitespace-nowrap mr-4 bg-red-800 px-2 py-1 rounded text-xs uppercase tracking-wider">Live Update</span>
        <motion.div
          key={tickerIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="truncate"
        >
          {tickerItems[tickerIndex]}
        </motion.div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 text-xs py-2.5 px-4 text-center font-semibold">
        ⚠️ <strong>Disclaimer:</strong> DriveLegal TN is a student project created for the Road Safety Hackathon 2026 (CoERS, IIT Madras). This is NOT an official government website, and the information presented here should not be treated as official legal or police advice.
      </div>

      {/* Hero Section */}
      <section className="bg-[var(--color-brand-dark)] text-white py-16 relative overflow-hidden">
        {/* Background Image Overlay (Tamil Nadu Highway Theme) */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596489376916-2495bf41c0ad?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-dark)] to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
                  <ShieldAlert className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-yellow-400 text-sm font-bold tracking-wider uppercase">Govt of Tamil Nadu</h3>
                  <p className="text-xs text-gray-300">Ministry of Road Transport & Highways</p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                தமிழ்நாடு போக்குவரத்து விதிகள் <br/>
                <span className="text-[var(--color-brand-green-light)] text-xl sm:text-2xl md:text-4xl">Tamil Nadu Traffic Rules & Fines</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl mt-6 leading-relaxed">
                The official AI-powered portal for all traffic regulations across Tamil Nadu. Stay informed, avoid penalties, and drive safely.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 w-full"
            >
              <Link href="/calculator" className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-light)] text-white px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-102 shadow-lg shadow-green-900/50 justify-center w-full sm:w-auto sm:flex-1 sm:min-w-[180px]">
                <Calculator className="w-5 h-5" /> Check Fine (₹)
              </Link>
              <Link href="/chat" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-102 shadow-lg justify-center w-full sm:w-auto sm:flex-1 sm:min-w-[180px]">
                <MessageSquare className="w-5 h-5" /> Ask AI Bot
              </Link>
              <Link href="/laws" className="bg-white text-[var(--color-brand-dark)] hover:bg-gray-100 px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-102 shadow-lg justify-center border border-gray-200 w-full sm:w-auto sm:flex-1 sm:min-w-[180px]">
                <BookOpen className="w-5 h-5" /> Know the Law
              </Link>
            </motion.div>
          </div>
          
          {/* Emergency Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-sm relative"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl relative">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-4 text-white">
                <Phone className="text-red-400" /> Emergency Numbers (TN)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold">100</div>
                    <div>
                      <p className="font-bold text-white">Police Control Room</p>
                      <p className="text-xs text-gray-400">For immediate traffic/law assistance</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="https://www.google.com/maps/search/Police+Station+near+me" target="_blank" rel="noreferrer" title="Find nearby Police Station" className="p-2 bg-white/10 rounded-full hover:bg-[var(--color-brand-green)] transition-colors">
                      <MapPin className="w-4 h-4 text-white" />
                    </a>
                    <a href="tel:100" title="Call 100" className="p-2 bg-white/10 rounded-full hover:bg-red-500 transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">108</div>
                    <div>
                      <p className="font-bold text-white">Ambulance Service</p>
                      <p className="text-xs text-gray-400">For medical emergencies on road</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="https://www.google.com/maps/search/Hospital+near+me" target="_blank" rel="noreferrer" title="Find nearby Hospital" className="p-2 bg-white/10 rounded-full hover:bg-[var(--color-brand-green)] transition-colors">
                      <MapPin className="w-4 h-4 text-white" />
                    </a>
                    <a href="tel:108" title="Call 108" className="p-2 bg-white/10 rounded-full hover:bg-blue-500 transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">103</div>
                    <div>
                      <p className="font-bold text-white">Traffic Helpline</p>
                      <p className="text-xs text-gray-400">Report accidents & jams</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="tel:103" title="Call 103" className="p-2 bg-white/10 rounded-full hover:bg-yellow-500 transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/stats" className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">TN Road Safety Stats</h3>
              <p className="text-xs text-gray-500">View accident data & fine charts by district.</p>
            </Link>
            
            <Link href="/vehicles" className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Vehicle Specific Rules</h3>
              <p className="text-xs text-gray-500">Auto meters, lorry weights, 2-wheeler rules.</p>
            </Link>

            <Link href="/info" className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Police Info & Court</h3>
              <p className="text-xs text-gray-500">eChallan payment, RTO finders, contest fines.</p>
            </Link>

            <Link href="/quiz" className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Road Safety Quiz</h3>
              <p className="text-xs text-gray-500">Test your TN traffic rule knowledge.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
