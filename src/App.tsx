import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/common/Header';
import AdvancedChatBot from '@/components/security/AdvancedChatBot';
import ParticleBackground from '@/components/effects/ParticleBackground';
import ThreatFeedTicker from '@/components/security/ThreatFeedTicker';
import CommandPalette from '@/components/common/CommandPalette';
import routes from './routes';

export default function App() {
  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background relative">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <ThreatFeedTicker />
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <AdvancedChatBot />
          <CommandPalette />
          <Toaster />
        </div>
      </div>
    </Router>
  );
}
