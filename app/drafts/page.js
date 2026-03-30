"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Trash2, ArrowRight, Play, Clock, Inbox, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch("/api/application/drafts");
        const data = await res.json();
        if (data.success) {
          setDrafts(data.drafts);
        }
      } catch (err) {
        console.error("Fetch drafts error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    try {
      const res = await fetch("/api/application/drafts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id })
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(prev => prev.filter(d => d.applicationId !== id));
      } else {
        alert(data.message || "Failed to delete draft");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading your drafts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Saved Drafts</h1>
          <p className="text-slate-500 font-medium">Continue where you left off with your pending applications.</p>
        </div>
      </div>

      {drafts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {drafts.map((draft, index) => {
             const progress = draft.fullName ? 40 : draft.dateOfBirth ? 20 : 0;
             return (
            <Card 
              key={draft.applicationId}
              className="group p-0 border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40 hover:border-indigo-200"
            >
              <div className="p-8 flex flex-col md:flex-row md:items-center gap-8">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8" />
                </div>

                <div className="flex-1 space-y-4">
                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <h3 className="text-xl font-bold text-slate-900">{draft.fullName || "Untitled Application"}</h3>
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 tracking-widest">
                        {draft.applicationId}
                      </span>
                   </div>

                   <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> 
                        Last edited: {new Date(draft.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> 
                        Progress: {progress}%
                      </span>
                      <span className="text-indigo-600 font-bold">
                        Currently at: {draft.address ? "Document Upload" : draft.fullName ? "Address Details" : "Personal Info"}
                      </span>
                   </div>

                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-indigo-600"
                      />
                   </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3">
                   <Button 
                     onClick={() => router.push(`/apply?id=${draft.applicationId}`)} 
                     className="gap-2 px-6 bg-indigo-600 hover:bg-indigo-500 font-bold"
                   >
                     <Play className="h-4 w-4" /> Continue
                   </Button>
                   <Button 
                    variant="ghost" 
                    onClick={() => handleDelete(draft.applicationId)} 
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 gap-2"
                   >
                     <Trash2 className="h-4 w-4" /> Delete
                   </Button>
                </div>
              </div>
            </Card>
             );
          })}
        </div>
      ) : (
        <Card className="p-20 flex flex-col items-center justify-center text-center gap-6 border-slate-100 bg-white/50 border-dashed border-2">
           <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
              <Inbox className="h-10 w-10 text-slate-300" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">No drafts found</h3>
              <p className="text-sm text-slate-500 font-medium">You don't have any incomplete passport applications at the moment.</p>
           </div>
           <Button onClick={() => router.push('/apply')} className="mt-4 gap-2 font-bold px-8">
             Start Application <ArrowRight className="h-4 w-4" />
           </Button>
        </Card>
      )}

      {/* Tip Card */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
            <FileText className="h-5 w-5 text-white" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">Draft Retention Policy</h4>
            <p className="text-xs text-blue-800/70 leading-relaxed font-medium">
              Application drafts are stored for 30 days from the date of final edit. Please ensure you complete and submit your application before it expires to avoid re-entering your information.
            </p>
         </div>
      </div>
    </div>
  );
}
