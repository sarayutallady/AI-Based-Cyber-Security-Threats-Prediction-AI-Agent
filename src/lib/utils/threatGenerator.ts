import type { Threat, ThreatLevel, ThreatType } from '@/types';

const threatTypes: ThreatType[] = [
  'malware',
  'phishing',
  'ddos',
  'intrusion',
  'data_breach',
  'ransomware',
  'sql_injection',
  'xss',
  'brute_force',
  'anomaly',
];

const threatLevels: ThreatLevel[] = ['critical', 'high', 'medium', 'low', 'safe'];

const ipRanges = [
  '192.168.',
  '10.0.',
  '172.16.',
  '203.0.113.',
  '198.51.100.',
  '45.33.32.',
  '185.220.101.',
];

const protocols = ['HTTP', 'HTTPS', 'FTP', 'SSH', 'SMTP', 'DNS', 'TCP', 'UDP'];

const threatDescriptions: Record<ThreatType, string[]> = {
  malware: [
    'Suspicious executable detected in network traffic',
    'Malicious payload identified in file transfer',
    'Trojan horse activity detected',
    'Worm propagation attempt blocked',
  ],
  phishing: [
    'Phishing email attempt detected',
    'Suspicious link in incoming message',
    'Credential harvesting attempt blocked',
    'Fake login page detected',
  ],
  ddos: [
    'Distributed Denial of Service attack detected',
    'Unusual traffic spike from multiple sources',
    'SYN flood attack in progress',
    'UDP flood detected',
  ],
  intrusion: [
    'Unauthorized access attempt detected',
    'Port scanning activity identified',
    'Suspicious login attempt from unknown location',
    'Privilege escalation attempt blocked',
  ],
  data_breach: [
    'Unauthorized data exfiltration detected',
    'Sensitive data access from suspicious source',
    'Data leak attempt blocked',
    'Unusual database query pattern detected',
  ],
  ransomware: [
    'Ransomware encryption activity detected',
    'File system modification by suspicious process',
    'Crypto-locker behavior identified',
    'Mass file encryption attempt blocked',
  ],
  sql_injection: [
    'SQL injection attempt in web request',
    'Malicious database query detected',
    'SQL command injection blocked',
    'Database manipulation attempt identified',
  ],
  xss: [
    'Cross-site scripting attempt detected',
    'Malicious script injection in web form',
    'XSS payload identified in request',
    'Script injection attempt blocked',
  ],
  brute_force: [
    'Brute force login attempt detected',
    'Multiple failed authentication attempts',
    'Password guessing attack in progress',
    'Dictionary attack detected',
  ],
  anomaly: [
    'Unusual network behavior detected',
    'Anomalous traffic pattern identified',
    'Unexpected protocol usage detected',
    'Abnormal data flow detected',
  ],
};

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomIP(): string {
  const range = randomElement(ipRanges);
  const octet3 = Math.floor(Math.random() * 256);
  const octet4 = Math.floor(Math.random() * 256);
  return `${range}${octet3}.${octet4}`;
}

function generateRandomPort(): number {
  return Math.floor(Math.random() * 65535) + 1;
}

export function generateThreat(): Threat {
  const type = randomElement(threatTypes);
  const level = randomElement(threatLevels);
  const blocked = Math.random() > 0.3;
  const resolved = blocked ? Math.random() > 0.5 : false;

  return {
    id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type,
    level,
    source: generateRandomIP(),
    target: generateRandomIP(),
    description: randomElement(threatDescriptions[type]),
    ipAddress: generateRandomIP(),
    port: Math.random() > 0.3 ? generateRandomPort() : undefined,
    protocol: Math.random() > 0.2 ? randomElement(protocols) : undefined,
    blocked,
    resolved,
  };
}

export function generateThreats(count: number): Threat[] {
  return Array.from({ length: count }, () => generateThreat());
}

export function getThreatLevelColor(level: ThreatLevel): string {
  const colors: Record<ThreatLevel, string> = {
    critical: 'text-destructive',
    high: 'text-warning',
    medium: 'text-info',
    low: 'text-muted-foreground',
    safe: 'text-success',
  };
  return colors[level];
}

export function getThreatLevelBgColor(level: ThreatLevel): string {
  const colors: Record<ThreatLevel, string> = {
    critical: 'bg-destructive/10 border-destructive',
    high: 'bg-warning/10 border-warning',
    medium: 'bg-info/10 border-info',
    low: 'bg-muted border-border',
    safe: 'bg-success/10 border-success',
  };
  return colors[level];
}
