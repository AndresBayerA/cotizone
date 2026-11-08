// Initial sample data for CotiZone (Configurado para Colombia y Latinoamérica)
export const DEFAULT_BUSINESS = {
  name: "Soluciones Técnicas & Reformas SAS",
  slogan: "Electricidad, fontanería, pintura y remodelaciones profesionales",
  phone: "+57 312 456 7890",
  email: "contacto@solucionestecnicas.com.co",
  address: "Calle 72 # 10-34, Of. 402, Bogotá D.C.",
  currency: "COP",
  currencySymbol: "$",
  taxRate: 19,
  defaultTerms: "50% de anticipo para compra de materiales e inicio de labores; 50% restante contra entrega a entera satisfacción. Garantía de 12 meses en mano de obra e instalación.",
  logoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80"
};

export const INITIAL_QUOTES = [
  {
    id: "COT-2026-001",
    clientName: "Restaurante La Candelaria Gourmet",
    clientPhone: "+57 315 987 6543",
    clientEmail: "administracion@lacandelariagourmet.co",
    clientAddress: "Cra. 4 # 11-20, La Candelaria, Bogotá",
    date: "2026-11-05",
    validDays: 15,
    status: "accepted", // draft, sent, accepted, rejected
    items: [
      { id: "1", description: "Renovación total de tablero eléctrico de cocina y circuitos trifásicos", quantity: 1, unitPrice: 780000 },
      { id: "2", description: "Instalación de 8 campanas LED herméticas de alta potencia", quantity: 8, unitPrice: 95000 },
      { id: "3", description: "Mano de obra especializada técnica (2 técnicos x 2 jornadas)", quantity: 2, unitPrice: 280000 },
      { id: "4", description: "Certificación RETIE de conformidad técnica de instalación", quantity: 1, unitPrice: 350000 }
    ],
    notes: "Trabajos a ejecutarse en jornada nocturna de 10:00 PM a 5:00 AM para no afectar el servicio del restaurante.",
    discountPercent: 5,
    taxPercent: 19,
    depositPercent: 40,
    depositPaid: true,
    depositAmount: 890000,
    depositPaidAt: "2026-11-06T15:20:00Z",
    paymentMethod: "Nequi (+57 312 456 7890)",
    transactionId: "NEQUI-M48921",
    signedAt: "2026-11-06T14:30:00Z",
    signedBy: "Carlos Mendoza (Administrador General)",
    signatureDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='60'><path d='M10 40 Q 50 10, 80 35 T 160 20' stroke='%230f172a' stroke-width='2' fill='none'/></svg>"
  },
  {
    id: "COT-2026-002",
    clientName: "Edificio Residencial Los Nogales",
    clientPhone: "+57 320 889 1234",
    clientEmail: "administracion@nogalesbogota.com",
    clientAddress: "Av. Carrera 15 # 93-40, Chicó Norte",
    date: "2026-11-07",
    validDays: 30,
    status: "sent",
    items: [
      { id: "1", description: "Mantenimiento preventivo y correctivo de bomba hidroneumática de agua", quantity: 1, unitPrice: 480000 },
      { id: "2", description: "Sustitución de sellos mecánicos y rodamientos SKF", quantity: 2, unitPrice: 165000 },
      { id: "3", description: "Revisión técnica de presostato y tanque de presión", quantity: 1, unitPrice: 190000 }
    ],
    notes: "Acceso coordinado con la administración y conserjería a partir de las 8:00 AM.",
    discountPercent: 0,
    taxPercent: 19,
    depositPercent: 50,
    depositPaid: false,
    signedAt: null,
    signedBy: null,
    signatureDataUrl: null
  },
  {
    id: "COT-2026-003",
    clientName: "Dra. Sofía Valenzuela (Consultorio Odontológico)",
    clientPhone: "+57 301 445 6789",
    clientEmail: "dra.valenzuela@dentalsmiles.co",
    clientAddress: "Calle 127 # 19A-28, Cons. 504",
    date: "2026-11-07",
    validDays: 15,
    status: "draft",
    items: [
      { id: "1", description: "Adecuación de línea eléctrica estabilizada para unidad odontológica", quantity: 1, unitPrice: 620000 },
      { id: "2", description: "Instalación de compresor libre de aceite con filtro coalescente", quantity: 1, unitPrice: 950000 },
      { id: "3", description: "Punto de drenaje sanitario en tubería PVC sanitaria de 2 pulgadas", quantity: 1, unitPrice: 220000 }
    ],
    notes: "Pendiente confirmar fecha de despacho de la nueva unidad odontológica.",
    discountPercent: 0,
    taxPercent: 19,
    depositPercent: 30,
    depositPaid: false,
    signedAt: null,
    signedBy: null,
    signatureDataUrl: null
  }
];

const STORAGE_KEYS = {
  QUOTES: "cotizone_quotes_v2",
  BUSINESS: "cotizone_business_v2"
};

export function getStoredQuotes() {
  const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(INITIAL_QUOTES));
    return INITIAL_QUOTES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUOTES;
  }
}

export function saveStoredQuotes(quotes) {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

export function getStoredBusiness() {
  const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(DEFAULT_BUSINESS));
    return DEFAULT_BUSINESS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BUSINESS;
  }
}

export function saveStoredBusiness(business) {
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
}

export function calculateTotals(items, discountPercent = 0, taxPercent = 0) {
  const subtotal = items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  const discountAmount = subtotal * ((Number(discountPercent) || 0) / 100);
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = subtotalAfterDiscount * ((Number(taxPercent) || 0) / 100);
  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    total
  };
}

export function formatCurrency(amount, currency = "COP", symbol = "$") {
  const isCOP = currency === "COP";
  const formatted = (Number(amount) || 0).toLocaleString(isCOP ? "es-CO" : "es-ES", {
    minimumFractionDigits: isCOP ? 0 : 2,
    maximumFractionDigits: isCOP ? 0 : 2
  });
  return `${symbol} ${formatted} ${isCOP ? 'COP' : currency}`;
}
