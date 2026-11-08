// Intelligent Natural Language Parser for Voice Quotes in Spanish

const NUMBER_WORDS = {
  'un': 1, 'uno': 1, 'una': 1,
  'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
  'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
  'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
  'veinte': 20, 'veinticinco': 25, 'treinta': 30, 'cincuenta': 50, 'cien': 100
};

export function parseVoiceQuoteText(rawText) {
  if (!rawText || !rawText.trim()) return null;

  const text = rawText.trim();
  
  // 1. Extract Client Name
  let clientName = 'Cliente';
  const clientMatch = text.match(/(?:para|cotizar a|cliente)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)(?:,|\.|necesito|cotizar|cotices|quiero|por favor|en\s+(?:calle|carrera|av|cra)|con|\d|\$|$)/i);
  if (clientMatch && clientMatch[1]) {
    const rawName = clientMatch[1].trim();
    // Exclude generic stopping words
    if (rawName.length > 1 && !/^(el|la|los|las|un|una)$/i.test(rawName)) {
      clientName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    }
  }

  // 2. Extract Price (handles $50.000, 50000, 50 mil, 50.000 pesos, etc.)
  let extractedPrice = null;
  const priceMatch = text.match(/\$?\s*([\d\.\,]+)\s*(mil|k)?\s*(?:pesos|cop|euros|usd)?(?:\s*(?:cada uno|c\/u|por unidad|en total))?/i);
  if (priceMatch) {
    let numStr = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
    let val = parseFloat(numStr) || 0;
    if (priceMatch[2] && (priceMatch[2].toLowerCase() === 'mil' || priceMatch[2].toLowerCase() === 'k')) {
      val = val * 1000;
    }
    if (val > 0) {
      extractedPrice = val;
    }
  }

  // Fallback for "X mil pesos" without numbers written as digits (e.g. "cincuenta mil pesos")
  if (!extractedPrice) {
    const wordPriceMatch = text.match(/(veinte|treinta|cuarenta|cincuenta|cien|doscientos|quinientos)\s+mil/i);
    if (wordPriceMatch) {
      const word = wordPriceMatch[1].toLowerCase();
      const map = { veinte: 20000, treinta: 30000, cuarenta: 40000, cincuenta: 50000, cien: 100000, doscientos: 200000, quinientos: 500000 };
      if (map[word]) extractedPrice = map[word];
    }
  }

  // 3. Extract Quantity
  let quantity = 1;
  const qtyDigitMatch = text.match(/\b(\d+)\s+([a-zA-ZáéíóúñÑ]+)/i);
  if (qtyDigitMatch) {
    const q = parseInt(qtyDigitMatch[1], 10);
    // Ignore if it looks like a year (e.g. 2026) or a large price
    if (q > 0 && q < 500) {
      quantity = q;
    }
  } else {
    // Check word numbers
    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      const regex = new RegExp(`\\b${word}\\s+([a-zA-ZáéíóúñÑ]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        quantity = num;
        break;
      }
    }
  }

  // 4. Extract Description / Concept
  let description = 'Servicio profesional / Mano de obra';
  // Try to find the action/item phrase: "necesito que le cotices tres helados a..." -> "tres helados" / "helados"
  const conceptMatch = text.match(/(?:cotices|cotizar|instalar|reparar|cambiar|hacer|poner|de|suministro de)\s+([^,\.\$]+?)(?:\s+a\s+\$|\s+por\s+\$|\s+en\s+total|\s+a\s+\d|\$|$)/i);
  if (conceptMatch && conceptMatch[1]) {
    let cleanConcept = conceptMatch[1].trim();
    // Remove leading quantity words if present in concept
    cleanConcept = cleanConcept.replace(/^(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+/i, '');
    if (cleanConcept.length > 2) {
      description = cleanConcept.charAt(0).toUpperCase() + cleanConcept.slice(1);
    }
  } else {
    // Fallback: take segment after client name
    const afterClient = text.replace(/^(?:hola\s+)?(?:cotizone\s*)?(?:para|a)\s+[^,\:]+[:\,]?/i, '').trim();
    if (afterClient) {
      description = afterClient.substring(0, 80);
    }
  }

  const finalUnitPrice = extractedPrice || (quantity > 0 ? 50000 : 50000);

  return {
    clientName,
    clientAddress: 'Dirección acordada con el cliente',
    items: [
      {
        id: 'v-' + Date.now(),
        description: description,
        quantity: quantity,
        unitPrice: finalUnitPrice
      }
    ],
    notes: `Cotización generada a partir de nota de voz: "${text}"`,
    depositPercent: 30
  };
}
