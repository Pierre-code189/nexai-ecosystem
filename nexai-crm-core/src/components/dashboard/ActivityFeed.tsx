'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCRMData } from '@/context/CRMDataContext';
import { formatTimeAgo } from '@/lib/utils';
import { Activity, UserPlus, DollarSign, MessageSquare, ArrowRight, Bot } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { activities } = useCRMData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact_created':
        return <UserPlus className="w-3.5 h-3.5 text-blue-400" />;
      case 'deal_created':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'deal_moved':
        return <ArrowRight className="w-3.5 h-3.5 text-purple-400" />;
      case 'whatsapp_message':
        return <MessageSquare className="w-3.5 h-3.5 text-green-400" />;
      case 'bot_reply':
        return <Bot className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Actividad Reciente del Negocio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-1">
            <span>No hay actividad registrada recientemente.</span>
            <p className="text-[11px] text-slate-600">Las nuevas oportunidades y mensajes de WhatsApp aparecerán aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="p-2 bg-slate-900 rounded-lg flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  {formatTimeAgo(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
