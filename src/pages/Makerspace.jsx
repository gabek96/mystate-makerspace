import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import StatusCard from '../components/makerspace/StatusCard';
import PopularTimes from '../components/makerspace/PopularTimes';
import AreaCard from '../components/makerspace/AreaCard';
import ActivePrint from '../components/makerspace/ActivePrint';
import Reservations from '../components/makerspace/Reservations';
import Workshops from '../components/makerspace/Workshops';
import Badges from '../components/makerspace/Badges';
import { api } from '../services/api';
import '../components/makerspace/makerspace.css';

const TABS = [
  { id: 'makerspaces', label: 'Makerspaces' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'badges', label: 'Badges' }
];

export default function Makerspace() {
  const { tab: urlTab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(urlTab || 'makerspaces');
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getMakerspace().then(setData);
  }, []);

  useEffect(() => {
    if (urlTab && TABS.find(t => t.id === urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/makerspace/${tabId}`, { replace: true });
  };

  if (!data) return (
    <div className="page-makerspace">
      <AppHeader title="Makerspace Tracker" showBack gradient />
      <div className="scroll-content">
        <div className="skeleton" style={{ height: 160, margin: 16, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 200, margin: 16, borderRadius: 16 }} />
      </div>
    </div>
  );

  return (
    <div className="page-makerspace">
      <AppHeader title="Makerspace Tracker" showBack gradient />
      <div className="scroll-content">
        <StatusCard location={data.location} summary={data.summary} />
        <PopularTimes data={data.popularTimes} />

        {/* Tab Navigation */}
        <div className="ms-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ms-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'makerspaces' && (
          <div className="tab-content animate-in">
            {data.areas.map(area => (
              <AreaCard key={area.id} area={area} />
            ))}
            <div className="reserve-section">
              <button className="reserve-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                Reserve a Machine
              </button>
              <div className="reserve-hint">Reserve up to 2 hours in advance</div>
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="tab-content animate-in">
            <ActivePrint print={data.activePrint} />
            <Reservations items={data.reservations} />
            <Workshops items={data.workshops} />
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="tab-content animate-in">
            <Badges data={data.badges} />
          </div>
        )}
      </div>
    </div>
  );
}
