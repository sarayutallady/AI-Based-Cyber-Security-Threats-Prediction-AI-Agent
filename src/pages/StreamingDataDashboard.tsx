import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreatCard } from '@/components/security/ThreatCard';
import { MetricCard } from '@/components/security/MetricCard';
import { ThreatLineChart } from '@/components/security/ThreatLineChart';
import { Badge } from '@/components/ui/badge';
import { generateThreat } from '@/lib/utils/threatGenerator';
import { generateTrafficData } from '@/lib/utils/dataGenerator';
import { toast } from 'sonner';
import type { Threat, TrafficData } from '@/types';
import {
  Activity,
  Zap,
  Radio,
  TrendingUp,
  Pause,
  Play,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function StreamingDataDashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [eventsPerSecond, setEventsPerSecond] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    setTrafficData(generateTrafficData(20));
    const initialThreats = [];
    for (let i = 0; i < 6; i++) {
      initialThreats.push(generateThreat());
    }
    setThreats(initialThreats);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newThreat = generateThreat();
        setThreats(prev => [newThreat, ...prev.slice(0, 5)]);
      }

      setEventsPerSecond(Math.floor(Math.random() * 1000) + 500);
      setTotalEvents(prev => prev + Math.floor(Math.random() * 100) + 50);

      setTrafficData(prev => {
        const newData = {
          timestamp: new Date(),
          incoming: Math.floor(Math.random() * 1000) + 500,
          outgoing: Math.floor(Math.random() * 800) + 400,
          threats: Math.floor(Math.random() * 20),
        };
        return [...prev.slice(1), newData];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const activeThreats = threats.filter(t => !t.resolved).length;
  const blockedThreats = threats.filter(t => t.blocked).length;

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
    toast.info(isStreaming ? 'Stream paused' : 'Stream resumed');
  };

  const handleRefresh = () => {
    setTrafficData(generateTrafficData(20));
    setThreats([]);
    setTotalEvents(0);
    toast.success('Dashboard refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Streaming Data Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time threat detection and monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={
              isStreaming
                ? 'bg-success/10 border-success text-success'
                : 'bg-muted border-border'
            }
          >
            <div className={`h-2 w-2 rounded-full mr-2 ${isStreaming ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            {isStreaming ? 'Live' : 'Paused'}
          </Badge>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleToggleStream}
            variant="outline"
            className="gap-2"
          >
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Events/Second"
          value={eventsPerSecond.toLocaleString()}
          icon={Zap}
          description="Current throughput"
        />
        <MetricCard
          title="Total Events"
          value={totalEvents.toLocaleString()}
          icon={Activity}
          description="Since session start"
        />
        <MetricCard
          title="Active Threats"
          value={activeThreats}
          icon={AlertCircle}
          description="Currently monitoring"
        />
        <MetricCard
          title="Blocked"
          value={blockedThreats}
          icon={Radio}
          description="Real-time prevention"
        />
      </div>

      <ThreatLineChart data={trafficData.slice(-12)} title="Real-Time Traffic Monitor" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Live Threat Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Radio className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Waiting for streaming data...</p>
              </div>
            ) : (
              threats.map(threat => (
                <ThreatCard key={threat.id} threat={threat} />
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Incoming Traffic</p>
                  <p className="text-xl font-bold mt-1">
                    {trafficData[trafficData.length - 1]?.incoming || 0} MB/s
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Outgoing Traffic</p>
                  <p className="text-xl font-bold mt-1">
                    {trafficData[trafficData.length - 1]?.outgoing || 0} MB/s
                  </p>
                </div>
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-muted-foreground">Threat Events</p>
                  <p className="text-xl font-bold mt-1 text-destructive">
                    {trafficData[trafficData.length - 1]?.threats || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Stream Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">2h 34m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Latency</span>
                <span className="font-medium">12ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Processed</span>
                <span className="font-medium">4.2 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Rate</span>
                <span className="font-medium text-success">96.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Stream Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Stable
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Buffer Status</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Normal
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Optimal
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
