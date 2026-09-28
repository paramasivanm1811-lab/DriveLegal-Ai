"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, MapPin } from "lucide-react";

const ACCIDENT_DATA = [
  { district: 'Chennai', accidents: 4520, fatalities: 840 },
  { district: 'Coimbatore', accidents: 2100, fatalities: 420 },
  { district: 'Madurai', accidents: 1850, fatalities: 310 },
  { district: 'Salem', accidents: 1640, fatalities: 290 },
  { district: 'Trichy', accidents: 1200, fatalities: 180 },
];

const MONTHLY_FINES = [
  { month: 'Jan', amount: 4.2 },
  { month: 'Feb', amount: 3.8 },
  { month: 'Mar', amount: 5.1 },
  { month: 'Apr', amount: 4.7 },
  { month: 'May', amount: 6.0 },
  { month: 'Jun', amount: 5.5 },
];

const BLACK_SPOTS = [
  { rank: 1, name: "OMR Toll Plaza Junction, Chennai", cases: 245 },
  { rank: 2, name: "Avinashi Road Flyover, Coimbatore", cases: 189 },
  { rank: 3, name: "Mattuthavani Bus Stand Area, Madurai", cases: 156 },
  { rank: 4, name: "Salem-Bangalore NH44 Crossing", cases: 142 },
  { rank: 5, name: "Pallavaram Radial Road, Chennai", cases: 110 },
];

export default function RoadSafetyStats() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">TN Road Safety Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Real-time data visualization of traffic violations, fine collections, and accident black spots across Tamil Nadu.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Accident Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Accidents by District (YTD)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACCIDENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="district" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend />
                <Bar dataKey="accidents" name="Total Accidents" fill="#ff7c7c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fatalities" name="Fatalities" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fines Line Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-[var(--color-brand-green)]" /> Fine Collection (₹ Crores)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_FINES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{stroke: '#e5e7eb', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="amount" name="Collection (₹ Cr)" stroke="var(--color-brand-green)" strokeWidth={4} dot={{r: 6, fill: 'var(--color-brand-green)', strokeWidth: 0}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Black Spots */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="text-orange-500" /> Top 5 Accident Black Spots in TN
          </h2>
          <div className="space-y-4">
            {BLACK_SPOTS.map((spot) => (
              <div key={spot.rank} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-500 text-white font-bold rounded-full flex items-center justify-center shrink-0 text-sm">
                    {spot.rank}
                  </div>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">{spot.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-black text-orange-600 text-lg">{spot.cases}</span>
                  <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Violations */}
        <div className="bg-[var(--color-brand-dark)] text-white p-6 rounded-3xl shadow-lg border border-[var(--color-brand-gray-light)]">
          <h2 className="text-xl font-bold mb-6 text-[var(--color-brand-green-light)]">Most Common Violations</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>No Helmet</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Over Speeding</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Signal Jumping</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Drunk Driving</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center italic">
              "Chennai accounts for 38% of all recorded violations in the state."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
