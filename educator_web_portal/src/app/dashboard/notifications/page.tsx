"use client";

import { useState } from 'react';
import { Bell, BookOpen, Clock, Trash2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../../../types';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Student Query',
      message: 'Student Amit Patel asked a question via the AI Tutor about Phase Overlaps.',
      is_read: false,
      type: 'announcement',
      created_at: '2026-07-07T14:30:00Z'
    },
    {
      id: 'notif-2',
      title: 'Translation Completed',
      message: 'Audio dubbing and translation for "Induction Safety" has finished processing.',
      is_read: true,
      type: 'system',
      created_at: '2026-07-06T09:00:00Z'
    },
    {
      id: 'notif-3',
      title: 'Live Session Starting',
      message: 'Your scheduled session "PLC Ladder Logic QA" will start in 1 hour.',
      is_read: false,
      type: 'live_session',
      created_at: '2026-07-07T15:00:00Z'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
          <p className="text-slate-400 mt-1">Review alerts, announcements, and task queue reminders.</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications log */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl">
            <Bell className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Your notification inbox is currently empty.</p>
          </div>
        ) : (
          notifications.map(item => {
            let Icon = Bell;
            let color = 'text-violet-400';

            if (item.type === 'live_session') {
              Icon = Clock;
              color = 'text-rose-400';
            } else if (item.type === 'system') {
              Icon = CheckCircle2;
              color = 'text-emerald-400';
            }

            return (
              <div 
                key={item.id}
                className={`bg-slate-900 border rounded-2xl p-5 flex items-start gap-4 transition-all ${
                  item.is_read ? 'border-slate-800/60 opacity-70' : 'border-violet-500/20 shadow-lg shadow-violet-500/5'
                }`}
              >
                <div className={`p-2.5 bg-slate-950 border border-slate-850 rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{item.message}</p>
                </div>
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors self-start cursor-pointer"
                  title="Remove Notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
