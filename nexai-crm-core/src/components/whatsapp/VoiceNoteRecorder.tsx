'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Play } from 'lucide-react';

interface VoiceNoteRecorderProps {
  onSendVoiceNote: (transcription: string) => Promise<void>;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onSendVoiceNote }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration((p) => p + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setIsTranscribing(true);

    // Simular transcripción de voz real procesada por Whisper
    setTimeout(async () => {
      await onSendVoiceNote('Hola, quería consultar sobre los precios y disponibilidad para esta semana.');
      setIsTranscribing(false);
      setRecordingDuration(0);
    }, 1200);
  };

  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          Grabador de Notas de Voz (Whisper IA)
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
          {isRecording ? `Grabando: ${recordingDuration}s` : 'Micrófono Listo'}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isTranscribing}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Transcribiendo audio con Whisper...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Grabar Nota de Voz</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 animate-pulse transition-all"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>Detener y Enviar Audio ({recordingDuration}s)</span>
          </button>
        )}
      </div>
    </div>
  );
};
