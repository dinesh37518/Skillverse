"use client";

import { useState } from 'react';
import { Key, RefreshCw } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { AIServiceConfig } from '../../../types';

export default function AIManagement() {
  const [geminiKey, setGeminiKey] = useState('your_gemini_api_key_here');
  const [bhashiniKey, setBhashiniKey] = useState('bha_82J3********************');
  const [activeModel, setActiveModel] = useState('gemini-1.5-flash');

  const [services] = useState<AIServiceConfig[]>([
    {
      id: 'srv-1',
      service_name: 'Gemini AI text summaries & quiz generator',
      provider: 'Google Gemini AI',
      status: 'active',
      api_key_set: true,
      usage_count: 1450,
      last_used: '2 mins ago'
    },
    {
      id: 'srv-2',
      service_name: 'Bhashini scheduled language translator',
      provider: 'MeitY Translation Gateway',
      status: 'active',
      api_key_set: true,
      usage_count: 8520,
      last_used: '10 mins ago'
    },
    {
      id: 'srv-3',
      service_name: 'Bhashini voice synthesis & speech to text',
      provider: 'MeitY TTS/ASR Gateway',
      status: 'maintenance',
      api_key_set: false,
      usage_count: 420,
      last_used: 'Yesterday'
    }
  ]);

  const columns = [
    {
      header: 'AI Pipeline Node',
      accessor: (s: AIServiceConfig) => (
        <div>
          <p className="font-semibold text-white">{s.service_name}</p>
          <span className="text-xs text-slate-500">Provider: {s.provider}</span>
        </div>
      )
    },
    {
      header: 'Credential status',
      accessor: (s: AIServiceConfig) => (
        <span className={`text-xs font-semibold ${s.api_key_set ? 'text-emerald-400' : 'text-amber-400'}`}>
          {s.api_key_set ? 'Active Key set' : 'Key missing'}
        </span>
      )
    },
    {
      header: 'System state',
      accessor: (s: AIServiceConfig) => {
        const styles = {
          active: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
          inactive: 'bg-rose-950/40 text-rose-400 border-rose-500/20',
          maintenance: 'bg-amber-950/40 text-amber-400 border-amber-500/20'
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[s.status]}`}>
            {s.status.toUpperCase()}
          </span>
        );
      }
    },
    {
      header: 'Total API hits',
      accessor: (s: AIServiceConfig) => <span className="text-slate-400 font-semibold">{s.usage_count} hits</span>
    },
    {
      header: 'Last Active',
      accessor: (s: AIServiceConfig) => <span className="text-slate-500 text-xs font-semibold">{s.last_used}</span>
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI & Translation Management</h2>
        <p className="text-slate-400 mt-1">Configure translation pipelines, Gemini AI allocations, system prompts, and endpoint audits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold border-b border-slate-800 pb-3 flex items-center gap-2">
            <Key className="h-4.5 w-4.5 text-sky-400" />
            API Keys Configuration
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Google Gemini AI API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bhashini API Access Secret</label>
            <input
              type="password"
              value={bhashiniKey}
              onChange={e => setBhashiniKey(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Active Gemini Model</label>
            <select
              value={activeModel}
              onChange={e => setActiveModel(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            </select>
          </div>

          <button
            onClick={() => alert("AI keys updated successfully!")}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 rounded-xl font-semibold text-white transition-all cursor-pointer"
          >
            Save configurations
          </button>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Translation & NLP Pipeline Nodes</h3>
            <button 
              onClick={() => alert("Verifying connection to Gemini AI and Bhashini...")}
              className="text-xs text-sky-400 font-semibold hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Force diagnostic run
            </button>
          </div>

          <DataTable
            columns={columns}
            data={services}
            emptyText="No translation components listed."
          />
        </div>
      </div>
    </div>
  );
}
