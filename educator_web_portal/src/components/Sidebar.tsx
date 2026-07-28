"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Library, UploadCloud, Video, FileText, 
  Users, BrainCircuit, BarChart3, Bell, User, Settings, LogOut, Sparkles, Plus, X
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Mechanical');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const handleLogout = async () => {
    localStorage.removeItem('mock_session');
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const courseObj = {
      id: `c-custom-${Date.now()}`,
      title: newCourseTitle.trim(),
      code: newCourseCode.trim() || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      badge: newCourseCategory,
      category: newCourseCategory,
      educator: userEmail || "Prof. Educator",
      desc: newCourseDesc.trim() || "Multilingual course created by Educator.",
      rating: "5.0 ★",
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('skillverse_courses') || '[]');
      localStorage.setItem('skillverse_courses', JSON.stringify([courseObj, ...existing]));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }

    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseDesc('');
    setShowAddCourseModal(false);
    router.push('/dashboard/courses');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Content Library', href: '/dashboard/content', icon: Library },
    { name: 'Upload Center', href: '/dashboard/upload', icon: UploadCloud },
    { name: 'Live Classes', href: '/dashboard/live', icon: Video },
    { name: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'AI Tools', href: '/dashboard/ai-tools', icon: BrainCircuit },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 text-white flex flex-col h-screen sticky top-0 shrink-0 backdrop-blur-md shadow-2xl z-30">
      {/* ── Brand Header ── */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/30 rounded-xl blur-md" />
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-600/20 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight text-white flex items-center gap-1.5">
              SkillVerse <span className="text-violet-400 font-extrabold">AI</span>
            </h1>
            <div className="flex items-center gap-1 mt-1.5">
              <Sparkles className="h-3 w-3 text-violet-400 animate-pulse" />
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Education for all</span>
            </div>
          </div>
        </div>

        {/* ── + Add New Course Trigger Button ── */}
        <button
          onClick={() => setShowAddCourseModal(true)}
          className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
        >
          <Plus className="h-4 w-4" />
          <span>{t('Add New Course')}</span>
        </button>
      </div>

      {/* ── Add New Course Modal Popup ── */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-400" />
                <span>Create New Multilingual Course</span>
              </h3>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Robotics & Microcontrollers"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. ROB-301"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category / Domain</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Safety & Compliance">Safety & Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Overview of modules, key safety concepts, and multilingual materials..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="flex-1 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
                >
                  Create & Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Navigation List ── */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 hover:border-slate-700/50 border border-transparent'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-300 rounded-r-full shadow-lg shadow-violet-300/60" />
              )}
              <Icon className={`h-[18px] w-[18px] transition-transform duration-200 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400 group-hover:scale-110'
              }`} />
              <span className="tracking-wide">{t(item.name)}</span>

              {/* Hover glow for inactive items */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-600/10 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer Profile & Signout ── */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1 bg-slate-900/60 rounded-xl border border-slate-800/60">
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-violet-600/30">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>
          <div className="truncate">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
            <p className="text-xs font-semibold truncate text-slate-200" title={userEmail}>
              {userEmail || 'educator@skillverse.ai'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-800/50 border border-transparent transition-all cursor-pointer group"
        >
          <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
