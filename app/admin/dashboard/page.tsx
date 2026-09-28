"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { 
  ShieldAlert, LogOut, Plus, Trash2, FileText, MapPin, Car, IndianRupee, 
  Search, Check, Sparkles, X, Eye, AlertCircle, RefreshCw, SlidersHorizontal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
]

const PRESETS = [
  {
    title: "No Helmet Riding Violation",
    desc: "Both the rider and the pillion passenger must wear BIS-certified safety helmets securely fastened under Section 129 of the Motor Vehicles Act.",
    penalty: "₹1000",
    tier: "state" as const,
    vehicleType: "2-Wheeler",
    category: "General" as const,
    authority: "TN Transport Department",
    label: "🪖 Helmet Fine"
  },
  {
    title: "Drunk Driving Offense (Sec 185)",
    desc: "Driving under the influence of alcohol or drugs exceeding 30mg per 100ml blood limit. Leads to heavy penalties, court appearance, and immediate vehicle impounding.",
    penalty: "₹10000",
    tier: "state" as const,
    vehicleType: "All",
    category: "General" as const,
    authority: "Tamil Nadu Traffic Police",
    label: "🍺 Drunk Driving"
  },
  {
    title: "ECR Highway Speed Limit Breach",
    desc: "Exceeding the maximum posted speed limit of 80 km/h on the East Coast Road (ECR) highway corridor. Monitored strictly via automated speed radar guns.",
    penalty: "₹2000",
    tier: "local" as const,
    district: "Chengalpattu",
    vehicleType: "4-Wheeler",
    category: "Highway" as const,
    authority: "Chengalpattu Traffic Police",
    label: "⚡ ECR Speeding"
  },
  {
    title: "Dangerous Triple Riding",
    desc: "Riding a two-wheeled vehicle with more than one pillion rider. Highly restricted and prosecutable offense under urban traffic guidelines.",
    penalty: "₹1000",
    tier: "state" as const,
    vehicleType: "2-Wheeler",
    category: "City" as const,
    authority: "TN Police Department",
    label: "🏍️ Triple Riding"
  },
  {
    title: "Mandatory Seatbelt Compliance",
    desc: "Failure to wear safety seatbelts by the driver or front-row passenger while the motor vehicle is in motion on public roadways.",
    penalty: "₹1000",
    tier: "state" as const,
    vehicleType: "4-Wheeler",
    category: "General" as const,
    authority: "TN Transport Department",
    label: "💺 Seatbelt Fine"
  },
  {
    title: "Unauthorized Custom Number Plate",
    desc: "Registration plates failing to adhere to RTO mandated size, background colors, font design, or featuring arbitrary political/regional labels.",
    penalty: "₹1500",
    tier: "state" as const,
    vehicleType: "All",
    category: "General" as const,
    authority: "TN Transport Department",
    label: "🎫 Fancy Plates"
  }
]

export default function AdminDashboard() {
  const { user, logout, laws, addLaw, deleteLaw, fetchLaws } = useStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  // Form input state
  const [newLaw, setNewLaw] = useState({
    tier: 'state' as 'state'|'local',
    district: 'Chennai',
    title: '',
    desc: '',
    authority: 'TN Transport Dept.',
    penalty: '',
    vehicleType: 'All',
    category: 'General' as 'General' | 'City' | 'Highway'
  })

  // Advanced search & filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTier, setFilterTier] = useState<'all' | 'state' | 'local'>('all')
  const [filterVehicle, setFilterVehicle] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    setMounted(true)
    fetchLaws()
  }, [fetchLaws])

  useEffect(() => {
    if (mounted && user.role !== 'admin') {
      router.push('/admin/login')
    }
  }, [user, mounted, router])

  if (!mounted || user.role !== 'admin') return null

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Pre-fill form from preset templates
  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setNewLaw({
      tier: preset.tier,
      district: preset.tier === 'local' ? (preset as any).district || 'Chennai' : 'Chennai',
      title: preset.title,
      desc: preset.desc,
      authority: preset.authority,
      penalty: preset.penalty,
      vehicleType: preset.vehicleType,
      category: preset.category
    })
    showToast(`Template applied: ${preset.label}`, "info")
  }

  const handleAddLaw = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addLaw({
        tier: newLaw.tier,
        district: newLaw.tier === 'state' ? 'All' : newLaw.district,
        title: newLaw.title,
        desc: newLaw.desc,
        authority: newLaw.authority,
        penalty: newLaw.penalty,
        vehicleType: newLaw.vehicleType === 'All' ? undefined : newLaw.vehicleType,
        category: newLaw.category
      })
      
      // Reset only variable fields
      setNewLaw({ 
        ...newLaw, 
        title: '', 
        desc: '', 
        penalty: '', 
        vehicleType: 'All', 
        category: 'General' 
      })
      showToast("New traffic regulation published successfully!", "success")
    } catch (err) {
      showToast("Failed to publish regulation. Please try again.", "error")
    }
  }

  const handleDeleteLaw = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to revoke the regulation:\n"${title}"?`)) {
      try {
        await deleteLaw(id)
        showToast("Regulation revoked and deleted from database.", "info")
      } catch (err) {
        showToast("Failed to delete regulation.", "error")
      }
    }
  }

  // Calculate Metrics
  const activeCount = laws.length
  const stateCount = laws.filter(l => l.tier === 'state').length
  const localCount = laws.filter(l => l.tier === 'local').length
  
  const avgFine = Math.round(
    laws.reduce((sum, l) => {
      const parsed = parseInt(l.penalty.replace(/[^0-9]/g, ""), 10)
      return sum + (isNaN(parsed) ? 0 : parsed)
    }, 0) / (activeCount || 1)
  )

  const vehicleDistribution = laws.reduce((acc, l) => {
    const vt = l.vehicleType || "All"
    acc[vt] = (acc[vt] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  let dominantVehicle = "All Vehicles"
  let maxVal = 0
  Object.entries(vehicleDistribution).forEach(([v, val]) => {
    if (val > maxVal) {
      maxVal = val
      dominantVehicle = v
    }
  })

  // Filter regulations dynamically
  const filteredLaws = laws.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.authority.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTier = filterTier === 'all' || l.tier === filterTier
    
    const matchesVehicle = 
      filterVehicle === 'All' || 
      l.vehicleType === filterVehicle || 
      (filterVehicle === 'All Vehicles' && (!l.vehicleType || l.vehicleType === 'All'))
      
    const matchesCategory = 
      filterCategory === 'All' || 
      l.category === filterCategory || 
      (filterCategory === 'General' && (!l.category || l.category === 'General'))
      
    return matchesSearch && matchesTier && matchesVehicle && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md max-w-md ${
              toast.type === "success" 
                ? "bg-emerald-500/90 text-white border-emerald-400" 
                : toast.type === "error"
                ? "bg-red-500/90 text-white border-red-400"
                : "bg-blue-500/90 text-white border-blue-400"
            }`}
          >
            {toast.type === "success" && <Check className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === "info" && <Sparkles className="w-5 h-5 flex-shrink-0" />}
            <span className="font-bold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:bg-white/20 p-1 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner and Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-[var(--color-brand-dark)] rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">Authorized Officer</span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Traffic Regulation Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { fetchLaws(); showToast("Synchronized with Neon DB", "info") }}
            className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition-colors"
            title="Sync Database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { logout(); router.push('/') }}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors border border-red-100"
          >
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xs block font-semibold uppercase tracking-wider">Total Rules</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xs block font-semibold uppercase tracking-wider">Jurisdictions</span>
            <span className="text-lg sm:text-xl font-black text-gray-900">{stateCount}S / {localCount}L</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xs block font-semibold uppercase tracking-wider">Common Target</span>
            <span className="text-base sm:text-lg font-black text-gray-900 truncate max-w-[120px] inline-block">{dominantVehicle === "All" ? "All Vehicles" : dominantVehicle}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-gray-400 text-xs block font-semibold uppercase tracking-wider">Avg Penalty</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">₹{activeCount > 0 ? avgFine.toLocaleString('en-IN') : 0}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Database List Right */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Form and Presets Panel (Left Side - 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Select Presets Toolbar */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Quick-Publish Preset Templates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  type="button"
                  className="text-left text-xs bg-gray-50 text-gray-900 hover:bg-[var(--color-brand-green)] hover:text-white border border-gray-200 p-2.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs truncate"
                >
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--color-brand-green)]" /> Publish New Regulation
            </h2>
            
            <form onSubmit={handleAddLaw} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tier</label>
                  <select 
                    value={newLaw.tier}
                    onChange={(e) => setNewLaw({ ...newLaw, tier: e.target.value as any })}
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none cursor-pointer"
                  >
                    <option value="state">Statewide (All TN)</option>
                    <option value="local">Local District</option>
                  </select>
                </div>

                {newLaw.tier === 'local' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">District</label>
                    <select 
                      value={newLaw.district}
                      onChange={(e) => setNewLaw({ ...newLaw, district: e.target.value })}
                      className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none cursor-pointer"
                    >
                      {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">District Scope</label>
                    <input 
                      type="text" disabled 
                      value="All Districts" 
                      className="w-full text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 cursor-not-allowed font-medium"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Vehicle Type</label>
                  <select 
                    value={newLaw.vehicleType}
                    onChange={(e) => setNewLaw({ ...newLaw, vehicleType: e.target.value })}
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none cursor-pointer"
                  >
                    <option value="All">All Vehicles</option>
                    <option value="2-Wheeler">2-Wheeler</option>
                    <option value="4-Wheeler">4-Wheeler</option>
                    <option value="Auto">Auto Rickshaw</option>
                    <option value="Bus">Bus</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={newLaw.category}
                    onChange={(e) => setNewLaw({ ...newLaw, category: e.target.value as any })}
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="City">City limits</option>
                    <option value="Highway">Highway</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Regulation Title</label>
                <input 
                  type="text" required
                  value={newLaw.title}
                  onChange={(e) => setNewLaw({ ...newLaw, title: e.target.value })}
                  placeholder="e.g. Helmet Compliance Mandate"
                  className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Official Legal Description</label>
                <textarea 
                  required rows={3}
                  value={newLaw.desc}
                  onChange={(e) => setNewLaw({ ...newLaw, desc: e.target.value })}
                  placeholder="Detailed breakdown of rules, exceptions, and MV act sections..."
                  className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Authority</label>
                  <input 
                    type="text" required
                    value={newLaw.authority}
                    onChange={(e) => setNewLaw({ ...newLaw, authority: e.target.value })}
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Penalty / Fine</label>
                  <input 
                    type="text" required
                    value={newLaw.penalty}
                    onChange={(e) => setNewLaw({ ...newLaw, penalty: e.target.value })}
                    placeholder="e.g. ₹1000"
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[var(--color-brand-dark)] hover:bg-black text-white font-extrabold py-4 rounded-xl transition-all cursor-pointer shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider mt-4"
              >
                <Plus className="w-4 h-4" /> Publish Regulation
              </button>
            </form>
          </div>

          {/* Live Interactive Preview Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Card Preview
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Draft</span>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-xs bg-gray-50/50">
              <div className="bg-white px-5 py-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-green)]">
                      {newLaw.tier === 'state' ? 'Statewide' : newLaw.district}
                    </span>
                    {newLaw.category && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">
                        {newLaw.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-base leading-tight">
                    {newLaw.title || "Pending Violation Title"}
                  </h4>
                </div>
              </div>
              <div className="p-5 bg-white">
                <p className="text-xs text-gray-500 mb-4 min-h-[50px] line-clamp-3 leading-relaxed">
                  {newLaw.desc || "The detailed regulation legal brief and MV Act specifics will display dynamically in this area..."}
                </p>
                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-400 text-[10px] font-mono">{newLaw.authority || "Pending Authority"}</div>
                    {newLaw.vehicleType && newLaw.vehicleType !== 'All' && (
                      <div className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-block w-fit">
                        {newLaw.vehicleType}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 block mb-0.5">Standard Fine</span>
                    <span className="text-xl font-black text-red-600">{newLaw.penalty || "₹0"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database List and Filters Panel (Right Side - 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-tight">Active Regulations Database</h2>
                <p className="text-xs text-gray-500">Live regulatory registry synced with Neon Postgres</p>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Showing {filteredLaws.length} of {laws.length}
              </span>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search database by title, description, or authority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent transition-all"
                />
              </div>

              {/* Advanced Filter Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" /> Scope:
                  </span>
                  {['all', 'state', 'local'].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterTier(t as any)}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                        filterTier === t 
                          ? "bg-[var(--color-brand-dark)] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t === 'all' ? 'All Tiers' : t === 'state' ? 'Statewide' : 'Local'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vehicle:</span>
                  {['All', '2-Wheeler', '4-Wheeler', 'Auto', 'Bus', 'Lorry'].map(v => (
                    <button
                      key={v}
                      onClick={() => setFilterVehicle(v)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        filterVehicle === v 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-50 text-gray-500 hover:bg-gray-150 border border-gray-200"
                      }`}
                    >
                      {v === 'All' ? 'All Vehicles' : v}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category:</span>
                  {['All', 'General', 'City', 'Highway'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterCategory(c)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        filterCategory === c 
                          ? "bg-purple-600 text-white" 
                          : "bg-gray-50 text-gray-500 hover:bg-gray-150 border border-gray-200"
                      }`}
                    >
                      {c === 'All' ? 'All Limits' : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Existing Rules Scroll */}
            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {filteredLaws.map(law => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={law.id} 
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md hover:border-gray-300 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-green)] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          {law.tier} {law.tier === 'local' && `- ${law.district}`}
                        </span>
                        {law.vehicleType && law.vehicleType !== 'All' && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {law.vehicleType}
                          </span>
                        )}
                        {law.category && law.category !== 'General' && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                            {law.category}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono ml-auto sm:ml-0">{law.authority}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-gray-900 leading-tight group-hover:text-[var(--color-brand-green)] transition-colors">{law.title}</h3>
                      <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3">{law.desc}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-400">Fine:</span>
                        <span className="font-black text-red-600 text-base">{law.penalty}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-end sm:justify-center items-end sm:items-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
                      <button 
                        onClick={() => handleDeleteLaw(law.id, law.title)}
                        className="text-gray-400 hover:text-white hover:bg-red-500 transition-all self-end p-2.5 rounded-xl border border-transparent hover:border-red-600 cursor-pointer shadow-xs"
                        title="Revoke Regulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredLaws.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                  <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                  <h4 className="text-gray-800 font-bold mb-1">No matching regulations found</h4>
                  <p className="text-gray-400 text-xs max-w-xs mx-auto">Try refining your search queries or clearing active filter selection pills.</p>
                  {(searchQuery || filterTier !== 'all' || filterVehicle !== 'All' || filterCategory !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        setFilterTier("all")
                        setFilterVehicle("All")
                        setFilterCategory("All")
                      }}
                      className="mt-4 text-xs text-[var(--color-brand-green)] font-extrabold hover:underline"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
