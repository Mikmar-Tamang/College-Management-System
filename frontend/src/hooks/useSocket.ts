import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Notification {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'registration';
  module: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Custom hook that connects to the backend Socket.IO server,
 * listens for 'db-change' and 'new-registration' events,
 * and maintains a notification list.
 */
export function useSocket() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('db-change', (payload: { action: string; module: string; data: unknown }) => {
      const actionVerbs: Record<string, string> = {
        created: 'added',
        updated: 'updated',
        deleted: 'removed',
      };

      const verb = actionVerbs[payload.action] || payload.action;
      const message = `${payload.module} ${verb} successfully`;

      const notification: Notification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        action: payload.action as Notification['action'],
        module: payload.module,
        message,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // keep last 50
    });

    // Listen for new college registration notifications
    socket.on('new-registration', (payload: { 
      id: number;
      admin_name: string;
      collegeName: string;
      message: string;
      timestamp: string | Date;
    }) => {
      const notification: Notification = {
        id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        action: 'registration',
        module: 'Registration',
        message: payload.message || `New college registration: ${payload.collegeName} by ${payload.admin_name}`,
        timestamp: new Date(payload.timestamp),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
