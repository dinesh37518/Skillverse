"use client";

import { useRouter } from 'next/navigation';
import {
  BookOpen, Users, Video, FileText, ArrowRight,
  Play, CheckCircle2, Clock, Sparkles, TrendingUp, Zap
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardOverview() {
  const router = useRouter();
  const { t } = useLanguage();

  const metrics = [
    { title: t('total_courses'), value: 8, changeText: "+2 this month", changeType: "positive" as const, icon: BookOpen },
    { title: t('students_enrolled'), value: "1,248", changeText: "+148 this week", changeType: "positive" as const, icon: Users, iconColor: "text-emerald-500" },
    { title: t('upcoming_live_classes'), value: 3, changeText: "Next at 4:00 PM today", changeType: "neutral" as const, icon: Video, iconColor: "text-rose-500" },
    { title: t('files_uploaded'), value: 45, changeText: "82% processing success", changeType: "positive" as const, icon: FileText, iconColor: "text-cyan-500" }
  ];

  const recentActivities = [
    { text: "Ravi Kumar enrolled in Hydraulic Control Valves", type: "enrollment", time: "10 mins ago" },
    { text: "New translation processing completed for PLC Motors.mp4", type: "ai", time: "45 mins ago" },
    { text: "Assignment 'Basic Ohm's Law Check' draft created", type: "course", time: "2 hours ago" },
    { text: "Live streaming recording finalized: Electrical Wiring Safety", type: "live", time: "Yesterday" }
  ];

  const quickActions = [
    { label: t('quick_create'), desc: "Design and publish vocational learning modules", onClick: () => router.push('/dashboard/courses/create'), gradient: "from-violet-600 to-indigo-600", hoverGradient: "hover:from-violet-500 hover:to-indigo-500", icon: BookOpen },
    { label: t('upcoming_live_classes'), desc: "Plan realtime interactive sessions with students", onClick: () => router.push('/dashboard/live'), gradient: "from-rose-600 to-fuchsia-600", hoverGradient: "hover:from-rose-500 hover:to-fuchsia-500", icon: Video },
    { label: t('files_uploaded'), desc: "Add videos, PDFs, and presentations to the library", onClick: () => router.push('/dashboard/upload'), gradient: "from-cyan-600 to-teal-600", hoverGradient: "hover:from-cyan-500 hover:to-teal-500", icon: FileText }
  ];

  return (
    <div className="space-y-8">
      {/* ── Premium Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20">
        {/* Glow background layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-violet-950/70 to-slate-900" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative p-8 flex justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">{t('educator_dashboard')}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              {t('welcome_title')}
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl leading-relaxed">
              {t('welcome_sub')}
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => router.push('/dashboard/courses/create')}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-600/20"
              >
                <Zap className="h-4 w-4" />
                {t('quick_create')}
              </button>
              <button
                onClick={() => router.push('/dashboard/analytics')}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-slate-300 transition-all cursor-pointer flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </button>
            </div>
          </div>
          <div className="hidden md:flex shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-600/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 p-6 rounded-full">
                <BookOpen className="h-14 w-14 text-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <StatCard
            key={idx}
            title={m.title}
            value={m.value}
            changeText={m.changeText}
            changeType={m.changeType}
            icon={m.icon}
            iconColor={m.iconColor}
          />
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-violet-400" />
            Quick Actions
          </h3>
          <div className="flex flex-col gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`group w-full p-5 rounded-2xl bg-gradient-to-r ${action.gradient} ${action.hoverGradient} text-white transition-all cursor-pointer text-left shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{action.label}</span>
                        <span className="text-xs text-white/60 block mt-0.5">{action.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-slate-400" />
            Recent Activity
          </h3>
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 hover:bg-slate-800/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 shrink-0">
                  {act.type === 'enrollment' && <Users className="h-4 w-4 text-emerald-400" />}
                  {act.type === 'ai' && <Play className="h-4 w-4 text-violet-400" />}
                  {act.type === 'course' && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                  {act.type === 'live' && <Video className="h-4 w-4 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{act.text}</p>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                    <Clock className="h-3 w-3" /> {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
