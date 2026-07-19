"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileText, Plus, Calendar, Star, Users } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Assignment } from '../../../types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

const assignmentSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  max_score: z.number().min(10, { message: "Score must be at least 10 points" }),
  due_date: z.string().min(1, { message: "Due date is required" }),
});

type AssignmentInput = z.infer<typeof assignmentSchema>;

export default function AssignmentManagement() {
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { max_score: 100 }
  });

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'assign-1',
      course_id: 'course-1',
      course_title: 'Hydraulic Systems',
      title: 'Safety Valve Pressure Calibration Review',
      description: 'Submit calculations for threshold safety configurations.',
      max_score: 100,
      due_date: '2026-07-12T23:59:00Z',
      submissions_count: 8,
      created_at: '2026-07-06T10:00:00Z'
    },
    {
      id: 'assign-2',
      course_id: 'course-2',
      course_title: 'PLC Fundamentals',
      title: 'PLC Registry Address Map Construction',
      description: 'Outline the full mapping schema for AC phase controls.',
      max_score: 50,
      due_date: '2026-07-15T18:00:00Z',
      submissions_count: 3,
      created_at: '2026-07-07T08:00:00Z'
    }
  ]);

  const handleCreateAssignment = (data: AssignmentInput) => {
    const newAssign: Assignment = {
      id: generateId('assign'),
      course_id: 'course-1',
      course_title: 'Hydraulic Systems',
      title: data.title,
      description: data.description,
      max_score: data.max_score,
      due_date: data.due_date,
      submissions_count: 0,
      created_at: new Date().toISOString()
    };

    setAssignments(prev => [newAssign, ...prev]);
    setShowModal(false);
    reset();
  };

  const columns = [
    {
      header: 'Assignment Title',
      accessor: (a: Assignment) => (
        <div>
          <p className="font-semibold text-white">{a.title}</p>
          <span className="text-xs text-slate-500">Course: {a.course_title}</span>
        </div>
      )
    },
    {
      header: 'Submissions',
      accessor: (a: Assignment) => (
        <span className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Users className="h-4 w-4" /> {a.submissions_count} submitted
        </span>
      )
    },
    {
      header: 'Max Score',
      accessor: (a: Assignment) => (
        <span className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Star className="h-4 w-4 text-amber-500" /> {a.max_score} pts
        </span>
      )
    },
    {
      header: 'Due Date',
      accessor: (a: Assignment) => (
        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
          <Calendar className="h-4 w-4" /> {new Date(a.due_date).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-slate-400 mt-1">Publish and grade student evaluation checklists.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Create Assignment
        </button>
      </div>

      {/* Assignment Table List */}
      <DataTable
        columns={columns}
        data={assignments}
        emptyStateText="No assignments published."
      />

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-xl font-bold">Create Assignment</h3>
              <p className="text-xs text-slate-400 mt-1">Detail instructions and maximum grading weight.</p>
            </div>

            <form onSubmit={handleSubmit(handleCreateAssignment)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Assignment Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none"
                  placeholder="e.g. Ohms Law Circuit Check"
                />
                {errors.title && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none"
                  placeholder="Summarize required submissions details..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Score</label>
                  <input
                    type="number"
                    {...register('max_score', { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    placeholder="e.g. 100"
                  />
                  {errors.max_score && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.max_score.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    {...register('due_date')}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
                  />
                  {errors.due_date && <p className="mt-1 text-xs text-red-405 font-semibold">{errors.due_date.message}</p>}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
