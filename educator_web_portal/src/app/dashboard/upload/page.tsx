"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import FileUploader from '../../../components/FileUploader';
import { SUPPORTED_LANGUAGES, COURSE_CATEGORIES, DIFFICULTY_LEVELS } from '../../../lib/constants';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const uploadSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Select category" }),
  language: z.string().min(1, { message: "Assign target language" }),
  difficulty: z.string().min(1, { message: "Assign difficulty level" }),
  tags: z.string().optional()
});

type UploadInput = z.infer<typeof uploadSchema>;

export default function UploadCenter() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UploadInput>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      language: 'English',
      difficulty: 'Beginner'
    }
  });

  const onSubmit = (data: UploadInput) => {
    if (!selectedFile) {
      alert("Please upload a resource file first.");
      return;
    }
    console.log("Metadata:", data, "File:", selectedFile.name);
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard/content');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button 
        onClick={() => router.push('/dashboard/content')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </button>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Center</h2>
        <p className="text-slate-400 mt-1">Upload lecture videos, PDF guides, or slide decks to compile into courses.</p>
      </div>

      {isSubmitted ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="inline-flex bg-emerald-950/40 p-4 rounded-full text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold">Upload Completed Successfully</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Your file has been transferred. The translation and subtitle indexing tasks are starting in the queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Uploader Box */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select File</h3>
            <FileUploader
              onFileSelect={(file) => setSelectedFile(file)}
              allowedFormats={['.mp4', '.mov', '.avi', '.pdf', '.ppt', '.docx', '.webm']}
              maxSizeMB={150}
            />
          </div>

          {/* Metadata Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold border-b border-slate-800 pb-2">File Metadata</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Title</label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="e.g. Inductors & Wiring Safety"
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                {...register('description')}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="Briefly summarize resource..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  <option value="">Category</option>
                  {COURSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Language</label>
                <select
                  {...register('language')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                {errors.language && <p className="mt-1 text-xs text-red-400">{errors.language.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty</label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  {DIFFICULTY_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                {errors.difficulty && <p className="mt-1 text-xs text-red-400">{errors.difficulty.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="e.g. PLC, Safety"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-750/30 disabled:text-slate-500 rounded-xl font-semibold text-white transition-all cursor-pointer flex justify-center"
            >
              Upload to Library
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
