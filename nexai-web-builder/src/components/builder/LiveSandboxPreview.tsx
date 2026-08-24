'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Copy, Check, ExternalLink, Code2, AlertTriangle, Sparkles, Terminal } from 'lucide-react';

interface LiveSandboxPreviewProps {
  jsxCode: string;
  title?: string;
  deviceView?: 'desktop' | 'tablet' | 'mobile';
}

export const LiveSandboxPreview: React.FC<LiveSandboxPreviewProps> = ({
  jsxCode,
  title = 'Vista Previa Sandbox',
  deviceView = 'desktop',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildSandboxHtml = (code: string) => {
    // Sanitizar código para extraer componente principal App
    let cleanCode = code.trim();
    cleanCode = cleanCode.replace(/^import\s+.*?;?\s*$/gm, ''); // Remover imports para runtime UMD de Babel

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- React 18 UMD -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- Babel Standalone para Compilación en Caliente en el Navegador -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #020617;
      color: #f8fafc;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #090d16; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo } = React;

    // Error Boundary Interno para atrapar errores de ejecución sin romper la UI
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, errorInfo) {
        window.parent.postMessage({ type: 'SANDBOX_ERROR', message: error.message }, '*');
      }
      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
              <div className="max-w-md p-6 bg-red-950/40 border border-red-500/40 rounded-3xl text-center space-y-3 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">⚠️</div>
                <h3 className="text-base font-black text-white">Error de Ejecución en el Sandbox</h3>
                <p className="text-xs text-red-300 font-mono text-left bg-slate-950 p-3 rounded-xl overflow-x-auto">
                  {this.state.error ? this.state.error.toString() : 'Error inesperado al renderizar el componente.'}
                </p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all">
                  Reintentar Renderizado
                </button>
              </div>
            </div>
          );
        }
        return this.props.children;
      }
    }

    try {
      ${cleanCode}

      // Detectar componente exportado o nombrado App
      const ComponentToRender = typeof App !== 'undefined' ? App : () => (
        <div className="p-8 text-center text-slate-400 text-xs">
          El componente no exporta una función App() válida.
        </div>
      );

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <ErrorBoundary>
          <ComponentToRender />
        </ErrorBoundary>
      );
      window.parent.postMessage({ type: 'SANDBOX_SUCCESS' }, '*');
    } catch (err) {
      window.parent.postMessage({ type: 'SANDBOX_ERROR', message: err.message }, '*');
    }
  </script>
</body>
</html>`;
  };

  const updateIframeContent = () => {
    setError(null);
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(buildSandboxHtml(jsxCode));
      doc.close();
    }
  };

  useEffect(() => {
    updateIframeContent();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SANDBOX_ERROR') {
        setError(event.data.message);
      } else if (event.data?.type === 'SANDBOX_SUCCESS') {
        setError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [jsxCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(jsxCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerStyles = {
    desktop: 'w-full h-full shadow-2xl rounded-3xl overflow-hidden border border-slate-800',
    tablet: 'max-w-2xl w-full h-full mx-auto shadow-2xl border border-slate-700 rounded-3xl overflow-hidden',
    mobile: 'max-w-sm w-full h-full mx-auto shadow-2xl border border-slate-700 rounded-3xl overflow-hidden',
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start relative">
      {/* Sandbox Top Control Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between pb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Sandbox Runtime
          </span>
          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
            React 18 + Tailwind CSS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar JSX'}</span>
          </button>
          <button
            onClick={updateIframeContent}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            title="Recargar Sandbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Alert Pill if any */}
      {error && (
        <div className="w-full max-w-6xl mb-3 p-3 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-center justify-between text-xs text-red-200 font-mono shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="truncate">{error}</span>
          </div>
          <button onClick={updateIframeContent} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold flex-shrink-0 ml-2">
            Reintentar
          </button>
        </div>
      )}

      {/* Virtual Browser Iframe */}
      <div className={`flex-1 ${containerStyles[deviceView]} bg-slate-950 transition-all duration-300 relative`}>
        <iframe
          ref={iframeRef}
          title="Live React Sandbox by Apio"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="w-full h-full border-0 bg-slate-950"
        />
      </div>
    </div>
  );
};
