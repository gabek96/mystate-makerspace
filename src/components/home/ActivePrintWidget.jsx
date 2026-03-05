import './home.css';

export default function ActivePrintWidget({ print }) {
  if (!print) return null;

  return (
    <div className="widget-card active-print-home animate-in">
      <div className="aph-top">
        <div className="aph-printer-icon bg-in-use">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M19 9h-2V3H7v6H5c-1.1 0-2 .9-2 2v5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5c0-1.1-.9-2-2-2zM9 5h6v4H9V5z"/>
          </svg>
        </div>
        <div className="aph-info">
          <div className="aph-name">{print.machine} — Print Job</div>
          <div className="aph-file">{print.file}</div>
        </div>
        <div className="aph-percent">{print.progress}%</div>
      </div>
      <div className="aph-progress-track">
        <div className="aph-progress-fill" style={{ width: `${print.progress}%` }} />
      </div>
      <div className="aph-details">
        <span>Est. done: {print.estDone}</span>
        <span>{print.remaining} remaining</span>
      </div>
    </div>
  );
}
