import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreatEvent {
  id: string;
  type: string;
  location: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
}

const threatTypes = [
  'DDoS Attack',
  'Malware Detected',
  'Phishing Attempt',
  'Ransomware',
  'SQL Injection',
  'XSS Attack',
  'Brute Force',
  'Data Breach',
  'APT Activity',
  'Zero-Day Exploit',
];

const locations = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Moscow',
  'Beijing',
  'Mumbai',
  'São Paulo',
  'Berlin',
  'Dubai',
  'Singapore',
  'Toronto',
  'Paris',
  'Seoul',
  'Amsterdam',
];

const generateThreatEvent = (): ThreatEvent => {
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  const weights = [0.1, 0.3, 0.4, 0.2]; // Probability weights
  
  let random = Math.random();
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
  
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      severity = severities[i];
      break;
    }
    random -= weights[i];
  }

  return {
    id: Date.now().toString() + Math.random(),
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    severity,
    timestamp: new Date(),
  };
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return AlertTriangle;
    case 'high':
      return Zap;
    case 'medium':
      return Activity;
    default:
      return Shield;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-destructive';
    case 'high':
      return 'text-warning';
    case 'medium':
      return 'text-info';
    default:
      return 'text-success';
  }
};

export default function ThreatFeedTicker() {
  const [threats, setThreats] = useState<ThreatEvent[]>([
    generateThreatEvent(),
    generateThreatEvent(),
    generateThreatEvent(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats((prev) => {
        const newThreat = generateThreatEvent();
        const updated = [newThreat, ...prev];
        return updated.slice(0, 20); // Keep last 20 threats
      });
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-card/50 backdrop-blur-sm border-y border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
      
      <div className="relative flex items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground flex-shrink-0">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span>Live Threat Feed</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6 animate-scroll">
            {threats.concat(threats).map((threat, index) => {
              const Icon = getSeverityIcon(threat.severity);
              return (
                <div
                  key={`${threat.id}-${index}`}
                  className="flex items-center gap-2 text-sm whitespace-nowrap animate-in fade-in slide-in-from-right duration-500"
                >
                  <Icon className={cn('h-3.5 w-3.5', getSeverityColor(threat.severity))} />
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{threat.type}</span>
                    {' in '}
                    <span className="font-medium text-foreground">{threat.location}</span>
                  </span>
                  <Badge
                    variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {threat.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {threat.timestamp.toLocaleTimeString()}
                  </span>
                  <div className="h-4 w-px bg-border mx-2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
