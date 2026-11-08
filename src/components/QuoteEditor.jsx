import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Save, Sparkles, 
  User, Calendar, Percent, FileText, CheckCircle2 
} from 'lucide-react';
import { calculateTotals, formatCurrency } from '../utils/storage';

const PRESET_ITEMS = [
  { label: "+ Mano de obra especializada", description: "Mano de obra técnica y montaje profesional", quantity: 1, unitPrice: 150 },
  { label: "+ Materiales y suministros", description: "Suministro de materiales de primera calidad", quantity: 1, unitPrice: 200 },
  { label: "+ Desplazamiento / Visita técnica", description: "Gastos de transporte y diagnóstico técnico en sitio", quantity: 1, unitPrice: 40 },
  { label: "+ Certificado / Memoria técnica", description: "Elaboración de informe técnico y homologación", quantity: 1, unitPrice: 120 }
];

export default function QuoteEditor({ quote, business, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: quote ? quote.id : `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    clientName: quote ? quote.clientName : '',
    clientPhone: quote ? quote.clientPhone : '',
    clientEmail: quote ? quote.clientEmail : '',
    clientAddress: quote ? quote.clientAddress : '',
    date: quote ? quote.date : new Date().toISOString().split('T')[0],
    validDays: quote ? quote.validDays : 15,
    status: quote ? quote.status : 'draft',
    notes: quote ? quote.notes : '',
    discountPercent: quote ? quote.discountPercent : 0,
    taxPercent: quote ? quote.taxPercent : business.taxRate || 21,
    depositPercent: quote?.depositPercent ?? 30,
    depositPaid: quote?.depositPaid ?? false,
    depositAmount: quote?.depositAmount ?? null,
    depositPaidAt: quote?.depositPaidAt ?? null,
    items: quote && quote.items.length > 0 ? quote.items : [
      { id: '1', description: 'Instalación y mano de obra profesional', quantity: 1, unitPrice: 180 }
    ],
    signedAt: quote ? quote.signedAt : null,
    signedBy: quote ? quote.signedBy : null,
    signatureDataUrl: quote ? quote.signatureDataUrl : null
  });

  const totals = calculateTotals(formData.items, formData.discountPercent, formData.taxPercent);

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index] = {
      ...updated[index],
      [field]: field === 'description' ? value : Number(value) || 0
    };
    setFormData({ ...formData, items: updated });
  };

  const handleAddItem = (preset) => {
    const newItem = preset ? {
      id: String(Date.now()),
      description: preset.description,
      quantity: preset.quantity,
      unitPrice: preset.unitPrice
    } : {
      id: String(Date.now()),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    const updated = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancelar y Volver
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {quote ? 'Editando Cotización' : 'Nueva Cotización Express'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Datos del Cliente & Proyecto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Cliente / Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Ej: Clínica Dental Las Rosas"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono WhatsApp (para envío con 1 clic)
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="Ej: +34 612 345 678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="cliente@ejemplo.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dirección / Ubicación de los trabajos
              </label>
              <input
                type="text"
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                placeholder="Calle Mayor 12, Planta 2"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Referencia / Número
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Emisión
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Validez de la oferta (días)
              </label>
              <select
                value={formData.validDays}
                onChange={(e) => setFormData({ ...formData, validDays: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700"
              >
                <option value={7}>7 días</option>
                <option value={15}>15 días</option>
                <option value={30}>30 días</option>
                <option value={60}>60 días</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Conceptos y Partidas del Presupuesto
              </h2>
              <p className="text-xs text-slate-500">Agrega conceptos manuales o usa los atajos rápidos</p>
            </div>

            <button
              type="button"
              onClick={() => handleAddItem(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Nueva Línea
            </button>
          </div>

          {/* Preset Buttons for Speed */}
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 py-1 px-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Atajos:
            </span>
            {PRESET_ITEMS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddItem(preset)}
                className="text-xs font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {formData.items.map((item, idx) => {
              const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
              return (
                <div 
                  key={item.id || idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition"
                >
                  <span className="text-xs font-bold text-slate-400 w-6 text-center">
                    {idx + 1}
                  </span>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Descripción del trabajo, servicio o material..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Cant."
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Precio U."
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-right text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="w-28 text-right font-bold text-sm text-slate-900 pr-2">
                      {formatCurrency(lineTotal, business.currency, business.currencySymbol)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={formData.items.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes and Totals */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notas y Condiciones Especiales
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ej: Incluye limpieza de área al finalizar. No incluye pintura de paredes adicionales..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-700"
              />
            </div>

            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(totals.subtotal, business.currency, business.currencySymbol)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> Descuento (%):
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  Impuestos / IVA (%):
                </span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.taxPercent}
                  onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                <div>
                  <span className="text-indigo-950 font-bold block text-xs">Anticipo / Seña Requerida (%):</span>
                  <span className="text-[10px] text-slate-500">Cobro con tarjeta al firmar</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.depositPercent}
                    onChange={(e) => setFormData({ ...formData, depositPercent: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-right text-xs font-bold text-indigo-700"
                  />
                  <span className="text-xs font-bold text-indigo-700">%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-300 flex justify-between items-center">
                <span className="text-base font-extrabold text-slate-900">Total a Cotizar:</span>
                <span className="text-2xl font-black text-indigo-600">
                  {formatCurrency(totals.total, business.currency, business.currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Save className="w-4 h-4" />
            Guardar Cotización
          </button>
        </div>
      </form>
    </div>
  );
}
