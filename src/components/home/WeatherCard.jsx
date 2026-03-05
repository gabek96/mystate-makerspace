import './home.css';

function renderWeatherIcon(condition) {
  const c = (condition || '').toLowerCase();
  if (c.includes('rain') || c.includes('shower'))
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="#42A5F5"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z"/></svg>;
  if (c.includes('snow') || c.includes('flurr'))
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="#90CAF9"><path d="M22 11h-4.17l2.54-2.54-1.42-1.42L15 11h-2V9l3.96-3.96-1.42-1.42L13 6.17V2h-2v4.17L8.46 3.63 7.04 5.04 11 9v2H9L5.04 7.04 3.63 8.46 6.17 11H2v2h4.17l-2.54 2.54 1.42 1.42L9 13h2v2l-3.96 3.96 1.42 1.42L11 17.83V22h2v-4.17l2.54 2.54 1.42-1.42L13 15v-2h2l3.96 3.96 1.42-1.42L17.83 13H22z"/></svg>;
  if (c.includes('cloud') || c.includes('overcast'))
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="#78909C"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>;
  if (c.includes('storm') || c.includes('thunder'))
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFA726"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h1l2-4h4l-1 4h3l2-4h2c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>;
  // Default: sunny / clear / partly cloudy
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--gold)"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>;
}

export default function WeatherCard({ data }) {
  if (!data) return <div className="weather-card skeleton" style={{ height: 100 }} />;

  return (
    <div className="weather-card animate-in">
      {data.live && <div className="weather-live"><span className="live-dot"></span>Live</div>}
      <div className="weather-main">
        <div className="weather-temp">{data.temp}°F</div>
        <div className="weather-desc">
          {renderWeatherIcon(data.condition)}
          <span>{data.condition}</span>
        </div>
      </div>
      <div className="weather-details">
        <span>H: {data.high}° L: {data.low}°</span>
        <span>Wind: {data.wind}</span>
      </div>
      <div className="weather-location">{data.location}</div>
    </div>
  );
}
