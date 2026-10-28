import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Predict from './pages/Predict';
import Performance from './pages/Performance';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-navy-900 text-slate-100 selection:bg-solar-gold selection:text-navy-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
