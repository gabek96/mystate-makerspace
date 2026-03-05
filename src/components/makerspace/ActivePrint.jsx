import './makerspace.css';

export default function ActivePrint({ print }) {
  if (!print) return null;

  return (
    <>
      <div className="section-label">Your Active Print</div>
      <div className="widget-card active-print-card animate-in">
        <div className="ap-header">
          <div className="ap-machine">
            <div className="ap-machine-icon bg-in-use">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M19 9h-2V3H7v6H5c-1.1 0-2 .9-2 2v5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5c0-1.1-.9-2-2-2zM9 5h6v4H9V5z"/>
              </svg>
            </div>
            <div>
              <div className="ap-machine-name">{print.machine}</div>
              <div className="ap-file">{print.file}</div>
            </div>
          </div>
          <div className="ap-percent-ring">
            <svg viewBox="0 0 36 36" className="ap-circle-chart">
              <path className="ap-circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path className="ap-circle-fill"
                strokeDasharray={`${print.progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <text x="18" y="21" className="ap-circle-text">{print.progress}%</text>
            </svg>
          </div>
        </div>
        <div className="ap-progress-track">
          <div className="ap-progress-fill" style={{ width: `${print.progress}%` }} />
        </div>
        <div className="ap-details">
          <div className="ap-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-tertiary)">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            Est. done: {print.estDone}
          </div>
          <div className="ap-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-tertiary)">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            {print.remaining} remaining
          </div>
          <div className="ap-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-tertiary)">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-8H8V6h8v3z"/>
            </svg>
            Layer {print.layer}
          </div>
        </div>
        <button className="ap-notify-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          Notify me when done
        </button>
      </div>
    </>
  );
}
