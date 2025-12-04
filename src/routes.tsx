import Home from './pages/Home';
import StaticDataDashboard from './pages/StaticDataDashboard';
import StreamingDataDashboard from './pages/StreamingDataDashboard';
import NetworkDashboard from './pages/NetworkDashboard';
import MLDashboard from './pages/MLDashboard';
import ThreatReports from './pages/ThreatReports';
import GlobalThreatMap from './pages/GlobalThreatMap';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Overview',
    path: '/',
    element: <Home />,
    visible: true,
  },
  {
    name: 'Global Threat Map',
    path: '/threat-map',
    element: <GlobalThreatMap />,
    visible: true,
  },
  {
    name: 'Static Data',
    path: '/static-data',
    element: <StaticDataDashboard />,
    visible: true,
  },
  {
    name: 'Streaming Data',
    path: '/streaming-data',
    element: <StreamingDataDashboard />,
    visible: true,
  },
  {
    name: 'Network VPN/WiFi',
    path: '/network',
    element: <NetworkDashboard />,
    visible: true,
  },
  {
    name: 'ML Dashboard',
    path: '/ml-dashboard',
    element: <MLDashboard />,
    visible: true,
  },
  {
    name: 'Threat Reports',
    path: '/reports',
    element: <ThreatReports />,
    visible: true,
  },
];

export default routes;
