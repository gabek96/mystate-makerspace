import { useNavigate } from 'react-router-dom';
import './home.css';

export default function DiningWidget({ locations }) {
  const navigate = useNavigate();
  if (!locations?.length) return null;

  return (
    <div className="widget-card animate-in" onClick={() => navigate('/dining')} style={{ cursor: 'pointer' }}>
      {locations.slice(0, 3).map(d => (
        <div className="dining-item" key={d.id}>
          <div className={`dining-status ${d.status}`} />
          <div className="dining-info">
            <div className="dining-name">{d.name}</div>
            <div className="dining-hours">{d.hours}</div>
          </div>
        </div>
      ))}
      <div className="dining-more">
        View all locations & meal swipes →
      </div>
    </div>
  );
}
