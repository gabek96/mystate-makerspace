import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'makerspace', title: 'Your print is complete! 🎉', body: 'Ultimaker S5 — gear_housing_v3 finished. Pick up from Room 1230, Bay B.', time: 'now', read: false },
    { id: 2, type: 'makerspace', title: 'Reservation reminder', body: 'Epilog Fusion Pro 32 reserved for 3:00 PM. Don\'t forget your materials!', time: '15m ago', read: false },
    { id: 3, type: 'cyride', title: 'Orange Route delayed', body: 'Expect 5 min delays on Orange Route due to road work near Friley.', time: '1h ago', read: true }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API refresh delay
    await new Promise(r => setTimeout(r, 1200));
    setIsRefreshing(false);
  }, []);

  return (
    <AppContext.Provider value={{
      notifications, unreadCount, markRead, markAllRead,
      searchQuery, setSearchQuery,
      isRefreshing, triggerRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
