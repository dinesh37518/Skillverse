"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, File, PlayCircle, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { ContentItem } from '../../../types';

export default function ContentLibrary() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [contentItems] = useState<ContentItem[]>([
    {
      id: 'item-1',
      title: 'PLC Induction Grounding Lecture',
      description: 'Introductory video detailing basic circuit safety measurements.',
      category: 'Electrical',
      language: 'Hindi',
      tags: ['PLC', 'Grounding', 'Safety'],
      difficulty: 'Beginner',
      file_path: '/uploads/videos/plc_induction.mp4',
      file_type: 'Video',
      status: 'completed',
      created_at: '2026-07-06T09:00:00Z'
    },
    {
      id: 'item-2',
      title: 'Hydraulic Seals Installation Manual',
      description: 'Comprehensive installation schematics booklet.',
      category: 'Mechanical',
      language: 'English',
      tags: ['Hydraulics', 'Seals', 'Mechanical'],
      difficulty: 'Intermediate',
      file_path: '/uploads/pdfs/hydraulic_seals.pdf',
      file_type: 'PDF',
      status: 'completed',
      created_at: '2026-07-05T14:30:00Z'
    },
    {
      id: 'item-3',
      title: 'Industrial Circuit Hazards.ppt',
      description: 'Syllabus presentation detailing danger hazards.',
      category: 'Safety & Compliance',
      language: 'Malayalam',
      tags: ['Safety', 'Circuits', 'Hazards'],
      difficulty: 'Advanced',
      file_path: '/uploads/ppts/safety_hazards.ppt',
      file_type: 'PPT',
      status: 'processing',
      created_at: '2026-07-07T11:15:00Z'
    }
  ]);

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.file_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      header: 'Resource Details',
      accessor: (item: ContentItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-violet-400 shrink-0">
            {item.file_type === 'Video' ? <PlayCircle className="h-5 w-5" /> : <File className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <span className="text-xs text-slate-500">{item.file_type} • {item.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Language',
      accessor: (item: ContentItem) => <span className="text-slate-400">{item.language}</span>
    },
    {
      header: 'Difficulty',
      accessor: (item: ContentItem) => (
        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400">
          {item.difficulty}
        </span>
      )
    },
    {
      header: 'Processing Status',
      accessor: (item: ContentItem) => {
        if (item.status === 'completed') {
          return (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <BookOpen className="h-4 w-4" /> Ready
            </span>
          );
        }
        if (item.status === 'processing') {
          return (
            <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <RefreshCw className="h-4 w-4 animate-spin" /> Translating
            </span>
          );
        }
        return (
          <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
            <AlertCircle className="h-4 w-4" /> Failed
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Library</h2>
          <p className="text-slate-400 mt-1">Browse, review, and search uploaded resources and files.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/upload')}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Upload Center
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search content by name or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          >
            <option value="all">All Content Types</option>
            <option value="Video">Videos</option>
            <option value="PDF">PDFs</option>
            <option value="PPT">PPTs</option>
            <option value="External Link">External Links</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <DataTable
        columns={columns}
        data={filteredItems}
        emptyStateText="No resource elements match your active filter."
      />
    </div>
  );
}
