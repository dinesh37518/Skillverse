"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Library, UploadCloud, Video, FileText, 
  Users, BrainCircuit, BarChart3, Bell, User, Settings, LogOut, Sparkles
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('mock_session');
    await supabase.auth.signOut();
    router.push('/auth');
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
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-900 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm">
      {/* ── Brand Header ── */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-md" />
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-md text-white">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight text-slate-900">SkillVerse AI</h1>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3 text-violet-600" />
              <span className="text-[10px] text-violet-600 font-bold uppercase tracking-widest">Education for all</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation List ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white shadow-lg shadow-violet-600/15' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-400 rounded-r-full shadow-lg shadow-violet-400/50" />
              )}
              <Icon className={`h-[18px] w-[18px] transition-transform duration-200 ${
                isActive ? '' : 'group-hover:scale-110'
              }`} />
              <span>{item.name}</span>
              {/* Hover glow for inactive items */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-600/5 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer Profile & Signout ── */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-violet-600/20">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="truncate">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Signed in as</p>
            <p className="text-sm font-medium truncate text-slate-300" title={userEmail}>
              {userEmail || 'educator@skillverse.ai'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all cursor-pointer group"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
