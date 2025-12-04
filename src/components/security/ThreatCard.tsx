import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getThreatLevelColor, getThreatLevelBgColor } from '@/lib/utils/threatGenerator';
import type { Threat } from '@/types';
import { Shield, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

interface ThreatCardProps {
  threat: Threat;
  className?: string;
}

export function ThreatCard({ threat, className }: ThreatCardProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <Card className={cn('shadow-card hover:shadow-hover transition-all', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {threat.blocked ? (
              <ShieldCheck className="h-5 w-5 text-success" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            )}
            <h3 className="font-semibold text-sm capitalize">
              {threat.type.replace('_', ' ')}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn('text-xs', getThreatLevelBgColor(threat.level))}
          >
            <span className={getThreatLevelColor(threat.level)}>
              {threat.level.toUpperCase()}
            </span>
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Source:</span>
            <p className="font-mono font-medium">{threat.source}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Target:</span>
            <p className="font-mono font-medium">{threat.target}</p>
          </div>
          {threat.protocol && (
            <div>
              <span className="text-muted-foreground">Protocol:</span>
              <p className="font-medium">{threat.protocol}</p>
            </div>
          )}
          {threat.port && (
            <div>
              <span className="text-muted-foreground">Port:</span>
              <p className="font-medium">{threat.port}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(threat.timestamp)}
          </div>
          <div className="flex gap-2">
            {threat.blocked && (
              <Badge variant="secondary" className="text-xs">
                Blocked
              </Badge>
            )}
            {threat.resolved && (
              <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                Resolved
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
