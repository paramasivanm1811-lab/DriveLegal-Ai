"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { ShieldAlert, ArrowRight, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const [passkey, setPasskey] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const loginAsAdmin = useStore(state => state.loginAsAdmin)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!passkey.trim()) {
      setError("Passkey cannot be empty.")
      return
    }
    setLoading(true)
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        loginAsAdmin("TN Police Authority", passkey)
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Invalid passkey.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center"
      >
        <div className="w-16 h-16 bg-[var(--color-brand-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authority Portal</h1>
        <p className="text-gray-500 mb-8">Secure login for Tamil Nadu Traffic Police to manage active regulations.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter Authority Passkey" 
              value={passkey}
              onChange={(e) => { setPasskey(e.target.value); setError("") }}
              className="w-full text-gray-900 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-[var(--color-brand-dark)] outline-none transition-shadow text-center"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-brand-dark)] hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Secure Access"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <p className="mt-6 text-xs text-gray-400">Mock passkey for testing: admin123 (configurable in .env)</p>
      </motion.div>
    </div>
  )
}
