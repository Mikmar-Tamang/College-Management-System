import { useState, useEffect } from 'react';
import { FiUsers, FiBookOpen, FiLayers, FiDollarSign, FiArrowUpRight } from 'react-icons/fi';
import axios from 'axios';


const BASE = import.meta.env.VITE_API_URL;

interface DashboardProps {
  onNavigate?: (menuId: string) => void;
}

const quickLinks = [
  { label: 'Add New Student',       description: 'Register a new student into the system', menuId: 'student-management' },
  { label: 'Create Department',     description: 'Add a new department to your college',   menuId: 'department' },
  { label: 'Fee Collection',        description: 'Record and track student fee payments',  menuId: 'student-fee-payment' },
  { label: 'View Scholarships',     description: 'Manage available scholarships',           menuId: 'scholarships' },
];

function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    students: 0,
    departments: 0,
    programs: 0,
    feeCollected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, deptsRes, progsRes, feesRes] = await Promise.all([
          axios.get(`${BASE}/api/students`, { withCredentials: true }),
          axios.get(`${BASE}/api/departments`, { withCredentials: true }),
          axios.get(`${BASE}/api/programs`, { withCredentials: true }),
          axios.get(`${BASE}/api/fee-payments`, { withCredentials: true }),
        ]);

        const feeCollected = (feesRes.data.data || [])
          .filter((p: { status: string }) => p.status === 'Paid')
          .reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

        setStats({
          students: (studentsRes.data.data || []).length,
          departments: (deptsRes.data.data || []).length,
          programs: (progsRes.data.data || []).length,
          feeCollected,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatAmount = (amt: number) => {
    if (amt >= 100000) return '₹' + (amt / 100000).toFixed(1) + 'L';
    if (amt >= 1000) return '₹' + (amt / 1000).toFixed(1) + 'K';
    return '₹' + amt.toLocaleString('en-IN');
  };

  const statCards = [
    { label: 'Total Students',   value: loading ? '...' : stats.students.toLocaleString(),      icon: FiUsers,      lightBg: 'bg-blue-50',   textColor: 'text-blue-600' },
    { label: 'Departments',      value: loading ? '...' : String(stats.departments),             icon: FiLayers,     lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Programs',         value: loading ? '...' : String(stats.programs),                icon: FiBookOpen,   lightBg: 'bg-green-50',  textColor: 'text-green-600' },
    { label: 'Fee Collected',    value: loading ? '...' : formatAmount(stats.feeCollected),      icon: FiDollarSign, lightBg: 'bg-amber-50',  textColor: 'text-amber-600' },
  ];

  return (
    <div>
      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon; // store icon component in a variable
          return (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              {/* Icon circle */}
              <div className={`w-10 h-10 ${stat.lightBg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              {/* Value & Label */}
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Links ── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <div
              key={link.label}
              onClick={() => onNavigate?.(link.menuId)}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-amber-300 hover:shadow-sm transition group"
            >
              <div>
                <p className="font-medium text-gray-800">{link.label}</p>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </div>
              <FiArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;