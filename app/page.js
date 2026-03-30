"use client";

import { motion } from "framer-motion";
import { Plus, Search, FileText, ClipboardList, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const actions = [
  {
    title: "Start New Application",
    description: "Begin a new passport application or renewal process with our guided wizard.",
    icon: Plus,
    color: "bg-indigo-600",
    href: "/apply",
    cta: "Start Application"
  },
  {
    title: "Track Application",
    description: "Monitor the real-time status and progress of your submitted applications.",
    icon: Search,
    color: "bg-emerald-600",
    href: "/track",
    cta: "Track Now"
  },
  {
    title: "Saved Drafts",
    description: "Picked up where you left off. Access your incomplete applications here.",
    icon: FileText,
    color: "bg-amber-500",
    href: "/drafts",
    cta: "View Drafts"
  },
  {
    title: "Application Status",
    description: "View a detailed breakdown of all your past and current applications.",
    icon: ClipboardList,
    color: "bg-blue-600",
    href: "/status",
    cta: "Check Status"
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-12 md:py-16 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Government Grade Security Enabled
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Welcome to the new <span className="text-indigo-400">Passport Hub</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className=" text-slate-400 leading-relaxed"
          >
            Our streamlined portal makes passport applications faster, simpler, and more secure than ever before. Manage everything in one place.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button onClick={() => router.push('/apply')} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none px-4">
              Start Application
            </Button>
            <Link href="/help">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Watch Guide
            </Button>
            </Link>
          </motion.div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -mb-20 rounded-full bg-blue-600/10 blur-3xl" />
      </section>

      {/* Main Actions Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">What would you like to do?</h2>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Fast Processing</span>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Instant Status</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Card
              key={action.title}
              onClick={() => router.push(action.href)}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col justify-between border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className="space-y-6">
                <div className={`h-14 w-14 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                  <action.icon className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{action.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-auto flex items-center text-sm font-bold text-indigo-600 group-hover:gap-2 transition-all">
                {action.cta}
                <ArrowRight className="h-4 w-4 ml-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all font-bold" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section (Mock) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card animate={false} className="bg-white border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Average Wait Time</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-bold text-slate-900">12 Days</h4>
            <span className="text-xs font-bold text-emerald-600 mb-1.5">+2.4% vs last mo.</span>
          </div>
        </Card>
        <Card animate={false} className="bg-white border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-bold text-slate-900">98.2%</h4>
            <span className="text-xs font-bold text-indigo-600 mb-1.5">Industry Leading</span>
          </div>
        </Card>
        <Card animate={false} className="bg-white border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Offices Nationwide</p>
          <div className="flex items-end gap-3">
            <h4 className="text-4xl font-bold text-slate-900">420+</h4>
            <span className="text-xs font-bold text-slate-500 mb-1.5">Near You</span>
          </div>
        </Card>
      </section>
    </div>
  );
}
