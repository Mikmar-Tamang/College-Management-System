import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiShield,
  FiUserCheck,
  FiCheckCircle,
  FiXOctagon,
  FiBell,
  FiSearch,
  FiX,
  FiClock,
  FiCheck,
  FiCornerDownLeft,
} from 'react-icons/fi';
import axios from 'axios';

import SuperAdminDashboard from './SuperAdminDashboard';
import PendingRegistrations from '../home/dashboard/PendingRegistrations';
import ApprovedColleges from './ApprovedColleges';
import BannedColleges from './BannedColleges';
import { useSocket } from '../../hooks/useSocket';

/* ──────────────────────────────────────────────────────────
   TYPE DEFINITIONS
   ────────────────────────────────────────────────────────── */

interface MenuItemType {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.FC<{ onNavigate?: (menuId: string) => void }>;
}

interface MenuGroupType {
  id: string;
  label: string;
  icon: React.ElementType;
  children: MenuItemType[];
}

type SidebarEntry = (MenuItemType & { children?: never }) | MenuGroupType;

/* ──────────────────────────────────────────────────────────
   SIDEBAR MENU
   ────────────────────────────────────────────────────────── */
const sidebarMenu: SidebarEntry[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: FiHome,
    component: SuperAdminDashboard,
  },
  {
    id: 'colleges',
    label: 'Colleges',
    icon: FiShield,
    children: [
      { id: 'pending-registrations', label: 'Pending Registrations', icon: FiUserCheck, component: PendingRegistrations },
      { id: 'approved-colleges', label: 'Approved Colleges', icon: FiCheckCircle, component: ApprovedColleges },
      { id: 'banned-colleges', label: 'Banned Colleges', icon: FiXOctagon, component: BannedColleges },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */
function findComponent(menuId: string): React.FC<{ onNavigate?: (menuId: string) => void }> {
  for (const entry of sidebarMenu) {
    if (!('children' in entry) || !entry.children) {
      if (entry.id === menuId) return (entry as MenuItemType).component;
    } else {
      const child = entry.children.find((c) => c.id === menuId);
      if (child) return child.component;
    }
  }
  return SuperAdminDashboard;
}

function findParentGroupId(menuId: string): string | null {
  for (const entry of sidebarMenu) {
    if ('children' in entry && entry.children) {
      const found = entry.children.some((c) => c.id === menuId);
      if (found) return entry.id;
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════════
   SUPER ADMIN HOME
   ══════════════════════════════════════════════════════════ */
function SuperAdminHome() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openGroups, setOpenGroups] = useState<string[]>(['colleges']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Notifications
  const {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useSocket();

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const navigateTo = (menuId: string) => {
    setActiveMenu(menuId);
    const parentId = findParentGroupId(menuId);
    if (parentId && !openGroups.includes(parentId)) {
      setOpenGroups((prev) => [...prev, parentId]);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
      navigate('/');
    } finally {
      setLogoutLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  const ActiveComponent = findComponent(activeMenu);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">Super Admin</h1>
        </div>

        {/* Right: Notifications */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-purple-600 hover:text-purple-700 font-medium transition">
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={() => { clearAll(); setShowNotifications(false); }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <FiBell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 20).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition hover:bg-gray-50 ${
                          !notification.read ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`bg-white border-r border-gray-200 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto transition-all duration-300 flex flex-col ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          {/* Menu */}
          <nav className={`p-4 flex-1 ${!isSidebarOpen && 'hidden'}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Menu
            </p>

            {sidebarMenu.map((entry) => {
              if (!('children' in entry) || !entry.children) {
                const item = entry as MenuItemType;
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              const group = entry as MenuGroupType;
              const GroupIcon = group.icon;
              const isOpen = openGroups.includes(group.id);
              const hasActiveChild = group.children.some((c) => c.id === activeMenu);

              return (
                <div key={group.id} className="mb-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                      hasActiveChild
                        ? 'text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GroupIcon className="w-4 h-4" />
                      {group.label}
                    </div>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {group.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = activeMenu === child.id;

                      return (
                        <button
                          key={child.id}
                          onClick={() => setActiveMenu(child.id)}
                          className={`w-full flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg text-sm transition ${
                            isChildActive
                              ? 'bg-purple-50 text-purple-700 font-medium'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <ChildIcon className="w-3.5 h-3.5" />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Logout Button at Bottom */}
          <div className={`p-4 border-t border-gray-200 ${!isSidebarOpen && 'hidden'}`}>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50"
            >
              {logoutLoading ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiLogOut className="w-4 h-4" />
              )}
              Logout
            </button>
          </div>
        </aside>

        {/* TOGGLE SIDEBAR */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-full p-1.5 shadow-sm transition-all duration-300"
          style={{
            left: isSidebarOpen ? '248px' : '4px',
            transform: 'translateY(-50%)',
          }}
        >
          {isSidebarOpen ? (
            <FiChevronLeft className="w-4 h-4" />
          ) : (
            <FiChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 p-6 h-[calc(100vh-57px)] overflow-y-auto transition-all duration-300 ${
            !isSidebarOpen && 'ml-6'
          }`}
        >
          <ActiveComponent onNavigate={navigateTo} />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminHome;
