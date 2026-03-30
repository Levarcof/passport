"use client";

import { LayoutDashboard, FileText, ClipboardList, Activity, Settings, HelpCircle, LogOut, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Start New Application", href: "/apply" },
  { icon: ClipboardList, label: "Saved Drafts", href: "/drafts" },
  { icon: Activity, label: "Application Status", href: "/status" },
  { icon: ClipboardList, label: "Track Application", href: "/track" },
];

const secondaryItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];




export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
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
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 shadow-xl lg:shadow-none lg:sticky lg:inset-y-0 lg:z-0 lg:flex lg:flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 lg:hidden">
          <span className="text-xl font-bold">PassportHub</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-8 py-8 px-6 lg:py-10">
          <nav className="flex flex-col gap-2">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  pathname === item.href 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.label}
              </button>
            ))}
          </nav>

          <nav className="flex flex-col gap-2">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workspace</p>
            {secondaryItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  pathname === item.href 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div onClick={handleLogout}  className="p-6 mt-auto border-t border-slate-100">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all w-full group">
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
