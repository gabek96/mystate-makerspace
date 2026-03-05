import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import './layout.css';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <main className="app-main">
        {children}
      </main>
      <BottomNav currentPath={location.pathname} />
    </div>
  );
}
