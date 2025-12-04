export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export type ThreatType = 
  | 'malware'
  | 'phishing'
  | 'ddos'
  | 'intrusion'
  | 'data_breach'
  | 'ransomware'
  | 'sql_injection'
  | 'xss'
  | 'brute_force'
  | 'anomaly';

export type DataSourceType = 'static' | 'streaming' | 'network';

export interface Threat {
  id: string;
  timestamp: Date;
  type: ThreatType;
  level: ThreatLevel;
  source: string;
  target: string;
  description: string;
  ipAddress: string;
  port?: number;
  protocol?: string;
  blocked: boolean;
  resolved: boolean;
}

export interface NetworkMetrics {
  totalTraffic: number;
  activeConnections: number;
  blockedAttempts: number;
  averageLatency: number;
  bandwidth: number;
  packetsPerSecond: number;
}

export interface MLModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  trainingTime: number;
  lastUpdated: Date;
}

export interface MLModel {
  id: string;
  name: string;
  type: string;
  status: 'training' | 'active' | 'inactive' | 'evaluating';
  metrics: MLModelMetrics;
  dataSource: DataSourceType;
  version: string;
  createdAt: Date;
}

export interface ThreatReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalThreats: number;
    criticalThreats: number;
    highThreats: number;
    mediumThreats: number;
    lowThreats: number;
    blockedThreats: number;
    resolvedThreats: number;
  };
  threats: Threat[];
  recommendations: string[];
}

export interface DashboardStats {
  activeThreats: number;
  totalThreatsToday: number;
  blockedThreats: number;
  systemHealth: number;
  networkStatus: 'healthy' | 'warning' | 'critical';
  lastScan: Date;
}

export interface TrafficData {
  timestamp: Date;
  incoming: number;
  outgoing: number;
  threats: number;
}

export interface ProtocolDistribution {
  protocol: string;
  count: number;
  percentage: number;
}

export interface GeographicThreat {
  country: string;
  countryCode: string;
  threatCount: number;
  latitude: number;
  longitude: number;
}
