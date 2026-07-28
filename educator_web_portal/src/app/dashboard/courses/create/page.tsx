"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SUPPORTED_LANGUAGES, COURSE_CATEGORIES } from '../../../../lib/constants';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  language: z.string().min(1, { message: "Please assign a language" }),
  duration_hours: z.number().min(1, { message: "Duration must be at least 1 hour" }),
  learning_outcomes: z.array(z.object({ value: z.string().min(1, { message: "Cannot be empty" }) })),
  prerequisites: z.array(z.object({ value: z.string().min(1, { message: "Cannot be empty" }) })),
});

type CourseInput = z.infer<typeof courseSchema>;

export default function CreateCourse() {
  const router = useRouter();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      language: 'English',
      duration_hours: 5,
      learning_outcomes: [{ value: '' }],
      prerequisites: [{ value: '' }]
    }
  });

  const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome } = useFieldArray({
    control,
    name: "learning_outcomes"
  });

  const { fields: prereqFields, append: appendPrereq, remove: removePrereq } = useFieldArray({
    control,
    name: "prerequisites"
  });

  const onSubmit = (data: CourseInput) => {
    const newCourse = {
      id: `c-custom-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category || 'Vocational',
      language: data.language || 'English',
      duration_hours: data.duration_hours || 10,
      educator: 'Prof. Educator',
      rating: '5.0 ★',
      students: 0,
      status: 'published',
      code: `EC-${data.title.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('skillverse_courses') || '[]');
      const updated = [newCourse, ...stored];
      localStorage.setItem('skillverse_courses', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }

    alert(`Success! Course "${data.title}" has been published and synced live to the Student Portal!`);
    router.push('/dashboard/courses');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <button 
        onClick={() => router.push('/dashboard/courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course List
      </button>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Course</h2>
        <p className="text-slate-400 mt-1">Provide metadata and setup options for the new vocational syllabus.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Course Title</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            placeholder="e.g. PLC Ladder Logic Winding"
          />
          {errors.title && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Course Description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            placeholder="Detailed course description, syllabus modules, etc."
          />
          {errors.description && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.description.message}</p>}
        </div>

        {/* Category, Language & Duration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              {COURSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Teaching Language</label>
            <select
              {...register('language')}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            >
              {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
            {errors.language && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.language.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration (Hours)</label>
            <input
              type="number"
              {...register('duration_hours', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="e.g. 10"
            />
            {errors.duration_hours && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.duration_hours.message}</p>}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-300">Learning Outcomes</label>
            <button
              type="button"
              onClick={() => appendOutcome({ value: '' })}
              className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Outcome
            </button>
          </div>
          <div className="space-y-3">
            {outcomeFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  {...register(`learning_outcomes.${idx}.value` as const)}
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Outcome description"
                />
                {outcomeFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutcome(idx)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-300">Prerequisites</label>
            <button
              type="button"
              onClick={() => appendPrereq({ value: '' })}
              className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Prerequisite
            </button>
          </div>
          <div className="space-y-3">
            {prereqFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  {...register(`prerequisites.${idx}.value` as const)}
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Requirement description"
                />
                {prereqFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrereq(idx)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form CTAs */}
        <div className="flex gap-4 pt-4 border-t border-slate-800/60">
          <button
            type="submit"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
          >
            Create Course Draft
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/courses')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
