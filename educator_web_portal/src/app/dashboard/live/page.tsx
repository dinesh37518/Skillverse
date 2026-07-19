"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, ExternalLink, Users, PlayCircle, AlertCircle } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { LiveSession } from '../../../types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

const sessionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  scheduled_at: z.string().min(1, { message: "Schedule date and time are required" }),
  duration: z.number().min(15, { message: "Duration must be at least 15 minutes" }),
});

type SessionInput = z.infer<typeof sessionSchema>;

export default function LiveClassroom() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { duration: 60 }
  });

  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: 'session-1',
      course_id: 'course-1',
      course_title: 'Hydraulic Systems',
      title: 'Hydraulic Valves Troubleshooting Live Session',
      scheduled_at: '2026-07-07T16:00:00Z',
      status: 'scheduled',
      webrtc_room_id: 'room-hydraulic-trouble',
      join_link: 'http://localhost:3000/live/room-hydraulic-trouble',
      created_at: '2026-07-06T10:00:00Z'
    },
    {
      id: 'session-2',
      course_id: 'course-2',
      course_title: 'PLC Fundamentals',
      title: 'AC Motor Phase Connections Vetting Q&A',
      scheduled_at: '2026-07-09T10:00:00Z',
      status: 'scheduled',
      webrtc_room_id: 'room-ac-motor-qa',
      join_link: 'http://localhost:3000/live/room-ac-motor-qa',
      created_at: '2026-07-07T08:00:00Z'
    },
    {
      id: 'session-3',
      course_id: 'course-1',
      course_title: 'Hydraulic Systems',
      title: 'Pressure Specs & Flow Valves Setup Class',
      scheduled_at: '2026-07-05T14:00:00Z',
      status: 'completed',
      webrtc_room_id: 'room-flow-valves',
      recording_url: '/archive/live-recordings/flow-valves-rec.mp4',
      attendance_count: 14,
      created_at: '2026-07-04T12:00:00Z'
    }
  ]);

  const handleCreateSession = (data: SessionInput) => {
    const timestamp = generateId('temp');
    const newSession: LiveSession = {
      id: `session-${timestamp}`,
      course_id: 'course-1',
      course_title: 'Hydraulic Systems',
      title: data.title,
      scheduled_at: data.scheduled_at,
      status: 'scheduled',
      webrtc_room_id: `room-${timestamp}`,
      join_link: `http://localhost:3000/live/room-${timestamp}`,
      created_at: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setShowModal(false);
    reset();
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled');

  const upcomingColumns = [
    {
      header: 'Session Name',
      accessor: (s: LiveSession) => (
        <div>
          <p className="font-semibold text-white">{s.title}</p>
          <span className="text-xs text-slate-500">Course: {s.course_title}</span>
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
      header: 'Join Link',
      accessor: (s: LiveSession) => (
        <a 
          href={s.join_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          <span>Link Placeholder</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )
    }
  ];

  const pastColumns = [
    {
      header: 'Session Name',
      accessor: (s: LiveSession) => (
        <div>
          <p className="font-semibold text-slate-300">{s.title}</p>
          <span className="text-xs text-slate-500">Course: {s.course_title}</span>
        </div>
      )
    },
    {
      header: 'Attendance',
      accessor: (s: LiveSession) => (
        <span className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Users className="h-4 w-4" /> {s.attendance_count || 0} students
        </span>
      )
    },
    {
      header: 'Recording',
      accessor: (s: LiveSession) => (
        s.recording_url ? (
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <PlayCircle className="h-4 w-4" /> Play Recording
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <AlertCircle className="h-4 w-4" /> Not Archived
          </span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Classes</h2>
          <p className="text-slate-400 mt-1">Schedule real-time lecture streams with live translations.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Schedule Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'upcoming' 
              ? 'border-violet-500 text-white font-bold' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Upcoming Sessions
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'past' 
              ? 'border-violet-500 text-white font-bold' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Past Sessions
        </button>
      </div>

      {/* Sessions Grid Lists */}
      {activeTab === 'upcoming' ? (
        <DataTable
          columns={upcomingColumns}
          data={upcomingSessions}
          emptyStateText="No upcoming sessions scheduled."
        />
      ) : (
        <DataTable
          columns={pastColumns}
          data={pastSessions}
          emptyStateText="No past classroom records exist."
        />
      )}

      {/* Schedule Session Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-xl font-bold">Schedule Live Session</h3>
              <p className="text-xs text-slate-400 mt-1">Specify date and class info below.</p>
            </div>

            <form onSubmit={handleSubmit(handleCreateSession)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Session Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g. Coil Overlaps Troubleshooting"
                />
                {errors.title && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    {...register('scheduled_at')}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {errors.scheduled_at && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.scheduled_at.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g. 60"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
