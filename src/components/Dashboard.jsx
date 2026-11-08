import React, { useState } from 'react';
import { 
  Plus, Search, CheckCircle2, Clock, FileText, 
  Send, Eye, Edit2, Trash2, Copy, TrendingUp, 
  DollarSign, Award, AlertCircle, Mic, Bot, Sparkles, ShieldCheck 
} from 'lucide-react';
import { calculateTotals, formatCurrency } from '../utils/storage';

export default function Dashboard({ 
  quotes, 
  business, 
  onCreateQuote, 
  onVoiceQuote,
  onOpenFollowUp,
  onViewQuote, 
  onEditQuote, 
  onDeleteQuote, 
  onDuplicateQuote 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Compute stats
  const totalQuoted = quotes.reduce((acc, q) => {
    return acc + calculateTotals(q.items, q.discountPercent, q.taxPercent).total;
  }, 0);

  const acceptedQuotes = quotes.filter(q => q.status === 'accepted');
  const totalWon = acceptedQuotes.reduce((acc, q) => {
    return acc + calculateTotals(q.items, q.discountPercent, q.taxPercent).total;
  }, 0);

  const pendingQuotes = quotes.filter(q => q.status === 'sent' || q.status === 'draft');
  const winRate = quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0;

  // Filtered quotes
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.clientPhone && q.clientPhone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getWhatsAppShareUrl = (quote) => {
    const totals = calculateTotals(quote.items, quote.discountPercent, quote.taxPercent);
    const cleanPhone = (quote.clientPhone || '').replace(/\D/g, '');
    const message = `Hola *${quote.clientName}*, te adjunto la cotización de *${business.name}* (Ref: *${quote.id}*) por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}*.\n\nPuedes verla y firmarla formalmente desde tu teléfono aquí. ¡Quedamos atentos a tus comentarios!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona tus presupuestos, envía propuestas por WhatsApp y cierra tratos con firma digital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onVoiceQuote}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200/80 shadow-xs transition"
          >
            <Mic className="w-4 h-4 text-indigo-600 animate-pulse" />
            Dictar por Voz (IA)
          </button>

          <button
            onClick={onCreateQuote}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            Nueva Cotización
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Cotizado</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(totalQuoted, business.currency, business.currencySymbol)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{quotes.length} propuestas creadas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cerrado / Ganado</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {formatCurrency(totalWon, business.currency, business.currencySymbol)}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">{acceptedQuotes.length} cotizaciones firmadas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tasa de Aprobación</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {winRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Efectividad de cierre</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pendientes de Firma</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingQuotes.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Por confirmar por clientes</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono o ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'accepted', label: 'Firmadas' },
              { id: 'sent', label: 'Enviadas' },
              { id: 'draft', label: 'Borrador' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes List / Table */}
        <div className="mt-6 divide-y divide-slate-100">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No hay cotizaciones encontradas</h3>
              <p className="text-xs text-slate-500 mt-1">Prueba con otro término de búsqueda o crea una nueva cotización.</p>
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const totals = calculateTotals(q.items, q.discountPercent, q.taxPercent);
              const isAccepted = q.status === 'accepted';
              return (
                <div
                  key={q.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 rounded-2xl px-3 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {q.clientName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{q.clientName}</h4>
                        <span className="text-xs font-mono text-slate-400">({q.id})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Emisión: {q.date}</span>
                        <span>•</span>
                        <span>{q.items.length} partidas</span>
                        {q.clientPhone && (
                          <>
                            <span>•</span>
                            <span>{q.clientPhone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatCurrency(totals.total, business.currency, business.currencySymbol)}
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isAccepted 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : q.status === 'sent' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isAccepted ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Firmada
                            </>
                          ) : q.status === 'sent' ? (
                            <>
                              <Clock className="w-3 h-3" /> Enviada
                            </>
                          ) : (
                            'Borrador'
                          )}
                        </span>
                        {q.depositPaid && (
                          <span className="text-[9px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            Seña Pagada
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!isAccepted && (
                        <button
                          onClick={() => onOpenFollowUp(q)}
                          title="Cerrar con Follow-up Fantasma (IA)"
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onViewQuote(q)}
                        title="Ver / Firmar"
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {q.clientPhone && (
                        <a
                          href={getWhatsAppShareUrl(q)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Compartir por WhatsApp"
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => onEditQuote(q)}
                        title="Editar"
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicateQuote(q)}
                        title="Duplicar"
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteQuote(q.id)}
                        title="Eliminar"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
