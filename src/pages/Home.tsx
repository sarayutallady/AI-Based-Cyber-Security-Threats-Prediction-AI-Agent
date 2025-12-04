import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/security/MetricCard';
import { ThreatCard } from '@/components/security/ThreatCard';
import { StatusIndicator } from '@/components/security/StatusIndicator';
import { AlertBanner } from '@/components/security/AlertBanner';
import { ThreatLineChart } from '@/components/security/ThreatLineChart';
import { ThreatPieChart } from '@/components/security/ThreatPieChart';
import { ThreatAreaChart } from '@/components/security/ThreatAreaChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateThreat } from '@/lib/utils/threatGenerator';
import { generateDashboardStats, generateNetworkMetrics, generateTrafficData } from '@/lib/utils/dataGenerator';
import { toast } from 'sonner';
import type { Threat, DashboardStats, NetworkMetrics, TrafficData } from '@/types';
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Network,
  RefreshCw,
  TrendingUp,
  Database,
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>(generateDashboardStats());
  const [metrics, setMetrics] = useState<NetworkMetrics>(generateNetworkMetrics());
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const initialThreats: Threat[] = [];
    for (let i = 0; i < 5; i++) {
      initialThreats.push(generateThreat());
    }
    setRecentThreats(initialThreats);
    setTrafficData(generateTrafficData(12));

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newThreat = generateThreat();
        setRecentThreats(prev => [newThreat, ...prev.slice(0, 4)]);
      }
      setStats(generateDashboardStats());
      setMetrics(generateNetworkMetrics());
      setTrafficData(prev => {
        const newData = generateTrafficData(1)[0];
        return [...prev.slice(1), newData];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setStats(generateDashboardStats());
    setMetrics(generateNetworkMetrics());
    setTrafficData(generateTrafficData(12));
    toast.success('Dashboard refreshed successfully');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const threatDistribution = [
    { name: 'Malware', value: stats.activeThreats * 0.25 },
    { name: 'Phishing', value: stats.activeThreats * 0.20 },
    { name: 'DDoS', value: stats.activeThreats * 0.15 },
    { name: 'Intrusion', value: stats.activeThreats * 0.15 },
    { name: 'Others', value: stats.activeThreats * 0.25 },
  ];

  const trendData = Array.from({ length: 10 }, (_, i) => ({
    time: `${i}h`,
    value: Math.floor(Math.random() * 50) + 20,
  }));

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Cyber Security Threat Prediction System
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and AI-powered threat detection
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {stats.activeThreats > 10 && (
        <AlertBanner
          type="warning"
          title="High Threat Activity Detected"
          description={`${stats.activeThreats} active threats are currently being monitored. Review the threat dashboard for details.`}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Active Threats"
          value={stats.activeThreats}
          icon={AlertTriangle}
          description="Currently being monitored"
          trend={{ value: 12, isPositive: false }}
        />
        <MetricCard
          title="Threats Today"
          value={stats.totalThreatsToday}
          icon={Shield}
          description="Total detected threats"
          trend={{ value: 8, isPositive: false }}
        />
        <MetricCard
          title="Blocked Threats"
          value={stats.blockedThreats}
          icon={CheckCircle}
          description="Successfully prevented"
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          icon={Activity}
          description={
            <StatusIndicator status={stats.networkStatus} showDot={false} />
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recent Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent threats detected</p>
              </div>
            ) : (
              recentThreats.map(threat => (
                <ThreatCard key={threat.id} threat={threat} />
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Connections</span>
                  <span className="font-medium">{metrics.activeConnections}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blocked Attempts</span>
                  <span className="font-medium text-destructive">
                    {metrics.blockedAttempts}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Latency</span>
                  <span className="font-medium">{metrics.averageLatency}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bandwidth</span>
                  <span className="font-medium">{metrics.bandwidth} Mbps</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Packets/sec</span>
                  <span className="font-medium">{metrics.packetsPerSecond.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium">Static Data</span>
                </div>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium">Streaming Data</span>
                </div>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium">Network VPN/WiFi</span>
                </div>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ThreatLineChart data={trafficData} title="Network Traffic Over Time" />
        <ThreatPieChart data={threatDistribution} title="Threat Distribution" />
      </div>

      <ThreatAreaChart data={trendData} title="Threat Detection Trend (Last 10 Hours)" />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Detection Rate
              </h3>
              <p className="text-2xl font-bold">94.5%</p>
              <p className="text-xs text-muted-foreground mt-1">
                AI model accuracy
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Response Time
              </h3>
              <p className="text-2xl font-bold">1.2s</p>
              <p className="text-xs text-muted-foreground mt-1">
                Average threat response
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Uptime
              </h3>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
