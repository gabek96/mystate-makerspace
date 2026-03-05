import './home.css';

export default function WeatherCard({ data }) {
  if (!data) return <div className="weather-card skeleton" style={{ height: 100 }} />;

  return (
    <div className="weather-card animate-in">
      <div className="weather-main">
        <div className="weather-temp">{data.temp}°F</div>
        <div className="weather-desc">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--gold)">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
          </svg>
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
