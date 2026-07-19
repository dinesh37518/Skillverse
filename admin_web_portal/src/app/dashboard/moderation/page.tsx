"use client";

import { useState } from 'react';
import { Shield, Eye, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

interface CourseReview {
  id: string;
  title: string;
  educator: string;
  category: string;
  lessonsCount: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ContentModeration() {
  const [courses] = useState<CourseReview[]>([
    { id: '1', title: 'Hydraulic Systems for Industrial Plants', educator: 'Ravi Kumar', category: 'Mechanical', lessonsCount: 8, submittedAt: '2026-07-06', status: 'pending' },
    { id: '2', title: 'PLC Programming Fundamentals', educator: 'Priya Sharma', category: 'Electrical', lessonsCount: 12, submittedAt: '2026-07-05', status: 'pending' },
    { id: '3', title: 'Welding Safety Certification', educator: 'Deepa Iyer', category: 'Safety', lessonsCount: 6, submittedAt: '2026-07-04', status: 'approved' },
    { id: '4', title: 'Basic Carpentry Joints', educator: 'Suresh Nair', category: 'Carpentry', lessonsCount: 5, submittedAt: '2026-07-03', status: 'rejected' },
  ]);

  const handleApprove = (id: string) => {
    alert(`Course ${id} approved. This would update courses SET is_published=true and notify the educator.`);
  };

  const handleReject = (id: string) => {
    alert(`Course ${id} rejected. Educator will be notified with feedback request.`);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
      approved: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-950/40 text-red-400 border-red-500/30',
    };
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Content Vetting & Moderation</h2>
        <p className="text-slate-400 mt-1">
          Review submitted courses before they are published to students.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', count: courses.filter(c => c.status === 'pending').length, color: 'text-amber-400', icon: Shield },
          { label: 'Approved', count: courses.filter(c => c.status === 'approved').length, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'Rejected', count: courses.filter(c => c.status === 'rejected').length, color: 'text-red-400', icon: XCircle },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className={`p-2.5 bg-slate-950 border border-slate-800 rounded-xl ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Review Cards */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-violet-400 shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold truncate">{course.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  by {course.educator} • {course.category} • {course.lessonsCount} lessons • Submitted {course.submittedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {statusBadge(course.status)}
              
              {course.status === 'pending' && (
                <>
                  <button className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors" title="Preview">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleApprove(course.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/60 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(course.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-950/60 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
