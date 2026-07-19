"use client";

import { useState } from 'react';
import { Video, Calendar, Users, PlayCircle, Eye, AlertCircle } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { LiveSession } from '../../../types';

export default function LiveClassMonitor() {
  const [sessions] = useState<LiveSession[]>([
    {
      id: 'session-1',
      title: 'Hydraulic Valves Troubleshooting Live Session',
      educator_name: 'Priya Patel',
      course_title: 'Hydraulic Systems',
      scheduled_at: '2026-07-07T16:00:00Z',
      status: 'live',
      attendance_count: 24,
      created_at: '2026-07-06T10:00:00Z'
    },
    {
      id: 'session-2',
      title: 'AC Motor Phase Connections Vetting Q&A',
      educator_name: 'Ravi Kumar',
      course_title: 'PLC Fundamentals',
      scheduled_at: '2026-07-09T10:00:00Z',
      status: 'scheduled',
      attendance_count: 0,
      created_at: '2026-07-07T08:00:00Z'
    },
    {
      id: 'session-3',
      title: 'Pressure Specs & Flow Valves Setup Class',
      educator_name: 'Priya Patel',
      course_title: 'Hydraulic Systems',
      scheduled_at: '2026-07-05T14:00:00Z',
      status: 'completed',
      attendance_count: 14,
      created_at: '2026-07-04T12:00:00Z'
    }
  ]);

  const columns = [
    {
      header: 'Session Name',
      accessor: (s: LiveSession) => (
        <div>
          <p className="font-semibold text-white">{s.title}</p>
          <span className="text-xs text-slate-500">Instructor: {s.educator_name} • Course: {s.course_title}</span>
        </div>
      )
    },
    {
      header: 'Scheduled Date/Time',
      accessor: (s: LiveSession) => (
        <span className="text-slate-400 font-medium">
          {new Date(s.scheduled_at).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Attendance',
      accessor: (s: LiveSession) => (
        <span className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Users className="h-4 w-4" /> {s.attendance_count} active
        </span>
      )
    },
    {
      header: 'Streaming Status',
      accessor: (s: LiveSession) => {
        const styles = {
          live: 'bg-rose-950/40 text-rose-400 border-rose-500/20 animate-pulse',
          scheduled: 'bg-sky-950/40 text-sky-400 border-sky-500/20',
          completed: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
          cancelled: 'bg-slate-950/40 text-slate-400 border-slate-800'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[s.status]}`}>
            {s.status.toUpperCase()}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Live Classes Monitor</h2>
        <p className="text-slate-400 mt-1">Audit ongoing live classrooms, check connection feeds, and monitor recording allocations.</p>
      </div>

      {/* Sessions Grid Lists */}
      <DataTable
        columns={columns}
        data={sessions}
        emptyText="No sessions monitored."
      />
    </div>
  );
}
