import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Semesters Page
   - Stat cards (total, current, upcoming)
   - Search + Add button
   - Table with semester data from API
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/semesters';

interface SemesterType {
  id: number;
  number: string;
  startDate: string;
  endDate: string;
  status: string;
}

function Semesters() {
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ number: '', startDate: '', endDate: '', status: 'Upcoming' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true });
      setSemesters(res.data.data);
    } catch (err) {
      console.error('Failed to fetch semesters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, form, { withCredentials: true });
      setForm({ number: '', startDate: '', endDate: '', status: 'Upcoming' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create semester', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this semester?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete semester', err);
    }
  };

  const filtered = semesters.filter((s) =>
    s.number.toLowerCase().includes(search.toLowerCase())
  );

  /* Helper: pick badge color based on status */
  const statusStyle = (status: string) => {
    if (status === 'Current')   return 'bg-green-50 text-green-600';
    if (status === 'Completed') return 'bg-gray-100 text-gray-500';
    return 'bg-amber-50 text-amber-600'; // Upcoming
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Semesters</h1>
        <p className="text-gray-500 mt-1">View and manage academic semesters.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{semesters.length}</p>
              <p className="text-sm text-gray-500">Total Semesters</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {semesters.filter(s => s.status === 'Current').length}
              </p>
              <p className="text-sm text-gray-500">Current</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {semesters.filter(s => s.status === 'Upcoming').length}
              </p>
              <p className="text-sm text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search semesters..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
          <FiPlus className="w-4 h-4" />
          Add Semester
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Semester</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">End Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No semesters found.</td>
              </tr>
            ) : (
              filtered.map((sem, index) => (
                <tr key={sem.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{sem.number}</td>
                  <td className="px-4 py-3 text-gray-600">{sem.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{sem.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(sem.status)}`}>
                      {sem.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(sem.id)} className="text-red-500 hover:text-red-700 transition">
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
              <h2 className="text-lg font-semibold text-gray-800">Add Semester</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" placeholder="Semester (e.g. 1st Semester)" required value={form.number}
                onChange={e => setForm({ ...form, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <div>
                <label className="text-xs text-gray-500">Start Date</label>
                <input type="date" required value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500">End Date</label>
                <input type="date" required value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                <option value="Upcoming">Upcoming</option>
                <option value="Current">Current</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add Semester'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Semesters;