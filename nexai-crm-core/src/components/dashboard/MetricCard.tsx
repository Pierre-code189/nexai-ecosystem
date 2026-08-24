import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: any;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  subtitle?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  isPositive = true,
  subtext,
  subtitle,
}) => {
  const displaySubtext = subtext || subtitle;

  const renderIcon = () => {
    if (!icon) return <Activity className="w-4 h-4 text-blue-400" />;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="w-4 h-4 text-blue-400" />;
  };

  return (
    <Card className="hover:border-slate-700 transition-all bg-slate-900 border-slate-800 shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-100 tracking-tight font-mono">{value}</span>
          {change && (
            <span
              className={cn(
                'inline-flex items-center text-xs font-semibold',
                isPositive ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
        </div>
        {displaySubtext && <p className="text-[11px] text-slate-500 mt-1 font-medium">{displaySubtext}</p>}
      </CardContent>
    </Card>
  );
};
