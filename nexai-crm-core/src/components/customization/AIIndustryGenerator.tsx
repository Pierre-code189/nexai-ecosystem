'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { useCRMData } from '@/context/CRMDataContext';
import { AISchemaDiscoveryEngine, GeneratedIndustrySchema } from '@/lib/solid/AISchemaDiscoveryEngine';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Wand2, Check, ArrowRight, Layers, Tag, MessageSquare, Palette } from 'lucide-react';

export const AIIndustryGenerator: React.FC = () => {
  const { currentTenant, updateTenant, updateTheme } = useTenant();
  const { updateStages } = useCRMData();

  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<GeneratedIndustrySchema | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const engine = new AISchemaDiscoveryEngine();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setGeneratedSchema(null);
    setIsApplied(false);

    try {
      const result = await engine.analyzeAndGenerateSchema(promptInput.trim(), currentTenant.name);
      setGeneratedSchema(result);
    } catch (err) {
      console.error('Error generando esquema con IA:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySchema = async () => {
    if (!generatedSchema) return;

    await updateTenant({
      name: currentTenant.name,
      industry: 'custom',
      stages: generatedSchema.stages,
      customFields: [...generatedSchema.contactFields, ...generatedSchema.dealFields],
      whatsappBotPrompt: generatedSchema.botSystemPrompt,
      theme: {
        ...currentTenant.theme,
        primaryColor: generatedSchema.theme.primaryColor,
        secondaryColor: generatedSchema.theme.secondaryColor,
        accentColor: generatedSchema.theme.accentColor,
      },
    });

    await updateTheme({
      primaryColor: generatedSchema.theme.primaryColor,
      secondaryColor: generatedSchema.theme.secondaryColor,
    });

    await updateStages(generatedSchema.stages);

    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 3000);
  };

  return (
    <Card className="border-blue-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Generador Inteligente de Cascarón por IA
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                Auto-Discovery
              </span>
            </CardTitle>
            <CardDescription>
              Escribe qué hace tu negocio en lenguaje natural. La IA detectará el rubro y configurará automáticamente todas las etapas, campos dinámicos, terminología y prompts del bot.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulario de Entrada */}
        <form onSubmit={handleGenerate} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Describe tu negocio, productos o servicios:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={2}
              placeholder="Ej. Tengo una Dark Kitchen de pizzas artesanales en Piura llamada Kira's Pizza con delivery por WhatsApp..."
              className="flex-1 p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <Button
              type="submit"
              isLoading={isGenerating}
              disabled={!promptInput.trim()}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="sm:w-48 self-stretch"
            >
              Analizar & Sintetizar
            </Button>
          </div>
        </form>

        {/* Preview del Esquema Generado por IA */}
        {generatedSchema && (
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 font-mono">
                  Rubro Identificado por IA
                </span>
                <h3 className="text-base font-extrabold text-slate-100">{generatedSchema.detectedRubro}</h3>
                <p className="text-xs text-slate-400">{generatedSchema.description}</p>
              </div>
              <Button
                variant="success"
                onClick={handleApplySchema}
                leftIcon={isApplied ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              >
                {isApplied ? '¡CRM Adaptado con Éxito!' : 'Aplicar este Cascarón al CRM'}
              </Button>
            </div>

            {/* Grid de Atributos Sintetizados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Etapas */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" /> Etapas del Pipeline ({generatedSchema.stages.length})
                </div>
                <div className="space-y-1.5">
                  {generatedSchema.stages.map((stg, i) => (
                    <div key={stg.id} className="flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stg.color }} />
                      <span className="text-[11px] font-medium">{stg.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campos Dinámicos */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Campos Personalizados Creados
                </div>
                <div className="space-y-1">
                  {[...generatedSchema.contactFields, ...generatedSchema.dealFields].map((fld) => (
                    <div key={fld.id} className="text-[11px] text-slate-300 font-mono">
                      • {fld.label} ({fld.entityType})
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompt y Marca */}
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Prompt IA Optimizado
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-4 leading-relaxed font-mono">
                  {generatedSchema.botSystemPrompt}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
