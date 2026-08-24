'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Search, Globe, CheckCircle2 } from 'lucide-react';

export const SEOOptimizationPanel: React.FC<{ businessName: string; tagline: string; industry: string }> = ({
  businessName, tagline, industry,
}) => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-400" /> Optimización SEO & Schema.org por IA
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">100% Score</span>
      </div>
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-[11px]">
        <div className="text-blue-400 font-bold truncate">&lt;title&gt;{businessName} | {tagline}&lt;/title&gt;</div>
        <div className="text-emerald-400 truncate">&lt;meta name="description" content="Descubre los mejores productos de {industry} en Piura..." /&gt;</div>
        <div className="text-slate-500">&lt;script type="application/ld+json"&gt; &#123; "@type": "LocalBusiness", "name": "{businessName}" &#125; &lt;/script&gt;</div>
      </div>
    </div>
  );
};
