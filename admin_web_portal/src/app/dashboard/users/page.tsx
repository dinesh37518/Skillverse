"use client";

import { useState } from 'react';
import { UserCheck, UserX, ShieldCheck, Search, MoreVertical } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<UserRecord[]>([
    { id: '1', name: 'Ravi Kumar', email: 'ravi.kumar@institution.edu', role: 'educator', status: 'pending', joinedAt: '2026-07-05' },
    { id: '2', name: 'Priya Sharma', email: 'priya.sharma@institution.edu', role: 'educator', status: 'active', joinedAt: '2026-06-20' },
    { id: '3', name: 'Amit Patel', email: 'amit.patel@student.edu', role: 'student', status: 'active', joinedAt: '2026-07-01' },
    { id: '4', name: 'Deepa Iyer', email: 'deepa.iyer@institution.edu', role: 'educator', status: 'pending', joinedAt: '2026-07-06' },
    { id: '5', name: 'spam.bot@fake.io', email: 'spam.bot@fake.io', role: 'student', status: 'suspended', joinedAt: '2026-07-04' },
  ]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
      suspended: 'bg-red-950/40 text-red-400 border-red-500/30',
    };
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleApprove = (userId: string) => {
    alert(`Approving educator application for user ${userId}. This would update the educators table: SET approved=true, status='active', approved_by=<admin_uid>, approved_at=now()`);
  };

  const handleSuspend = (userId: string) => {
    alert(`Suspending user ${userId}. This would update the educators/students table: SET status='suspended'`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-slate-400 mt-1">
            Approve educators, manage student accounts, and enforce access controls.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', count: users.length, icon: ShieldCheck, color: 'text-blue-400' },
          { label: 'Pending Approvals', count: users.filter(u => u.status === 'pending').length, icon: UserCheck, color: 'text-amber-400' },
          { label: 'Suspended', count: users.filter(u => u.status === 'suspended').length, icon: UserX, color: 'text-red-400' },
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

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 bg-slate-950/50">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Role</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Joined</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-800/50 hover:bg-slate-950/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium">{user.name}</td>
                  <td className="py-4 px-6 text-slate-400">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-slate-300">{user.role}</span>
                  </td>
                  <td className="py-4 px-6">{statusBadge(user.status)}</td>
                  <td className="py-4 px-6 text-slate-500">{user.joinedAt}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/60 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {user.status !== 'suspended' && (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-950/60 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
