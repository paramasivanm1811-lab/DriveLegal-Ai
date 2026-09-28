"use client";

import { useState, useMemo, useEffect } from "react";
import { Calculator, MapPin, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { CustomSelect } from "@/components/CustomSelect";
import Link from "next/link";

const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

export default function ChallanCalculator() {
  const { laws, fetchLaws } = useStore();
  
  useEffect(() => {
    fetchLaws();
  }, [fetchLaws]);
  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState("");
  const [violation, setViolation] = useState("");

  const availableViolations = useMemo(() => {
    return Array.from(new Set(laws.filter(l => l.tier === 'state' || l.district === district).map(l => l.title)));
  }, [laws, district]);

  const result = useMemo(() => {
    return laws.find(l => l.title === violation && (l.tier === 'state' || l.district === district));
  }, [laws, district, violation]);

  const isStep1Complete = !!district;
  const isStep2Complete = !!violation;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-[var(--color-brand-green)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-[var(--color-brand-green)]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Challan Calculator</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">Get accurate traffic fine estimates based on your specific district in Tamil Nadu.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex-1 py-4 text-center text-sm font-bold border-r border-gray-100 last:border-0 transition-colors ${step === i ? 'bg-[var(--color-brand-green)] text-white' : step > i ? 'text-[var(--color-brand-green)]' : 'text-gray-400'}`}>
              Step {i} {step > i && <CheckCircle2 className="w-4 h-4 inline ml-1 mb-0.5" />}
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8"><MapPin className="text-[var(--color-brand-green)]" /> Select Your District</h2>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tamil Nadu District</label>
                  <CustomSelect 
                    value={district} 
                    onChange={(val) => { setDistrict(val); setViolation(""); }} 
                    options={TN_DISTRICTS.map(d => ({ label: d, value: d }))}
                    placeholder="Select District"
                  />
                </div>

                <div className="pt-6">
                  <button onClick={() => setStep(2)} disabled={!isStep1Complete} className="w-full bg-[var(--color-brand-dark)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors">
                    Continue to Violation Details <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8"><AlertCircle className="text-[var(--color-brand-green)]" /> Select Violation</h2>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">What was the violation?</label>
                  <CustomSelect 
                    value={violation} 
                    onChange={setViolation} 
                    options={availableViolations.map(v => ({ label: v, value: v }))}
                    placeholder="Select Violation Type"
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Back</button>
                  <button onClick={() => setStep(3)} disabled={!isStep2Complete} className="flex-1 bg-[var(--color-brand-green)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-brand-green-dark)] transition-colors">
                    Calculate Fine <Calculator className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                {result ? (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{result.title}</h2>
                    <p className="text-sm text-gray-500 mb-8">{result.tier === 'state' ? 'Statewide Rule' : `${result.district} District`}</p>
                    
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 inline-block text-left w-full max-w-md mx-auto shadow-inner">
                      <div className="mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">Estimated Fine</span>
                        <span className="text-5xl font-black text-[var(--color-brand-green)]">{result.penalty}</span>
                      </div>
                      <div className="space-y-3 pt-6 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Authority</span>
                          <span className="font-bold text-gray-900 text-right">{result.authority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Jurisdictional Court</span>
                          <span className="font-bold text-gray-900 text-right">
                            {result.tier === 'state' ? 'State Transport Court' : `${district} District Traffic Court`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-gray-500 italic max-w-sm mx-auto">{result.desc}</p>
                  </>
                ) : (
                  <div className="py-12">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">No specific law found</h2>
                    <p className="text-gray-500 mt-2">We couldn't find a matching rule for this combination.</p>
                  </div>
                )}
                
                <div className="pt-10 flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => {setStep(1); setDistrict(""); setViolation("");}} className="px-8 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Start Over</button>
                  <Link href="/chat" className="px-8 py-4 rounded-xl font-bold text-white bg-[var(--color-brand-dark)] hover:bg-black transition-colors flex items-center justify-center gap-2">
                    Ask AI Assistant <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
