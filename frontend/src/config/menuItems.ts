import {
  FiHome,
  FiBook,
  FiUsers,
  FiDollarSign,
  FiLayers,
  FiBookOpen,
  FiCalendar,
  FiGrid,
  FiUserPlus,
  FiAward,
  FiCreditCard,
} from 'react-icons/fi';

/* ──────────────────────────────────────────────────────────
   Searchable menu item — flat list used by the header search
   Each item has an id, label, icon, parent group name,
   and optional keywords for better fuzzy matching
   ────────────────────────────────────────────────────────── */
export interface SearchableMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  group: string;           // parent group label (e.g. "Academics")
  groupIcon: React.ElementType;
  keywords: string[];      // extra terms to improve search matching
}

/**
 * Flat list of all navigable menu items for search.
 * Keywords include common synonyms and related terms
 * so typing "fee" finds "Fee Payment", "student" finds
 * both "Student Management" and "Fee Payment", etc.
 */
export const searchableMenuItems: SearchableMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: FiHome,
    group: 'Main',
    groupIcon: FiHome,
    keywords: ['home', 'overview', 'stats', 'welcome', 'main'],
  },
  {
    id: 'department',
    label: 'Department',
    icon: FiLayers,
    group: 'Academics',
    groupIcon: FiBook,
    keywords: ['dept', 'departments', 'faculty', 'create department', 'add department'],
  },
  {
    id: 'program',
    label: 'Program',
    icon: FiBookOpen,
    group: 'Academics',
    groupIcon: FiBook,
    keywords: ['programs', 'course', 'courses', 'degree', 'curriculum'],
  },
  {
    id: 'semesters',
    label: 'Semesters',
    icon: FiCalendar,
    group: 'Academics',
    groupIcon: FiBook,
    keywords: ['semester', 'term', 'terms', 'period'],
  },
  {
    id: 'academic-year',
    label: 'Academic Year',
    icon: FiGrid,
    group: 'Academics',
    groupIcon: FiBook,
    keywords: ['year', 'session', 'academic', 'calendar year'],
  },
  {
    id: 'student-management',
    label: 'Student Management',
    icon: FiUserPlus,
    group: 'Students',
    groupIcon: FiUsers,
    keywords: ['students', 'add student', 'register', 'enroll', 'admission', 'manage students'],
  },
  {
    id: 'batches',
    label: 'Batches',
    icon: FiUsers,
    group: 'Students',
    groupIcon: FiUsers,
    keywords: ['batch', 'group', 'cohort', 'class', 'section'],
  },
  {
    id: 'student-fee-payment',
    label: 'Fee Payment',
    icon: FiCreditCard,
    group: 'Finance',
    groupIcon: FiDollarSign,
    keywords: ['fee', 'fees', 'payment', 'pay', 'tuition', 'collection', 'billing', 'student fee'],
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    icon: FiAward,
    group: 'Finance',
    groupIcon: FiDollarSign,
    keywords: ['scholarship', 'award', 'grant', 'financial aid', 'merit', 'stipend'],
  },
];
