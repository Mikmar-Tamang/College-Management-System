import { useState, useEffect } from 'react';
import { FiAward, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Scholarships Page
   - 3 stat cards (total, awarded, available)
   - Search + Add button
   - Table with scholarship data from API
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/scholarships';

interface ScholarshipType {
  id: number;
  name: string;
  amount: number;
  eligibility: string;
  awarded: number;
  status: string;
}

function Scholarships() {
  const [scholarships, setScholarships] = useState<ScholarshipType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', amount: 0, eligibility: '', awarded: 0, status: 'Active' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true });
      setScholarships(res.data.data);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
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
      setForm({ name: '', amount: 0, eligibility: '', awarded: 0, status: 'Active' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create scholarship', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this scholarship?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete scholarship', err);
    }
  };

  const filtered = scholarships.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = scholarships.filter(s => s.status === 'Active').length;
  const totalAwarded = scholarships.reduce((sum, s) => sum + s.awarded, 0);

  /* Format currency */
  const formatAmount = (amt: number) => '₹' + amt.toLocaleString('en-IN');

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
        <h1 className="text-2xl font-bold text-gray-800">Scholarships</h1>
        <p className="text-gray-500 mt-1">Manage scholarship programs and awards.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <FiAward className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{scholarships.length}</p>
              <p className="text-sm text-gray-500">Total Scholarships</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              <p className="text-sm text-gray-500">Active Programs</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">{totalAwarded}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalAwarded}</p>
              <p className="text-sm text-gray-500">Students Awarded</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search scholarships..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
          <FiPlus className="w-4 h-4" />
          Add Scholarship
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Scholarship Name</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Eligibility</th>
              <th className="px-4 py-3 font-medium">Awarded</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No scholarships found.</td>
              </tr>
            ) : (
              filtered.map((sch, index) => (
                <tr key={sch.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{sch.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatAmount(sch.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{sch.eligibility}</td>
                  <td className="px-4 py-3 text-gray-600">{sch.awarded}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sch.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {sch.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(sch.id)} className="text-red-500 hover:text-red-700 transition">
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
              <h2 className="text-lg font-semibold text-gray-800">Add Scholarship</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" placeholder="Scholarship Name" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input type="number" placeholder="Amount" required value={form.amount || ''}
                onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input type="text" placeholder="Eligibility Criteria" required value={form.eligibility}
                onChange={e => setForm({ ...form, eligibility: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <input type="number" placeholder="Students Awarded" value={form.awarded}
                onChange={e => setForm({ ...form, awarded: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
              <button type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add Scholarship'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scholarships;