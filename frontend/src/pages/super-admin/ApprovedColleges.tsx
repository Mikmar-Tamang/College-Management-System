import { useState, useEffect } from 'react';
import { FiEye, FiSlash, FiSearch, FiUser, FiMail, FiMapPin, FiHash, FiPhone } from 'react-icons/fi';
import axios from 'axios';
import CollegeDetails from './CollegeDetails';

const BASE = import.meta.env.VITE_API_URL;

interface CollegeAdmin {
  id: number;
  admin_name: string;
  email: string;
  phone_number: string;
  collegeName: string;
  collegeCode: string;
  collegeAddress: string;
  collegeEmail: string;
  collegePhoneNumber: string;
  isApproved: boolean;
  isBanned: boolean;
  createdAt: string;
}

function ApprovedColleges() {
  const [colleges, setColleges] = useState<CollegeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/api/admin/colleges`, { withCredentials: true });
      setColleges(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleBan = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to ban ${name}? They will no longer be able to access the system.`)) {
      return;
    }
    try {
      setActionLoading(id);
      setError('');
      await axios.put(`${BASE}/api/admin/colleges/${id}/ban`, {}, { withCredentials: true });
      setColleges((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg(`${name} has been banned successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to ban college');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredColleges = colleges.filter((college) => {
    const q = search.toLowerCase();
    return (
      college.collegeName?.toLowerCase().includes(q) ||
      college.collegeCode?.toLowerCase().includes(q) ||
      college.admin_name?.toLowerCase().includes(q) ||
      college.collegeEmail?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // If a college is selected, show its details
  if (selectedCollegeId !== null) {
    return (
      <CollegeDetails
        collegeId={selectedCollegeId}
        onBack={() => setSelectedCollegeId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading approved colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Approved Colleges</h1>
          <p className="text-gray-500 text-sm mt-1">
            All active colleges currently on the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition w-64"
            />
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            {filteredColleges.length} Active
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{successMsg}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {filteredColleges.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Colleges Found</h3>
          <p className="text-gray-500 text-sm">
            {search ? `No colleges match "${search}"` : 'No approved colleges yet.'}
          </p>
        </div>
      )}

      {/* College Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredColleges.map((college) => (
          <div
            key={college.id}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                  {(college.collegeName || 'C')
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{college.collegeName}</h3>
                  <p className="text-xs text-gray-400">Since {formatDate(college.createdAt)}</p>
                </div>
              </div>
              <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FiHash className="w-3.5 h-3.5 text-gray-400" />
                {college.collegeCode}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiMail className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{college.collegeEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                {college.collegePhoneNumber}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{college.collegeAddress}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedCollegeId(college.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <FiEye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => handleBan(college.id, college.collegeName)}
                disabled={actionLoading === college.id}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition border border-red-200 disabled:opacity-50"
              >
                {actionLoading === college.id ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSlash className="w-4 h-4" />
                )}
                Ban
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApprovedColleges;
