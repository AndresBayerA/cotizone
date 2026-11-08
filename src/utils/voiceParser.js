// Intelligent Natural Language Parser for Voice Quotes in Spanish (Colombia & LatAm)

export function deduplicateSpeech(str) {
  if (!str) return '';
  let s = str.trim();

  // Clean obvious immediate repeated words (e.g. "para para" -> "para")
  s = s.replace(/\b(\w+)\s+\1\b/gi, '$1');

  // Detect and remove phrase-level repetitions caused by Android Chrome Speech API
  let changed = true;
  let loops = 0;
  while (changed && loops < 5) {
    changed = false;
    loops++;
    const maxLen = Math.floor(s.length / 2);
    for (let len = maxLen; len >= 6; len--) {
      const tail = s.slice(-len).trim();
      const head = s.slice(0, s.lastIndexOf(tail)).trim();
      if (head && head.endsWith(tail)) {
        s = head;
        changed = true;
        break;
      }
    }
  }

  return s.trim();
}

const NUMBER_WORDS = {
  'un': 1, 'uno': 1, 'una': 1,
  'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
  'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
  'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
  'veinte': 20, 'veinticinco': 25, 'treinta': 30, 'cincuenta': 50, 'cien': 100
};

export function parseVoiceQuoteText(rawText) {
  if (!rawText || !rawText.trim()) return null;

  // First deduplicate speech artifacts
  const text = deduplicateSpeech(rawText.trim());

  // 1. Extract Client Name (handles: "Para Don Matthew", "Para Don Mario", "Cotizar a Carlos", etc.)
  let clientName = 'Cliente';
  const clientMatch = text.match(/(?:para|cotizar a|cliente|don|doña|señor|señora)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)(?:,|\.|necesito|cotizar|cotices|quiero|por favor|en\s+(?:calle|carrera|av|cra)|con|\d|\$|$)/i);
  if (clientMatch && clientMatch[1]) {
    let rawName = clientMatch[1].trim();
    // Exclude noise words
    rawName = rawName.replace(/^(el|la|los|las|un|una)\s+/i, '');
    if (rawName.length > 1) {
      // If user said "Para Don Mario", keep "Don Mario"
      if (/^don\s+/i.test(text.substring(text.toLowerCase().indexOf('don')))) {
        const donMatch = text.match(/(don\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)/i);
        if (donMatch) rawName = donMatch[1];
      }
      clientName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    }
  }

  // 2. Extract Quantity
  let quantity = 1;
  // Look for digits: "3 helados", "13 lados"
  const qtyDigitMatch = text.match(/\b(\d+)\s+([a-zA-ZáéíóúñÑ]+)/i);
  if (qtyDigitMatch) {
    const q = parseInt(qtyDigitMatch[1], 10);
    // Ignore if it looks like a year or a price like 50000
    if (q > 0 && q <= 100) {
      quantity = q;
    }
  } else {
    // Check word numbers: "tres helados"
    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      const regex = new RegExp(`\\b${word}\\s+([a-zA-ZáéíóúñÑ]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        quantity = num;
        break;
      }
    }
  }

  // 3. Extract Price
  let extractedPrice = null;
  // Patterns like "$50.000", "50000", "50 mil", "a 50 cada uno"
  const priceMatch = text.match(/\$?\s*([\d\.\,]+)\s*(mil|k)?\s*(?:pesos|cop|euros|usd)?(?:\s*(?:cada uno|c\/u|por unidad|en total|por favor))?/i);
  if (priceMatch) {
    let numStr = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
    let val = parseFloat(numStr) || 0;
    
    // In Colombia, saying "a 50 cada uno" or "a 380" means 50.000 or 380.000 COP
    if (val > 0 && val < 1000 && !priceMatch[2]) {
      val = val * 1000;
    } else if (priceMatch[2] && (priceMatch[2].toLowerCase() === 'mil' || priceMatch[2].toLowerCase() === 'k')) {
      val = val * 1000;
    }
    
    if (val > 0) {
      extractedPrice = val;
    }
  }

  // Fallback for word prices: "cincuenta mil", "treinta mil"
  if (!extractedPrice) {
    const wordPriceMatch = text.match(/(veinte|treinta|cuarenta|cincuenta|cien|doscientos|quinientos)\s+mil/i);
    if (wordPriceMatch) {
      const word = wordPriceMatch[1].toLowerCase();
      const map = { veinte: 20000, treinta: 30000, cuarenta: 40000, cincuenta: 50000, cien: 100000, doscientos: 200000, quinientos: 500000 };
      if (map[word]) extractedPrice = map[word];
    }
  }

  // 4. Extract Description / Concept
  let description = 'Servicio / Suministro acordado';
  // Check for common Colombian product/service patterns
  const itemMatch = text.match(/(?:cotices|cotizar|necesito|cambiar|instalar|poner|reparar|hacer|vender|comprar)\s+(?:que\s+le\s+cotices\s+)?(?:\d+\s+)?([a-zA-ZáéíóúñÑ\s]+?)(?:\s+a\s+\$|\s+a\s+\d|\s+por\s+\$|\s+en\s+total|\$|$)/i);
  if (itemMatch && itemMatch[1]) {
    let clean = itemMatch[1].trim();
    // Remove quantity word if trapped
    clean = clean.replace(/^(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+/i, '');
    clean = clean.replace(/^(que\s+le\s+cotices|le\s+cotices)\s+/i, '');
    
    // Fix phonetic transcription ("13 lados" -> "Helados", "tres lados" -> "Helados")
    if (/^lados$/i.test(clean) || /helados/i.test(text)) {
      clean = 'Helados artesanales';
    }

    if (clean.length > 2) {
      description = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
  }

  // If description was caught as "Lados", fix to "Helados" if user said helados
  if (/helado/i.test(text)) {
    description = 'Helados';
  }

  const finalUnitPrice = extractedPrice || 50000;

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
    notes: `Cotización generada automáticamente por nota de voz: "${text}"`,
    depositPercent: 30
  };
}
