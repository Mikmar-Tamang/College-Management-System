import type { IconType } from 'react-icons';

// ✅ Types
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  section: string;
  semester: number;
  year: number;
  feeStatus: 'paid' | 'pending' | 'overdue';
  dueAmount?: number;
  paidAmount?: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface SubNavItem {
  id: string;
  label: string;
  icon: IconType;
}

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  section: string;
  subItems?: SubNavItem[];
}