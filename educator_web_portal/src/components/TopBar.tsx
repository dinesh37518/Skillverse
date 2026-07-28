"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronRight, Bell, Sun, Moon, User, Settings, LogOut, Search, Globe
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useLanguage, SupportedLanguage, ALL_23_LANGUAGES } from '../context/LanguageContext';

interface TopBarProps {
  userEmail?: string;
}

export default function TopBar({ userEmail }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage } = useLanguage();

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(p => p && p !== 'dashboard');
    return ['Dashboard', ...paths.map(p => p.charAt(0).toUpperCase() + p.slice(1))];
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-slate-900/75 backdrop-blur-md border-b border-slate-800/80 text-white flex items-center justify-between px-8 sticky top-0 z-40 shadow-md">
      {/* Left section: Breadcrumbs & Search */}
      <div className="flex items-center gap-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />}
              <span className={idx === breadcrumbs.length - 1 ? 'text-white font-bold bg-violet-500/10 text-violet-300 px-2.5 py-1 rounded-md border border-violet-500/20' : 'hover:text-slate-200 transition-colors'}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Global Search Input */}
        <div className="relative hidden md:flex items-center">
          <Search className="h-4 w-4 absolute left-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, videos, documents, AI tools..."
            className="pl-9 pr-8 py-1.5 bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500/50 w-72 transition-all"
          />
          <kbd className="absolute right-2.5 text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">⌘K</kbd>

          {/* Search Dropdown Overlay */}
          {searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800 flex justify-between">
                <span>Search Results for "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-white">Clear</button>
              </div>

              {[
                { title: "Satellite Communication Orbits & Link Budget", type: "Course", link: "/dashboard/courses" },
                { title: "2 MARKS Question Bank & Syllabus PDF", type: "PDF Document", link: "/dashboard/content" },
                { title: "Satellite Orbit & Transponder Video", type: "Video", link: "/dashboard/content" },
                { title: "SC Part B Excel Spreadsheet", type: "Spreadsheet", link: "/dashboard/content" },
                { title: "AI Notes & Quiz Studio Suite", type: "AI Tool", link: "/dashboard/ai-tools" }
              ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    router.push(item.link);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                >
                  <div>
                    <p className="font-semibold text-white group-hover:text-violet-300">{item.title}</p>
                    <span className="text-[10px] text-slate-400">{item.type}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Action Utilities */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Preferred Language Selector */}
        <div className="relative flex items-center">
          <Globe className="h-3.5 w-3.5 text-violet-400 absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="pl-8 pr-3 py-1.5 bg-slate-950/80 text-xs font-semibold text-violet-300 border border-slate-700/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer appearance-none"
          >
            {ALL_23_LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900 text-white">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Dark/Light Toggler */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 transition-all cursor-pointer"
        >
          {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-400" />}
        </button>

        {/* Notifications Icon with Live Pulse */}
        <button 
          onClick={() => router.push('/dashboard/notifications')}
          title="Notifications"
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 transition-all relative cursor-pointer"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="h-5 w-px bg-slate-800" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-violet-400/30 shadow-md shadow-violet-600/20">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 py-2 text-xs backdrop-blur-md">
                <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{userEmail || 'educator@skillverse.ai'}</p>
                </div>
                
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/dashboard/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-xl transition-all cursor-pointer font-medium"
                  >
                    <User className="h-4 w-4 text-violet-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-xl transition-all cursor-pointer font-medium"
                  >
                    <Settings className="h-4 w-4 text-violet-400" />
                    Account Settings
                  </button>
                </div>

                <div className="border-t border-slate-800/80 my-1" />

                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
