import { cn } from '@/lib/utils';
import { getStatusColor, getStatusBgColor } from '@/lib/utils/dataGenerator';

interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical';
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  showDot = true,
  className,
}: StatusIndicatorProps) {
  const statusLabels = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showDot && (
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'healthy' && 'bg-success',
            status === 'warning' && 'bg-warning',
            status === 'critical' && 'bg-destructive'
          )}
        />
      )}
      <span className={cn('text-sm font-medium', getStatusColor(status))}>
        {label || statusLabels[status]}
      </span>
    </div>
  );
}
