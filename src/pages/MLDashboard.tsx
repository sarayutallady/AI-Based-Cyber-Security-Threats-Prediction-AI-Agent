import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThreatBarChart } from '@/components/security/ThreatBarChart';
import {
  getDefaultMLModels,
  simulateModelTraining,
  completeModelTraining,
  formatMetricValue,
  getMetricColor,
} from '@/lib/utils/mlSimulator';
import { toast } from 'sonner';
import type { MLModel } from '@/types';
import {
  Brain,
  TrendingUp,
  Play,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap,
  RefreshCw,
} from 'lucide-react';

export default function MLDashboard() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [trainingModel, setTrainingModel] = useState<string | null>(null);

  useEffect(() => {
    setModels(getDefaultMLModels());
  }, []);

  const handleTrainModel = (modelId: string) => {
    setTrainingModel(modelId);
    const modelName = models.find(m => m.id === modelId)?.name;
    toast.info(`Training ${modelName}...`);
    
    setModels(prev =>
      prev.map(m => (m.id === modelId ? simulateModelTraining(m) : m))
    );

    setTimeout(() => {
      setModels(prev =>
        prev.map(m => (m.id === modelId ? completeModelTraining(m) : m))
      );
      setTrainingModel(null);
      toast.success(`${modelName} training completed!`);
    }, 5000);
  };

  const handleRetrainAll = () => {
    toast.info('Retraining all models...');
    models.forEach((model, index) => {
      setTimeout(() => {
        handleTrainModel(model.id);
      }, index * 1000);
    });
  };

  const getStatusIcon = (status: MLModel['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'training':
        return <Play className="h-4 w-4 text-info animate-pulse" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <BarChart3 className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: MLModel['status']) => {
    const styles = {
      active: 'bg-success/10 text-success border-success',
      training: 'bg-info/10 text-info border-info',
      inactive: 'bg-muted text-muted-foreground border-border',
      evaluating: 'bg-warning/10 text-warning border-warning',
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const activeModels = models.filter(m => m.status === 'active').length;
  const avgAccuracy =
    models.reduce((sum, m) => sum + m.metrics.accuracy, 0) / models.length;

  return (
    <div className="min-h-screen bg-gradient-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">ML Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Machine Learning model performance and training
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRetrainAll} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retrain All
          </Button>
          <Button variant="outline" className="gap-2">
            <Brain className="h-4 w-4" />
            Deploy New Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold mt-1">{activeModels}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold mt-1">
                  {formatMetricValue(avgAccuracy)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold mt-1">{models.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predictions/s</p>
                <p className="text-2xl font-bold mt-1">1,247</p>
              </div>
              <Zap className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {models.map(model => (
          <Card key={model.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(model.status)}
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {model.type} • {model.version}
                    </p>
                  </div>
                </div>
                {getStatusBadge(model.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className={`text-lg font-bold ${getMetricColor(model.metrics.accuracy)}`}>
                    {formatMetricValue(model.metrics.accuracy)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Precision</p>
                  <p className={`text-lg font-bold ${getMetricColor(model.metrics.precision)}`}>
                    {formatMetricValue(model.metrics.precision)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Recall</p>
                  <p className={`text-lg font-bold ${getMetricColor(model.metrics.recall)}`}>
                    {formatMetricValue(model.metrics.recall)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">F1 Score</p>
                  <p className={`text-lg font-bold ${getMetricColor(model.metrics.f1Score)}`}>
                    {formatMetricValue(model.metrics.f1Score)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">False Positive Rate</span>
                    <span className={`font-medium ${getMetricColor(model.metrics.falsePositiveRate, true)}`}>
                      {formatMetricValue(model.metrics.falsePositiveRate)}
                    </span>
                  </div>
                  <Progress
                    value={model.metrics.falsePositiveRate * 100}
                    className="h-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">False Negative Rate</span>
                    <span className={`font-medium ${getMetricColor(model.metrics.falseNegativeRate, true)}`}>
                      {formatMetricValue(model.metrics.falseNegativeRate)}
                    </span>
                  </div>
                  <Progress
                    value={model.metrics.falseNegativeRate * 100}
                    className="h-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Data Source: </span>
                  <Badge variant="secondary" className="ml-1">
                    {model.dataSource}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTrainModel(model.id)}
                  disabled={model.status === 'training' || trainingModel !== null}
                  className="gap-2"
                >
                  {model.status === 'training' ? (
                    <>
                      <Play className="h-3 w-3 animate-pulse" />
                      Training...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Retrain
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Last updated:{' '}
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(model.metrics.lastUpdated)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ThreatBarChart 
        data={models.map(m => ({ name: m.name, value: m.metrics.accuracy * 100 }))}
        title="Model Accuracy Comparison"
        colors={['hsl(var(--primary))']}
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Model Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map(model => (
              <div key={model.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-muted-foreground">
                    {formatMetricValue(model.metrics.accuracy)}
                  </span>
                </div>
                <Progress value={model.metrics.accuracy * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
