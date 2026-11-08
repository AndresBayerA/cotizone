import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Printer, CheckCircle2, Clock, 
  MapPin, Phone, Mail, Building, FileText, Send, Sparkles, 
  Bot, CreditCard, ShieldCheck, Check, Copy, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateTotals, formatCurrency } from '../utils/storage';
import { getShareableQuoteUrl, getShortQuoteUrl } from '../utils/shareUtils';
import SignaturePad from './SignaturePad';
import DepositPaymentModal from './DepositPaymentModal';
import FollowUpModal from './FollowUpModal';

export default function QuoteView({ quote, business, onBack, onUpdateQuote, isClientMode = false, onGoToApp }) {
  const [showSignModal, setShowSignModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeShareUrl, setActiveShareUrl] = useState(() => getShareableQuoteUrl(quote, business));

  useEffect(() => {
    let isMounted = true;
    getShortQuoteUrl(quote, business).then((short) => {
      if (isMounted && short) {
        setActiveShareUrl(short);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [quote.id, quote.date, quote.items]);

  const totals = calculateTotals(quote.items, quote.discountPercent, quote.taxPercent);
  const depositPercent = quote.depositPercent || 30;
  const depositAmount = (totals.total * depositPercent) / 100;
  const isAccepted = quote.status === 'accepted';

  const shareUrl = activeShareUrl;

  const handleSignatureSuccess = ({ signatureData, signerName, signedAt }) => {
    const updated = {
      ...quote,
      status: 'accepted',
      signedAt,
      signedBy: signerName,
      signatureDataUrl: signatureData
    };
    onUpdateQuote(updated);
    setShowSignModal(false);

    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handlePaymentSuccess = (paymentDetails) => {
    const updated = {
      ...quote,
      ...paymentDetails
    };
    onUpdateQuote(updated);
    setShowDepositModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const getWhatsAppLink = () => {
    const cleanPhone = (quote.clientPhone || '').replace(/\D/g, '');
    const message = `Hola *${quote.clientName}*, te comparto la propuesta formal de *${business.name}* (Ref: *${quote.id}*) por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}*.\n\nPuedes revisarla, firmarla y ver los detalles aquí:\n${shareUrl}\n\n¡Quedamos atentos a tus comentarios!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getClientConfirmWhatsAppLink = () => {
    const cleanProviderPhone = (business.phone || '').replace(/\D/g, '');
    const message = `Hola *${business.name}*, he revisado y aceptado formalmente la cotización *${quote.id}* por un total de *${formatCurrency(totals.total, business.currency, business.currencySymbol)}* con firma digital${quote.depositPaid ? ' y anticipo abonado' : ''}. ¡Quedo atento a la fecha de inicio!`;
    return `https://wa.me/${cleanProviderPhone}?text=${encodeURIComponent(message)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
      {/* Top Action Bar (Hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {isClientMode ? (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">
              Cotización oficial de <strong className="text-slate-900">{business.name}</strong>
            </span>
          </div>
        ) : (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Panel
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {/* Contractor Controls (Hidden in Client Mode) */}
          {!isClientMode && (
            <>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{linkCopied ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                onClick={() => setShowFollowUpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200/60"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Follow-up IA</span>
              </button>
            </>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {!isClientMode && quote.clientPhone && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}

          {isClientMode && isAccepted && business.phone && (
            <a
              href={getClientConfirmWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Notificar al Proveedor</span>
            </a>
          )}

          {!isAccepted && (
            <button
              onClick={() => setShowSignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Firmar Cotización</span>
            </button>
          )}
        </div>
      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <SignaturePad
            onSave={handleSignatureSuccess}
            onCancel={() => setShowSignModal(false)}
          />
        </div>
      )}

      {/* Deposit Payment Modal */}
      {showDepositModal && (
        <DepositPaymentModal
          quote={quote}
          business={business}
          depositAmount={depositAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {/* Follow-up Assistant Modal */}
      {showFollowUpModal && (
        <FollowUpModal
          quote={quote}
          business={business}
          onClose={() => setShowFollowUpModal(false)}
        />
      )}

      {/* Printable Quote Paper */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xl print:shadow-none print:border-none print:p-0">
        
        {/* Header / Brand & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/30">
                {business.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{business.name}</h1>
                <p className="text-xs text-slate-500 font-medium">{business.slogan}</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-xs text-slate-600">
              {business.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {business.phone}
                </p>
              )}
              {business.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {business.email}
                </p>
              )}
              {business.address && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {business.address}
                </p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-block">
              {isAccepted ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Aceptado & Firmado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Pendiente de Firma
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 sm:mt-3">{quote.id}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Fecha de emisión: <strong className="text-slate-700">{quote.date}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Válido por: <strong className="text-slate-700">{quote.validDays} días</strong>
            </p>
          </div>
        </div>

        {/* Client Info Grid */}
        <div className="my-6 sm:my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-100">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Presupuesto preparado para:
            </span>
            <h3 className="font-bold text-slate-900 text-base">{quote.clientName}</h3>
            {quote.clientAddress && (
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {quote.clientAddress}
              </p>
            )}
          </div>
          <div className="sm:text-right space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Datos de contacto:
            </span>
            {quote.clientPhone && (
              <p className="text-xs text-slate-600 flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {quote.clientPhone}
              </p>
            )}
            {quote.clientEmail && (
              <p className="text-xs text-slate-600 flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {quote.clientEmail}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto my-6 sm:my-8">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Descripción del Trabajo / Suministro</th>
                <th className="py-2.5 px-2 text-center">Cant.</th>
                <th className="py-2.5 px-2 text-right">Precio Unit.</th>
                <th className="py-2.5 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {quote.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="py-3 px-2 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 px-2 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-slate-600">
                    {formatCurrency(item.unitPrice, business.currency, business.currencySymbol)}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-slate-900">
                    {formatCurrency(item.quantity * item.unitPrice, business.currency, business.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8 pt-4 pb-6 sm:pb-8 border-b border-slate-100">
          <div className="max-w-md">
            {quote.notes && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Notas y Observaciones:</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {quote.notes}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Términos de Pago y Garantía:</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {business.defaultTerms}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(totals.subtotal, business.currency, business.currencySymbol)}</span>
            </div>

            {quote.discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento ({quote.discountPercent}%):</span>
                <span>-{formatCurrency(totals.discountAmount, business.currency, business.currencySymbol)}</span>
              </div>
            )}

            {quote.taxPercent > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Impuestos / IVA ({quote.taxPercent}%):</span>
                <span>+{formatCurrency(totals.taxAmount, business.currency, business.currencySymbol)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2.5 border-t-2 border-slate-900 text-sm sm:text-base font-extrabold text-slate-900">
              <span>TOTAL:</span>
              <span className="text-lg sm:text-xl text-indigo-600">
                {formatCurrency(totals.total, business.currency, business.currencySymbol)}
              </span>
            </div>

            <div className="pt-2 text-[11px] sm:text-xs text-slate-500 flex justify-between border-t border-slate-200">
              <span>Anticipo de inicio ({depositPercent}%):</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(depositAmount, business.currency, business.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Deposit Paid Status Banner */}
        {quote.depositPaid ? (
          <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm">
                  Anticipo abonado exitosamente ({formatCurrency(quote.depositAmount || depositAmount, business.currency, business.currencySymbol)})
                </h4>
                <p className="text-xs text-emerald-700">
                  Abonado mediante {quote.paymentMethod || 'Nequi / Tarjeta'} el {new Date(quote.depositPaidAt || Date.now()).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-xl">
              {quote.transactionId || 'PAGADO'}
            </span>
          </div>
        ) : isAccepted ? (
          /* Deposit Call to Action after signature */
          <div className="no-print my-6 p-5 rounded-3xl bg-gradient-to-r from-indigo-50 to-emerald-50 border-2 border-dashed border-indigo-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                Paso Final Requerido
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Abonar anticipo para congelar la fecha ({depositPercent}%): {formatCurrency(depositAmount, business.currency, business.currencySymbol)}
              </h4>
              <p className="text-xs text-slate-500">
                Garantiza la compra inmediata de materiales y la reserva técnica en la agenda.
              </p>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              Abonar con Nequi / Tarjeta
            </button>
          </div>
        ) : null}

        {/* Signatures Block */}
        <div className="mt-8 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Por la Empresa Proveedora</p>
            <div className="h-20 sm:h-24 border-b border-slate-300 flex flex-col justify-end pb-2">
              <span className="font-semibold text-sm text-slate-800">{business.name}</span>
              <span className="text-xs text-slate-500">Representante Autorizado</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Por el Cliente / Aceptación Formal</p>
            {isAccepted ? (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
                {quote.signatureDataUrl && (
                  <img
                    src={quote.signatureDataUrl}
                    alt="Firma del cliente"
                    className="max-h-16 object-contain mb-2"
                  />
                )}
                <p className="text-xs font-bold text-slate-900">{quote.signedBy}</p>
                <p className="text-[11px] text-emerald-700">
                  Firmado digitalmente el {new Date(quote.signedAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ) : (
              <div 
                onClick={() => setShowSignModal(true)}
                className="h-20 sm:h-24 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 transition no-print"
              >
                <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                <span className="text-xs font-semibold text-indigo-600">Haz clic aquí para firmar</span>
                <span className="text-[10px] text-slate-400">Aceptación digital táctil instantánea</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Client Mode Footer: Subtle viral link to create quotes with CotiZone */}
      {isClientMode && (
        <div className="no-print mt-10 text-center text-xs text-slate-400">
          <p>Documento generado con seguridad por <strong>CotiZone</strong></p>
          <button
            onClick={onGoToApp}
            className="text-indigo-600 hover:underline mt-1 font-medium inline-flex items-center gap-1"
          >
            ¿También necesitas enviar cotizaciones profesionales? Pruébalo gratis <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
