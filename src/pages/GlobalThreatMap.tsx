import { Shield } from 'lucide-react';
import AdvancedThreatMap from '@/components/security/AdvancedThreatMap';

export default function GlobalThreatMap() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Global Threat Map</h1>
        </div>
        <p className="text-muted-foreground">
          Real-time visualization of cyber threats across 30+ global locations. Monitor threat locations, severity levels, attack patterns, and incident trends.
        </p>
      </div>

      <AdvancedThreatMap />
    </div>
  );
}
