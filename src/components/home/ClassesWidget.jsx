import './home.css';

export default function ClassesWidget({ classes }) {
  if (!classes?.length) return null;

  return (
    <div className="widget-card animate-in">
      {classes.map(c => (
        <div className="class-item" key={c.id}>
          <div className="class-time-bar" style={{ background: c.color }} />
          <div className="class-info">
            <div className="class-name">{c.name}</div>
            <div className="class-detail">{c.time} · {c.room}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
