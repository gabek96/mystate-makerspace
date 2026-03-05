import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import Makerspace from './pages/Makerspace';
import Dining from './pages/Dining';
import GetAndGo from './pages/GetAndGo';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Classes from './pages/Classes';
import CyRide from './pages/CyRide';
import Events from './pages/Events';
import Laundry from './pages/Laundry';
import Library from './pages/Library';
import News from './pages/News';
import StuOrgs from './pages/StuOrgs';
import Directory from './pages/Directory';
import CampusMap from './pages/CampusMap';
import Fairs from './pages/Fairs';
import './styles/transitions.css';

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <div className="page-transition">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/cyride" element={<CyRide />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/getgo" element={<GetAndGo />} />
          <Route path="/makerspace" element={<Makerspace />} />
          <Route path="/makerspace/:tab" element={<Makerspace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/laundry" element={<Laundry />} />
          <Route path="/library" element={<Library />} />
          <Route path="/news" element={<News />} />
          <Route path="/stuorgs" element={<StuOrgs />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/fairs" element={<Fairs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Layout>
  );
}
