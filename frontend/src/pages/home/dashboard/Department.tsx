import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiLayers, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Department Page
   - 3 stat cards (total, active, inactive)
   - Search bar + Add button
   - Table showing departments from API
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/departments';

interface DepartmentType {
  id: number;
  name: string;
  hod: string;
  students: number;
  status: string;
}

function Department() {
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', hod: '', students: 0, status: 'Active' });
  const [submitting, setSubmitting] = useState(false);

  /* Fetch departments on mount */
  const fetchData = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true });
      setDepartments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* Create department */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, form, { withCredentials: true });
      setForm({ name: '', hod: '', students: 0, status: 'Active' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create department', err);
    } finally {
      setSubmitting(false);
    }
  };

  /* Delete department */
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this department?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete department', err);
    }
  };

  /* Filter departments based on search */
  const filtered = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  /* Count active / inactive */
  const activeCount   = departments.filter(d => d.status === 'Active').length;
  const inactiveCount = departments.filter(d => d.status === 'Inactive').length;

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
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <p className="text-gray-500 mt-1">Manage all departments in your college.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FiLayers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
              <p className="text-sm text-gray-500">Total Departments</p>
            </div>
          </div>
        </div>
        {/* Active */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        {/* Inactive */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{inactiveCount}</p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add Button ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <FiPlus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Department Name</th>
              <th className="px-4 py-3 font-medium">HOD</th>
              <th className="px-4 py-3 font-medium">Students</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No departments found.</td>
              </tr>
            ) : (
              filtered.map((dept, index) => (
                <tr key={dept.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{dept.name}</td>
                  <td className="px-4 py-3 text-gray-600">{dept.hod}</td>
                  <td className="px-4 py-3 text-gray-600">{dept.students}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dept.status === 'Active'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 transition">
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
              <h2 className="text-lg font-semibold text-gray-800">Add Department</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" placeholder="Department Name" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input type="text" placeholder="HOD Name" required value={form.hod}
                onChange={e => setForm({ ...form, hod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input type="number" placeholder="Number of Students" value={form.students}
                onChange={e => setForm({ ...form, students: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Department;