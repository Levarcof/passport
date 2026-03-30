"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <Card className="p-8 md:p-10 border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
          {/* Brand/Logo Section */}
          <div className="text-center space-y-3 mb-10">
            <motion.div 
               initial={{ rotate: -10, opacity: 0 }}
               animate={{ rotate: 0, opacity: 1 }}
               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
               className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 mb-2"
            >
              <ShieldCheck className="h-8 w-8" />
            </motion.div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Passport Portal</h1>
            <p className="text-slate-500 font-medium text-sm">Secure access to the national passport services.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 pr-1">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secret Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 text-xs font-bold leading-relaxed px-1"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 border-none transition-all active:scale-[0.98]"
            >
              {loading ? (
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                   className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full"
                />
              ) : (
                <span className="flex items-center gap-2">SIGN IN TO PORTAL <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Registration Access</span>
          </div>

          {/* Create Account Link */}
          <div className="text-center group cursor-pointer" onClick={() => router.push("/register")}>
             <p className="text-sm  text-slate-500">
               New to Passport Seva? 
               <span className="text-indigo-600 ml-1.5 group-hover:underline transition-all inline-flex items-center gap-1">
                 Create Account <UserPlus className="h-3.5 w-3.5" />
               </span>
             </p>
          </div>
        </Card>

        {/* Support Section */}
        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          PROTECTING NATIONAL IDENTITY SINCE 1967
        </p>
      </motion.div>
    </div>
  );
}
