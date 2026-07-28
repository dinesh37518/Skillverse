"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Users, Video, FileText, ArrowRight,
  Play, CheckCircle2, Clock, Sparkles, TrendingUp, Zap,
  X, ExternalLink, Download, UserCheck, Eye
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { useLanguage } from '../../context/LanguageContext';
import { SATELLITE_COMMUNICATION_COURSE, SATELLITE_COMMUNICATION_FILES } from './courses/page';

export default function DashboardOverview() {
  const router = useRouter();
  const { t } = useLanguage();

  const [coursesCount, setCoursesCount] = useState(1);
  const [filesCount, setFilesCount] = useState(8);
  const [studentsCount, setStudentsCount] = useState(1250);
  const [liveSessionsCount, setLiveSessionsCount] = useState(1);

  const [storedCourses, setStoredCourses] = useState<any[]>([]);
  const [storedUploads, setStoredUploads] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<'courses' | 'students' | 'files' | 'live' | null>(null);

  const mockStudentsList = [
    { name: "Ananya Sharma", email: "ananya.s@gmail.com", course: "Satellite Communication", progress: "92%", quizAvg: "96%", status: "Active 10m ago" },
    { name: "Karthik Raja", email: "karthik.r@gmail.com", course: "Satellite Communication", progress: "78%", quizAvg: "88%", status: "Active Today" },
    { name: "Deepa Lakshmi", email: "deepa.l@gmail.com", course: "Satellite Communication", progress: "95%", quizAvg: "94%", status: "Active Yesterday" },
    { name: "Ravi Kumar", email: "ravi.k@gmail.com", course: "Satellite Communication", progress: "85%", quizAvg: "92%", status: "Active Now" }
  ];

  const mockLiveSessionsList = [
    { title: "Satellite Orbit & Link Budget Live Lab", course: "Satellite Communication", time: "Today at 4:00 PM", status: "Scheduled", room: "room-sat-501" }
  ];

  const loadTeacherMetrics = () => {
    try {
      const courses = JSON.parse(localStorage.getItem('skillverse_courses') || '[]');
      const uploads = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');

      if (courses && courses.length > 0) {
        setStoredCourses(courses);
        setCoursesCount(courses.length);
        const totalStud = courses.reduce((sum: number, c: any) => sum + (Number(c.students) || 0), 0);
        setStudentsCount(totalStud > 0 ? totalStud : 1250);
      } else {
        setStoredCourses([SATELLITE_COMMUNICATION_COURSE]);
        setCoursesCount(1);
        setStudentsCount(1250);
      }

      if (uploads && uploads.length > 0) {
        setStoredUploads(uploads);
        setFilesCount(uploads.length);
      } else {
        setStoredUploads([...SATELLITE_COMMUNICATION_FILES]);
        setFilesCount(8);
      }
    } catch (e) {
      console.error(e);
      setCoursesCount(1);
      setFilesCount(8);
      setStudentsCount(1250);
    }
  };

  useEffect(() => {
    // Seed Satellite Communication course if empty
    try {
      const courses = JSON.parse(localStorage.getItem('skillverse_courses') || '[]');
      const uploads = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');
      if (courses.length === 0) {
        localStorage.setItem('skillverse_courses', JSON.stringify([SATELLITE_COMMUNICATION_COURSE]));
      }
      if (uploads.length === 0) {
        localStorage.setItem('skillverse_uploaded_content', JSON.stringify([...SATELLITE_COMMUNICATION_FILES]));
      }
    } catch (e) {
      console.error(e);
    }

    loadTeacherMetrics();
    window.addEventListener('storage', loadTeacherMetrics);
    return () => window.removeEventListener('storage', loadTeacherMetrics);
  }, []);

  const metrics = [
    { id: 'courses', title: t('total_courses'), value: coursesCount, changeText: t('active_course_hosted'), changeType: "positive" as const, icon: BookOpen, onClick: () => setActiveModal('courses') },
    { id: 'students', title: t('students_enrolled'), value: studentsCount.toLocaleString(), changeText: t('total_enrollments'), changeType: "positive" as const, icon: Users, iconColor: "text-emerald-500", onClick: () => setActiveModal('students') },
    { id: 'live', title: t('upcoming_live_classes'), value: liveSessionsCount, changeText: t('next_session_scheduled'), changeType: "neutral" as const, icon: Video, iconColor: "text-rose-500", onClick: () => setActiveModal('live') },
    { id: 'files', title: t('files_uploaded'), value: filesCount, changeText: t('across_all_course_modules'), changeType: "positive" as const, icon: FileText, iconColor: "text-cyan-500", onClick: () => setActiveModal('files') }
  ];

  const recentActivities = [
    { text: "Hosted 1 core course: Satellite Communication", type: "course", time: "Just now" },
    { text: "Uploaded 8 learning files & Question Banks for Satellite Communication", type: "ai", time: "15 mins ago" },
    { text: "Published Unit 1-5 Lecture Notes & Part-B Excel Spreadsheets", type: "course", time: "1 hour ago" },
    { text: "1,250 students actively enrolled in Satellite Communication", type: "enrollment", time: "Today" },
    { text: "Live streaming session scheduled: Satellite Orbit & Link Budget Lab", type: "live", time: "Upcoming at 4:00 PM" }
  ];

  const quickActions = [
    { label: t('quick_create_course'), desc: t('quick_create_course_desc'), onClick: () => router.push('/dashboard/courses/create'), gradient: "from-violet-600 to-indigo-600", hoverGradient: "hover:from-violet-500 hover:to-indigo-500", icon: BookOpen },
    { label: t('upcoming_live_classes'), desc: t('upcoming_live_classes_desc'), onClick: () => router.push('/dashboard/live'), gradient: "from-rose-600 to-fuchsia-600", hoverGradient: "hover:from-rose-500 hover:to-fuchsia-500", icon: Video },
    { label: t('files_upload_center'), desc: t('files_upload_center_desc'), onClick: () => router.push('/dashboard/upload'), gradient: "from-cyan-600 to-teal-600", hoverGradient: "hover:from-cyan-500 hover:to-teal-500", icon: FileText }
  ];

  return (
    <div className="space-y-8">
      {/* ── Premium Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-r from-indigo-950/90 via-violet-950/70 to-slate-900 shadow-2xl p-8 backdrop-blur-md">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">EDUCATOR DASHBOARD</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {t('welcome_educator')}
            </h2>
            <p className="text-slate-300 mt-2 max-w-xl leading-relaxed text-sm">
              {t('welcome_subtitle')}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.push('/dashboard/courses/create')}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-600/25 border border-violet-400/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="h-4 w-4" />
                {t('quick_create_course')}
              </button>
              <button
                onClick={() => router.push('/dashboard/analytics')}
                className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-violet-400" />
                {t('view_analytics')}
              </button>
            </div>
          </div>
          <div className="hidden md:flex shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-slate-950/80 border border-violet-500/40 p-6 rounded-full shadow-2xl">
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
            onClick={m.onClick}
          />
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-violet-400" />
              <span>{t('quick_actions')}</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('fast_shortcuts')}</span>
          </div>

          <div className="flex flex-col gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`group w-full p-5 rounded-2xl bg-gradient-to-r ${action.gradient} ${action.hoverGradient} text-white transition-all cursor-pointer text-left shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-white/10`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{action.label}</span>
                        <span className="text-xs text-white/70 block mt-0.5">{action.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-400" />
              <span>{t('recent_activity_feed')}</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('live_audit_log')}
            </span>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl divide-y divide-slate-800/70 shadow-xl">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 hover:bg-slate-800/40 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-slate-400 shrink-0 shadow-md">
                  {act.type === 'enrollment' && <Users className="h-4 w-4 text-emerald-400" />}
                  {act.type === 'ai' && <Play className="h-4 w-4 text-violet-400" />}
                  {act.type === 'course' && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                  {act.type === 'live' && <Video className="h-4 w-4 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 leading-snug">{act.text}</p>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1.5 font-medium">
                    <Clock className="h-3 w-3 text-slate-500" /> {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── INTERACTIVE PARTICULAR INSPECTION MODAL ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-600/20 border border-violet-500/30 rounded-xl text-violet-400">
                  {activeModal === 'courses' && <BookOpen className="h-6 w-6" />}
                  {activeModal === 'students' && <Users className="h-6 w-6 text-emerald-400" />}
                  {activeModal === 'files' && <FileText className="h-6 w-6 text-cyan-400" />}
                  {activeModal === 'live' && <Video className="h-6 w-6 text-rose-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {activeModal === 'courses' && `Hosted Courses List (${storedCourses.length})`}
                    {activeModal === 'students' && `Enrolled Students Breakdown (${studentsCount.toLocaleString()})`}
                    {activeModal === 'files' && `Uploaded Content & Material Names (${storedUploads.length})`}
                    {activeModal === 'live' && `Upcoming Scheduled Live Sessions (${mockLiveSessionsList.length})`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Viewing itemized particulars for your educator account.
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

              {/* 1. COURSES BREAKDOWN */}
              {activeModal === 'courses' && (
                <div className="space-y-3">
                  {storedCourses.map((c, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-violet-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{c.title}</span>
                          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-[10px] font-mono rounded border border-violet-500/30">
                            {c.code || `CRSE-${i+1}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{c.description || 'Comprehensive vocational training module.'}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>📁 Category: <strong className="text-slate-200">{c.category || 'General'}</strong></span>
                          <span>👥 Enrolled Students: <strong className="text-emerald-400">{(c.students || 1000).toLocaleString()}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveModal(null); router.push(`/dashboard/courses/${c.id}`); }}
                        className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Manage
                      </button>
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
                          <span className="text-xs text-slate-400 font-mono">({s.email})</span>
                        </div>
                        <p className="text-xs text-slate-300">Course: <strong className="text-violet-300">{s.course}</strong></p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>Completion: <strong className="text-emerald-400">{s.progress}</strong></span>
                          <span>Quiz Average: <strong className="text-amber-400">{s.quizAvg}</strong></span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-semibold shrink-0">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. UPLOADED FILES PARTICULAR NAMES */}
              {activeModal === 'files' && (
                <div className="space-y-3">
                  {storedUploads.map((f, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-cyan-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="font-bold text-white text-sm">{f.title}</span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono">
                            {f.file_type || 'PDF Document'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Belongs to: <strong className="text-violet-300">{f.course_title || 'Satellite Communication'}</strong></p>
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">{f.description}</p>
                      </div>
                      <a
                        href={f.file_path || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" />
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. UPCOMING LIVE CLASSES */}
              {activeModal === 'live' && (
                <div className="space-y-3">
                  {mockLiveSessionsList.map((ls, i) => (
                    <div key={i} className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl flex items-center justify-between hover:border-rose-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-rose-400" />
                          <span className="font-bold text-white text-base">{ls.title}</span>
                        </div>
                        <p className="text-xs text-slate-300">Course: <strong className="text-violet-300">{ls.course}</strong></p>
                        <p className="text-xs text-rose-400 font-semibold">Scheduled: {ls.time}</p>
                      </div>
                      <button
                        onClick={() => { setActiveModal(null); router.push('/dashboard/live'); }}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/20 cursor-pointer shrink-0"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Join Room
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Click any item to open or edit its full details.
              </span>
              <button
                onClick={() => {
                  const target = activeModal === 'courses' ? '/dashboard/courses' : activeModal === 'students' ? '/dashboard/students' : activeModal === 'files' ? '/dashboard/upload' : '/dashboard/live';
                  setActiveModal(null);
                  router.push(target);
                }}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View Full Page</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


