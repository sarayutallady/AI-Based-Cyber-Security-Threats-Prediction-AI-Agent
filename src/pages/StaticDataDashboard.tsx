import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreatCard } from '@/components/security/ThreatCard';
import { MetricCard } from '@/components/security/MetricCard';
import { ThreatBarChart } from '@/components/security/ThreatBarChart';
import { ThreatPieChart } from '@/components/security/ThreatPieChart';
import { Progress } from '@/components/ui/progress';
import { generateThreats } from '@/lib/utils/threatGenerator';
import { toast } from 'sonner';
import type { Threat } from '@/types';
import {
  Database,
  Upload,
  FileText,
  BarChart3,
  Filter,
  Download,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default function StaticDataDashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [datasetSize, setDatasetSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialThreats = generateThreats(8);
    setThreats(initialThreats);
    setDatasetSize(Math.floor(Math.random() * 50000) + 10000);
  }, []);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully`);
      setDatasetSize(Math.floor(Math.random() * 50000) + 10000);
      handleAnalyze();
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    toast.info('Starting data analysis...');

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          const newThreats = generateThreats(8);
          setThreats(newThreats);
          toast.success('Analysis completed successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleExport = () => {
    const data = threats.map(t => ({
      id: t.id,
      type: t.type,
      level: t.level,
      source: t.source,
      target: t.target,
      blocked: t.blocked,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `static-data-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const criticalCount = threats.filter(t => t.level === 'critical').length;
  const highCount = threats.filter(t => t.level === 'high').length;
  const blockedCount = threats.filter(t => t.blocked).length;

  const threatTypeData = [
    { name: 'Malware', value: threats.filter(t => t.type === 'malware').length },
    { name: 'Phishing', value: threats.filter(t => t.type === 'phishing').length },
    { name: 'DDoS', value: threats.filter(t => t.type === 'ddos').length },
    { name: 'Intrusion', value: threats.filter(t => t.type === 'intrusion').length },
    { name: 'Others', value: threats.filter(t => !['malware', 'phishing', 'ddos', 'intrusion'].includes(t.type)).length },
  ].filter(item => item.value > 0);

  const threatLevelData = [
    { name: 'Critical', value: criticalCount },
    { name: 'High', value: highCount },
    { name: 'Medium', value: threats.filter(t => t.level === 'medium').length },
    { name: 'Low', value: threats.filter(t => t.level === 'low').length },
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Static Data Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Analyze historical data and identify patterns
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleUpload} variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Dataset
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
          </Button>
        </div>
      </div>

      {isAnalyzing && (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Analysis Progress</span>
                <span className="font-medium">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Processing {datasetSize.toLocaleString()} records...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Dataset Size"
          value={datasetSize.toLocaleString()}
          icon={Database}
          description="Total records"
        />
        <MetricCard
          title="Critical Threats"
          value={criticalCount}
          icon={AlertTriangle}
          description="Requires immediate attention"
        />
        <MetricCard
          title="High Priority"
          value={highCount}
          icon={Shield}
          description="Elevated risk level"
        />
        <MetricCard
          title="Blocked"
          value={blockedCount}
          icon={Shield}
          description="Successfully prevented"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ThreatPieChart data={threatTypeData} title="Threat Types Distribution" />
        <ThreatBarChart 
          data={threatLevelData} 
          title="Threat Severity Levels"
          colors={['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--success))']}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detected Threats
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
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
              <CardTitle>Threat Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Malware</span>
                  <span className="font-medium">28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phishing</span>
                  <span className="font-medium">22%</span>
                </div>
                <Progress value={22} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">DDoS</span>
                  <span className="font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intrusion</span>
                  <span className="font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Other</span>
                  <span className="font-medium">17%</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Total Analyzed</p>
                <p className="text-2xl font-bold mt-1">{datasetSize.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Threats Found</p>
                <p className="text-2xl font-bold mt-1">{threats.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Detection Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {((threats.length / datasetSize) * 100).toFixed(3)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
