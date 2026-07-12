import { useState, useEffect, useCallback } from 'react';
import { FiCheck, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import type { Notification } from '../../../hooks/useSocket';

interface ToastNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

/* ──────────────────────────────────────────────
   Individual Toast Item
   - Color-coded by action type
   - Auto-dismiss with animated progress bar
   - Manual dismiss via close button
   ────────────────────────────────────────────── */
function ToastItem({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const DURATION = 5000; // 5 seconds

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  }, [notification.id, onDismiss]);

  useEffect(() => {
    // Progress bar animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    // Auto-dismiss timer
    const timeout = setTimeout(handleDismiss, DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [handleDismiss]);

  // Color and icon mapping based on action type
  const actionConfig = {
    created: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      progressColor: 'bg-emerald-500',
      icon: FiCheck,
    },
    updated: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      progressColor: 'bg-blue-500',
      icon: FiEdit,
    },
    deleted: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      progressColor: 'bg-red-500',
      icon: FiTrash2,
    },
  };

  const config = actionConfig[notification.action] || actionConfig.created;
  const Icon = config.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} shadow-lg backdrop-blur-sm transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      style={{
        animation: isExiting ? 'none' : 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        minWidth: '320px',
        maxWidth: '400px',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Action Icon */}
        <div className={`flex-shrink-0 w-9 h-9 ${config.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 capitalize">
            {notification.module} {notification.action}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
          <p className="text-[10px] text-gray-400 mt-1">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/60 transition"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-0.5 bg-gray-200/50 w-full">
        <div
          className={`h-full ${config.progressColor} transition-all duration-100 ease-linear rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Toast Notifications Container
   - Fixed position top-right
   - Stacked toasts with spacing
   ────────────────────────────────────────────── */
export default function ToastNotifications({ notifications, onDismiss }: ToastNotificationsProps) {
  // Only show the 5 most recent unread notifications as toasts
  const visibleToasts = notifications.filter((n) => !n.read).slice(0, 5);

  if (visibleToasts.length === 0) return null;

  return (
    <>
      {/* Keyframe animation injected via style tag */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="fixed top-[70px] right-4 z-50 flex flex-col gap-3">
        {visibleToasts.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </>
  );
}
