import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreatCard } from '@/components/security/ThreatCard';
import { MetricCard } from '@/components/security/MetricCard';
import { ThreatPieChart } from '@/components/security/ThreatPieChart';
import { ThreatAreaChart } from '@/components/security/ThreatAreaChart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateThreat } from '@/lib/utils/threatGenerator';
import { generateNetworkMetrics, generateProtocolDistribution } from '@/lib/utils/dataGenerator';
import { toast } from 'sonner';
import type { Threat, NetworkMetrics, ProtocolDistribution } from '@/types';
import {
  Wifi,
  Network,
  Globe,
  Shield,
  Lock,
  Unlock,
  RefreshCw,
  Activity,
} from 'lucide-react';

export default function NetworkDashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [metrics, setMetrics] = useState<NetworkMetrics>(generateNetworkMetrics());
  const [protocols, setProtocols] = useState<ProtocolDistribution[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [vpnStatus, setVpnStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [bandwidthHistory, setBandwidthHistory] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    const initialThreats = [];
    for (let i = 0; i < 6; i++) {
      initialThreats.push(generateThreat());
    }
    setThreats(initialThreats);
    setProtocols(generateProtocolDistribution());
    
    const history = Array.from({ length: 10 }, (_, i) => ({
      time: `${i}m`,
      value: Math.floor(Math.random() * 100) + 50,
    }));
    setBandwidthHistory(history);

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newThreat = generateThreat();
        setThreats(prev => [newThreat, ...prev.slice(0, 5)]);
      }
      setMetrics(generateNetworkMetrics());
      setBandwidthHistory(prev => {
        const newPoint = {
          time: `${prev.length}m`,
          value: Math.floor(Math.random() * 100) + 50,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    toast.info('Scanning network...');
    setTimeout(() => {
      setIsScanning(false);
      setProtocols(generateProtocolDistribution());
      toast.success('Network scan completed');
    }, 2000);
  };

  const handleToggleVPN = () => {
    const newStatus = vpnStatus === 'connected' ? 'disconnected' : 'connected';
    setVpnStatus(newStatus);
    toast.success(`VPN ${newStatus === 'connected' ? 'connected' : 'disconnected'}`);
  };

  const handleRefresh = () => {
    setMetrics(generateNetworkMetrics());
    setProtocols(generateProtocolDistribution());
    toast.success('Network data refreshed');
  };

  const wifiStatus = 'connected';

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Network VPN/WiFi Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor network connections and detect intrusions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleScan}
            disabled={isScanning}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            Scan Network
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Active Connections"
          value={metrics.activeConnections}
          icon={Network}
          description="Current network sessions"
        />
        <MetricCard
          title="Blocked Attempts"
          value={metrics.blockedAttempts}
          icon={Shield}
          description="Prevented intrusions"
        />
        <MetricCard
          title="Bandwidth Usage"
          value={`${metrics.bandwidth} Mbps`}
          icon={Activity}
          description="Current throughput"
        />
        <MetricCard
          title="Avg Latency"
          value={`${metrics.averageLatency}ms`}
          icon={Globe}
          description="Network response time"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              VPN Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {vpnStatus === 'connected' ? (
                    <Lock className="h-5 w-5 text-success" />
                  ) : (
                    <Unlock className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">VPN Connection</p>
                    <p className="text-sm text-muted-foreground">
                      {vpnStatus === 'connected' ? 'Secure tunnel active' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    vpnStatus === 'connected'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }
                >
                  {vpnStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              {vpnStatus === 'connected' && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Server Location</span>
                    <span className="font-medium">US East (Virginia)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IP Address</span>
                    <span className="font-mono font-medium">203.0.113.42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Encryption</span>
                    <span className="font-medium">AES-256</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Protocol</span>
                    <span className="font-medium">OpenVPN</span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleToggleVPN} 
                className="w-full gap-2"
                variant={vpnStatus === 'connected' ? 'destructive' : 'default'}
              >
                {vpnStatus === 'connected' ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    Disconnect VPN
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Connect VPN
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              WiFi Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">Corporate Network</p>
                    <p className="text-sm text-muted-foreground">
                      5GHz • WPA3 Encryption
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Connected
                </Badge>
              </div>

              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Signal Strength</span>
                  <span className="font-medium">Excellent (95%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Channel</span>
                  <span className="font-medium">149 (5GHz)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="font-medium">866 Mbps</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security</span>
                  <span className="font-medium text-success">WPA3-Personal</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ThreatAreaChart data={bandwidthHistory} title="Bandwidth Usage (Mbps)" />
        <ThreatPieChart 
          data={protocols.map(p => ({ name: p.protocol, value: p.percentage }))} 
          title="Protocol Distribution" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Network Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threats.map(threat => (
              <ThreatCard key={threat.id} threat={threat} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Protocol Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {protocols.map(protocol => (
                <div key={protocol.protocol} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{protocol.protocol}</span>
                    <span className="font-medium">{protocol.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={protocol.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Traffic</p>
                <p className="text-xl font-bold mt-1">
                  {metrics.totalTraffic.toLocaleString()} MB
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Packets/Second</p>
                <p className="text-xl font-bold mt-1">
                  {metrics.packetsPerSecond.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-xl font-bold mt-1">
                  {Math.floor(metrics.activeConnections / 3)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
