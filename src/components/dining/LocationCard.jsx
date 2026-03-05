import './dining.css';

const CROWD_LABELS = { low: 'Not Busy', moderate: 'Moderate', busy: 'Busy' };
const CROWD_COLORS = { low: '#4CAF50', moderate: '#FF9800', busy: '#F44336' };
const CATEGORY_ICONS = {
  'dining-center': '🏛️',
  'cafe': '☕',
  'convenience': '🏪',
  'fast-casual': '🍕',
};

export default function LocationCard({ location, compact }) {
  const { name, building, status, hours, category, crowdLevel, acceptsSwipes, acceptsGetGo, acceptsDiningDollars, currentMeal } = location;
  const isOpen = status === 'open';

  return (
    <div className={`location-card ${compact ? 'compact' : ''} ${!isOpen ? 'closed' : ''}`}>
      <div className="loc-left">
        <div className="loc-icon">{CATEGORY_ICONS[category] || '🍽️'}</div>
      </div>
      <div className="loc-center">
        <div className="loc-name-row">
          <span className="loc-name">{name}</span>
          {isOpen && crowdLevel && (
            <span className="loc-crowd" style={{ color: CROWD_COLORS[crowdLevel] }}>
              {CROWD_LABELS[crowdLevel]}
            </span>
          )}
        </div>
        <span className="loc-building">{building}</span>
        <div className="loc-meta">
          <span className={`loc-status ${status}`}>{isOpen ? 'Open' : 'Closed'}</span>
          <span className="loc-hours">{hours}</span>
          {currentMeal && <span className="loc-meal">· {currentMeal}</span>}
        </div>
        {!compact && (
          <div className="loc-accepts">
            {acceptsSwipes && <span className="loc-accept-chip swipe">Swipes</span>}
            {acceptsGetGo && <span className="loc-accept-chip getgo">GET&GO</span>}
            {acceptsDiningDollars && <span className="loc-accept-chip dd">D$</span>}
          </div>
        )}
      </div>
    </div>
  );
}
