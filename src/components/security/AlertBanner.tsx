import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  className?: string;
}

export function AlertBanner({ type, title, description, className }: AlertBannerProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
    success: CheckCircle,
  };

  const styles = {
    info: 'border-info/50 bg-info/10 text-info-foreground',
    warning: 'border-warning/50 bg-warning/10 text-warning-foreground',
    error: 'border-destructive/50 bg-destructive/10 text-destructive-foreground',
    success: 'border-success/50 bg-success/10 text-success-foreground',
  };

  const Icon = icons[type];

  return (
    <Alert className={cn(styles[type], className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
