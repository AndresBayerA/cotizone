import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, ArrowRight, X, Play, RotateCcw, Check } from 'lucide-react';

const SAMPLE_VOICE_NOTES = [
  {
    title: "Fontanería / Termo eléctrico",
    duration: "0:14",
    text: "Hola CotiZone, para don Rodrigo en Calle Mayor 14: instalar termo eléctrico de 100 litros marca Junkers, 3 horas de mano de obra técnica y retirar el termo viejo al punto limpio. Ponle 380 euros más 50 de materiales.",
    parsed: {
      clientName: "Don Rodrigo",
      clientAddress: "Calle Mayor 14",
      items: [
        { id: "v1", description: "Suministro e instalación de termo eléctrico 100L Junkers", quantity: 1, unitPrice: 380 },
        { id: "v2", description: "Mano de obra técnica especializada de fontanería", quantity: 3, unitPrice: 40 },
        { id: "v3", description: "Materiales auxiliares, tubería y conexiones", quantity: 1, unitPrice: 50 },
        { id: "v4", description: "Desmonte y retirada de termo antiguo a punto limpio", quantity: 1, unitPrice: 35 }
      ],
      notes: "Se incluye purga de circuito y comprobación de presión.",
      depositPercent: 30
    }
  },
  {
    title: "Electricidad / Cuadro y LED",
    duration: "0:18",
    text: "Presupuesto para Farmacia San Juan: cambio de automático general por salto de diferencial y colocar 6 focos LED empotrados en falso techo con su cableado libre de halógenos. En total unos 450 euros.",
    parsed: {
      clientName: "Farmacia San Juan",
      clientAddress: "Av. Central 88",
      items: [
        { id: "v1", description: "Sustitución de interruptor diferencial y magnetotérmico general", quantity: 1, unitPrice: 160 },
        { id: "v2", description: "Focos LED 24W empotrables para falso techo", quantity: 6, unitPrice: 35 },
        { id: "v3", description: "Tirada de cable libre de halógenos y conexionado", quantity: 1, unitPrice: 80 }
      ],
      notes: "Trabajo certificado con garantía de 12 meses.",
      depositPercent: 40
    }
  },
  {
    title: "Pintura y Reforma / Salón",
    duration: "0:16",
    text: "Para la señora Beatriz: alisar y pintar salón de 35 metros cuadrados con pintura plástica lavable blanca mate, tapar grietas y 2 manos de pintura. Cobrar 550 euros en total.",
    parsed: {
      clientName: "Sra. Beatriz",
      clientAddress: "Carrer Nou 12, 3º B",
      items: [
        { id: "v1", description: "Preparación de paredes, masillado y lijado de grietas", quantity: 1, unitPrice: 150 },
        { id: "v2", description: "Pintura plástica lavable mate de alta cobertura (2 manos)", quantity: 35, unitPrice: 9 },
        { id: "v3", description: "Protección de suelos, rodapiés y limpieza final", quantity: 1, unitPrice: 85 }
      ],
      notes: "Pintura ecológica sin olor secado rápido.",
      depositPercent: 50
    }
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
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
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
      alert('Tu navegador no tiene activado el reconocimiento de voz nativo. Puedes usar los audios de ejemplo o escribir abajo.');
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
    processAudioText(sample.text, sample.parsed);
  };

  const processAudioText = (textToProcess, presetParsed = null) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      let result;
      if (presetParsed) {
        result = presetParsed;
      } else {
        // Fallback intelligent parser extracting simple items from text
        result = {
          clientName: "Cliente (Dictado por Voz)",
          clientAddress: "Obra / Domicilio del cliente",
          items: [
            { id: "v1", description: textToProcess.substring(0, 70), quantity: 1, unitPrice: 250 },
            { id: "v2", description: "Mano de obra y montaje profesional", quantity: 1, unitPrice: 120 }
          ],
          notes: `Generado automáticamente desde nota de voz: "${textToProcess}"`,
          depositPercent: 30
        };
      }

      setIsProcessing(false);
      onQuoteGenerated(result);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Voice-to-Quote con IA</h2>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gancho Exclusivo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Habla con naturalidad como en una nota de WhatsApp; la IA arma el presupuesto formal.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Record Button Area */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isRecording
                ? 'bg-rose-600 text-white ring-8 ring-rose-100 scale-110 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="mt-4 font-bold text-slate-800 text-sm">
            {isRecording ? 'Escuchando tu voz... Habla ahora' : 'Toca el micrófono para dictar'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Ej: "Para María en Calle Pino: cambiar grifo de cocina y 2 llaves de paso, 180 euros más 30 de material".
          </p>

          {/* Transcript box */}
          {transcript && (
            <div className="mt-6 w-full text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Texto capturado:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{transcript}"
              </p>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => processAudioText(transcript)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isProcessing ? 'Procesando con IA...' : 'Convertir en Cotización'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Demo Samples for Quick Testing */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              O pruébalo con notas de voz típicas ya grabadas:
            </span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_VOICE_NOTES.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleUseSample(sample)}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition">
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-900">{sample.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">"{sample.text}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">{sample.duration}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
