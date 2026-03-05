import './makerspace.css';

const AREA_ICONS = {
  printer3d: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 9h-2V3H7v6H5c-1.1 0-2 .9-2 2v5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5c0-1.1-.9-2-2-2zM9 5h6v4H9V5z"/></svg>,
  laser: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></svg>,
  cnc: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>,
  sewing: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-8H8V6h8v3z"/></svg>,
  electronics: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>,
  tools: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
};

export default function AreaCard({ area }) {
  const availCount = area.machines.filter(m => m.status === 'available').length;
  const totalCount = area.machines.length;

  return (
    <div className="sic-area-card animate-in">
      <div className="sic-area-header">
        <div className="sic-area-icon" style={{ background: `linear-gradient(135deg, ${area.color[0]}, ${area.color[1]})` }}>
          {AREA_ICONS[area.icon] || AREA_ICONS.tools}
        </div>
        <div className="sic-area-info">
          <div className="sic-area-name">{area.name}</div>
          <div className="sic-area-loc">{area.room}</div>
        </div>
        <div className="sic-area-avail">
          <span className="sic-avail-count status-available">{availCount}</span>/<span>{totalCount}</span> open
        </div>
      </div>
      <div className="sic-area-machines">
        {area.machines.map(m => (
          <div key={m.id} className={`sic-machine-chip ${m.status}`}>
            {m.name} — {m.detail}
          </div>
        ))}
      </div>
    </div>
  );
}
