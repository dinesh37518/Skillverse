"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      let hasSession = false;
      let role = 'student';
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          hasSession = true;
          role = session.user?.user_metadata?.role || 'student';
        }
      } catch (e) {
        console.error("Supabase getSession failed:", e);
      }
      
      if (!hasSession) {
        const mockSessionStr = typeof window !== 'undefined' ? localStorage.getItem('mock_session') : null;
        if (mockSessionStr) {
          try {
            const mockSession = JSON.parse(mockSessionStr);
            if (mockSession?.user) {
              hasSession = true;
              role = mockSession.user.user_metadata?.role || 'student';
            }
          } catch (e) {}
        }
      }
      
      if (hasSession && role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    };

    checkRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="animate-pulse text-sm text-slate-500 font-medium">
        Redirecting to administrator access gateway...
      </div>
    </div>
  );
}
