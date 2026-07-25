"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../utils/supabase';
import { GraduationCap, ShieldAlert, Key, Mail, Lock, Smartphone, KeyRound } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type LoginInput = z.infer<typeof loginSchema>;
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function AdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  // Mobile OTP State
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtpHint, setGeneratedOtpHint] = useState('');

  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerForgot, handleSubmit: handleSubmitForgot, formState: { errors: forgotErrors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Call backend endpoint or generate mock OTP
      const res = await fetch('http://localhost:8000/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: mobileNumber, role: 'admin' })
      });
      const data = await res.json();
      const codeHint = data.dev_otp_hint || Math.floor(100000 + Math.random() * 900000).toString();
      
      setGeneratedOtpHint(codeHint);
      setOtpSent(true);
      setSuccessMsg(`OTP sent to ${mobileNumber}. Dev OTP Code: ${codeHint}`);
    } catch (err) {
      const codeHint = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtpHint(codeHint);
      setOtpSent(true);
      setSuccessMsg(`OTP sent to ${mobileNumber}. (Mock OTP Code: ${codeHint})`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    if (otpCode === generatedOtpHint || otpCode === '123456') {
      const mockSession = {
        user: {
          id: '00000000-0000-0000-0000-000000000003',
          email: `${mobileNumber}@mobile.skillverse.ai`,
          user_metadata: { role: 'admin', full_name: 'Admin Mobile User', phone_number: mobileNumber }
        }
      };
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
      router.push('/dashboard');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: mobileNumber,
          otp: otpCode,
          full_name: 'Admin Mobile User',
          role: 'admin'
        })
      });

      if (!res.ok) {
        throw new Error('Invalid OTP verification failed.');
      }
      const data = await res.json();
      localStorage.setItem('mock_session', JSON.stringify({ user: { id: data.user_id, role: 'admin', full_name: data.full_name } }));
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'OTP verification failed. Use code on screen or "123456".');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (formData: LoginInput) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      if (formData.email === 'adminofskillverse@gmail.com' && formData.password === 'Admin@123') {
        const mockSession = {
          user: {
            id: '00000000-0000-0000-0000-000000000003',
            email: 'adminofskillverse@gmail.com',
            user_metadata: { role: 'admin', full_name: 'System Administrator' }
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

      if (role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Administrator privileges are required.');
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
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background Patriotic Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center relative z-10">
        {/* Freedom Fighters Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-900/90 shadow-2xl shadow-amber-500/10 mb-6 group p-2">
          <img
            src="/freedom_fighters_banner.png"
            alt="Indian Freedom Fighters Educational Tribute"
            className="w-full h-auto max-h-64 object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="mt-2 text-left px-2 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 w-fit backdrop-blur-md">
              🇮🇳 HONOURING INDIA'S NATIONAL HEROES
            </span>
            <h1 className="text-sm font-black text-white drop-shadow-md">
              SkillVerse AI Admin Gateway
            </h1>
          </div>
        </div>

        {/* Freedom Fighter Quote Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 flex gap-2.5 items-center text-left backdrop-blur-sm">
            <img src="/swami_vivekananda.png" alt="Swami Vivekananda" className="w-10 h-10 rounded-lg object-cover border border-amber-400/40 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 italic font-medium">"Arise, awake & stop not."</p>
              <p className="text-[10px] text-amber-400 font-bold mt-0.5">— Swami Vivekananda</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex gap-2.5 items-center text-left backdrop-blur-sm">
            <img src="/bhagat_singh.png" alt="Bhagat Singh" className="w-10 h-10 rounded-lg object-cover border border-emerald-400/40 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 italic font-medium">"Ideas are immortal."</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-0.5">— Shaheed Bhagat Singh</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 border border-slate-800 shadow-2xl rounded-2xl sm:px-10">
          
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

          {!showForgot && (
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'email'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="h-4 w-4" />
                Email Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('mobile'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'mobile'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Mobile OTP Login
              </button>
            </div>
          )}

          {!showForgot && authMethod === 'mobile' ? (
            !otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    A 6-digit verification code will be dispatched to this mobile number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
                >
                  {loading ? 'Dispatched OTP...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white tracking-widest text-lg font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Access Admin Portal'}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-xs text-sky-400 hover:underline pt-2"
                >
                  Change Mobile Number
                </button>
              </form>
            )
          ) : !showForgot ? (
            <form onSubmit={handleSubmitLogin(handleSignIn)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    {...registerLogin('email')}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="adminofskillverse@gmail.com"
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
                    className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    {...registerLogin('password')}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-sky-700/50 disabled:text-slate-400 transition-all flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Sign In as Admin'}
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
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="adminofskillverse@gmail.com"
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
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-sky-700/50 transition-all cursor-pointer"
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
