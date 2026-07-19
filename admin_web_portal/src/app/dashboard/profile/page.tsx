"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, User } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function AdminProfile() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'System Administrator',
      email: 'admin@skillverse.ai'
    }
  });

  const onSubmit = (data: ProfileInput) => {
    alert("Profile details updated!");
    console.log(data);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Profile</h2>
        <p className="text-slate-400 mt-1">Configure user details, change logins credentials, and audit security claims.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center gap-4 border-b border-slate-800/60 pb-6">
            <div className="h-16 w-16 rounded-full bg-sky-600/10 border border-sky-500/20 flex items-center justify-center font-bold text-xl text-sky-400">
              A
            </div>
            <div>
              <h4 className="font-semibold text-lg text-white">System Administrator</h4>
              <p className="text-xs text-slate-500">Root Access Node: Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.email.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-550 rounded-xl font-semibold text-white transition-colors cursor-pointer"
          >
            Save profile updates
          </button>
        </form>

        {/* Security / Password updates form */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="h-4.5 w-4.5 text-sky-400" />
            Security & Authentication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => alert("Credentials token dispatched.")}
            className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Change Login Password
          </button>
        </div>
      </div>
    </div>
  );
}
