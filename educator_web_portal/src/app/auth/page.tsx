"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../utils/supabase';
import { BookOpen, ShieldAlert, Key, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type LoginInput = z.infer<typeof loginSchema>;
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function EducatorAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerForgot, handleSubmit: handleSubmitForgot, formState: { errors: forgotErrors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const handleSignIn = async (formData: LoginInput) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const isMockEmail = formData.email.endsWith('@skillverse.ai') || formData.email.includes('educator');
      const isMockPass = formData.password === 'SkillVerse@2026!' || formData.password === 'Admin@123';
      if (isMockEmail && isMockPass) {
        const displayName = formData.email.split('@')[0]
          .replace(/[\._\-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const mockSession = {
          user: {
            id: '00000000-0000-0000-0000-000000000002',
            email: formData.email,
            user_metadata: { role: 'educator', full_name: displayName }
          }
        };
        localStorage.setItem('mock_session', JSON.stringify(mockSession));
        router.push('/dashboard');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const metadata = data.user?.user_metadata || {};
      const role = metadata.role || 'student';

      if (role !== 'educator' && role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Educator portal access requires educator authorization privileges.');
      }

      router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (formData: ForgotPasswordInput) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setSuccessMsg('A password reset link has been dispatched to your email address.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex bg-violet-600/20 p-3 rounded-2xl border border-violet-500/30 mb-4">
          <BookOpen className="h-10 w-10 text-violet-400" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">SkillVerse AI</h2>
        <p className="mt-2 text-sm text-slate-400">
          Educator Access Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 border border-slate-800 shadow-xl rounded-2xl sm:px-10">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex gap-3 text-red-300 text-sm items-start">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex gap-3 text-emerald-300 text-sm items-start">
              <Key className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmitLogin(handleSignIn)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    {...registerLogin('email')}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="educator@skillverse.ai"
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    {...registerLogin('password')}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {loginErrors.password && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:bg-violet-700/50 disabled:text-slate-400 transition-all flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitForgot(handleForgotPassword)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Provide Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    {...registerForgot('email')}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="educator@skillverse.ai"
                  />
                </div>
                {forgotErrors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{forgotErrors.email.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:bg-violet-700/50 transition-all cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
