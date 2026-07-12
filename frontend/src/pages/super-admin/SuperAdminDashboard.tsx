import { useState, useEffect } from 'react';
import { FiUsers, FiCheckCircle, FiXOctagon, FiClock, FiArrowUpRight } from 'react-icons/fi';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL;

interface SuperAdminDashboardProps {
  onNavigate?: (menuId: string) => void;
}

function SuperAdminDashboard({ onNavigate }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState({
    totalColleges: 0,
    activeColleges: 0,
    bannedColleges: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE}/api/admin/dashboard-stats`, { withCredentials: true });
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Colleges', 
      value: loading ? '...' : stats.totalColleges.toString(), 
      icon: FiUsers, 
      lightBg: 'bg-blue-50', 
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    { 
      label: 'Active Colleges', 
      value: loading ? '...' : stats.activeColleges.toString(), 
      icon: FiCheckCircle, 
      lightBg: 'bg-green-50', 
      textColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    { 
      label: 'Banned Colleges', 
      value: loading ? '...' : stats.bannedColleges.toString(), 
      icon: FiXOctagon, 
      lightBg: 'bg-red-50', 
      textColor: 'text-red-600',
      borderColor: 'border-red-100',
    },
    { 
      label: 'Pending Approvals', 
      value: loading ? '...' : stats.pendingApprovals.toString(), 
      icon: FiClock, 
      lightBg: 'bg-amber-50', 
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
  ];

  const quickActions = [
    { 
      label: 'Review Pending Registrations', 
      description: 'Approve or decline new college admin registrations', 
      menuId: 'pending-registrations',
      urgent: stats.pendingApprovals > 0,
    },
    { 
      label: 'View All Colleges', 
      description: 'Browse approved colleges and view their details', 
      menuId: 'approved-colleges',
    },
    { 
      label: 'Manage Banned Colleges', 
      description: 'Review and unban previously banned colleges', 
      menuId: 'banned-colleges',
    },
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Super Admin. Here's what's happening across all colleges.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white border ${stat.borderColor} rounded-xl p-5 shadow-sm hover:shadow-md transition`}>
              <div className={`w-10 h-10 ${stat.lightBg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.label}
              onClick={() => onNavigate?.(action.menuId)}
              className={`relative flex items-center justify-between bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md transition group ${
                action.urgent ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100 hover:border-amber-300'
              }`}
            >
              {action.urgent && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {stats.pendingApprovals} New
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">{action.label}</p>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
              <FiArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
