"use client";

import { useRouter } from 'next/navigation';
import { Users, GraduationCap, BookOpen, Video, Activity, Sparkles, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function AdminDashboardOverview() {
  const router = useRouter();

  const metrics = [
    { title: "Total Educators", value: 34, changeText: "+4 this month", changeType: "positive" as const, icon: Users, iconColor: "text-sky-500" },
    { title: "Total Students", value: "4,821", changeText: "+342 this week", changeType: "positive" as const, icon: GraduationCap, iconColor: "text-emerald-500" },
    { title: "Active Courses", value: 112, changeText: "+12 since last term", changeType: "positive" as const, icon: BookOpen, iconColor: "text-amber-500" },
    { title: "Live Streaming Rooms", value: 4, changeText: "Live stream nodes operational", changeType: "neutral" as const, icon: Video, iconColor: "text-rose-500" }
  ];

  const quickActions = [
    { label: "Onboard New Educator", onClick: () => router.push('/dashboard/educators'), color: "bg-sky-600 hover:bg-sky-500" },
    { label: "Configure AI Parameters", onClick: () => router.push('/dashboard/ai-management'), color: "bg-purple-600 hover:bg-purple-500" },
    { label: "Generate Portal Report", onClick: () => router.push('/dashboard/reports'), color: "bg-emerald-600 hover:bg-emerald-500" }
  ];

  const auditLogs = [
    { desc: "Educator Ravi Kumar requested course draft approval: 'PLC Basics'", time: "10 mins ago", type: "course" },
    { desc: "System Config updated: Sindhi language engine enabled", time: "1 hour ago", type: "system" },
    { desc: "AI Usage limit threshhold warning: Groq token logs reached 85%", time: "3 hours ago", type: "ai" },
    { desc: "Educator account registration status suspended: Suresh Nair", time: "Yesterday", type: "security" }
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/20 p-8 rounded-2xl flex justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SkillVerse AI Administration Console</h2>
          <p className="text-slate-400 mt-2 max-w-xl">
            Monitor educator portals, manage student progress logs, toggle translation capabilities, configure AI pipeline models, and run platform analytics.
          </p>
        </div>
        <div className="hidden md:block shrink-0 bg-sky-600/10 border border-sky-500/30 p-4 rounded-full">
          <ShieldCheck className="h-12 w-12 text-sky-400" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            changeText={stat.changeText}
            changeType={stat.changeType}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold border-b border-slate-800 pb-3">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            {quickActions.map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all cursor-pointer flex items-center justify-between px-6 ${act.color}`}
              >
                <span>{act.label}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold border-b border-slate-800 pb-3">Recent Security & Activity Logs</h3>
          <div className="space-y-4">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-950/20 transition-colors">
                <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-400">
                  {log.type === 'course' && <BookOpen className="h-4 w-4 text-amber-400" />}
                  {log.type === 'system' && <Activity className="h-4 w-4 text-sky-400" />}
                  {log.type === 'ai' && <Sparkles className="h-4 w-4 text-purple-400" />}
                  {log.type === 'security' && <ShieldCheck className="h-4 w-4 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{log.desc}</p>
                  <span className="text-xs text-slate-500 mt-1">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
