import React, { useState } from 'react';
import { 
  Sparkles, Mic, CheckCircle2, Bot, ArrowRight, 
  CreditCard, ShieldCheck, Zap, MessageCircle, Star, 
  Smartphone, Clock, DollarSign, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function LandingPage({ onGoToApp, onOpenVoiceDemo, onOpenPricing }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [quotesPerMonth, setQuotesPerMonth] = useState(8);
  const [avgTicket, setAvgTicket] = useState(650000); // COP

  const recoveredJobs = Math.max(1, Math.round(quotesPerMonth * 0.25));
  const additionalRevenue = recoveredJobs * avgTicket;

  const faqs = [
    {
      q: "¿Mis clientes tienen que descargar alguna aplicación?",
      a: "No, en lo absoluto. Tu cliente recibe un enlace limpio por WhatsApp (ej. cotizone.app/p/123), lo abre en el navegador de su teléfono, revisa el detalle del trabajo, firma con el dedo y puede pagar el anticipo en 1 minuto."
    },
    {
      q: "¿Tiene validez legal en Colombia y otros países?",
      a: "Sí. En Colombia, la Ley 527 de 1999 (Comercio Electrónico y Mensajes de Datos) le da plena validez jurídica a las firmas electrónicas y aceptaciones por WhatsApp. Además, cumple con normativas internacionales equivalentes en México, España y Estados Unidos."
    },
    {
      q: "¿Cómo funciona el cobro de anticipos por Nequi o tarjeta?",
      a: "Al momento de firmar, la pantalla le permite a tu cliente abonar el anticipo definido (por ejemplo, el 30% o 50%) transfiriendo directamente a tu Nequi, Bancolombia / PSE o tarjeta bancaria, asegurando los fondos para comprar materiales."
    },
    {
      q: "¿Cómo funciona el dictado por voz (Voice-to-Quote)?",
      a: "Tocas el micrófono o envías una nota de voz informal de 15 segundos tal como hablas en WhatsApp. Nuestra IA identifica el cliente, desglosa los conceptos de mano de obra y materiales, calcula precios y te entrega el presupuesto formal maquetado al instante."
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            La primera app con Voice-to-Quote en WhatsApp para Colombia y Latinoamérica
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Deja de perder trabajos por llegar tarde a hacer cotizaciones en Excel
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manda un <strong>audio de 15 segundos</strong> mientras conduces y la IA arma tu presupuesto formal. Tu cliente <strong>firma en su móvil, abona el anticipo por Nequi</strong> y la IA cierra las ventas por ti.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-105 transition"
            >
              <Zap className="w-5 h-5" />
              Probar CotiZone Gratis Ahora
            </button>

            <button
              onClick={onOpenVoiceDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Mic className="w-5 h-5 text-indigo-600" />
              Ver Demo de Voz (IA)
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Compatible con Nequi y PSE
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Válido legalmente en Colombia
            </span>
          </div>

          {/* Product Preview Mockup */}
          <div className="mt-14 relative max-w-4xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 to-transparent border border-indigo-100 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    CZ
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Presupuesto Rápido por WhatsApp</h4>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Firmado con el dedo & Seña Pagada por Nequi
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-indigo-600 font-mono">$ 850.000 COP</span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold block text-slate-900">1. Dictado por audio</span>
                  <span>"Instalar tubería y reparar fuga en cocina..."</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold block text-slate-900">2. Envío con 1 clic</span>
                  <span>Link interactivo enviado por WhatsApp al cliente.</span>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-emerald-900">3. Cierre inmediato</span>
                  <span>Firma táctil + $250.000 COP abonados al instante.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Killer Hooks Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Tu ventaja desleal frente a la competencia
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Tres tecnologías que te hacen ganar más dinero cada semana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hook 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition hover:shadow-lg group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 group-hover:scale-110 transition">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Voice-to-Quote (IA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Olvídate de teclear en pantallas pequeñas. Dicta un audio de 15 segundos como si le hablaras a un amigo y la IA desglosa materiales, mano de obra e impuestos con formato impecable.
              </p>
            </div>

            {/* Hook 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition hover:shadow-lg group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-6 group-hover:scale-110 transition">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Firma + Nequi / PSE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                El cliente firma con el dedo en su móvil y transfiere el anticipo del 30% o 50% al momento. No arriesgues tu dinero comprando materiales sin tener la seña en tu cuenta.
              </p>
            </div>

            {/* Hook 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition hover:shadow-lg group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 group-hover:scale-110 transition">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Follow-up Fantasma</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                El 60% de los presupuestos se pierden porque el profesional no hace seguimiento. La IA envía mensajes respetuosos y persuasivos por WhatsApp para reactivar a los clientes que no responden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Calculadora de Retorno de Inversión
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">
              ¿Cuánto dinero extra puedes ganar con CotiZone?
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Si recuperas solo 1 trabajo al mes que antes perdías por tardar en cotizar, el plan se paga solo diez veces.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cotizaciones que envías al mes: <strong className="text-white text-base ml-1">{quotesPerMonth}</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={quotesPerMonth}
                  onChange={(e) => setQuotesPerMonth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cobro promedio por trabajo: <strong className="text-white text-base ml-1">${(avgTicket).toLocaleString('es-CO')} COP</strong>
                </label>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="50000"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Ingreso adicional estimado al mes:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  + ${(additionalRevenue).toLocaleString('es-CO')} COP
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cerrando aproximadamente <strong>{recoveredJobs} trabajos adicionales</strong> con respuesta rápida y seguimiento.
                </p>
              </div>

              <button
                onClick={onOpenPricing}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition whitespace-nowrap"
              >
                Ver Planes desde $59.000 COP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Preguntas Frecuentes</h2>
          <p className="text-xs text-slate-500 mt-1">Todo lo que necesitas saber antes de empezar</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-black text-slate-900">¿Listo para modernizar tu negocio hoy?</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Prueba gratis sin tarjeta de crédito y crea tu primera cotización en 1 minuto.</p>
          <button
            onClick={onGoToApp}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition"
          >
            Comenzar Prueba Gratuita Ahora
          </button>
        </div>
      </section>

    </div>
  );
}
