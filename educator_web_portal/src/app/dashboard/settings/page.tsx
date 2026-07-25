"use client";

import { useState } from 'react';
import { Settings, Shield, Bell, Eye, Accessibility } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../../lib/constants';
import { useLanguage, SupportedLanguage } from '../../../context/LanguageContext';

export default function SettingsPanel() {
  const { language, setLanguage, t } = useLanguage();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [liveReminders, setLiveReminders] = useState(true);
  const [studentQueries, setStudentQueries] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
        <p className="text-slate-400 mt-1">Manage portal preferences, accessibility levels, and privacy bounds.</p>
      </div>

      <div className="space-y-6">
        {/* Language Preferences */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="h-4.5 w-4.5 text-violet-400" />
            Regional & Localization Settings
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">{t('preferred_language')}</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-violet-300 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-2">Adjusts menu buttons, notifications, and form schemas.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="h-4.5 w-4.5 text-violet-400" />
            Alert Configurations
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-805 bg-slate-950 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-300">Deliver email announcements summary digests</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={liveReminders}
                onChange={e => setLiveReminders(e.target.checked)}
                className="h-4 w-4 rounded border-slate-805 bg-slate-950 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-300">Trigger popups 10 minutes prior to live classes</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={studentQueries}
                onChange={e => setStudentQueries(e.target.checked)}
                className="h-4 w-4 rounded border-slate-805 bg-slate-950 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-300">Notify instantly on AI Tutor student question flags</span>
            </label>
          </div>
        </div>

        {/* Accessibility options */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold flex items-center gap-2 border-b border-slate-800 pb-3">
            <Accessibility className="h-4.5 w-4.5 text-violet-400" />
            Portal Accessibility Settings
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-200">High Contrast Layout Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Increases text contrast across border panels.</p>
              </div>
              <button 
                onClick={() => alert("High contrast toggled.")}
                className="px-3 py-1.5 bg-slate-950 border border-slate-805 text-xs text-slate-300 rounded hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Toggle Mode
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-200">Enlarged Layout Fonts</p>
                <p className="text-xs text-slate-500 mt-0.5">Increases base font size to 16px across details.</p>
              </div>
              <button 
                onClick={() => alert("Font scale toggled.")}
                className="px-3 py-1.5 bg-slate-950 border border-slate-805 text-xs text-slate-300 rounded hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Scale Fonts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
