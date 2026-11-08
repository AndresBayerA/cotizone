import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Check, Sparkles, Lock, Smartphone, Building2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/storage';

export default function DepositPaymentModal({ quote, business, depositAmount, onPaymentSuccess, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('nequi'); // 'nequi' | 'bancolombia' | 'card' | 'apple_pay'
  const [nequiPhone, setNequiPhone] = useState('312 456 7890');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 130,
          spread: 85,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      let methodText = 'Nequi (+57 312 456 7890)';
      if (paymentMethod === 'bancolombia') methodText = 'Bancolombia / PSE';
      if (paymentMethod === 'card') methodText = 'Tarjeta Débito/Crédito (••4242)';
      if (paymentMethod === 'apple_pay') methodText = 'Apple Pay';

      onPaymentSuccess({
        depositPaid: true,
        depositAmount: depositAmount,
        depositPaidAt: new Date().toISOString(),
        paymentMethod: methodText,
        transactionId: `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl overflow-hidden relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Abonar Anticipo de Inicio</h3>
              <p className="text-xs text-slate-500">Congela la fecha de inicio de labores</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to pay */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center mb-5">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            Monto del anticipo ({quote.depositPercent || 30}%)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
            {formatCurrency(depositAmount, business.currency, business.currencySymbol)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Correspondiente a la cotización <strong>{quote.id}</strong> para <strong>{quote.clientName}</strong>
          </p>
        </div>

        {/* Payment selector */}
        <div className="space-y-2.5 mb-5">
          {/* Nequi / Daviplata */}
          <button
            type="button"
            onClick={() => setPaymentMethod('nequi')}
            className={`w-full p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-between transition ${
              paymentMethod === 'nequi'
                ? 'border-purple-600 bg-purple-50/70 text-purple-950 shadow-xs'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                N
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Nequi / Daviplata</div>
                <div className="text-[10px] text-slate-500 font-normal">Transferencia celular instantánea en Colombia</div>
              </div>
            </div>
            <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Más Usado</span>
          </button>

          {/* Bancolombia / PSE */}
          <button
            type="button"
            onClick={() => setPaymentMethod('bancolombia')}
            className={`w-full p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-between transition ${
              paymentMethod === 'bancolombia'
                ? 'border-amber-500 bg-amber-50/60 text-amber-950 shadow-xs'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                B
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Bancolombia / PSE</div>
                <div className="text-[10px] text-slate-500 font-normal">Cualquier banco en Colombia vía PSE</div>
              </div>
            </div>
          </button>

          {/* Tarjetas */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-between transition ${
              paymentMethod === 'card'
                ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 shadow-xs'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Tarjeta Débito o Crédito</div>
                <div className="text-[10px] text-slate-500 font-normal">Visa, Mastercard, Amex internacional</div>
              </div>
            </div>
          </button>
        </div>

        {/* Nequi Details */}
        {paymentMethod === 'nequi' && (
          <div className="bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100 mb-5 text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Número de Nequi habilitado:</span>
              <span className="font-mono font-bold text-purple-900">+57 312 456 7890</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Titular de la cuenta:</span>
              <span className="font-bold text-slate-800">{business.name}</span>
            </div>
          </div>
        )}

        {/* Pay button */}
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirmando transferencia segura...
            </span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Confirmar y Abonar {formatCurrency(depositAmount, business.currency, business.currencySymbol)}
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Fondos transferidos con recibo digital inmediato para ambas partes
        </p>

      </div>
    </div>
  );
}
