"use client";

import { Server, Database, Cpu, HardDrive, Wifi, Clock } from 'lucide-react';

export default function SystemHealth() {
  const services = [
    { name: 'FastAPI Backend', status: 'healthy', uptime: '99.97%', responseTime: '23ms', icon: Server },
    { name: 'PostgreSQL (Supabase)', status: 'healthy', uptime: '99.99%', responseTime: '8ms', icon: Database },
    { name: 'Redis Cache', status: 'healthy', uptime: '99.95%', responseTime: '2ms', icon: Cpu },
    { name: 'WebRTC Signaling', status: 'degraded', uptime: '98.50%', responseTime: '145ms', icon: Wifi },
    { name: 'Storage (Supabase)', status: 'healthy', uptime: '99.99%', responseTime: '35ms', icon: HardDrive },
    { name: 'Groq LLM API', status: 'healthy', uptime: '99.80%', responseTime: '420ms', icon: Cpu },
  ];

  const recentEvents = [
    { severity: 'info', message: 'Scheduled database backup completed successfully.', timestamp: '2026-07-07 14:00 UTC' },
    { severity: 'warning', message: 'WebRTC signaling server response time elevated (>100ms).', timestamp: '2026-07-07 13:42 UTC' },
    { severity: 'info', message: 'Translation cache cleared and rebuilt (Redis flush).', timestamp: '2026-07-07 12:00 UTC' },
    { severity: 'error', message: 'Bhashini TTS endpoint returned 503 for Santali — fallback to local model.', timestamp: '2026-07-07 10:15 UTC' },
    { severity: 'info', message: 'SSL certificate renewed for api.skillverse.ai.', timestamp: '2026-07-06 22:00 UTC' },
  ];

  const statusColor = (s: string) => {
    if (s === 'healthy') return 'text-emerald-400';
    if (s === 'degraded') return 'text-amber-400';
    return 'text-red-400';
  };

  const statusDot = (s: string) => {
    if (s === 'healthy') return 'bg-emerald-500';
    if (s === 'degraded') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const severityStyles: Record<string, string> = {
    info: 'text-blue-400 bg-blue-950/30 border-blue-500/20',
    warning: 'text-amber-400 bg-amber-950/30 border-amber-500/20',
    error: 'text-red-400 bg-red-950/30 border-red-500/20',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Health & Diagnostics</h2>
        <p className="text-slate-400 mt-1">
          Monitor infrastructure, service uptime, and platform event logs.
        </p>
      </div>

      {/* Service Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm">{svc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot(svc.status)} animate-pulse`} />
                  <span className={`text-xs font-semibold capitalize ${statusColor(svc.status)}`}>
                    {svc.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Uptime</p>
                  <p className="font-semibold mt-0.5">{svc.uptime}</p>
                </div>
                <div>
                  <p className="text-slate-500">Avg Response</p>
                  <p className="font-semibold mt-0.5">{svc.responseTime}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-rose-400" />
          Platform Event Log
        </h3>
        <div className="space-y-3">
          {recentEvents.map((evt, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 p-4 rounded-xl border ${severityStyles[evt.severity]}`}
            >
              <span className="text-xs font-semibold uppercase mt-0.5 shrink-0 w-16">
                {evt.severity}
              </span>
              <p className="text-sm flex-1">{evt.message}</p>
              <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
