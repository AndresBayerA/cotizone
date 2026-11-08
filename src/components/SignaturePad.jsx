import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenLine } from 'lucide-react';

export default function SignaturePad({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signerName, setSignerName] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleConfirm = () => {
    if (!hasSignature || !signerName.trim()) return;
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onSave({
      signatureData,
      signerName: signerName.trim(),
      signedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-lg w-full mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <PenLine className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">Aceptar y Firmar Cotización</h3>
          <p className="text-xs text-slate-500">Dibuja tu firma en el recuadro con el dedo o ratón</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Nombre completo de quien firma *
        </label>
        <input
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="Ej: Carlos Mendoza (Gerente / Propietario)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 cursor-crosshair touch-none"
        />
        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 text-sm select-none">
            ✍️ Dibuja tu firma aquí
          </div>
        )}
        <button
          type="button"
          onClick={clearCanvas}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-600 rounded-lg shadow-sm border border-slate-200 text-xs flex items-center gap-1 transition"
        >
          <Eraser className="w-3.5 h-3.5" />
          Limpiar
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-5 leading-relaxed">
        Al firmar digitalmente, confirmas la aceptación formal de las condiciones, alcances y presupuesto detallados en este documento.
      </p>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!hasSignature || !signerName.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
        >
          <Check className="w-4 h-4" />
          Aceptar y Firmar Ahora
        </button>
      </div>
    </div>
  );
}
