"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, GraduationCap, BookOpen, Video, Activity, Sparkles, ShieldCheck, ArrowRight, X, Mail, Clock, CheckCircle2, Eye } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function AdminDashboardOverview() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'educators' | 'students' | 'courses' | 'live' | null>(null);

  const mockEducatorsList = [
    { id: "EDU-2001", name: "Prof. Ramanathan", email: "ramanathan@skillverse.ai", dept: "Electronics & Communication", courses: 5, lastLogin: "Active Today at 1:45 PM", status: "Active" },
    { id: "EDU-2002", name: "Dr. Ananya Roy", email: "ananya.roy@skillverse.ai", dept: "Computer Science & AI", courses: 4, lastLogin: "Active Today at 10:15 AM", status: "Active" },
    { id: "EDU-2003", name: "Prof. Priya Patel", email: "priya.patel@skillverse.ai", dept: "Mechanical Engineering", courses: 3, lastLogin: "Active Yesterday", status: "Active" },
    { id: "EDU-2004", name: "Dr. Suresh Nair", email: "suresh.nair@skillverse.ai", dept: "Electrical Engineering", courses: 4, lastLogin: "Active 2 days ago", status: "Suspended" }
  ];

  const mockStudentsList = [
    { id: "STU-1001", name: "Ananya Sharma", email: "ananya.s@gmail.com", course: "Satellite Communication", progress: "92%", quizAvg: "96%", lastLogin: "Active Today at 1:40 PM", status: "Active" },
    { id: "STU-1002", name: "Karthik Raja", email: "karthik.r@gmail.com", course: "Satellite Communication", progress: "78%", quizAvg: "88%", lastLogin: "Active Today at 12:15 PM", status: "Active" },
    { id: "STU-1003", name: "Deepa Lakshmi", email: "deepa.l@gmail.com", course: "PLC Basics & Automation", progress: "95%", quizAvg: "94%", lastLogin: "Active Yesterday at 6:30 PM", status: "Active" },
    { id: "STU-1004", name: "Ravi Kumar", email: "ravi.k@gmail.com", course: "Machine Learning & AI", progress: "85%", quizAvg: "92%", lastLogin: "Active Today at 1:55 PM", status: "Active" },
    { id: "STU-1005", name: "Priya Sundaram", email: "priya.s@gmail.com", course: "Electrical Engineering", progress: "89%", quizAvg: "90%", lastLogin: "Active Today at 11:20 AM", status: "Active" }
  ];

  const mockCoursesList = [
    { id: "CRSE-501", title: "Satellite Communication", code: "EC-SAT-501", educator: "Prof. Ramanathan", category: "Electronics & Communication", enrolled: "1,250", status: "Published" },
    { id: "CRSE-601", title: "Machine Learning & AI Engineering", code: "CS-ML-601", educator: "Dr. Ananya Roy", category: "Computer Science", enrolled: "890", status: "Published" },
    { id: "CRSE-401", title: "Hydraulic Systems & Valves", code: "ME-HYD-401", educator: "Prof. Priya Patel", category: "Mechanical Engineering", enrolled: "640", status: "Published" },
    { id: "CRSE-301", title: "PLC Basics & Industrial Automation", code: "EE-PLC-301", educator: "Dr. Suresh Nair", category: "Electrical Engineering", enrolled: "980", status: "Draft Vetting" }
  ];

  const mockLiveRoomsList = [
    { id: "ROOM-101", title: "Satellite Orbit & Link Budget Live Lab", instructor: "Prof. Ramanathan", course: "Satellite Communication", attendees: 24, scheduledTime: "Today at 4:00 PM", status: "Broadcasting Live" },
    { id: "ROOM-102", title: "AC Motor Phase Connections Q&A", instructor: "Prof. Priya Patel", course: "PLC Basics & Automation", attendees: 18, scheduledTime: "Tomorrow at 10:00 AM", status: "Scheduled" }
  ];

  const metrics = [
    { title: "Total Educators", value: 34, changeText: "+4 this month", changeType: "positive" as const, icon: Users, iconColor: "text-sky-500", onClick: () => setActiveModal('educators') },
    { title: "Total Students", value: "4,821", changeText: "+342 this week", changeType: "positive" as const, icon: GraduationCap, iconColor: "text-emerald-500", onClick: () => setActiveModal('students') },
    { title: "Active Courses", value: 112, changeText: "+12 since last term", changeType: "positive" as const, icon: BookOpen, iconColor: "text-amber-500", onClick: () => setActiveModal('courses') },
    { title: "Live Streaming Rooms", value: 4, changeText: "Live stream nodes operational", changeType: "neutral" as const, icon: Video, iconColor: "text-rose-500", onClick: () => setActiveModal('live') }
  ];

  const quickActions = [
    { label: "Onboard New Educator", onClick: () => router.push('/dashboard/educators'), color: "bg-sky-600 hover:bg-sky-500" },
    { label: "Configure AI Parameters", onClick: () => router.push('/dashboard/ai-management'), color: "bg-purple-600 hover:bg-purple-500" },
    { label: "Generate Portal Report", onClick: () => router.push('/dashboard/reports'), color: "bg-emerald-600 hover:bg-emerald-500" }
  ];

  const auditLogs = [
    { desc: "Educator Ravi Kumar requested course draft approval: 'PLC Basics'", time: "10 mins ago", type: "course" },
    { desc: "System Config updated: Bhashini live voice synthesis active", time: "1 hour ago", type: "system" },
    { desc: "AI Usage limit threshold warning: Gemini AI token logs reached 85%", time: "3 hours ago", type: "ai" },
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

      {/* Stats row with interactive modals */}
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
            onClick={stat.onClick}
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
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
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

      {/* ── INTERACTIVE PARTICULAR INSPECTION MODAL ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-600/20 border border-sky-500/30 rounded-xl text-sky-400">
                  {activeModal === 'educators' && <Users className="h-6 w-6" />}
                  {activeModal === 'students' && <GraduationCap className="h-6 w-6 text-emerald-400" />}
                  {activeModal === 'courses' && <BookOpen className="h-6 w-6 text-amber-400" />}
                  {activeModal === 'live' && <Video className="h-6 w-6 text-rose-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {activeModal === 'educators' && `Registered Educators Roster (${mockEducatorsList.length})`}
                    {activeModal === 'students' && `Enrolled Students Ledger & Login Log (${mockStudentsList.length})`}
                    {activeModal === 'courses' && `Active Hosted Courses Directory (${mockCoursesList.length})`}
                    {activeModal === 'live' && `Live Streaming Classroom Nodes (${mockLiveRoomsList.length})`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Viewing itemized account rosters, email credentials, and login activity.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">

              {/* 1. EDUCATORS BREAKDOWN */}
              {activeModal === 'educators' && (
                <div className="space-y-3">
                  {mockEducatorsList.map((e, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-sky-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{e.name}</span>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Mail className="h-3 w-3 text-sky-400" /> ({e.email})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Department: <strong className="text-slate-200">{e.dept}</strong> | Courses Hosted: <strong className="text-sky-400">{e.courses}</strong></p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>Login Activity: <strong className="text-emerald-400">{e.lastLogin}</strong></span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 border ${
                        e.status === 'Active' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. STUDENTS BREAKDOWN */}
              {activeModal === 'students' && (
                <div className="space-y-3">
                  {mockStudentsList.map((s, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-emerald-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{s.name}</span>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Mail className="h-3 w-3 text-emerald-400" /> ({s.email})
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">Course Enrolled: <strong className="text-sky-300">{s.course}</strong></p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>Completion: <strong className="text-emerald-400">{s.progress}</strong></span>
                          <span>Quiz Avg: <strong className="text-amber-400">{s.quizAvg}</strong></span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-slate-500" /> {s.lastLogin}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold shrink-0">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. COURSES BREAKDOWN */}
              {activeModal === 'courses' && (
                <div className="space-y-3">
                  {mockCoursesList.map((c, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-amber-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{c.title}</span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded border border-amber-500/30">
                            {c.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Instructor: <strong className="text-slate-200">{c.educator}</strong> | Category: <strong className="text-slate-200">{c.category}</strong></p>
                        <p className="text-[11px] text-emerald-400 pt-0.5 font-semibold">👥 Enrolled Students: {c.enrolled}</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold shrink-0">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. LIVE ROOMS BREAKDOWN */}
              {activeModal === 'live' && (
                <div className="space-y-3">
                  {mockLiveRoomsList.map((lr, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-rose-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-rose-400" />
                          <span className="font-bold text-white text-base">{lr.title}</span>
                        </div>
                        <p className="text-xs text-slate-300">Instructor: <strong className="text-sky-300">{lr.instructor}</strong> | Course: {lr.course}</p>
                        <p className="text-xs text-rose-400 font-semibold">Scheduled: {lr.scheduledTime} | Active Attendees: {lr.attendees}</p>
                      </div>
                      <button
                        onClick={() => { setActiveModal(null); router.push('/dashboard/live'); }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Eye className="h-3.5 w-3.5" /> Monitor Feed
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Detailed system roster powered by SkillVerse AI Administration.
              </span>
              <button
                onClick={() => {
                  const target = activeModal === 'educators' ? '/dashboard/educators' : activeModal === 'students' ? '/dashboard/students' : activeModal === 'courses' ? '/dashboard/courses' : '/dashboard/live';
                  setActiveModal(null);
                  router.push(target);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-600/20"
              >
                <span>View Complete Directory</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
