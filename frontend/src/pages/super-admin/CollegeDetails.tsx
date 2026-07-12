import { useState, useEffect } from 'react';
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiUser,
  FiLayers,
  FiBookOpen,
  FiUsers,
  FiDollarSign,
} from 'react-icons/fi';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL;

interface CollegeDetailsProps {
  collegeId: number;
  onBack: () => void;
}

interface CollegeData {
  college: {
    id: number;
    admin_name: string;
    email: string;
    phone_number: string;
    collegeName: string;
    collegeCode: string;
    collegeAddress: string;
    collegeEmail: string;
    collegePhoneNumber: string;
    isVerified: boolean;
    isApproved: boolean;
    isBanned: boolean;
    createdAt: string;
  };
  stats: {
    totalDepartments: number;
    totalPrograms: number;
    totalStudents: number;
    totalFeeCollected: number;
    totalFeePending: number;
    departments: any[];
    programs: any[];
  };
}

function CollegeDetails({ collegeId, onBack }: CollegeDetailsProps) {
  const [data, setData] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE}/api/admin/colleges/${collegeId}/details`, { withCredentials: true });
        setData(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load college details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [collegeId]);

  const formatAmount = (amt: number) => {
    if (amt >= 100000) return '₹' + (amt / 100000).toFixed(1) + 'L';
    if (amt >= 1000) return '₹' + (amt / 1000).toFixed(1) + 'K';
    return '₹' + amt.toLocaleString('en-IN');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error || 'Something went wrong'}</p>
        <button onClick={onBack} className="text-amber-600 hover:text-amber-700 font-medium text-sm">
          ← Go Back
        </button>
      </div>
    );
  }

  const { college, stats } = data;

  const statCards = [
    { label: 'Departments', value: stats.totalDepartments, icon: FiLayers, lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Programs', value: stats.totalPrograms, icon: FiBookOpen, lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Students', value: stats.totalStudents, icon: FiUsers, lightBg: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Fee Collected', value: formatAmount(stats.totalFeeCollected), icon: FiDollarSign, lightBg: 'bg-amber-50', textColor: 'text-amber-600' },
  ];

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 text-sm font-medium transition"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Colleges
      </button>

      {/* College Header */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 font-bold text-xl flex-shrink-0">
            {(college.collegeName || 'C')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{college.collegeName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                college.isBanned
                  ? 'bg-red-50 text-red-600'
                  : college.isApproved
                  ? 'bg-green-50 text-green-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {college.isBanned ? 'Banned' : college.isApproved ? 'Active' : 'Pending'}
              </span>
              <span className="text-xs text-gray-400">Member since {formatDate(college.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className={`w-9 h-9 ${stat.lightBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${stat.textColor}`} />
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* College Information */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">College Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiHash className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">College Code</p>
                <p className="text-sm font-medium text-gray-700">{college.collegeCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">College Email</p>
                <p className="text-sm font-medium text-gray-700">{college.collegeEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">College Phone</p>
                <p className="text-sm font-medium text-gray-700">{college.collegePhoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-700">{college.collegeAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Information */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">Admin Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Admin Name</p>
                <p className="text-sm font-medium text-gray-700">{college.admin_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Admin Email</p>
                <p className="text-sm font-medium text-gray-700">{college.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Admin Phone</p>
                <p className="text-sm font-medium text-gray-700">{college.phone_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Summary */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">Finance Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium">Total Fee Collected</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatAmount(stats.totalFeeCollected)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-xs text-amber-600 font-medium">Total Fee Pending</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{formatAmount(stats.totalFeePending)}</p>
          </div>
        </div>
      </div>

      {/* Departments List */}
      {stats.departments.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">
            Departments ({stats.departments.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.departments.map((dept: any) => (
              <div key={dept.id} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">{dept.name}</p>
                {dept.code && <p className="text-xs text-gray-400 mt-0.5">{dept.code}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Programs List */}
      {stats.programs.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">
            Programs ({stats.programs.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.programs.map((prog: any) => (
              <div key={prog.id} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">{prog.name}</p>
                {prog.code && <p className="text-xs text-gray-400 mt-0.5">{prog.code}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeDetails;
