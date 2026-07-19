"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Filter, Plus, CheckCircle, Trash2, XCircle, Pencil, Eye, EyeOff } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Educator } from '../../../types';
import { DEPARTMENTS } from '../../../lib/constants';

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

const educatorSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  department: z.string().min(1, { message: "Select department" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type EducatorInput = z.infer<typeof educatorSchema>;

function EducatorNameCell({ ed }: { ed: Educator }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div>
      <p className="font-semibold text-white">{ed.full_name}</p>
      <span className="text-xs text-slate-500">{ed.email}</span>
      {ed.password && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
          <span>Pass: {showPass ? ed.password : '••••••••'}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPass(!showPass);
            }}
            className="hover:text-white transition-colors p-0.5 cursor-pointer"
            title={showPass ? "Hide Password" : "Show Password"}
          >
            {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

export default function EducatorManagement() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const [editingEducator, setEditingEducator] = useState<Educator | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EducatorInput>({
    resolver: zodResolver(educatorSchema)
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm<EducatorInput>({
    resolver: zodResolver(educatorSchema)
  });

  const [educators, setEducators] = useState<Educator[]>([
    {
      id: 'ed-1',
      full_name: 'Ravi Kumar',
      email: 'ravi.kumar@skillverse.ai',
      department: 'Electrical Engineering',
      status: 'active',
      courses_count: 5,
      students_count: 248,
      joined_at: '2026-06-01T08:00:00Z',
      password: 'RaviPassword123!'
    },
    {
      id: 'ed-2',
      full_name: 'Priya Patel',
      email: 'priya.patel@skillverse.ai',
      department: 'Mechanical Engineering',
      status: 'active',
      courses_count: 3,
      students_count: 180,
      joined_at: '2026-06-15T09:00:00Z',
      password: 'PriyaPassword456!'
    },
    {
      id: 'ed-3',
      full_name: 'Suresh Nair',
      email: 'suresh.nair@skillverse.ai',
      department: 'Automotive',
      status: 'suspended',
      courses_count: 1,
      students_count: 15,
      joined_at: '2026-06-20T10:00:00Z',
      password: 'SureshPassword789!'
    }
  ]);

  const handleCreateEducator = (data: EducatorInput) => {
    const newEducator: Educator = {
      id: generateId('ed'),
      full_name: data.fullName,
      email: data.email,
      department: data.department,
      status: 'active',
      courses_count: 0,
      students_count: 0,
      joined_at: new Date().toISOString(),
      password: data.password
    };

    setEducators(prev => [newEducator, ...prev]);
    setShowModal(false);
    reset();
  };

  const handleToggleStatus = (id: string, currentStatus: 'active' | 'suspended') => {
    setEducators(prev => prev.map(ed => {
      if (ed.id === id) {
        return { ...ed, status: currentStatus === 'active' ? 'suspended' as const : 'active' as const };
      }
      return ed;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to offboard this educator?")) {
      setEducators(prev => prev.filter(ed => ed.id !== id));
    }
  };

  const handleEditClick = (ed: Educator) => {
    setEditingEducator(ed);
    resetEdit({
      fullName: ed.full_name,
      email: ed.email,
      department: ed.department,
      password: ed.password || 'Educator@123',
    });
    setShowEditModal(true);
  };

  const handleUpdateEducator = (data: EducatorInput) => {
    if (!editingEducator) return;
    setEducators(prev => prev.map(ed => {
      if (ed.id === editingEducator.id) {
        return {
          ...ed,
          full_name: data.fullName,
          email: data.email,
          department: data.department,
          password: data.password,
        };
      }
      return ed;
    }));
    setShowEditModal(false);
    setEditingEducator(null);
  };

  const filteredEducators = educators.filter(ed => {
    const matchesSearch = ed.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ed.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || ed.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const columns = [
    {
      header: 'Educator Name',
      accessor: (ed: Educator) => <EducatorNameCell ed={ed} />
    },
    {
      header: 'Department',
      accessor: (ed: Educator) => <span className="text-slate-400">{ed.department}</span>
    },
    {
      header: 'Metrics',
      accessor: (ed: Educator) => (
        <span className="text-xs text-slate-400 font-medium">
          {ed.courses_count} courses • {ed.students_count} students
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (ed: Educator) => {
        const style = ed.status === 'active' 
          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
          : 'bg-rose-950/40 text-rose-400 border-rose-500/20';
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
            {ed.status.toUpperCase()}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (ed: Educator) => (
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => handleEditClick(ed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Edit Details"
          >
            <Pencil className="h-4 w-4 text-sky-400" />
          </button>
          <button 
            onClick={() => handleToggleStatus(ed.id, ed.status)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={ed.status === 'active' ? "Suspend Account" : "Activate Account"}
          >
            {ed.status === 'active' ? <XCircle className="h-4 w-4 text-rose-400" /> : <CheckCircle className="h-4 w-4 text-emerald-400" />}
          </button>
          <button 
            onClick={() => handleDelete(ed.id)}
            className="p-1.5 hover:bg-red-950/40 rounded-lg text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete Account"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Educator Directory</h2>
          <p className="text-slate-400 mt-1">Review onboarded trainers, adjust access scopes, and audit profile statuses.</p>
        </div>
        <button
          onClick={() => {
            reset({
              fullName: '',
              email: '',
              department: '',
              password: ''
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Onboard Educator
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search educators by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <DataTable
        columns={columns}
        data={filteredEducators}
        emptyText="No educators onboarded matching query filters."
      />

      {/* Onboard Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-xl font-bold">Onboard New Trainer</h3>
              <p className="text-xs text-slate-400 mt-1">Specify profile parameters to generate invite credentials.</p>
            </div>

            <form onSubmit={handleSubmit(handleCreateEducator)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="e.g. Ramesh Chandra"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="e.g. ramesh@skillverse.ai"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                <select
                  {...register('department')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
                >
                  <option value="">Select Dept</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.department.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                <input
                  type="text"
                  {...register('password')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="Password (min 6 characters)"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password.message}</p>}
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
                  className="px-4 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg cursor-pointer"
                >
                  Add Educator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEducator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-xl font-bold">Edit Educator Details</h3>
              <p className="text-xs text-slate-400 mt-1">Modify trainer profile parameters and credentials.</p>
            </div>

            <form onSubmit={handleSubmitEdit(handleUpdateEducator)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  {...registerEdit('fullName')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="e.g. Ramesh Chandra"
                />
                {editErrors.fullName && <p className="mt-1 text-xs text-red-500 font-semibold">{editErrors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  {...registerEdit('email')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="e.g. ramesh@skillverse.ai"
                />
                {editErrors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{editErrors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                <select
                  {...registerEdit('department')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
                >
                  <option value="">Select Dept</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {editErrors.department && <p className="mt-1 text-xs text-red-500 font-semibold">{editErrors.department.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                <input
                  type="text"
                  {...registerEdit('password')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  placeholder="Password (min 6 characters)"
                />
                {editErrors.password && <p className="mt-1 text-xs text-red-500 font-semibold">{editErrors.password.message}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEducator(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
