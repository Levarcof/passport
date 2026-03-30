"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, MessageCircle, Phone, FileText, 
  Search, ExternalLink, ChevronRight, BookOpen, 
  ShieldQuestion, UserCheck, ArrowRight, ArrowLeft,
  CheckCircle2, Info, AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const categories = [
  { 
    id: "app-process",
    title: "Application Process", 
    icon: FileText, 
    color: "bg-blue-50 text-blue-600 border-blue-100",
    questions: ["How to apply for a fresh passport?", "Documents required for minor?", "Normal vs Tatkaal scheme."],
    description: "Learn the end-to-end journey of getting your passport, from online registration to final delivery.",
    details: [
      {
        title: "Step 1: Online Registration",
        content: "Create an account on the Passport Seva portal. You will need a valid email ID. Once registered, log in to start your application."
      },
      {
        title: "Step 2: Fill Application",
        content: "Choose between 'Fresh Passport' or 'Re-issue'. Fill in personal details, family details, and address accurately. Double-check before submitting."
      },
      {
        title: "Step 3: Document Upload",
        content: "Upload required documents like Aadhaar Card, Pan Card, or School Leaving Certificate. For minors, parent's documents are required."
      },
      {
        title: "Step 4: Scheduling Appointment",
        content: "Pay the required fee online and choose a convenient date and time at your nearest Passport Seva Kendra (PSK)."
      }
    ]
  },
  { 
    id: "appointment-fee",
    title: "Appointment & Fee", 
    icon: BookOpen, 
    color: "bg-amber-50 text-amber-600 border-amber-100",
    questions: ["Rescheduling my appointment?", "Fee payment methods?", "Refund policy for canceled app."],
    description: "Manage your visits and payments. Understand how to pay, schedule, and what to bring.",
    details: [
      {
        title: "Rescheduling Policy",
        content: "You can reschedule your appointment up to 3 times within a year of the first appointment date. Changes must be made at least 24 hours in advance."
      },
      {
        title: "Payment Methods",
        content: "We accept Credit/Debit cards (SBI and other banks), Net Banking, and UPI. Payment is mandatory to book an appointment."
      },
      {
        title: "Missing an Appointment",
        content: "If you miss your appointment, you will need to wait 24 hours before you can reschedule again. Your fee remains valid for 1 year."
      }
    ]
  },
  { 
    id: "police-verification",
    title: "Police Verification", 
    icon: UserCheck, 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    questions: ["What documents for police?", "Status of verification?", "Officer didn't contact me."],
    description: "Everything you need to know about the mandatory security check by your local police station.",
    details: [
      {
        title: "The Process",
        content: "After your PSK visit, your files are sent to the local police station. An officer will visit your home or call you to the station."
      },
      {
        title: "Verification Documents",
        content: "Keep copies of your address proof, age proof, and two references (neighbors or friends) ready for the officer."
      },
      {
        title: "Post-Verification",
        content: "Once the police send a 'Clear' report, your passport goes into the printing queue. This usually takes 3-7 days."
      }
    ]
  },
  { 
    id: "tech-support",
    title: "Technical Support", 
    icon: ShieldQuestion, 
    color: "bg-purple-50 text-purple-600 border-purple-100",
    questions: ["Login issues?", "File upload errors?", "Dashboard showing wrong status."],
    description: "Solving website glitches, login problems, and document upload issues.",
    details: [
      {
        title: "Login Problems",
        content: "If you've forgotten your password, use the 'Forgot Password' link. If your account is locked, wait 2 hours for it to auto-unlock."
      },
      {
        title: "Upload Errors",
        content: "Ensure documents are in PDF or JPG format and under 2MB in size. Clear your browser cache if the upload button is not responding."
      },
      {
        title: "Mobile App Issues",
        content: "Ensure you are using the latest version of the mPassport Seva app. Some features are only available on the desktop website."
      }
    ]
  }
];

export default function HelpPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <AnimatePresence mode="wait">
        {!activeCategory ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <section className="relative py-20 px-8 rounded-[40px] bg-indigo-900 overflow-hidden text-center text-white shadow-2xl shadow-indigo-300/30">
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text- font-bold uppercase tracking-widest text-indigo-200">
                   <HelpCircle className="h-4 w-4" /> Support Portal
                 </div>
                 <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">How can we <span className="text-indigo-300">help you</span> today?</h1>
                 <p className="text-indigo-100/70 md:medium md:text-lg">Search our documentation or contact our 24/7 assistance office.</p>
                 
                 <div className="relative max-w-xl mx-auto mt-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-300" />
                    <input 
                      type="text" 
                      placeholder="Search keywords, topics, or FAQs..." 
                      className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-white border-none text-slate-900 text-sm placeholder:text-slate-400 shadow-2xl outline-none focus:ring-4 focus:ring-indigo-400"
                    />
                 </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                 <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white animate-pulse" />
                 <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-indigo-300/40" />
              </div>
            </section>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <Card key={idx} className="group p-8 border-slate-200 shadow-xl shadow-slate-200/40 hover:border-indigo-500 transition-all duration-300">
                   <div className={`h-14 w-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform duration-300`}>
                      <cat.icon className="h-7 w-7" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">{cat.title}</h3>
                   <ul className="space-y-3 mb-8">
                      {cat.questions.map((q, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-2 group/item cursor-pointer">
                          <ChevronRight className="h-4 w-4 text-slate-300 mt-0.5 group-hover/item:text-indigo-600 transition-colors" />
                          <span className="text-sm font-medium text-slate-500 group-hover/item:text-slate-900 transition-colors leading-tight">
                            {q}
                          </span>
                        </li>
                      ))}
                   </ul>
                   <Button 
                    onClick={() => setActiveCategory(cat)}
                    variant="ghost" 
                    className="p-0 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-indigo-800 gap-2"
                   >
                      View All <ExternalLink className="h-3.5 w-3.5" />
                   </Button>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-10 bg-white border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-10 items-center">
                 <div className="space-y-6 flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Need direct assistance?</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Our support officers are available 24/7 to resolve your passport application queries and technical issues.</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                       <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold gap-3 shadow-lg shadow-indigo-200">
                          <MessageCircle className="h-5 w-5" /> Start Live Chat
                       </Button>
                       <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold gap-3 border-2">
                          <Phone className="h-5 w-5" /> Schedule Callback
                       </Button>
                    </div>
                 </div>
                 <div className="h-48 w-48 rounded-full bg-slate-50 border-8 border-white shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
                    <HelpCircle className="h-20 w-20 text-indigo-200" />
                 </div>
              </Card>

              <Card className="lg:col-span-1 p-10 bg-indigo-50 border-indigo-100 flex flex-col justify-between shadow-xl shadow-indigo-100/50">
                 <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                       <Phone className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">National Helpline</h3>
                    <p className="text-4xl font-black text-indigo-600">1800-258-1800</p>
                    <p className="text-sm font-semibold text-slate-500">Toll-free assistance in 12 languages across India.</p>
                 </div>
                 <Button variant="link" onClick={() => router.push('/')} className="p-0 justify-start text-indigo-600 font-extrabold uppercase tracking-widest text-xs gap-2">
                    Back to Dashboard <ArrowRight className="h-4 w-4" />
                 </Button>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-1"
          >
            <Button 
              onClick={() => setActiveCategory(null)}
              variant="ghost" 
              className="gap-2 font-bold text-slate-500 hover:text-indigo-600 px-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-6 mb-6">
             
                   <div>
                      <h1 className="text-2xl text-center font-black text-slate-900 tracking-tight">{activeCategory.title}</h1>
                      <p className="text-slate-500 text-center font-medium">{activeCategory.description}</p>
                   </div>
                </div>

                <div className="space-y-6">
                  {activeCategory.details.map((detail, idx) => (
                    <Card key={idx} className="p-8 border-slate-100 hover:border-indigo-100 transition-all shadow-sm">
                       <div className="flex gap-4">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                             {idx + 1}
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-xl font-semibold text-slate-900">{detail.title}</h4>
                             <p className="text-slate-600 font-medium leading-relaxed">{detail.content}</p>
                          </div>
                       </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 bg-indigo-900 text-white border-none shadow-2xl shadow-indigo-200">
                   <div className="flex gap-6 items-start">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                         <Info className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-lg font-bold">Still have questions?</h4>
                         <p className="text-indigo-100/70 text-sm font-medium">Our help center is updated weekly. For complex issues, we recommend visiting your local Passport Seva Kendra or calling our national helpline.</p>
                         <Button className="mt-4 bg-white text-indigo-900 hover:bg-slate-100 font-bold">
                            Talk to an expert
                         </Button>
                      </div>
                   </div>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                 <Card className="p-6 border-slate-200 shadow-xl shadow-slate-200/30">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Related Topics</h3>
                    <div className="space-y-4">
                       {categories.filter(c => c.id !== activeCategory.id).map((c, idx) => (
                         <button 
                          key={idx}
                          onClick={() => setActiveCategory(c)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-indigo-100 hover:bg-slate-50 transition-all text-left group"
                         >
                            <div className="flex items-center gap-3">
                               <c.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                               <span className="text-sm font-bold text-slate-700">{c.title}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600" />
                         </button>
                       ))}
                    </div>
                 </Card>

                 <Card className="p-8 bg-emerald-50 border-emerald-100 shadow-xl shadow-emerald-100/50">
                    <div className="flex items-center gap-3 mb-4">
                       <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                       <h4 className="text-lg font-bold text-emerald-900">Verified Info</h4>
                    </div>
                    <p className="text-sm font-medium text-emerald-800/70 leading-relaxed italic">
                      "All information provided above is sourced directly from the Ministry of External Affairs guidelines for 2026."
                    </p>
                 </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documentation Link */}
      <div className="text-center space-y-4 pt-10">
         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Additional Resources</p>
         <div className="flex flex-wrap justify-center gap-8">
            {['E-Passport Guide', 'Digital Locker Integration', 'Visa Information', 'Office Locator'].map((link, idx) => (
              <a key={idx} href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4">
                {link}
              </a>
            ))}
         </div>
      </div>
    </div>
  );
}
