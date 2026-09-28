"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Filter, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { CustomSelect } from "@/components/CustomSelect";

export default function LawsDatabase() {
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState("All");
  const { laws, fetchLaws } = useStore();

  useEffect(() => {
    fetchLaws();
  }, [fetchLaws]);
  const TN_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];
  const vehicleTypes = ["All", "2-Wheeler", "4-Wheeler", "Auto", "Bus", "Lorry"];

  const filteredLaws = laws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(search.toLowerCase()) || 
                          law.desc.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = selectedDistrict === "All" || law.district === "All" || law.district === selectedDistrict;
    const matchesVehicle = selectedVehicle === "All" || law.vehicleType === selectedVehicle || law.vehicleType === "All" || !law.vehicleType;
    return matchesSearch && matchesDistrict && matchesVehicle;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Traffic Laws Database</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Browse official motor vehicle acts, violations, and fine schedules active in Tamil Nadu.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search violations (e.g., 'Speeding', 'Helmet')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-gray-900 bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent transition-all"
          />
        </div>
        <div className="md:w-64 relative">
          <CustomSelect 
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            options={[
              { label: "All Districts", value: "All" },
              ...TN_DISTRICTS.map(d => ({ label: d, value: d }))
            ]}
            icon={<Filter />}
          />
        </div>
        <div className="md:w-56 relative">
          <CustomSelect 
            value={selectedVehicle}
            onChange={setSelectedVehicle}
            options={vehicleTypes.map(v => ({ label: v === "All" ? "All Vehicles" : `${v} Rules`, value: v }))}
            icon={<Filter />}
          />
        </div>
      </div>

      {filteredLaws.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No laws found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaws.map((law, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={law.id} 
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-green)]">
                      {law.tier === 'state' ? 'Statewide' : law.district}
                    </span>
                    {law.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">
                        {law.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{law.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6 min-h-[60px]">{law.desc}</p>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-500 text-xs font-mono">{law.authority}</div>
                    {law.vehicleType && law.vehicleType !== 'All' && (
                      <div className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block w-fit">
                        {law.vehicleType}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">Standard Fine</span>
                    <span className="text-2xl font-extrabold text-red-600">{law.penalty}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
