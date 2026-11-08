import React, { useState } from 'react';
import { X, Check, Zap, Shield, Sparkles, Globe, DollarSign } from 'lucide-react';

export default function PricingModal({ onClose }) {
  const [currencyMode, setCurrencyMode] = useState('COP'); // 'COP' | 'USD'

  const handleSelectPlan = (planName) => {
    alert(`¡Excelente! Has seleccionado el ${planName}. En la versión de producción conectamos tu cuenta de Wompi (para Colombia con Nequi/PSE) o Stripe (para cobros internacionales en USD).`);
    onClose();
  };

  const isCOP = currencyMode === 'COP';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Currency Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Planes de Suscripción CotiZone
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Elige el plan para tu negocio
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Recuperas la suscripción entera cerrando un solo trabajo al mes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrencyMode('COP')}
                className={`px-3 py-1.5 rounded-lg transition ${isCOP ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🇨🇴 COP ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode('USD')}
                className={`px-3 py-1.5 rounded-lg transition ${!isCOP ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🌎 USD ($)
              </button>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Plan Starter / Gratis */}
          <div className="rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Plan Starter</h3>
              <p className="text-xs text-slate-500 mt-1">Para probar la herramienta y empezar</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-400 text-xs">/ mes</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Hasta 3 cotizaciones mensuales
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Envío rápido por WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Descarga en PDF estándar
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  Voice-to-Quote ilimitado
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  Follow-up Fantasma (IA)
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  Firma táctil + Cobro con Nequi/Tarjeta
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Plan Starter')}
              className="mt-8 w-full py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
            >
              Plan Gratuito
            </button>
          </div>

          {/* Plan Pro */}
          <div className="rounded-3xl border-2 border-indigo-600 p-6 bg-gradient-to-b from-indigo-50/50 to-white flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
              Recomendado
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Plan Pro Negocio</h3>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Para contratistas y profesionales activos</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600">
                  {isCOP ? '$59.000' : '$19'}
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  {isCOP ? 'COP / mes' : 'USD / mes'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold ml-2">
                  {isCOP ? '(o $490.000/año)' : '(o $149/año)'}
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <strong>Cotizaciones ilimitadas</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <strong>Voice-to-Quote (IA)</strong> ilimitado
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <strong>Follow-up Fantasma (IA)</strong> para cerrar ventas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  Firma digital táctil + <strong>Anticipo con Nequi/Tarjeta</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  Tu logotipo y marca en los PDFs y enlaces
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(isCOP ? 'Plan Pro ($59.000 COP/mes)' : 'Plan Pro ($19 USD/mes)')}
              className="mt-8 w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Comenzar Prueba Gratis (14 Días)
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs text-slate-500">
          <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>Sin contratos de permanencia: Cancela cuando quieras en 1 clic. Métodos de pago locales e internacionales habilitados.</span>
        </div>
      </div>
    </div>
  );
}
