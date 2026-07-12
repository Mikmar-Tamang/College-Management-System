import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiUser, FiMail, FiPhone, FiMapPin, FiHash } from 'react-icons/fi';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL;

interface PendingAdmin {
  id: number;
  admin_name: string;
  email: string;
  phone_number: string;
  collegeName: string;
  collegeCode: string;
  collegeAddress: string;
  collegeEmail: string;
  collegePhoneNumber: string;
  createdAt: string;
}

function PendingRegistrations() {
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/api/admin/pending`, { withCredentials: true });
      setPendingAdmins(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load pending registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number, name: string) => {
    try {
      setActionLoading(id);
      setError('');
      await axios.put(`${BASE}/api/admin/approve/${id}`, {}, { withCredentials: true });
      setPendingAdmins((prev) => prev.filter((a) => a.id !== id));
      setSuccessMsg(`${name} has been approved successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve admin');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to reject ${name}'s registration? This will permanently delete their account.`)) {
      return;
    }
    try {
      setActionLoading(id);
      setError('');
      await axios.delete(`${BASE}/api/admin/reject/${id}`, { withCredentials: true });
      setPendingAdmins((prev) => prev.filter((a) => a.id !== id));
      setSuccessMsg(`${name}'s registration has been rejected.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject admin');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading pending registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Registrations</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and approve college admin registration requests
          </p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
          {pendingAdmins.length} Pending
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm flex items-center gap-2">
            <FiCheckCircle />
            {successMsg}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {pendingAdmins.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 text-sm">No pending registration requests at the moment.</p>
        </div>
      )}

      {/* Registration Cards */}
      <div className="space-y-4">
        {pendingAdmins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Admin Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                    {admin.admin_name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{admin.admin_name}</h3>
                    <p className="text-xs text-gray-400">Applied {formatDate(admin.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Info</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail className="w-3.5 h-3.5 text-gray-400" />
                      {admin.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                      {admin.phone_number}
                    </div>
                  </div>

                  {/* College Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">College Info</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiUser className="w-3.5 h-3.5 text-gray-400" />
                      {admin.collegeName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiHash className="w-3.5 h-3.5 text-gray-400" />
                      {admin.collegeCode}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail className="w-3.5 h-3.5 text-gray-400" />
                      {admin.collegeEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                      {admin.collegePhoneNumber}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                      {admin.collegeAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-3 lg:min-w-[140px]">
                <button
                  onClick={() => handleApprove(admin.id, admin.admin_name)}
                  disabled={actionLoading === admin.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === admin.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiCheckCircle className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(admin.id, admin.admin_name)}
                  disabled={actionLoading === admin.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg font-medium text-sm transition border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiXCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingRegistrations;
