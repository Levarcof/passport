"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  Camera, Upload, ArrowRight, ArrowLeft, 
  CheckCircle2, Loader2, ShieldCheck, UserPlus
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let profileImageUrl = "";

      // Step 1: Upload to Cloudinary if image is selected
      if (imagePreview) {
        const uploadRes = await fetch("/api/auth/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imagePreview }),
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          profileImageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.message || "Image upload failed");
        }
      }

      // Step 2: Call Signup API with Cloudinary URL
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, profileImage: profileImageUrl }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.message || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-50/50 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <Card className="p-8 md:p-10 border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Portal Registration</h1>
            <p className="text-slate-500 text-sm">Join the national passport service network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Component */}
            <div className="flex flex-col items-center justify-center space-y-4 mb-8">
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-all group-hover:ring-4 group-hover:ring-indigo-50">
                     {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                     ) : (
                       <Camera className="h-8 w-8 text-slate-300" />
                     )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-indigo-50 group-hover:scale-110 transition-transform">
                     <Upload className="h-4 w-4" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*"
                  />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Identity Photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Name */}
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <input
                     type="text"
                     name="name"
                     placeholder="John Doe"
                     value={form.name}
                     onChange={handleChange}
                     required
                     className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                   />
                 </div>
               </div>

               {/* Phone */}
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <input
                     type="tel"
                     name="phone"
                     placeholder="+91..."
                     value={form.phone}
                     onChange={handleChange}
                     required
                     className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                   />
                 </div>
               </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-rose-500 text-[10px] font-black uppercase tracking-wider px-1 text-center"
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
                <div className="flex items-center gap-3">
                   <Loader2 className="h-5 w-5 animate-spin" />
                   <span>PROCESSING IDENTITY...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">VERIFY & REGISTER <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
              <div 
                onClick={() => router.push("/login")}
                className="group cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                BACK TO LOGIN
              </div>
          </div>
        </Card>

        {/* Support Section */}
        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          ALL SUBMISSIONS ARE ENCRYPTED END-TO-END
        </p>
      </motion.div>
    </div>
  );
}