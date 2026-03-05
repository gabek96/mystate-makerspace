import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import './search.css';

const TYPE_LABELS = {
  feature: 'Feature',
  machine: 'Machine',
  class: 'Class',
  dining: 'Dining',
};

const TYPE_ICONS = {
  feature: '⚡',
  machine: '🔧',
  class: '📚',
  dining: '🍽️',
};

export default function Search() {
  const { searchQuery, setSearchQuery } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api.search(searchQuery).then((r) => {
        setResults(r);
        setSearched(true);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const handleResultClick = (item) => {
    if (item.type === 'machine') navigate('/makerspace');
    else if (item.type === 'feature') navigate('/features');
    else if (item.type === 'class') navigate('/');
    else if (item.type === 'dining') navigate('/');
  };

  return (
    <div className="search-page page-enter">
      <div className="search-input-wrap">
        <span className="search-input-icon">🔍</span>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search features, machines, classes, dining..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>
            ✕
          </button>
        )}
      </div>

      {!searched && !loading && (
        <div className="search-empty">
          <div className="search-empty-icon">🔍</div>
          <p className="search-empty-title">Search MyState</p>
          <p className="search-empty-desc">
            Find features, makerspace machines, classes, dining locations and more
          </p>
          <div className="search-suggestions">
            {['3D Printer', 'Laser Cutter', 'Dining', 'CyRide'].map((s) => (
              <button
                key={s}
                className="search-suggestion-chip"
                onClick={() => setSearchQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="search-loading">
          <div className="spinner" />
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-icon">😕</div>
          <p className="search-empty-title">No results found</p>
          <p className="search-empty-desc">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {searched && !loading && results.length > 0 && (
        <div className="search-results">
          <p className="search-results-count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="search-group">
              <div className="search-group-header">
                <span>{TYPE_ICONS[type]}</span>
                <span>{TYPE_LABELS[type] || type}</span>
                <span className="search-group-count">{items.length}</span>
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(item)}
                >
                  <div className="search-result-info">
                    <p className="search-result-name">{item.name}</p>
                    {item.description && (
                      <p className="search-result-desc">{item.description}</p>
                    )}
                  </div>
                  <span className="search-result-arrow">›</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
