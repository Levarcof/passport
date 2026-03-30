"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Eye, Download, FileEdit, Loader2 ,ArrowRight , FileText} from "lucide-react";
import { Card } from "@/components/ui/Card"; 
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export default function StatusPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/application/status");
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error("Fetch status error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'dispatched': case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'under_review': case 'Under Review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'submitted': case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'police_verification': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Updating application statuses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Application Status</h1>
          <p className="text-slate-500 font-medium">View and manage all your submitted passport applications.</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 font-bold">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button onClick={() => router.push('/apply')} className="bg-indigo-600 hover:bg-indigo-500 font-bold">
            Submit New Request
          </Button>
        </div> */}
      </div>

      <Card className="p-0 border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by ID or applicant name..." 
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2 font-bold">
              <Filter className="h-3.5 w-3.5" /> All Statuses
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {applications.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Application ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Passport Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Submission Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <motion.tr 
                    key={app.applicationId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group border-b border-slate-50 hover:bg-indigo-50/30 transition-all"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-900 tracking-tight">{app.applicationId}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-600">Fresh Passport</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-800">{app.fullName}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm",
                        getStatusColor(app.status)
                      )}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 pr-2">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-9 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold gap-2" 
                           onClick={() => handleDownload(`/api/application/pdf/${app.applicationId}`)}
                         >
                           <Download className="h-4 w-4" /> App PDF
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-9 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold gap-2" 
                           onClick={() => handleDownload(`/api/appointment/receipt/${app.applicationId}`)}
                         >
                           <FileText className="h-4 w-4" /> Receipt
                         </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
                <p className="text-sm text-slate-500 font-medium">You haven't submitted any passport applications yet.</p>
              </div>
              <Button onClick={() => router.push('/apply')} className="mt-2 font-bold px-8">
                Start Application <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Showing {applications.length} applications
           </p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold" disabled>Prev</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold" disabled>Next</Button>
           </div>
        </div>
      </Card>
      
      {/* Help Tip */}
      <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
         <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
            <Filter className="h-5 w-5 text-white" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Status Updates</h4>
            <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
              Application statuses are updated every 24 hours. If you don't see an update immediately after police verification, please wait for the next cycle or contact support.
            </p>
         </div>
      </div>
    </div>
  );
}
