"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Camera, Save, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/utils/cloudinary-upload";

export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    profileImage: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
          setForm({ 
            name: data.user.name, 
            profileImage: data.user.profileImage || "" 
          });
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        window.location.reload(); // Refresh to update Navbar
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'user_profiles');
      setForm({ ...form, profileImage: url });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Checking security clearance...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Profile</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your personal information and account security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-8 flex flex-col items-center text-center gap-6 border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                ) : form.profileImage ? (
                  <img src={form.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-slate-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-10 w-10 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera className="h-4 w-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{userData?.name}</h3>
              <p className="text-[11px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full tracking-widest border border-indigo-100">Verified Identity</p>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-200/50">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold tracking-tight">Encryption Status</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Your personal data is encrypted using military-grade AES-256 protocols. It is only accessible to authorized passport officers during verification.
             </p>
          </Card>
        </div>

        {/* Right Column: Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Personal Information</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Identity Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Official Email</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={userData?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-100 rounded-xl font-semibold text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone (Read Only for now) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Verified Contact</label>
                  <div className="relative opacity-60">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="tel" 
                      value={userData?.phone}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-100 rounded-xl font-semibold text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="gap-2 px-10 bg-indigo-600 hover:bg-indigo-500 w-[100%] font-bold h-12"
                >
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
          
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
             <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                <ShieldCheck className="h-5 w-5 text-white" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">Identity Modification</h4>
                <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
                  Changing your legal identity name will require re-verification of all active passport applications. This may delay your current application process.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
