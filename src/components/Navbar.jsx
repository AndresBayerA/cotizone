import React from 'react';
import { FileSpreadsheet, Settings, Crown, Plus, CheckCircle2, Mic } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  onOpenSettings, 
  onOpenPricing,
  onOpenVoiceQuote,
  business 
}) {
  return (
    <header className="no-print bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Coti<span className="text-indigo-600">Zone</span></span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                SaaS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">Presupuestos & Firma Express</p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate(currentView === 'landing' ? 'dashboard' : 'landing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentView === 'landing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {currentView === 'landing' ? 'Ir al Panel App' : 'Ver Web de Venta'}
          </button>

          <button
            onClick={onOpenVoiceQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="hidden sm:inline">Voz a Cotización (IA)</span>
            <span className="sm:hidden">Voz IA</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              currentView === 'dashboard' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Mis Cotizaciones
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Mi Negocio</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 shadow-xs transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Plan Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
