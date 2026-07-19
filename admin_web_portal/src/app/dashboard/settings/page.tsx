"use client";

import { useState } from 'react';
import { Settings, Shield, Bell, Database, Mail } from 'lucide-react';

export default function SystemSettings() {
  const [platformName, setPlatformName] = useState('SkillVerse AI');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [smtpServer, setSmtpServer] = useState('smtp.mailgun.org');
  const [backupSchedule, setBackupSchedule] = useState('daily');

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-slate-400 mt-1">Configure global variables, toggler values, SMTP mail configs, and automated databases backup schedules.</p>
      </div>

      <div className="space-y-6">
        {/* Core preferences */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="h-4.5 w-4.5 text-sky-400" />
            General Branding & Maintenance
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Platform Application Name</label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-sm font-medium text-slate-200">Maintenance Mode Status</p>
                <p className="text-xs text-slate-500 mt-0.5">Redirect all external users to a static service update notice.</p>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  maintenanceMode 
                    ? 'bg-rose-950/40 text-rose-450 border-rose-500/30' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {maintenanceMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Database configurations */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="h-4.5 w-4.5 text-sky-400" />
            Database & Backups Config
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Automated Backup Schedule</label>
              <select
                value={backupSchedule}
                onChange={e => setBackupSchedule(e.target.value)}
                className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Every Day at 00:00 UTC</option>
                <option value="weekly">Every Sunday</option>
              </select>
            </div>
            
            <button 
              onClick={() => alert("Platform database backup task dispatched to storage servers.")}
              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-xs text-slate-300 hover:text-white rounded-lg font-semibold transition-all cursor-pointer"
            >
              Trigger Instant Backup
            </button>
          </div>
        </div>

        {/* SMTP settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="h-4.5 w-4.5 text-sky-400" />
            Branded Email (SMTP) Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">SMTP Relayer Host Address</label>
              <input
                type="text"
                value={smtpServer}
                onChange={e => setSmtpServer(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
            
            <button 
              onClick={() => alert("Test connection email successfully sent to primary admin account.")}
              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-xs text-slate-300 hover:text-white rounded-lg font-semibold transition-all cursor-pointer"
            >
              Send Diagnostic Mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
