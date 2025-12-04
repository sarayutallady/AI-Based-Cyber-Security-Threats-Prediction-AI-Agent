import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Line } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Activity, Filter, Zap, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface ThreatLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

const mockThreats: ThreatLocation[] = [
  { id: '1', name: 'New York, USA', coordinates: [-74.006, 40.7128], severity: 'critical', type: 'DDoS Attack', count: 1247, trend: 'up' },
  { id: '2', name: 'London, UK', coordinates: [-0.1276, 51.5074], severity: 'high', type: 'Malware', count: 892, trend: 'down' },
  { id: '3', name: 'Tokyo, Japan', coordinates: [139.6917, 35.6895], severity: 'medium', type: 'Phishing', count: 634, trend: 'stable' },
  { id: '4', name: 'Sydney, Australia', coordinates: [151.2093, -33.8688], severity: 'high', type: 'Ransomware', count: 756, trend: 'up' },
  { id: '5', name: 'Moscow, Russia', coordinates: [37.6173, 55.7558], severity: 'critical', type: 'APT Attack', count: 1523, trend: 'up' },
  { id: '6', name: 'Beijing, China', coordinates: [116.4074, 39.9042], severity: 'high', type: 'Data Breach', count: 945, trend: 'stable' },
  { id: '7', name: 'Mumbai, India', coordinates: [72.8777, 19.076], severity: 'medium', type: 'SQL Injection', count: 567, trend: 'down' },
  { id: '8', name: 'São Paulo, Brazil', coordinates: [-46.6333, -23.5505], severity: 'high', type: 'Botnet', count: 823, trend: 'up' },
  { id: '9', name: 'Berlin, Germany', coordinates: [13.405, 52.52], severity: 'medium', type: 'XSS Attack', count: 445, trend: 'stable' },
  { id: '10', name: 'Dubai, UAE', coordinates: [55.2708, 25.2048], severity: 'critical', type: 'Zero-Day Exploit', count: 1089, trend: 'up' },
  { id: '11', name: 'Singapore', coordinates: [103.8198, 1.3521], severity: 'high', type: 'Cryptojacking', count: 712, trend: 'down' },
  { id: '12', name: 'Toronto, Canada', coordinates: [-79.3832, 43.6532], severity: 'medium', type: 'Trojan', count: 498, trend: 'stable' },
  { id: '13', name: 'Paris, France', coordinates: [2.3522, 48.8566], severity: 'high', type: 'Brute Force', count: 678, trend: 'up' },
  { id: '14', name: 'Seoul, South Korea', coordinates: [126.978, 37.5665], severity: 'medium', type: 'Spyware', count: 534, trend: 'down' },
  { id: '15', name: 'Mexico City, Mexico', coordinates: [-99.1332, 19.4326], severity: 'high', type: 'Rootkit', count: 789, trend: 'up' },
  { id: '16', name: 'Amsterdam, Netherlands', coordinates: [4.9041, 52.3676], severity: 'medium', type: 'Adware', count: 423, trend: 'stable' },
  { id: '17', name: 'Hong Kong', coordinates: [114.1694, 22.3193], severity: 'critical', type: 'APT Attack', count: 1156, trend: 'up' },
  { id: '18', name: 'Istanbul, Turkey', coordinates: [28.9784, 41.0082], severity: 'high', type: 'Malware', count: 845, trend: 'up' },
  { id: '19', name: 'Bangkok, Thailand', coordinates: [100.5018, 13.7563], severity: 'medium', type: 'Phishing', count: 512, trend: 'down' },
  { id: '20', name: 'Cairo, Egypt', coordinates: [31.2357, 30.0444], severity: 'high', type: 'DDoS Attack', count: 723, trend: 'stable' },
  { id: '21', name: 'Lagos, Nigeria', coordinates: [3.3792, 6.5244], severity: 'medium', type: 'Scam', count: 456, trend: 'up' },
  { id: '22', name: 'Buenos Aires, Argentina', coordinates: [-58.3816, -34.6037], severity: 'high', type: 'Ransomware', count: 698, trend: 'down' },
  { id: '23', name: 'Stockholm, Sweden', coordinates: [18.0686, 59.3293], severity: 'low', type: 'Spam', count: 234, trend: 'stable' },
  { id: '24', name: 'Warsaw, Poland', coordinates: [21.0122, 52.2297], severity: 'medium', type: 'Trojan', count: 478, trend: 'up' },
  { id: '25', name: 'Riyadh, Saudi Arabia', coordinates: [46.6753, 24.7136], severity: 'high', type: 'Data Breach', count: 812, trend: 'up' },
  { id: '26', name: 'Johannesburg, South Africa', coordinates: [28.0473, -26.2041], severity: 'medium', type: 'Phishing', count: 523, trend: 'stable' },
  { id: '27', name: 'Jakarta, Indonesia', coordinates: [106.8456, -6.2088], severity: 'high', type: 'Malware', count: 756, trend: 'up' },
  { id: '28', name: 'Manila, Philippines', coordinates: [120.9842, 14.5995], severity: 'medium', type: 'Scam', count: 489, trend: 'down' },
  { id: '29', name: 'Kuala Lumpur, Malaysia', coordinates: [101.6869, 3.139], severity: 'high', type: 'Botnet', count: 687, trend: 'up' },
  { id: '30', name: 'Tel Aviv, Israel', coordinates: [34.7818, 32.0853], severity: 'critical', type: 'APT Attack', count: 1234, trend: 'up' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'hsl(0 72% 51%)';
    case 'high':
      return 'hsl(38 92% 50%)';
    case 'medium':
      return 'hsl(199 89% 48%)';
    case 'low':
      return 'hsl(142 71% 45%)';
    default:
      return 'hsl(215 15% 65%)';
  }
};

const getSeveritySize = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 14;
    case 'high':
      return 11;
    case 'medium':
      return 9;
    case 'low':
      return 7;
    default:
      return 7;
  }
};

export default function AdvancedThreatMap() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [hoveredThreat, setHoveredThreat] = useState<ThreatLocation | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showConnections, setShowConnections] = useState(true);

  const filteredThreats = mockThreats.filter(
    (threat) => filterSeverity === 'all' || threat.severity === filterSeverity
  );

  const criticalThreats = filteredThreats.filter((t) => t.severity === 'critical');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Critical Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {filteredThreats.filter((t) => t.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active locations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {filteredThreats.filter((t) => t.severity === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active locations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-info" />
              Total Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">
              {filteredThreats.reduce((sum, t) => sum + t.count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Monitored Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {filteredThreats.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Global coverage</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {filteredThreats.filter((t) => t.trend === 'up').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Increasing threats</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Global Threat Map
                <Badge variant="secondary" className="ml-2">
                  {filteredThreats.length} locations
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32 h-8">
                    <Filter className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={showConnections ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowConnections(!showConnections)}
                  className="h-8"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Connections
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-muted/20 to-background rounded-lg overflow-hidden border border-border/50" style={{ height: '600px' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 147,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <ZoomableGroup center={[0, 20]} zoom={1}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="hsl(215 35% 22%)"
                          stroke="hsl(215 45% 12%)"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { fill: 'hsl(215 40% 25%)', outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  
                  {/* Attack connections */}
                  {showConnections && criticalThreats.map((threat, i) => {
                    const nextThreat = criticalThreats[(i + 1) % criticalThreats.length];
                    return (
                      <Line
                        key={`line-${threat.id}`}
                        from={threat.coordinates}
                        to={nextThreat.coordinates}
                        stroke="hsl(0 72% 51%)"
                        strokeWidth={1}
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        opacity={0.3}
                      />
                    );
                  })}

                  {filteredThreats.map((threat) => (
                    <Marker
                      key={threat.id}
                      coordinates={threat.coordinates}
                      onMouseEnter={() => setHoveredThreat(threat)}
                      onMouseLeave={() => setHoveredThreat(null)}
                      onClick={() => setSelectedThreat(threat)}
                      style={{ cursor: 'pointer' }}
                    >
                      <g className="animate-in fade-in zoom-in duration-500">
                        <circle
                          r={getSeveritySize(threat.severity)}
                          fill={getSeverityColor(threat.severity)}
                          fillOpacity={0.9}
                          stroke="hsl(210 40% 98%)"
                          strokeWidth={2}
                          className="animate-pulse"
                        />
                        <circle
                          r={getSeveritySize(threat.severity) + 6}
                          fill={getSeverityColor(threat.severity)}
                          fillOpacity={0.2}
                          className="animate-ping"
                          style={{ animationDuration: '2s' }}
                        />
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              {hoveredThreat && (
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-2xl animate-in fade-in slide-in-from-left duration-200">
                  <div className="text-sm font-semibold text-foreground">{hoveredThreat.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{hoveredThreat.type}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={hoveredThreat.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {hoveredThreat.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{hoveredThreat.count} incidents</span>
                    {hoveredThreat.trend === 'up' && <TrendingUp className="h-3 w-3 text-destructive" />}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base">
              {selectedThreat ? 'Threat Details' : 'Active Threats'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedThreat ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedThreat(null)}
                  className="mb-2"
                >
                  ← Back to list
                </Button>
                <div>
                  <div className="text-sm font-semibold text-foreground">{selectedThreat.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Location</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{selectedThreat.type}</div>
                  <div className="text-xs text-muted-foreground mt-1">Threat Type</div>
                </div>
                <div>
                  <Badge variant={selectedThreat.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {selectedThreat.severity.toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">Severity Level</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {selectedThreat.count.toLocaleString()}
                    {selectedThreat.trend === 'up' && <TrendingUp className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Incident Count (24h)</div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Coordinates: {selectedThreat.coordinates[1].toFixed(4)}°, {selectedThreat.coordinates[0].toFixed(4)}°
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {filteredThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/40 transition-all hover:scale-[1.02] border border-transparent hover:border-primary/20"
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {threat.name}
                          {threat.trend === 'up' && <TrendingUp className="h-3 w-3 text-destructive" />}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{threat.type}</div>
                      </div>
                      <Badge variant={threat.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                        {threat.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">{threat.count} incidents</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
