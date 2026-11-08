import React, { useState } from 'react';
import { 
  Plus, Search, CheckCircle2, Clock, FileText, 
  Send, Eye, Edit2, Trash2, Copy, TrendingUp, 
  DollarSign, Award, AlertCircle, Mic, Bot, Sparkles, ShieldCheck 
} from 'lucide-react';
import { calculateTotals, formatCurrency } from '../utils/storage';
import { getShareableQuoteUrl, getShortQuoteUrl } from '../utils/shareUtils';

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
    const shareUrl = getShareableQuoteUrl(quote, business);
    const message = `Hola *${quote.clientName}*, te adjunto la cotización formal de *${business.name}* (Ref: *${quote.id}*) por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}*.\n\nPuedes verla y firmarla formalmente desde tu teléfono en este enlace:\n${shareUrl}\n\n¡Quedamos atentos a tus comentarios!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppShare = async (quote, e) => {
    if (e) e.preventDefault();
    const totals = calculateTotals(quote.items, quote.discountPercent, quote.taxPercent);
    const cleanPhone = (quote.clientPhone || '').replace(/\D/g, '');
    let url = getShareableQuoteUrl(quote, business);
    try {
      const short = await getShortQuoteUrl(quote, business);
      if (short) url = short;
    } catch (err) {}
    const message = `Hola *${quote.clientName}*, te adjunto la cotización formal de *${business.name}* (Ref: *${quote.id}*) por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}*.\n\nPuedes verla y firmarla formalmente desde tu teléfono en este enlace:\n${url}\n\n¡Quedamos atentos a tus comentarios!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Presupuestos rápidos, firma digital y cobro de anticipos por WhatsApp.
          </p>
        </div>

        {/* 2-Column Action Grid on Mobile */}
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onVoiceQuote}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200/80 shadow-xs transition"
          >
            <Mic className="w-4 h-4 text-indigo-600 animate-pulse shrink-0" />
            <span className="truncate">Dictar Voz (IA)</span>
          </button>

          <button
            onClick={onCreateQuote}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="truncate">Nueva Cotización</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - 2x2 Grid on Mobile, 4 Cols on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        
        {/* Metric 1 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Total Cotizado</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900 truncate">
            {formatCurrency(totalQuoted, business.currency, business.currencySymbol)}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{quotes.length} propuestas</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Ganado / Cerrado</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black text-emerald-600 truncate">
            {formatCurrency(totalWon, business.currency, business.currencySymbol)}
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700/80 mt-0.5">{acceptedQuotes.length} firmadas</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Aprobación</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900 truncate">
            {winRate}%
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Tasa de cierre</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Por Confirmar</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900 truncate">
            {pendingQuotes.length}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Pendientes de firma</p>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono o ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
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
        <div className="mt-4 sm:mt-6 divide-y divide-slate-100">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">No hay cotizaciones encontradas</h3>
              <p className="text-xs text-slate-500 mt-1">Prueba con otro término o crea una nueva cotización.</p>
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const totals = calculateTotals(q.items, q.discountPercent, q.taxPercent);
              const isAccepted = q.status === 'accepted';
              return (
                <div
                  key={q.id}
                  className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-2xl px-2 sm:px-3 transition border border-transparent hover:border-slate-200/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 mt-0.5">
                      {q.clientName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{q.clientName}</h4>
                        <span className="text-[11px] font-mono text-slate-400">({q.id})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>Emisión: {q.date}</span>
                        <span>•</span>
                        <span>{q.items.length} partidas</span>
                        {q.clientPhone && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-slate-600">{q.clientPhone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">
                        {formatCurrency(totals.total, business.currency, business.currencySymbol)}
                      </div>
                      <div className="flex items-center gap-1.5 sm:justify-end mt-0.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
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
                          <span className="text-[8px] sm:text-[9px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            Seña Pagada
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {!isAccepted && (
                        <button
                          onClick={() => onOpenFollowUp(q)}
                          title="Cerrar con Follow-up Fantasma (IA)"
                          className="p-1.5 sm:p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onViewQuote(q)}
                        title="Ver / Firmar"
                        className="p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {q.clientPhone && (
                        <a
                          href={getWhatsAppShareUrl(q)}
                          onClick={(e) => handleWhatsAppShare(q, e)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Compartir por WhatsApp"
                          className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => onEditQuote(q)}
                        title="Editar"
                        className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicateQuote(q)}
                        title="Duplicar"
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteQuote(q.id)}
                        title="Eliminar"
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
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
