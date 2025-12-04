import type { MLModel, MLModelMetrics, DataSourceType } from '@/types';

export function generateMLModelMetrics(): MLModelMetrics {
  const accuracy = 0.85 + Math.random() * 0.12;
  const precision = 0.82 + Math.random() * 0.15;
  const recall = 0.80 + Math.random() * 0.17;
  const f1Score = (2 * precision * recall) / (precision + recall);
  const falsePositiveRate = Math.random() * 0.08;
  const falseNegativeRate = Math.random() * 0.10;
  const trainingTime = Math.floor(Math.random() * 300) + 60;

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    falsePositiveRate,
    falseNegativeRate,
    trainingTime,
    lastUpdated: new Date(),
  };
}

export function createMLModel(
  name: string,
  type: string,
  dataSource: DataSourceType
): MLModel {
  return {
    id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    status: 'active',
    metrics: generateMLModelMetrics(),
    dataSource,
    version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  };
}

export function getDefaultMLModels(): MLModel[] {
  return [
    createMLModel('Random Forest Classifier', 'Anomaly Detection', 'static'),
    createMLModel('Neural Network', 'Threat Classification', 'streaming'),
    createMLModel('SVM Classifier', 'Intrusion Detection', 'network'),
    createMLModel('Deep Learning Model', 'Malware Detection', 'static'),
    createMLModel('Gradient Boosting', 'DDoS Detection', 'streaming'),
    createMLModel('LSTM Network', 'Behavioral Analysis', 'network'),
  ];
}

export function simulateModelTraining(model: MLModel): MLModel {
  return {
    ...model,
    status: 'training',
    metrics: {
      ...model.metrics,
      lastUpdated: new Date(),
    },
  };
}

export function completeModelTraining(model: MLModel): MLModel {
  return {
    ...model,
    status: 'active',
    metrics: generateMLModelMetrics(),
  };
}

export function formatMetricValue(value: number, isPercentage = true): string {
  if (isPercentage) {
    return `${(value * 100).toFixed(2)}%`;
  }
  return value.toFixed(2);
}

export function getMetricColor(value: number, inverse = false): string {
  if (inverse) {
    if (value < 0.05) return 'text-success';
    if (value < 0.10) return 'text-warning';
    return 'text-destructive';
  }
  
  if (value >= 0.90) return 'text-success';
  if (value >= 0.75) return 'text-info';
  if (value >= 0.60) return 'text-warning';
  return 'text-destructive';
}
