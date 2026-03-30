"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Calendar, Clock, CheckCircle2, 
  Circle, ArrowRight, Download, Loader2, FileText, 
  ChevronRight, LayoutDashboard, History
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/application/track");
        const data = await res.json();
        if (data.success && data.applications.length > 0) {
          setApplications(data.applications);
          setSelectedApplication(data.applications[0]); // Default to latest
        }
      } catch (err) {
        console.error("Fetch tracking error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, []);

  const getStatusIndex = (status) => {
    const statuses = ["submitted", "under_review", "police_verification", "passport_printed", "dispatched"];
    return statuses.indexOf(status);
  };

  const steps = [
    { label: "Application Submitted", key: "submitted", desc: "Your application has been received." },
    { label: "Under Review", key: "under_review", desc: "Officers are reviewing your documents." },
    { label: "Police Verification", key: "police_verification", desc: "Local police station verification in progress." },
    { label: "Passport Printed", key: "passport_printed", desc: "Your passport is being printed." },
    { label: "Passport Dispatched", key: "dispatched", desc: "Dispatched via speed post." },
  ];

  const handleDownloadReceipt = (appId) => {
    const link = document.createElement('a');
    link.href = `/api/appointment/receipt/${appId}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Accessing tracking systems...</p>
      </div>
    );
  }

  const currentStatusIdx = selectedApplication ? getStatusIndex(selectedApplication.status) : -1;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Track Progress</h1>
          <p className="text-slate-500 font-medium">Real-time tracking for all your passport requests.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
              <p className="text-sm font-bold text-indigo-600">{applications.length} Applications</p>
           </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="p-20 flex flex-col items-center justify-center text-center gap-6 border-slate-100 bg-white shadow-xl shadow-slate-200/50">
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
             <Search className="h-10 w-10 text-slate-300" />
          </div>
          <div className="space-y-2">
             <h3 className="text-xl font-bold text-slate-900">No Applications Found</h3>
             <p className="text-sm text-slate-500 font-medium">You haven't submitted any applications for tracking yet.</p>
          </div>
          <Button onClick={() => router.push('/apply')} className="mt-4 gap-2 font-bold px-8">
            Start New Application <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: List Selection */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Your Submissions</h3>
            <div className="space-y-3">
              {applications.map((app) => (
                <button
                  key={app.applicationId}
                  onClick={() => setSelectedApplication(app)}
                  className={cn(
                    "w-full p-5 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden",
                    selectedApplication?.applicationId === app.applicationId
                      ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50"
                      : "bg-white/50 border-slate-200 hover:border-indigo-300 hover:bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      selectedApplication?.applicationId === app.applicationId 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-100 text-slate-500"
                    )}>
                      {app.applicationId}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">
                    {app.fullName || "Passport Application"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-600 capitalize">
                      {app.status.replace('_', ' ')}
                    </p>
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      selectedApplication?.applicationId === app.applicationId ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Tracker */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedApplication?.applicationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Summary Card */}
                  <Card className="p-6 border-slate-200 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <History className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Application Info</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Reference Number", value: selectedApplication.applicationId },
                        { label: "Submission Date", value: new Date(selectedApplication.createdAt).toLocaleDateString() },
                        { label: "Current Status", value: selectedApplication.status.replace('_', ' ') },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
                          <span className="text-xs font-extrabold text-slate-900 tracking-tight uppercase whitespace-nowrap">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handleDownloadReceipt(selectedApplication.applicationId)}
                      variant="outline" 
                      className="w-full mt-6 gap-2 font-bold border-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                    >
                      <Download className="h-4 w-4" /> Download Receipt
                    </Button>
                  </Card>

                  {/* Next Step Card */}
                  <Card animate={false} className="p-6 bg-slate-900 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Next Step</p>
                          <p className="text-sm font-black uppercase tracking-tight">
                            {steps[currentStatusIdx + 1]?.label || "Application Finalized"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-medium mb-6 italic">
                        {steps[currentStatusIdx + 1]?.desc || "All steps are completed. Your passport has been successfully dispatched."}
                      </p>
                      <Button 
                        onClick={() => router.push('/help')}
                        className="w-full bg-white text-slate-900 border-none hover:bg-indigo-50 font-black tracking-tight"
                      >
                        GET CONTACT DETAILS
                      </Button>
                    </div>
                    <LayoutDashboard className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
                  </Card>
                </div>

                {/* Timeline */}
                <Card className="p-8 md:p-10 border-slate-200 shadow-xl shadow-slate-200/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 text-center">Live Lifecycle Progress</h3>
                  
                  <div className="space-y-0 relative max-w-md mx-auto">
                    <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-slate-100" />
                    
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStatusIdx;
                      const isCurrent = index === currentStatusIdx;
                      
                      return (
                      <div key={index} className="relative pl-12 pb-10 group">
                        <div 
                          className={cn(
                            "absolute left-0 top-1 h-11 w-11 rounded-full border-4 border-white z-10 flex items-center justify-center transition-all duration-300",
                            isCompleted ? (isCurrent ? "bg-indigo-600 ring-4 ring-indigo-50" : "bg-emerald-500") : "bg-slate-100"
                          )}
                        >
                          {isCurrent ? (
                             <motion.div 
                               animate={{ scale: [1, 1.2, 1] }}
                               transition={{ repeat: Infinity, duration: 2 }}
                             >
                                <Circle className="h-5 w-5 text-white" />
                             </motion.div>
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300" />
                          )}
                        </div>

                        <div className={cn(
                          "transition-all duration-300",
                          isCurrent ? "opacity-100 scale-100" : "opacity-60 scale-[0.98]"
                        )}>
                          <h4 className={cn(
                            "text-sm font-black uppercase tracking-wider mb-1",
                            isCompleted ? (isCurrent ? "text-indigo-600" : "text-emerald-600") : "text-slate-400"
                          )}>
                            {step.label}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
