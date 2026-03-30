import { useState, useEffect } from "react";
import { Bell, Search, User, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function Navbar({ onMenuClick }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold leading-none">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
              Passport<span className="text-indigo-600">Hub</span>
            </span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex relative max-w-md w-full mx-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search application ID, status, or help..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" className="relative">
          </Button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="relative">
            <div 
              className="flex items-center gap-3 pl-2 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-900 leading-none">
                  {userData?.name || "Loading..."}
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                  Verified User
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                {userData?.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-slate-400" />
                )}
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                        {userData?.profileImage ? (
                          <img src={userData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <UserCircle className="h-8 w-8 text-indigo-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">{userData?.name}</span>
                        <span className="text-[11px] text-slate-500 truncate">{userData?.email}</span>
                        <span className="text-[11px] text-slate-400">{userData?.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => { setIsDropdownOpen(false); router.push("/settings"); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors rounded-xl"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
