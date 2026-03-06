import { useNavigate } from 'react-router-dom';
import './home.css';

export default function CyRideWidget({ routes }) {
  const navigate = useNavigate();
  if (!routes?.length) return null;

  // Pick the first stop from each active route and show next arrival
  const items = routes
    .filter(r => r.status === 'active')
    .slice(0, 4)
    .map(r => {
      const stop = r.stops?.[0];
      const nextArrival = stop?.arrivals?.[0];
      return { ...r, nearestStop: stop?.name, nextArrival };
    });

  if (!items.length) return null;

  return (
    <div className="widget-card animate-in" onClick={() => navigate('/cyride')} style={{ cursor: 'pointer' }}>
      {items.map(r => (
        <div className="cyride-item" key={r.id}>
          <div className="route-badge" style={{ background: r.color }}>{r.number}</div>
          <div className="cyride-info">
            <div className="cyride-route">{r.name}</div>
            <div className="cyride-stop">{r.nearestStop} · {r.frequency}</div>
          </div>
          <div className="cyride-time">{r.nextArrival || '—'}</div>
        </div>
      ))}
      <div className="dining-more">View all routes →</div>
    </div>
  );
}
