import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import Makerspace from './pages/Makerspace';
import Dining from './pages/Dining';
import GetAndGo from './pages/GetAndGo';
import Profile from './pages/Profile';
import Search from './pages/Search';
import './styles/transitions.css';

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <div className="page-transition">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/getgo" element={<GetAndGo />} />
          <Route path="/makerspace" element={<Makerspace />} />
          <Route path="/makerspace/:tab" element={<Makerspace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Layout>
  );
}
