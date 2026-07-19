"use client";

import { Globe, BarChart3, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TranslationSettings() {
  const supportedLanguages = [
    "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati",
    "Hindi", "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam",
    "Manipuri (Meitei)", "Marathi", "Nepali", "Odia", "Punjabi",
    "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu"
  ];

  const serviceProviders = [
    { name: 'AI4Bharat Bhashini', type: 'Translation + STT + TTS', status: 'active', latency: '120ms', quota: '85%' },
    { name: 'Groq Whisper Large-v3', type: 'Speech-to-Text', status: 'active', latency: '95ms', quota: '62%' },
    { name: 'Google Cloud TTS', type: 'Text-to-Speech', status: 'standby', latency: '—', quota: '100%' },
    { name: 'IndicTrans2 (Local)', type: 'Translation Fallback', status: 'active', latency: '210ms', quota: 'N/A' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Translation & Language Controls</h2>
        <p className="text-slate-400 mt-1">
          Configure AI translation service providers, monitor usage quotas, and manage supported languages.
        </p>
      </div>

      {/* Supported Languages Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            Active Languages ({supportedLanguages.length})
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {supportedLanguages.map((lang, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors cursor-default"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Service Providers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-violet-400" />
            Translation Service Endpoints
          </h3>
          <button className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4 font-medium">Provider</th>
                <th className="py-3 px-4 font-medium">Service Type</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Avg. Latency</th>
                <th className="py-3 px-4 font-medium">Quota Used</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviders.map((provider, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-950/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{provider.name}</td>
                  <td className="py-4 px-4 text-slate-400">{provider.type}</td>
                  <td className="py-4 px-4">
                    {provider.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5" /> Standby
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{provider.latency}</td>
                  <td className="py-4 px-4">
                    {provider.quota !== 'N/A' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-violet-600 h-full transition-all"
                            style={{ width: provider.quota }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{provider.quota}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Local Model</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Key Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">API Key Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Bhashini API Key', placeholder: 'bhas_xxxxxxxxxx' },
            { label: 'Groq API Key', placeholder: 'gsk_xxxxxxxxxx' },
            { label: 'Google Cloud TTS Key', placeholder: 'AIzaSy...' },
            { label: 'Redis Connection URL', placeholder: 'redis://localhost:6379/0' },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {field.label}
              </label>
              <input
                type="password"
                defaultValue="••••••••••••••••••"
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-sm font-semibold transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
