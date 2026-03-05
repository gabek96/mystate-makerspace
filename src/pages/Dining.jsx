import { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route, Outlet } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import { api } from '../services/api';
import MealPlanCard from '../components/dining/MealPlanCard';
import BalanceRing from '../components/dining/BalanceRing';
import LocationCard from '../components/dining/LocationCard';
import TransactionList from '../components/dining/TransactionList';
import './dining.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'locations', label: 'Locations' },
  { id: 'history', label: 'History' },
];

export default function Dining() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDiningFull().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="dining-page">
        <AppHeader title="Dining & Meal Swipes" showBack />
        <div className="dining-skeleton">
          <div className="skeleton" style={{ height: 180, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  const { mealPlan, locations, transactions, getAndGo } = data;
  const openGetGo = getAndGo.locations.filter((l) => l.status === 'open');

  return (
    <div className="dining-page page-enter">
      <AppHeader title="Dining & Meal Swipes" showBack />

      <div className="scroll-content">
        {/* Meal Plan Summary Card */}
        <MealPlanCard plan={mealPlan} />

        {/* GET & GO Quick Access */}
        <div className="getgo-banner" onClick={() => navigate('/dining/getgo')}>
          <div className="getgo-banner-left">
            <div className="getgo-banner-icon">🍔</div>
            <div>
              <p className="getgo-banner-title">GET & GO Mobile Ordering</p>
              <p className="getgo-banner-sub">
                {openGetGo.length} location{openGetGo.length !== 1 ? 's' : ''} open · Use meal swipes
              </p>
            </div>
          </div>
          <span className="getgo-banner-arrow">›</span>
        </div>

        {/* Tabs */}
        <div className="dn-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`dn-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="dn-tab-content">
            {/* Balance Rings */}
            <div className="balance-rings-row">
              <BalanceRing
                label="Meal Swipes"
                current={mealPlan.mealSwipes.total - mealPlan.mealSwipes.used}
                total={mealPlan.mealSwipes.total}
                color="#C8102E"
                icon="🍽️"
              />
              <BalanceRing
                label="Dining Dollars"
                current={mealPlan.diningDollars.balance}
                total={mealPlan.diningDollars.total}
                color="#F1BE48"
                icon="💰"
                isCurrency
              />
              <BalanceRing
                label="GET & GO"
                current={mealPlan.getAndGo.perDay - mealPlan.getAndGo.usedToday}
                total={mealPlan.getAndGo.perDay}
                color="#4CAF50"
                icon="📱"
                subtitle="today"
              />
            </div>

            {/* Today's stats */}
            <div className="dn-today-card widget-card">
              <div className="dn-today-header">
                <span className="dn-today-title">Today's Activity</span>
                <span className="dn-today-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="dn-today-stats">
                <div className="dn-today-stat">
                  <span className="dn-today-num">{mealPlan.mealSwipes.usedToday}</span>
                  <span className="dn-today-lbl">of {mealPlan.mealSwipes.perDay} swipes</span>
                </div>
                <div className="dn-today-divider" />
                <div className="dn-today-stat">
                  <span className="dn-today-num">{mealPlan.getAndGo.usedToday}</span>
                  <span className="dn-today-lbl">of {mealPlan.getAndGo.perDay} GET&GO</span>
                </div>
                <div className="dn-today-divider" />
                <div className="dn-today-stat">
                  <span className="dn-today-num">{mealPlan.guestMeals.remaining}</span>
                  <span className="dn-today-lbl">guest meals left</span>
                </div>
              </div>
            </div>

            {/* Quick Locations */}
            <div className="section-label" style={{ padding: '0 var(--space-lg)' }}>
              Open Now
            </div>
            {locations
              .filter((l) => l.status === 'open')
              .slice(0, 4)
              .map((loc) => (
                <LocationCard key={loc.id} location={loc} compact />
              ))}

            {/* Recent Transactions */}
            <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-lg)' }}>
              Recent
            </div>
            <TransactionList transactions={transactions.slice(0, 4)} />
          </div>
        )}

        {tab === 'locations' && (
          <div className="dn-tab-content">
            {/* Filter chips */}
            <LocationFilter locations={locations} />
          </div>
        )}

        {tab === 'history' && (
          <div className="dn-tab-content">
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}

function LocationFilter({ locations }) {
  const [filter, setFilter] = useState('all');

  const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'dining-center', label: 'Dining Centers' },
    { id: 'cafe', label: 'Cafés' },
    { id: 'convenience', label: 'C-Stores' },
    { id: 'fast-casual', label: 'Fast Casual' },
  ];

  const filtered = filter === 'all' ? locations : locations.filter((l) => l.category === filter);

  return (
    <>
      <div className="dn-filter-row">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`dn-filter-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {filtered.map((loc) => (
        <LocationCard key={loc.id} location={loc} />
      ))}
    </>
  );
}
