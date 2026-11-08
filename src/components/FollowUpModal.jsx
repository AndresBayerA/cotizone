import React, { useState } from 'react';
import { X, Send, Bot, Clock, Sparkles, MessageCircle, Check, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency, calculateTotals } from '../utils/storage';

export default function FollowUpModal({ quote, business, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [copied, setCopied] = useState(false);
  const [autoFollowUp, setAutoFollowUp] = useState(true);

  const totals = calculateTotals(quote.items, quote.discountPercent, quote.taxPercent);
  const cleanPhone = (quote.clientPhone || '').replace(/\D/g, '');

  const templates = [
    {
      title: "Seguimiento Amistoso (24h - 48h)",
      desc: "Ideal para romper el hielo y consultar dudas técnicas",
      message: `Hola *${quote.clientName}*, ¿cómo estás? Te escribo de parte de *${business.name}*. Quería consultar si tuviste oportunidad de revisar la propuesta del trabajo (${quote.id}). Si tienes alguna duda sobre los materiales o los plazos, con gusto lo revisamos juntos.`
    },
    {
      title: "Reserva de Agenda y Disponibilidad",
      desc: "Genera urgencia sana para que confirmen su fecha",
      message: `Hola *${quote.clientName}*, te saluda el equipo de *${business.name}*. Estamos cerrando el calendario de obras e instalaciones para la próxima semana. Si deseas que te reservemos las fechas de tu proyecto, confírmanos por aquí o con tu firma en el enlace: https://cotizone.app/p/${quote.id}`
    },
    {
      title: "Garantía de Precios de Materiales",
      desc: "Excelente cuando los clientes postergan la decisión",
      message: `Hola *${quote.clientName}*, un saludo cordial. Te recordamos que la cotización *${quote.id}* por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}* tiene los precios de materiales congelados durante su período de validez. ¡Quedamos listos para iniciar cuando nos indiques!`
    }
  ];

  const currentMsg = templates[selectedTemplate].message;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentMsg)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Follow-up Fantasma (IA)</h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Cerrador de Ventas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                El 60% de los presupuestos se cierran con un seguimiento oportuno.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Status Card */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Cliente:</span>
            <span className="font-extrabold text-slate-900 text-sm">{quote.clientName}</span>
            <span className="text-slate-500 ml-2">({quote.id})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold text-[11px] border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> Pendiente de Respuesta
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {formatCurrency(totals.total, business.currency, business.currencySymbol)}
            </span>
          </div>
        </div>

        {/* Template Selector */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Selecciona la estrategia de seguimiento:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {templates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTemplate(idx)}
                className={`p-3 rounded-2xl text-left border transition ${
                  selectedTemplate === idx
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{t.title}</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl mb-6 relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Mensaje redactado por IA para WhatsApp
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {copied ? '¡Copiado!' : 'Copiar texto'}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
            {currentMsg}
          </p>
        </div>

        {/* Automation Toggle */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Piloto Automático de Seguimiento</h4>
              <p className="text-[11px] text-slate-500">Enviar recordatorio automático a las 48h si no hay firma</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutoFollowUp(!autoFollowUp)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              autoFollowUp ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                autoFollowUp ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Cerrar
          </button>

          {quote.clientPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition"
            >
              <Send className="w-4 h-4" />
              Enviar Seguimiento por WhatsApp
            </a>
          ) : (
            <button
              onClick={handleCopy}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
            >
              Copiar para enviar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
