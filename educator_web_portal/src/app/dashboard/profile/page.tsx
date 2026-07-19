"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SUPPORTED_LANGUAGES } from '../../../lib/constants';
import { User, Shield, CheckCircle2 } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  institution: z.string().min(5, { message: "Institution name must be at least 5 characters" }),
  department: z.string().min(2, { message: "Department must be at least 2 characters" }),
  preferredLanguage: z.string().min(1, { message: "Please choose a language" }),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function EducatorProfile() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'Ravi Kumar',
      institution: 'National Vocational Training Institute',
      department: 'Electrical Sciences',
      preferredLanguage: 'Hindi'
    }
  });

  const onSubmit = (data: ProfileInput) => {
    alert("Profile details successfully updated!");
    console.log(data);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Educator Profile</h2>
        <p className="text-slate-400 mt-1">Review contact details and institutional affiliations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center gap-4 border-b border-slate-800/60 pb-6">
            <div className="h-16 w-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center font-bold text-xl text-violet-400">
              R
            </div>
            <div>
              <h4 className="font-semibold text-lg text-white">Ravi Kumar</h4>
              <p className="text-xs text-slate-500">Instructor Account Status: Verified</p>
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Preferred Language</label>
              <select
                {...register('preferredLanguage')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Institution</label>
              <input
                type="text"
                {...register('institution')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none"
              />
              {errors.institution && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.institution.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department</label>
              <input
                type="text"
                {...register('department')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none"
              />
              {errors.department && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.department.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
          >
            Save Profile Updates
          </button>
        </form>

        {/* Security / Password updates form */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="h-4.5 w-4.5 text-violet-400" />
            Security Settings
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => alert("Password reset token dispatched.")}
            className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
