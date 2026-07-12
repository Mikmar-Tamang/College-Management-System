import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiBookOpen, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Programs Page
   - 3 stat cards (total, UG, PG)
   - Search bar + Add button
   - Table with programs from API
   - Department dropdown populated from API
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/programs';
const DEPT_API = import.meta.env.VITE_API_URL + '/api/departments';

interface DepartmentType {
  id: number;
  name: string;
}

interface ProgramType {
  id: number;
  name: string;
  code: string;
  duration: string;
  departmentId: number;
  department: DepartmentType | null;
  type: string;
}

function Programs() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', duration: '', departmentId: '', type: 'UG' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [progRes, deptRes] = await Promise.all([
        axios.get(API, { withCredentials: true }),
        axios.get(DEPT_API, { withCredentials: true }),
      ]);
      setPrograms(progRes.data.data);
      setDepartments(deptRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, { ...form, departmentId: Number(form.departmentId) }, { withCredentials: true });
      setForm({ name: '', code: '', duration: '', departmentId: '', type: 'UG' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create program', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this program?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete program', err);
    }
  };

  /* Filter programs by name or code */
  const filtered = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const ugCount = programs.filter(p => p.type === 'UG').length;
  const pgCount = programs.filter(p => p.type === 'PG').length;

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
        <h1 className="text-2xl font-bold text-gray-800">Programs</h1>
        <p className="text-gray-500 mt-1">View and manage all academic programs.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiBookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{programs.length}</p>
              <p className="text-sm text-gray-500">Total Programs</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">UG</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{ugCount}</p>
              <p className="text-sm text-gray-500">Undergraduate</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">PG</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pgCount}</p>
              <p className="text-sm text-gray-500">Postgraduate</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add Button ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search programs..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
          <FiPlus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Program Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No programs found.</td>
              </tr>
            ) : (
              filtered.map((prog, index) => (
                <tr key={prog.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{prog.name}</td>
                  <td className="px-4 py-3 text-gray-600">{prog.code}</td>
                  <td className="px-4 py-3 text-gray-600">{prog.duration}</td>
                  <td className="px-4 py-3 text-gray-600">{prog.department?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prog.type === 'UG' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {prog.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(prog.id)} className="text-red-500 hover:text-red-700 transition">
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add Program</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Warning if no departments exist */}
            {departments.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">Please add a department first before creating a program.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3">
                <input type="text" placeholder="Program Name" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                <input type="text" placeholder="Code (e.g. BTCS)" required value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                <input type="text" placeholder="Duration (e.g. 4 Years)" required value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />

                {/* Department Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <select required value={form.departmentId}
                    onChange={e => setForm({ ...form, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
                <button type="submit" disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Program'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Programs;