import './home.css';

export default function CyRideWidget({ routes }) {
  if (!routes?.length) return null;

  return (
    <div className="widget-card animate-in">
      {routes.map(r => (
        <div className="cyride-item" key={r.id}>
          <div className="route-badge" style={{ background: r.color }}>{r.number}</div>
          <div className="cyride-info">
            <div className="cyride-route">{r.name}</div>
            <div className="cyride-stop">{r.stop}</div>
          </div>
          <div className="cyride-time">{r.eta} min</div>
        </div>
      ))}
    </div>
  );
}
