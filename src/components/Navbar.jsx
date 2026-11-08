import React from 'react';
import { 
  FileSpreadsheet, Settings, Crown, Plus, CheckCircle2, 
  Mic, LayoutDashboard, Globe, Sparkles 
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  onOpenSettings, 
  onOpenPricing,
  onOpenVoiceQuote,
  business 
}) {
  return (
    <>
      {/* Top Header */}
      <header className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Coti<span className="text-indigo-600">Zone</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Presupuestos & Firma Express
              </p>
            </div>
          </div>

          {/* Desktop Navigation (Hidden on mobile to avoid clutter) */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => onNavigate(currentView === 'landing' ? 'dashboard' : 'landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                currentView === 'landing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {currentView === 'landing' ? 'Ir al Panel App' : 'Ver Web de Venta'}
            </button>

            <button
              onClick={onOpenVoiceQuote}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Voz a Cotización (IA)</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                currentView === 'dashboard' 
                  ? 'bg-slate-100 text-slate-900 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Mis Cotizaciones
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Mi Negocio</span>
            </button>

            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 shadow-xs transition"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Plan Pro</span>
            </button>
          </div>

          {/* Mobile Quick Action Buttons (Only Plan Pro & Settings) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Plan Pro</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Mi Negocio"
              className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (App Bar) */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-3 py-2 shadow-2xl flex items-center justify-around">
        
        {/* Panel Tab */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            currentView === 'dashboard' 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Panel</span>
        </button>

        {/* Center Floating Voice AI Button */}
        <button
          onClick={onOpenVoiceQuote}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-white active:scale-95 transition">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-indigo-700 mt-1">Voz IA</span>
        </button>

        {/* Web Venta / Landing Tab */}
        <button
          onClick={() => onNavigate(currentView === 'landing' ? 'dashboard' : 'landing')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            currentView === 'landing' 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px]">{currentView === 'landing' ? 'Ver App' : 'Web Venta'}</span>
        </button>

      </nav>
    </>
  );
}
