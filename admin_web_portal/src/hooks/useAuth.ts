import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';

import { User } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      let session = null;
      try {
        const res = await supabase.auth.getSession();
        session = res.data.session;
      } catch (e) {
        console.error("Supabase getSession failed:", e);
      }
      
      if (!session) {
        const mockSessionStr = typeof window !== 'undefined' ? localStorage.getItem('mock_session') : null;
        if (mockSessionStr) {
          try {
            const mockSession = JSON.parse(mockSessionStr);
            setUser(mockSession.user);
            setLoading(false);
            return;
          } catch (e) {}
        }
        router.push('/auth');
        return;
      }
      const role = session.user?.user_metadata?.role || 'student';
      if (role !== 'admin') {
        await supabase.auth.signOut();
        router.push('/auth');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          const hasMock = typeof window !== 'undefined' && localStorage.getItem('mock_session');
          if (!hasMock) {
            router.push('/auth');
          }
        }
      }
    );
    return () => { subscription.unsubscribe(); };
  }, [router]);

  return { user, loading };
}
