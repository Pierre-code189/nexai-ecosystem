'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Upload, Sparkles, Check, Trash2 } from 'lucide-react';
import { RAGKnowledgeBaseService, KnowledgeDocument } from '@/lib/solid/RAGKnowledgeBaseService';

export const RAGKnowledgeBaseManager: React.FC = () => {
  const rag = new RAGKnowledgeBaseService();
  const [docs, setDocs] = useState<KnowledgeDocument[]>(rag.getDocuments());
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: KnowledgeDocument = {
        id: `doc_${Date.now()}`,
        title: 'Politicas_Garantia_y_Promociones.pdf',
        category: 'Políticas & Preguntas Frecuentes',
        chunkCount: 8,
        contentSnippet: 'Garantía de entrega en 45 min. Métodos de pago Yape, Plin y BCP.',
        uploadedAt: new Date().toISOString(),
      };
      setDocs((prev) => [newDoc, ...prev]);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Base de Conocimiento RAG (PDFs del Negocio)
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleSimulateUpload} isLoading={isUploading} leftIcon={<Upload className="w-3 h-3" />}>
            Subir PDF / Menú
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {docs.map((d) => (
          <div key={d.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="truncate">
                <p className="font-bold text-slate-200 truncate">{d.title}</p>
                <p className="text-[10px] text-slate-500">{d.category} • {d.chunkCount} fragmentos vectoriales</p>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">Indexado</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
