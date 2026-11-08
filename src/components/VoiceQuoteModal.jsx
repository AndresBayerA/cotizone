import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, ArrowRight, X, Play, RotateCcw, Check, Edit3 } from 'lucide-react';
import { parseVoiceQuoteText, deduplicateSpeech } from '../utils/voiceParser';

const SAMPLE_VOICE_NOTES = [
  {
    title: "Venta / Heladería & Alimentos",
    duration: "0:09",
    text: "Para Don Matthew, necesito que le cotices tres helados a $50.000 cada uno"
  },
  {
    title: "Fontanería / Termo eléctrico",
    duration: "0:14",
    text: "Para Don Rodrigo: instalar termo eléctrico de 100 litros, 3 horas de mano de obra y desmonte a 380 mil pesos"
  },
  {
    title: "Electricidad / Tablero y luces",
    duration: "0:12",
    text: "Cotizar a Farmacia San Juan: cambio de automáticos y 6 focos LED empotrados a 450 mil pesos en total"
  }
];

export default function VoiceQuoteModal({ onClose, onQuoteGenerated }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // On Android Chrome, continuous=false is strictly required to prevent infinite sentence looping
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-CO'; // Español Colombia

      recognition.onresult = (event) => {
        let textResult = '';
        // Extract the latest spoken sentence
        for (let i = 0; i < event.results.length; i++) {
          textResult += event.results[i][0].transcript + ' ';
        }
        
        // Remove duplicate loops caused by mobile speech engines
        const cleaned = deduplicateSpeech(textResult);
        setTranscript(cleaned);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition status:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Puedes probar con los audios de ejemplo o escribir abajo.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const handleUseSample = (sample) => {
    setTranscript(sample.text);
    processAudioText(sample.text);
  };

  const processAudioText = (textToProcess) => {
    const raw = (textToProcess || transcript).trim();
    if (!raw) return;

    setIsProcessing(true);

    setTimeout(() => {
      const parsedQuote = parseVoiceQuoteText(raw);
      setIsProcessing(false);
      onQuoteGenerated(parsedQuote);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-900">Voice-to-Quote con IA</h2>
                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  IA Colombia
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Dicta como en una nota de WhatsApp; la IA arma la cotización.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Recording Center */}
        <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isRecording
                ? 'bg-rose-600 text-white ring-8 ring-rose-100 scale-105 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10" />}
          </button>

          <p className="mt-4 font-bold text-slate-800 text-xs sm:text-sm">
            {isRecording ? '🔴 Grabando... Di tu frase ahora' : 'Toca el micrófono para hablar'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs sm:max-w-sm">
            Toca el botón, di tu frase clara y toca para detener cuando termines.
          </p>

          {/* Transcript Box with Live Editability */}
          {transcript && (
            <div className="mt-5 w-full text-left bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <span>Texto Capturado:</span>
                <span className="flex items-center gap-1 text-slate-500 normal-case">
                  <Edit3 className="w-3 h-3" /> Puedes editar si deseas
                </span>
              </div>
              
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
              
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Borrar
                </button>

                <button
                  type="button"
                  onClick={() => processAudioText(transcript)}
                  disabled={isProcessing || !transcript.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isProcessing ? 'Procesando...' : 'Convertir en Cotización'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preset Samples */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            O prueba con audios de ejemplo con 1 toque:
          </span>

          <div className="space-y-2">
            {SAMPLE_VOICE_NOTES.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleUseSample(sample)}
                className="group p-2.5 sm:p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition">
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-950 truncate">{sample.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">"{sample.text}"</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
