import { useState } from 'react';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiDollarSign,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiBookOpen,
  FiCalendar,
  FiGrid,
  FiUserPlus,
  FiAward,
  FiCreditCard,
  FiLogOut,
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import ToastNotifications from './layout/ToastNotifications';
import Dashboard from './dashboard/Dashboard';
import StudentManagement from './dashboard/StudentManagement';
import Department from './dashboard/Department';
import Programs from './dashboard/Program';
import Academicyear from './dashboard/AcademicYear';
import Batches from './dashboard/Batches';
import Semesters from './dashboard/Semesters';
import Scholarships from './dashboard/Scholarships';
import StudentFeePayment from './dashboard/StudentFeePayment';
import { useSocket } from '../../hooks/useSocket';

/* ──────────────────────────────────────────────────────────
   TYPE DEFINITIONS
   - MenuItemType: a single menu item (no children)
   - MenuGroupType: a parent item with children (submenu)
   ────────────────────────────────────────────────────────── */

// A single clickable menu item
interface MenuItemType {
  id: string;        // unique key
  label: string;     // display text
  icon: React.ElementType;  // icon component from react-icons
  component: React.FC<{ onNavigate?: (menuId: string) => void }>;  // which page to render
}

// A group of items (parent + children submenu)
interface MenuGroupType {
  id: string;
  label: string;
  icon: React.ElementType;
  children: MenuItemType[];
}

// A sidebar entry is either a single item or a group
type SidebarEntry = (MenuItemType & { children?: never }) | MenuGroupType;

/* ──────────────────────────────────────────────────────────
   SIDEBAR MENU STRUCTURE (College Admin only)
   ────────────────────────────────────────────────────────── */
const sidebarMenu: SidebarEntry[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: FiHome,
    component: Dashboard,
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: FiBook,
    children: [
      { id: 'department',    label: 'Department',    icon: FiLayers,   component: Department },
      { id: 'program',       label: 'Program',       icon: FiBookOpen, component: Programs },
      { id: 'semesters',     label: 'Semesters',     icon: FiCalendar, component: Semesters },
      { id: 'academic-year', label: 'Academic Year', icon: FiGrid,     component: Academicyear },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    icon: FiUsers,
    children: [
      { id: 'student-management', label: 'Student Management', icon: FiUserPlus, component: StudentManagement },
      { id: 'batches',            label: 'Batches',            icon: FiUsers,    component: Batches },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: FiDollarSign,
    children: [
      { id: 'student-fee-payment', label: 'Fee Payment',  icon: FiCreditCard, component: StudentFeePayment },
      { id: 'scholarships',        label: 'Scholarships', icon: FiAward,      component: Scholarships },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   HELPER: Find the active component from the menu structure
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
  return Dashboard; // fallback
}

/* ──────────────────────────────────────────────────────────
   HELPER: Find the parent group id for a given menu item id
   ────────────────────────────────────────────────────────── */
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
   HOME COMPONENT (College Admin)
   - Renders Header, Sidebar (with submenus), and Main content
   - Logout button at bottom of sidebar
   ══════════════════════════════════════════════════════════ */
function Home() {
  const navigate = useNavigate();

  // Which menu item is currently selected
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Which parent groups are expanded (open)
  const [openGroups, setOpenGroups] = useState<string[]>(['academics']);

  // Sidebar open/collapsed state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Logout loading state
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Socket.IO notifications
  const {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useSocket();

  /* Toggle a parent group open/closed */
  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)  // close it
        : [...prev, groupId]                    // open it
    );
  };

  /* Navigate to a specific menu section (used by Dashboard quick actions) */
  const navigateTo = (menuId: string) => {
    setActiveMenu(menuId);

    // Auto-open the parent group if the target is a child
    const parentId = findParentGroupId(menuId);
    if (parentId && !openGroups.includes(parentId)) {
      setOpenGroups((prev) => [...prev, parentId]);
    }
  };

  /* Logout handler */
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

  /* Get the component to render in the main area */
  const ActiveComponent = findComponent(activeMenu);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Header (with notification props) ── */}
      <Header
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
        onClearAll={clearAll}
        onMarkAsRead={markAsRead}
        onNavigate={navigateTo}
      />

      {/* ── Toast Notifications ── */}
      <ToastNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* ── Body: Sidebar + Main ── */}
      <div className="flex">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           SIDEBAR
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <aside
          className={`bg-white border-r border-gray-200 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto transition-all duration-300 flex flex-col ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          {/* Sidebar menu content */}
          <nav className={`p-4 flex-1 ${!isSidebarOpen && 'hidden'}`}>
            {/* Menu label */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Menu
            </p>

            {/* Loop through each sidebar entry */}
            {sidebarMenu.map((entry) => {
              // ── Case 1: Direct item (no children) ──
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
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              // ── Case 2: Group with children (submenu) ──
              const group = entry as MenuGroupType;
              const GroupIcon = group.icon;
              const isOpen = openGroups.includes(group.id);

              // Check if any child is the active menu
              const hasActiveChild = group.children.some((c) => c.id === activeMenu);

              return (
                <div key={group.id} className="mb-1">
                  {/* Parent button — toggles the submenu */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                      hasActiveChild
                        ? 'text-amber-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GroupIcon className="w-4 h-4" />
                      {group.label}
                    </div>
                    {/* Arrow rotates when open */}
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Children — shown only when group is open */}
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
                              ? 'bg-amber-50 text-amber-700 font-medium'
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

          {/* ── Logout Button at Bottom ── */}
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

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           TOGGLE SIDEBAR BUTTON
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           MAIN CONTENT AREA
           Renders the active dashboard page
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

export default Home;