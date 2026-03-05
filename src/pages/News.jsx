import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './news.css';

export default function News() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getNews().then(setData);
  }, []);

  if (!data) return <div className="page-news"><AppHeader title="News" showBack /><div className="loading-state">Loading...</div></div>;

  const filtered = filter === 'all' ? data.articles : data.articles.filter(a => a.category === filter);

  const timeAgo = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr + 'T12:00:00');
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  return (
    <div className="page-news">
      <AppHeader title="News" showBack />
      <div className="scroll-content">
        {/* Breaking News */}
        {data.articles.filter(a => a.isBreaking).map(a => (
          <div className="breaking-card" key={a.id}>
            <div className="breaking-badge">BREAKING</div>
            <div className="breaking-title">{a.title}</div>
            <div className="breaking-summary">{a.summary}</div>
            <div className="breaking-source">{a.source} · {timeAgo(a.date)}</div>
          </div>
        ))}

        {/* Filters */}
        <div className="news-filters">
          {data.categories.map(c => (
            <button key={c.id} className={`news-filter ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="news-list">
          {filtered.filter(a => !a.isBreaking).map(a => (
            <div className="news-card" key={a.id}>
              <div className="nc-color" style={{ background: a.imageColor }} />
              <div className="nc-content">
                <div className="nc-title">{a.title}</div>
                <div className="nc-summary">{a.summary}</div>
                <div className="nc-meta">
                  <span>{a.source}</span>
                  <span>·</span>
                  <span>{timeAgo(a.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
