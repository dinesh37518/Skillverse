"use client";

import { useState } from 'react';
import { Languages, ToggleLeft, ToggleRight, Check, Star } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { LanguageConfig } from '../../../types';
import { SUPPORTED_LANGUAGES } from '../../../lib/constants';

export default function LanguageManagement() {
  const [languages, setLanguages] = useState<LanguageConfig[]>(
    SUPPORTED_LANGUAGES.map((lang, idx) => ({
      id: `lang-${idx}`,
      name: lang,
      code: lang.substring(0, 3).toLowerCase(),
      enabled: lang === 'English' || lang === 'Hindi' || lang === 'Bengali' || lang === 'Malayalam',
      is_default: lang === 'English'
    }))
  );

  const handleToggleEnable = (id: string) => {
    setLanguages(prev => prev.map(l => {
      if (l.id === id) {
        // Can't disable the default language
        if (l.is_default) {
          alert("Cannot disable the default platform language.");
          return l;
        }
        return { ...l, enabled: !l.enabled };
      }
      return l;
    }));
  };

  const handleSetDefault = (id: string) => {
    setLanguages(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, is_default: true, enabled: true };
      }
      return { ...l, is_default: false };
    }));
  };

  const columns = [
    {
      header: 'Language Name',
      accessor: (l: LanguageConfig) => (
        <span className="font-semibold text-white">{l.name}</span>
      )
    },
    {
      header: 'Locale Code',
      accessor: (l: LanguageConfig) => (
        <span className="text-xs font-mono uppercase bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
          {l.code}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (l: LanguageConfig) => {
        const style = l.enabled 
          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
          : 'bg-slate-950/40 text-slate-500 border-slate-800';
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${style}`}>
            {l.enabled ? 'ENABLED' : 'DISABLED'}
          </span>
        );
      }
    },
    {
      header: 'Set Platform Default',
      accessor: (l: LanguageConfig) => (
        <button
          onClick={() => handleSetDefault(l.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            l.is_default
              ? 'bg-sky-600/10 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {l.is_default ? (
            <>
              <Star className="h-3.5 w-3.5 fill-sky-400" /> Default Language
            </>
          ) : (
            'Set Default'
          )}
        </button>
      )
    },
    {
      header: 'Actions',
      accessor: (l: LanguageConfig) => (
        <button
          onClick={() => handleToggleEnable(l.id)}
          className={`p-1 text-slate-400 hover:text-white transition-colors cursor-pointer`}
          title={l.enabled ? "Disable Language" : "Enable Language"}
        >
          {l.enabled ? (
            <ToggleRight className="h-7 w-7 text-sky-500" />
          ) : (
            <ToggleLeft className="h-7 w-7 text-slate-600" />
          )}
        </button>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Multilingual Localization</h2>
        <p className="text-slate-400 mt-1">Configure language availability layers, assign fallback defaults, and track translation engines status.</p>
      </div>

      {/* Table grid */}
      <DataTable
        columns={columns}
        data={languages}
        emptyText="No languages configured."
      />
    </div>
  );
}
