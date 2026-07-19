"use client";

import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Verifying educator authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <Sidebar userEmail={user?.email} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar userEmail={user?.email} />
        <main className="flex-1 overflow-y-auto p-8 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
