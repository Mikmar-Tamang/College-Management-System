import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiSearch, FiUserPlus, FiUserCheck, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Student Management Page
   - 3 stat cards (total, active, graduated)
   - Search bar + Add Student button
   - Table with student data from API
   - Dropdowns for department, program, semester, role
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/students';
const DEPT_API = import.meta.env.VITE_API_URL + '/api/departments';
const PROG_API = import.meta.env.VITE_API_URL + '/api/programs';
const SEM_API = import.meta.env.VITE_API_URL + '/api/semesters';

interface DepartmentType {
  id: number;
  name: string;
}

interface ProgramType {
  id: number;
  name: string;
  code: string;
  departmentId: number;
}

interface SemesterType {
  id: number;
  number: string;
}

interface StudentType {
  id: number;
  name: string;
  rollNo: string;
  departmentId: number;
  programId: number;
  semester: string;
  role: string;
  status: string;
  department: DepartmentType | null;
  program: { id: number; name: string; code: string } | null;
}

const ROLES = ['Student', 'Class Representative', 'Lab Assistant', 'Sports Captain', 'Cultural Secretary'];

function StudentAdmission() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', rollNo: '', departmentId: '', programId: '', semester: '', role: 'Student', status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [stuRes, deptRes, progRes, semRes] = await Promise.all([
        axios.get(API, { withCredentials: true }),
        axios.get(DEPT_API, { withCredentials: true }),
        axios.get(PROG_API, { withCredentials: true }),
        axios.get(SEM_API, { withCredentials: true }),
      ]);
      setStudents(stuRes.data.data);
      setDepartments(deptRes.data.data);
      setPrograms(progRes.data.data);
      setSemesters(semRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* Programs filtered by selected department */
  const filteredPrograms = form.departmentId
    ? programs.filter(p => p.departmentId === Number(form.departmentId))
    : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, {
        ...form,
        departmentId: Number(form.departmentId),
        programId: Number(form.programId),
      }, { withCredentials: true });
      setForm({ name: '', rollNo: '', departmentId: '', programId: '', semester: '', role: 'Student', status: 'Active' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create student', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };

  /* Filter students by name or roll number */
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount    = students.filter(s => s.status === 'Active').length;
  const graduatedCount = students.filter(s => s.status === 'Graduated').length;

  const hasDeptAndProg = departments.length > 0 && programs.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Page Title ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-500 mt-1">View, search, and manage all student records.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiUserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              <p className="text-sm text-gray-500">Active Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FiUserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{graduatedCount}</p>
              <p className="text-sm text-gray-500">Graduated</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by name or roll number..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
          <FiPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Roll No</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Semester</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">No students found.</td>
              </tr>
            ) : (
              filtered.map((student, index) => (
                <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                  <td className="px-4 py-3 text-gray-600">{student.rollNo}</td>
                  <td className="px-4 py-3 text-gray-600">{student.department?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{student.program?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{student.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.role === 'Student' ? 'bg-gray-100 text-gray-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {student.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700 transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add Student</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Warning if no departments or programs exist */}
            {!hasDeptAndProg ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  {departments.length === 0 && programs.length === 0
                    ? 'Please add a department and a program first before adding students.'
                    : departments.length === 0
                    ? 'Please add a department first.'
                    : 'Please add a program first.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3">
                <input type="text" placeholder="Student Name" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                <input type="text" placeholder="Roll No (e.g. CS2025001)" required value={form.rollNo}
                  onChange={e => setForm({ ...form, rollNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />

                {/* Department Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <select required value={form.departmentId}
                    onChange={e => setForm({ ...form, departmentId: e.target.value, programId: '' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                {/* Program Dropdown — filtered by selected department */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Program</label>
                  <select required value={form.programId}
                    onChange={e => setForm({ ...form, programId: e.target.value })}
                    disabled={!form.departmentId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">{form.departmentId ? 'Select Program' : 'Select a department first'}</option>
                    {filteredPrograms.map(prog => (
                      <option key={prog.id} value={prog.id}>{prog.name} ({prog.code})</option>
                    ))}
                    {form.departmentId && filteredPrograms.length === 0 && (
                      <option value="" disabled>No programs in this department</option>
                    )}
                  </select>
                </div>

                {/* Semester Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Semester</label>
                  <select required value={form.semester}
                    onChange={e => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem.id} value={sem.number}>{sem.number}</option>
                    ))}
                  </select>
                </div>

                {/* Role Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Role / Position</label>
                  <select value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                  <option value="Active">Active</option>
                  <option value="Graduated">Graduated</option>
                </select>

                <button type="submit" disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Student'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAdmission;