import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiSearch,
  FiUser,
  FiCheck,
  FiEdit,
  FiTrash2,
  FiX,
  FiCornerDownLeft,
  FiClock,
} from 'react-icons/fi';
import type { Notification } from '../../../hooks/useSocket';
import { searchableMenuItems, type SearchableMenuItem } from '../../../config/menuItems';

/* ──────────────────────────────────────────────
   Header Component
   - College name / branding on the left
   - Search bar with suggestions in the center
   - Notification bell + profile avatar on the right
   ────────────────────────────────────────────── */

interface HeaderProps {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onMarkAsRead?: (id: string) => void;
  onNavigate?: (menuId: string) => void;
}

/* ── Recent searches stored in localStorage ── */
const RECENT_SEARCHES_KEY = 'cms-recent-searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function addRecentSearch(menuId: string) {
  const recent = getRecentSearches().filter((id) => id !== menuId);
  recent.unshift(menuId);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function Header({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onClearAll,
  onMarkAsRead,
  onNavigate,
}: HeaderProps) {
  const navigate = useNavigate();

  // ── Notification dropdown state ──
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Search state ──
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());

  /* ── Close dropdowns when clicking outside ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Keyboard shortcut: Ctrl+K or / to focus search ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement === document.body)) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ── Filter menu items by query ── */
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const scored: { item: SearchableMenuItem; score: number }[] = [];

    for (const item of searchableMenuItems) {
      let score = 0;
      const label = item.label.toLowerCase();
      const group = item.group.toLowerCase();

      // Exact label match → highest priority
      if (label === q) {
        score = 100;
      }
      // Label starts with query
      else if (label.startsWith(q)) {
        score = 80;
      }
      // Label contains query
      else if (label.includes(q)) {
        score = 60;
      }
      // Group contains query
      else if (group.includes(q)) {
        score = 40;
      }
      // Keywords match
      else {
        for (const kw of item.keywords) {
          if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) {
            score = 30;
            break;
          }
        }
      }

      // Word-level matching for multi-word queries
      if (score === 0) {
        const queryWords = q.split(/\s+/);
        const matchedWords = queryWords.filter(
          (w) =>
            label.includes(w) ||
            group.includes(w) ||
            item.keywords.some((kw) => kw.toLowerCase().includes(w))
        );
        if (matchedWords.length > 0) {
          score = 20 * (matchedWords.length / queryWords.length);
        }
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
  }, [query]);

  /* ── Recent items (when no query, show recents) ── */
  const recentItems = useMemo(() => {
    return recentSearches
      .map((id) => searchableMenuItems.find((item) => item.id === id))
      .filter(Boolean) as SearchableMenuItem[];
  }, [recentSearches]);

  /* ── Items to display in dropdown ── */
  const displayItems = query.trim() ? filteredItems : recentItems;
  const showDropdown = showSearch && (displayItems.length > 0 || query.trim().length > 0);

  /* ── Handle selecting a search result ── */
  const handleSelect = useCallback(
    (item: SearchableMenuItem) => {
      onNavigate?.(item.id);
      addRecentSearch(item.id);
      setRecentSearches(getRecentSearches());
      setQuery('');
      setShowSearch(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onNavigate]
  );

  /* ── Keyboard navigation in search results ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && displayItems[highlightedIndex]) {
      e.preventDefault();
      handleSelect(displayItems[highlightedIndex]);
    }
  };

  /* ── Highlight matching text in label ── */
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-amber-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ── Notification helpers ── */
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <FiCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'updated': return <FiEdit className="w-3.5 h-3.5 text-blue-500" />;
      case 'deleted': return <FiTrash2 className="w-3.5 h-3.5 text-red-500" />;
      default: return <FiBell className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getActionDotColor = (action: string) => {
    switch (action) {
      case 'created': return 'bg-emerald-400';
      case 'updated': return 'bg-blue-400';
      case 'deleted': return 'bg-red-400';
      default: return 'bg-gray-400';
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

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* ── Left: Logo / Title ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CM</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800 hidden sm:block">College Manager</h1>
      </div>

      {/* ═══════════════════════════════════════════
          CENTER: Search Bar with Suggestions
          ═══════════════════════════════════════════ */}
      <div className="hidden md:block flex-1 max-w-lg mx-8" ref={searchRef}>
        <div className="relative">
          {/* Search Icon */}
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search menus…"
            className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:shadow-md transition"
          />

          {/* Keyboard shortcut hint */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setHighlightedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded">
              Ctrl K
            </kbd>
          </div>

          {/* ── Suggestions Dropdown ── */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              {/* Section Header */}
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {query.trim() ? `Results for "${query}"` : 'Recent Searches'}
                </p>
              </div>

              {/* Results List */}
              <div className="max-h-72 overflow-y-auto">
                {displayItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <FiSearch className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No menus found for "{query}"</p>
                    <p className="text-xs text-gray-300 mt-1">Try searching for "student", "fee", or "department"</p>
                  </div>
                ) : (
                  displayItems.map((item, index) => {
                    const Icon = item.icon;
                    const GroupIcon = item.groupIcon;
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                          isHighlighted
                            ? 'bg-amber-50 border-l-2 border-amber-400'
                            : 'border-l-2 border-transparent hover:bg-gray-50'
                        }`}
                      >
                        {/* Item Icon */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isHighlighted ? 'bg-amber-100' : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${isHighlighted ? 'text-amber-600' : 'text-gray-500'}`}
                          />
                        </div>

                        {/* Label & Group */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isHighlighted ? 'text-amber-700 font-medium' : 'text-gray-700'}`}>
                            {highlightMatch(item.label)}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <GroupIcon className="w-3 h-3 text-gray-400" />
                            <p className="text-[11px] text-gray-400">{item.group}</p>
                          </div>
                        </div>

                        {/* Enter hint for highlighted item / Clock for recents */}
                        {!query.trim() ? (
                          <FiClock className="flex-shrink-0 w-3.5 h-3.5 text-gray-300" />
                        ) : isHighlighted ? (
                          <div className="flex-shrink-0 flex items-center gap-1 text-gray-400">
                            <FiCornerDownLeft className="w-3 h-3" />
                            <span className="text-[10px]">Enter</span>
                          </div>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Hint */}
              {displayItems.length > 0 && (
                <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px]">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px]">↵</kbd>
                      Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px]">Esc</kbd>
                      Close
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Notifications + Profile ── */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
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
              {/* Dropdown Header */}
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
                    <button
                      onClick={() => onMarkAllRead?.()}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium transition"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={() => {
                        onClearAll?.();
                        setShowNotifications(false);
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <FiBell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications yet</p>
                    <p className="text-xs text-gray-300 mt-1">Changes will appear here in real-time</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => onMarkAsRead?.(notification.id)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition hover:bg-gray-50 ${
                        !notification.read ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                        {getActionIcon(notification.action)}
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
                        <div className={`flex-shrink-0 w-2 h-2 ${getActionDotColor(notification.action)} rounded-full mt-2`} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center transition"
        >
          <FiUser className="w-4 h-4 text-amber-700" />
        </button>
      </div>
    </header>
  );
}

export default Header;
