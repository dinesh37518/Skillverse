"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, Video, Languages, 
  FileSpreadsheet, BarChart3, BrainCircuit, Bell, Settings, User, LogOut 
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Educators', href: '/dashboard/educators', icon: Users },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
    { name: 'Live Classes', href: '/dashboard/live', icon: Video },
    { name: 'Languages', href: '/dashboard/languages', icon: Languages },
    { name: 'Reports', href: '/dashboard/reports', icon: FileSpreadsheet },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Management', href: '/dashboard/ai-management', icon: BrainCircuit },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-sky-600 p-2 rounded-lg">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">SkillVerse AI</h1>
          <span className="text-xs text-sky-400 font-medium">Admin Console</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/10' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Signout */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link 
          href="/dashboard/profile"
          className="flex items-center gap-3 px-2 p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
          title="View Admin Profile & Login Details"
        >
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sky-400 border border-slate-700 group-hover:border-sky-500 transition-colors">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs text-slate-400 font-semibold group-hover:text-sky-400 transition-colors">System Admin</p>
            <p className="text-xs font-mono truncate text-slate-300" title={userEmail}>
              {userEmail || 'adminofskillverse@gmail.com'}
            </p>
          </div>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
