import { useState, useEffect } from 'react';
import { FiDollarSign, FiSearch, FiAlertCircle, FiPlus, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

/* ──────────────────────────────────────────────
   Student Fee Payment Page
   - 3 stat cards (collected, pending, overdue)
   - Search bar + Add button
   - Table with fee payment data from API
   - Student dropdown, fee type (Monthly/Semester)
   ────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL + '/api/fee-payments';
const STUDENT_API = import.meta.env.VITE_API_URL + '/api/students';
const SEM_API = import.meta.env.VITE_API_URL + '/api/semesters';

interface StudentOption {
  id: number;
  name: string;
  rollNo: string;
}

interface SemesterOption {
  id: number;
  number: string;
}

interface PaymentType {
  id: number;
  studentId: number;
  student: StudentOption | null;
  amount: number;
  feeType: string;
  semester: string | null;
  month: string | null;
  description: string | null;
  dueDate: string;
  paidDate: string | null;
  status: string;
}

function StudentFeePayment() {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    studentId: '', amount: 0, feeType: 'Semester', semester: '', month: '',
    description: '', dueDate: '', paidDate: '', status: 'Pending'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [payRes, stuRes, semRes] = await Promise.all([
        axios.get(API, { withCredentials: true }),
        axios.get(STUDENT_API, { withCredentials: true }),
        axios.get(SEM_API, { withCredentials: true }),
      ]);
      setPayments(payRes.data.data);
      setStudents(stuRes.data.data);
      setSemesters(semRes.data.data);
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
      const payload = {
        studentId: Number(form.studentId),
        amount: form.amount,
        feeType: form.feeType,
        semester: form.feeType === 'Semester' ? form.semester : null,
        month: form.feeType === 'Monthly' ? form.month : null,
        description: form.description || null,
        dueDate: form.dueDate,
        paidDate: form.paidDate || null,
        status: form.status,
      };
      await axios.post(API, payload, { withCredentials: true });
      setForm({ studentId: '', amount: 0, feeType: 'Semester', semester: '', month: '', description: '', dueDate: '', paidDate: '', status: 'Pending' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create fee payment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment record?')) return;
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete fee payment', err);
    }
  };

  const filtered = payments.filter((p) =>
    (p.student?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.student?.rollNo || '').toLowerCase().includes(search.toLowerCase())
  );

  /* Calculate totals */
  const paidTotal    = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingTotal = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueTotal = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  /* Format currency */
  const formatAmount = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  /* Status badge color */
  const statusStyle = (status: string) => {
    if (status === 'Paid')    return 'bg-green-50 text-green-600';
    if (status === 'Pending') return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-600'; // Overdue
  };

  /* Fee type badge */
  const feeTypeBadge = (type: string) => {
    return type === 'Monthly' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600';
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
        <h1 className="text-2xl font-bold text-gray-800">Student Fee Payment</h1>
        <p className="text-gray-500 mt-1">Track and manage student fee payments — monthly or per semester.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{formatAmount(paidTotal)}</p>
              <p className="text-sm text-gray-500">Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{formatAmount(pendingTotal)}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{formatAmount(overdueTotal)}</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Add ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by student name or roll no..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition">
          <FiPlus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Fee Type</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Paid Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">No payments found.</td>
              </tr>
            ) : (
              filtered.map((pay, index) => (
                <tr key={pay.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{pay.student?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{pay.student?.rollNo || ''}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatAmount(pay.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${feeTypeBadge(pay.feeType)}`}>
                      {pay.feeType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {pay.feeType === 'Semester' ? pay.semester || '—' : pay.month || '—'}
                    {pay.description && <div className="text-xs text-gray-400">{pay.description}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{pay.dueDate}</td>
                  <td className="px-4 py-3 text-gray-600">{pay.paidDate || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(pay.status)}`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(pay.id)} className="text-red-500 hover:text-red-700 transition">
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
              <h2 className="text-lg font-semibold text-gray-800">Add Fee Payment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Warning if no students exist */}
            {students.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">Please add students first before creating fee payments.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-3">
                {/* Student Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Student</label>
                  <select required value={form.studentId}
                    onChange={e => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    <option value="">Select Student</option>
                    {students.map(stu => (
                      <option key={stu.id} value={stu.id}>{stu.name} ({stu.rollNo})</option>
                    ))}
                  </select>
                </div>

                <input type="number" placeholder="Amount" required value={form.amount || ''}
                  onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />

                {/* Fee Type */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fee Type</label>
                  <select value={form.feeType}
                    onChange={e => setForm({ ...form, feeType: e.target.value, semester: '', month: '' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                    <option value="Semester">Semester</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                {/* Semester or Month based on feeType */}
                {form.feeType === 'Semester' ? (
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
                ) : (
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Month</label>
                    <input type="month" required value={form.month}
                      onChange={e => setForm({ ...form, month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                )}

                {/* Description */}
                <input type="text" placeholder="Description (e.g. Tuition Fee, Lab Fee)" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />

                <div>
                  <label className="text-xs text-gray-500">Due Date</label>
                  <input type="date" required value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Paid Date (leave empty if unpaid)</label>
                  <input type="date" value={form.paidDate}
                    onChange={e => setForm({ ...form, paidDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <button type="submit" disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Payment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentFeePayment;