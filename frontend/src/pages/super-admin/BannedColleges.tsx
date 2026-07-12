import { useState, useEffect } from 'react';
import { FiCheckCircle, FiSearch, FiXOctagon, FiMail, FiMapPin, FiHash, FiPhone, FiUser } from 'react-icons/fi';
import axios from 'axios';

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
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

function BannedColleges() {
  const [colleges, setColleges] = useState<CollegeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBannedColleges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/api/admin/colleges/banned`, { withCredentials: true });
      setColleges(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load banned colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedColleges();
  }, []);

  const handleUnban = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to unban ${name}? They will be able to access the system again.`)) {
      return;
    }
    try {
      setActionLoading(id);
      setError('');
      await axios.put(`${BASE}/api/admin/colleges/${id}/unban`, {}, { withCredentials: true });
      setColleges((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg(`${name} has been unbanned successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unban college');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading banned colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banned Colleges</h1>
          <p className="text-gray-500 text-sm mt-1">
            Colleges that have been banned from the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/20 transition w-64"
            />
          </div>
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
            {filteredColleges.length} Banned
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm flex items-center gap-2">
            <FiCheckCircle /> {successMsg}
          </p>
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
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Banned Colleges</h3>
          <p className="text-gray-500 text-sm">
            {search ? `No banned colleges match "${search}"` : 'All colleges are currently active.'}
          </p>
        </div>
      )}

      {/* College Cards */}
      <div className="space-y-4">
        {filteredColleges.map((college) => (
          <div
            key={college.id}
            className="bg-white border border-red-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* College Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-lg">
                  <FiXOctagon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-800">{college.collegeName}</h3>
                    <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">Banned</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiUser className="w-3 h-3" /> {college.admin_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiHash className="w-3 h-3" /> {college.collegeCode}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiMail className="w-3 h-3" /> <span className="truncate">{college.collegeEmail}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiPhone className="w-3 h-3" /> {college.collegePhoneNumber}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
                      <FiMapPin className="w-3 h-3" /> {college.collegeAddress}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Banned on {formatDate(college.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Unban Button */}
              <button
                onClick={() => handleUnban(college.id, college.collegeName)}
                disabled={actionLoading === college.id}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {actionLoading === college.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
                Unban
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BannedColleges;
