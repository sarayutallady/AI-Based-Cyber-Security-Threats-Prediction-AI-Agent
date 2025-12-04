import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreatBarChart } from '@/components/security/ThreatBarChart';
import { generateThreats } from '@/lib/utils/threatGenerator';
import { toast } from 'sonner';
import type { ThreatReport } from '@/types';
import {
  FileText,
  Download,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function ThreatReports() {
  const [reports, setReports] = useState<ThreatReport[]>([]);

  useEffect(() => {
    const generatedReports: ThreatReport[] = [];
    
    for (let i = 0; i < 5; i++) {
      const threats = generateThreats(Math.floor(Math.random() * 50) + 20);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i + 1));
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59);

      const summary = {
        totalThreats: threats.length,
        criticalThreats: threats.filter(t => t.level === 'critical').length,
        highThreats: threats.filter(t => t.level === 'high').length,
        mediumThreats: threats.filter(t => t.level === 'medium').length,
        lowThreats: threats.filter(t => t.level === 'low').length,
        blockedThreats: threats.filter(t => t.blocked).length,
        resolvedThreats: threats.filter(t => t.resolved).length,
      };

      generatedReports.push({
        id: `report-${i}`,
        generatedAt: new Date(),
        period: {
          start: startDate,
          end: endDate,
        },
        summary,
        threats,
        recommendations: [
          'Increase monitoring on high-risk ports',
          'Update firewall rules to block suspicious IPs',
          'Review and update security policies',
          'Conduct security awareness training',
          'Implement multi-factor authentication',
        ],
      });
    }

    setReports(generatedReports);
  }, []);

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const reportContent = `
CYBER SECURITY THREAT REPORT
Generated: ${report.generatedAt.toLocaleString()}
Period: ${report.period.start.toLocaleDateString()} - ${report.period.end.toLocaleDateString()}

SUMMARY
-------
Total Threats: ${report.summary.totalThreats}
Critical: ${report.summary.criticalThreats}
High: ${report.summary.highThreats}
Medium: ${report.summary.mediumThreats}
Low: ${report.summary.lowThreats}
Blocked: ${report.summary.blockedThreats}
Resolved: ${report.summary.resolvedThreats}

RECOMMENDATIONS
---------------
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

DETAILED THREATS
----------------
${report.threats.map(t => `
[${t.level.toUpperCase()}] ${t.type.replace('_', ' ').toUpperCase()}
Time: ${t.timestamp.toLocaleString()}
Source: ${t.source}
Target: ${t.target}
Description: ${t.description}
Status: ${t.blocked ? 'BLOCKED' : 'DETECTED'}${t.resolved ? ' - RESOLVED' : ''}
`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${report.period.start.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully');
  };

  const handleGenerateReport = () => {
    toast.info('Generating new report...');
    setTimeout(() => {
      const threats = generateThreats(Math.floor(Math.random() * 50) + 20);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();

      const summary = {
        totalThreats: threats.length,
        criticalThreats: threats.filter(t => t.level === 'critical').length,
        highThreats: threats.filter(t => t.level === 'high').length,
        mediumThreats: threats.filter(t => t.level === 'medium').length,
        lowThreats: threats.filter(t => t.level === 'low').length,
        blockedThreats: threats.filter(t => t.blocked).length,
        resolvedThreats: threats.filter(t => t.resolved).length,
      };

      const newReport: ThreatReport = {
        id: `report-new-${Date.now()}`,
        generatedAt: new Date(),
        period: { start: startDate, end: endDate },
        summary,
        threats,
        recommendations: [
          'Increase monitoring on high-risk ports',
          'Update firewall rules to block suspicious IPs',
          'Review and update security policies',
        ],
      };

      setReports(prev => [newReport, ...prev]);
      toast.success('New report generated successfully');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Threat Reports</h1>
          <p className="text-muted-foreground mt-1">
            Historical threat analysis and security recommendations
          </p>
        </div>
        <Button onClick={handleGenerateReport} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {reports.length > 0 && (
        <ThreatBarChart
          data={reports.slice(0, 5).reverse().map(r => ({
            name: r.period.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: r.summary.totalThreats,
          }))}
          title="Threat Trends (Last 5 Days)"
          colors={['hsl(var(--destructive))']}
        />
      )}

      <div className="space-y-6">
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold mt-1">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Threats/Day</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.floor(
                    reports.reduce((sum, r) => sum + r.summary.totalThreats, 0) /
                      reports.length
                  )}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Block Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {(
                    (reports.reduce((sum, r) => sum + r.summary.blockedThreats, 0) /
                      reports.reduce((sum, r) => sum + r.summary.totalThreats, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {(
                    (reports.reduce((sum, r) => sum + r.summary.resolvedThreats, 0) /
                      reports.reduce((sum, r) => sum + r.summary.totalThreats, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.map((report, index) => {
          const prevReport = reports[index + 1];
          const threatTrend = prevReport
            ? ((report.summary.totalThreats - prevReport.summary.totalThreats) /
                prevReport.summary.totalThreats) *
              100
            : 0;

          return (
            <Card key={report.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">
                        {report.period.start.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generated on{' '}
                        {report.generatedAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {report.generatedAt.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold mt-1">
                      {report.summary.totalThreats}
                    </p>
                    {prevReport && (
                      <div className="flex items-center gap-1 mt-1">
                        {threatTrend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-destructive" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-success" />
                        )}
                        <span
                          className={`text-xs ${threatTrend > 0 ? 'text-destructive' : 'text-success'}`}
                        >
                          {Math.abs(threatTrend).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-xs text-muted-foreground">Critical</p>
                    <p className="text-lg font-bold mt-1 text-destructive">
                      {report.summary.criticalThreats}
                    </p>
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                    <p className="text-xs text-muted-foreground">High</p>
                    <p className="text-lg font-bold mt-1 text-warning">
                      {report.summary.highThreats}
                    </p>
                  </div>
                  <div className="p-3 bg-info/10 border border-info rounded-lg">
                    <p className="text-xs text-muted-foreground">Medium</p>
                    <p className="text-lg font-bold mt-1 text-info">
                      {report.summary.mediumThreats}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Low</p>
                    <p className="text-lg font-bold mt-1">
                      {report.summary.lowThreats}
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 border border-success rounded-lg">
                    <p className="text-xs text-muted-foreground">Blocked</p>
                    <p className="text-lg font-bold mt-1 text-success">
                      {report.summary.blockedThreats}
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 border border-success rounded-lg">
                    <p className="text-xs text-muted-foreground">Resolved</p>
                    <p className="text-lg font-bold mt-1 text-success">
                      {report.summary.resolvedThreats}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {report.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">
                          {i + 1}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
