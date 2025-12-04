import type { NetworkMetrics, TrafficData, ProtocolDistribution, DashboardStats } from '@/types';

export function generateNetworkMetrics(): NetworkMetrics {
  return {
    totalTraffic: Math.floor(Math.random() * 10000) + 5000,
    activeConnections: Math.floor(Math.random() * 500) + 100,
    blockedAttempts: Math.floor(Math.random() * 50) + 10,
    averageLatency: Math.floor(Math.random() * 50) + 10,
    bandwidth: Math.floor(Math.random() * 1000) + 500,
    packetsPerSecond: Math.floor(Math.random() * 50000) + 10000,
  };
}

export function generateTrafficData(count: number): TrafficData[] {
  const data: TrafficData[] = [];
  const now = Date.now();
  
  for (let i = count - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60000),
      incoming: Math.floor(Math.random() * 1000) + 500,
      outgoing: Math.floor(Math.random() * 800) + 400,
      threats: Math.floor(Math.random() * 20),
    });
  }
  
  return data;
}

export function generateProtocolDistribution(): ProtocolDistribution[] {
  const protocols = [
    { protocol: 'HTTPS', base: 45 },
    { protocol: 'HTTP', base: 25 },
    { protocol: 'SSH', base: 10 },
    { protocol: 'FTP', base: 8 },
    { protocol: 'DNS', base: 7 },
    { protocol: 'Other', base: 5 },
  ];

  const total = protocols.reduce((sum, p) => sum + p.base + Math.random() * 10, 0);
  
  return protocols.map(p => {
    const count = Math.floor(p.base + Math.random() * 10);
    return {
      protocol: p.protocol,
      count,
      percentage: (count / total) * 100,
    };
  });
}

export function generateDashboardStats(): DashboardStats {
  const activeThreats = Math.floor(Math.random() * 15) + 2;
  const totalThreatsToday = Math.floor(Math.random() * 100) + 50;
  const blockedThreats = Math.floor(totalThreatsToday * (0.7 + Math.random() * 0.2));
  const systemHealth = Math.floor(Math.random() * 20) + 75;
  
  let networkStatus: 'healthy' | 'warning' | 'critical';
  if (systemHealth >= 85) {
    networkStatus = 'healthy';
  } else if (systemHealth >= 70) {
    networkStatus = 'warning';
  } else {
    networkStatus = 'critical';
  }

  return {
    activeThreats,
    totalThreatsToday,
    blockedThreats,
    systemHealth,
    networkStatus,
    lastScan: new Date(),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function getStatusColor(status: 'healthy' | 'warning' | 'critical'): string {
  const colors = {
    healthy: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };
  return colors[status];
}

export function getStatusBgColor(status: 'healthy' | 'warning' | 'critical'): string {
  const colors = {
    healthy: 'bg-success/10 border-success',
    warning: 'bg-warning/10 border-warning',
    critical: 'bg-destructive/10 border-destructive',
  };
  return colors[status];
}
