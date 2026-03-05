import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import WeatherCard from '../components/home/WeatherCard';
import QuickActions from '../components/home/QuickActions';
import MakerspaceWidget from '../components/home/MakerspaceWidget';
import ActivePrintWidget from '../components/home/ActivePrintWidget';
import CyRideWidget from '../components/home/CyRideWidget';
import ClassesWidget from '../components/home/ClassesWidget';
import DiningWidget from '../components/home/DiningWidget';
import PullToRefresh from '../components/common/PullToRefresh';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { triggerRefresh, isRefreshing } = useApp();
  const [weather, setWeather] = useState(null);
  const [classes, setClasses] = useState([]);
  const [cyride, setCyride] = useState([]);
  const [dining, setDining] = useState([]);
  const [makerspace, setMakerspace] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadData = async () => {
    const [w, c, cr, d, m] = await Promise.all([
      api.getWeather(),
      api.getClasses(),
      api.getCyRide(),
      api.getDining(),
      api.getMakerspaceSummary()
    ]);
    setWeather(w);
    setClasses(c);
    setCyride(cr);
    setDining(d);
    setMakerspace(m);
    setLoaded(true);
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => {
    await triggerRefresh();
    await loadData();
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <div className="page-home">
      <AppHeader
        subtitle={getGreeting()}
        title="Cyclone!"
        showSearch
        showNotif
      />
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="scroll-content">
          <WeatherCard data={weather} />
          <QuickActions onNavigate={(path) => navigate(path)} />

          <div className="section-label">Makerspace — Live</div>
          <MakerspaceWidget data={makerspace} onClick={() => navigate('/makerspace')} />

          <div className="section-label">Your Active Print</div>
          <ActivePrintWidget print={makerspace?.activePrint} />

          <div className="section-label">CyRide — Nearby</div>
          <CyRideWidget routes={cyride} />

          <div className="section-label">Today's Classes</div>
          <ClassesWidget classes={classes} />

          <div className="section-label">Dining</div>
          <DiningWidget locations={dining} />
        </div>
      </PullToRefresh>
    </div>
  );
}
