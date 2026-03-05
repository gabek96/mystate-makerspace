import { useState } from 'react';
import './makerspace.css';

export default function PopularTimes({ data }) {
  const [activeDay, setActiveDay] = useState(data.currentDay);
  const dayKey = data.days[activeDay];
  const bars = data.data[dayKey] || [];

  return (
    <>
      <div className="section-label">Popular Times</div>
      <div className="widget-card popular-times-card animate-in">
        <div className="pt-day-selector">
          {data.days.map((day, i) => (
            <button
              key={day}
              className={`pt-day ${i === activeDay ? 'active' : ''} ${day === 'Su' ? 'dim' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="pt-chart">
          {bars.map((height, i) => (
            <div className={`pt-bar-col ${i === data.currentHour && activeDay === data.currentDay ? 'now' : ''}`} key={i}>
              <div
                className={`pt-bar ${height >= 65 ? 'busy' : ''} ${i === data.currentHour && activeDay === data.currentDay ? 'current' : ''}`}
                style={{ height: `${height}%` }}
              />
              <span className="pt-hour">{data.hours[i]}</span>
            </div>
          ))}
        </div>
        <div className="pt-legend">
          <span className="pt-now-indicator"></span> Currently: <strong>{data.currentLevel}</strong>
        </div>
      </div>
    </>
  );
}
