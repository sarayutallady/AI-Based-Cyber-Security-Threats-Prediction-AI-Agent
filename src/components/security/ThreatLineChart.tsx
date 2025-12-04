import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TrafficData } from '@/types';

interface ThreatLineChartProps {
  data: TrafficData[];
  title?: string;
}

export function ThreatLineChart({ data, title = 'Network Traffic Over Time' }: ThreatLineChartProps) {
  const chartData = data.map(item => ({
    time: new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(item.timestamp),
    incoming: item.incoming,
    outgoing: item.outgoing,
    threats: item.threats,
  }));

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="incoming" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              name="Incoming (MB/s)"
            />
            <Line 
              type="monotone" 
              dataKey="outgoing" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              name="Outgoing (MB/s)"
            />
            <Line 
              type="monotone" 
              dataKey="threats" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              name="Threats"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
