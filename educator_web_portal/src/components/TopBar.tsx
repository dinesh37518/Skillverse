"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Sun, Moon, ChevronRight, User, LogOut, Settings } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface TopBarProps {
  userEmail?: string;
}

export default function TopBar({ userEmail }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    // Sync with HTML class element
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />}
            <span className={idx === breadcrumbs.length - 1 ? 'text-white font-semibold' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-6">
        {/* Dark/Light Toggler */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Icon */}
        <button 
          onClick={() => router.push('/dashboard/notifications')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition-opacity"
          >
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-violet-400 border border-slate-700">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'E'}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-20 py-2 text-sm">
                <div className="px-4 py-3 border-b border-slate-800/60">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="font-semibold text-white truncate">{userEmail || 'educator@skillverse.ai'}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/dashboard/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <User className="h-4.5 w-4.5" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/dashboard/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Settings className="h-4.5 w-4.5" />
                  Account Settings
                </button>

                <div className="border-t border-slate-800/60 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
