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
  'once': 11, 'doce': 12, 'quince': 15, 'veinte': 20
};

export function parseVoiceQuoteText(rawText) {
  if (!rawText || !rawText.trim()) return null;

  // Clean any speech artifacts
  const text = deduplicateSpeech(rawText.trim());

  // 1. EXTRACT PRICE FIRST (before numbers are confused with quantities)
  let price = 50000;
  
  // A) Check "millones" / "millón" (e.g. "50 millones", "3.5 millones", "1 millón")
  const millionsMatch = text.match(/([\d\.\,]+)\s*(?:millones|millón|millon)/i);
  if (millionsMatch) {
    let rawNum = millionsMatch[1];
    // If it has decimal like 3.5 or 3,5
    if (/^\d+[\.\,]\d+$/.test(rawNum)) {
      price = parseFloat(rawNum.replace(',', '.')) * 1000000;
    } else {
      let clean = rawNum.replace(/\./g, '').replace(/,/g, '');
      price = (parseFloat(clean) || 1) * 1000000;
    }
  } else {
    // B) Check "mil" or regular prices: "por valor de X", "a $X", "$X", "a X mil"
    const pricePattern = /(?:por\s+valor\s+de|valor\s+de|precio\s+de|a\s+\$|\$|a\s+)([\d\.\,]+)\s*(mil|k)?(?:\s*(?:pesos|cop))?/i;
    const pm = text.match(pricePattern) || text.match(/\$?\s*([\d\.\,]+)\s*(mil|k)(?:\s*(?:pesos|cop))?/i) || text.match(/\$\s*([\d\.\,]+)/);
    if (pm) {
      let clean = pm[1].replace(/\./g, '').replace(/,/g, '');
      let val = parseFloat(clean) || 0;
      if (pm[2] || (val > 0 && val < 1000)) {
        val = val * 1000;
      }
      if (val > 0) price = val;
    }
  }

  // 2. EXTRACT CLIENT NAME
  let clientName = 'Cliente';
  const clientMatch = text.match(/(?:cotices\s+a|cotizar\s+a|cotizarle\s+a|\bpara\b|\bcliente\b|\ba\b(?!\s*[\d\$]))\s+([A-Za-zÁÉÍÓÚáéíóúñÑ0-9]+)(?:\s+([A-Za-zÁÉÍÓÚáéíóúñÑ0-9]+))?/i);
  if (clientMatch) {
    let first = clientMatch[1];
    let second = clientMatch[2] || '';
    // Exclude stopwords from second name word
    if (/^(una|un|dos|tres|cuatro|cinco|diez|cotizar|cotices|cotizarle|instalar|cambiar|reparar|por|la|el|\d+)$/i.test(second)) {
      second = '';
    }
    let full = (first + ' ' + second).trim();
    if (full.length > 1) {
      clientName = full.charAt(0).toUpperCase() + full.slice(1);
    }
  }

  // 3. STRIP PRICE FROM TEXT to accurately isolate items & quantities
  let cleanText = text
    .replace(/(?:por\s+valor\s+de|valor\s+de|precio\s+de)?\s*[\d\.\,]+\s*(?:millones|millón|millon|mil|k)?\s*(?:de\s+pesos|pesos|cop|cada\s+uno|c\/u)?/gi, ' ')
    .replace(/\$\s*[\d\.\,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 4. EXTRACT QUANTITY & CONCEPT
  let quantity = 1;
  let description = 'Servicio / Suministro profesional';

  // Words like: "una cocina", "tres helados", "dos comedores"
  for (const [w, n] of Object.entries(NUMBER_WORDS)) {
    const regex = new RegExp(`\\b${w}\\s+([a-zA-ZáéíóúñÑ]+)`, 'i');
    const km = cleanText.match(regex);
    if (km && !/^(mil|millon|millones|pesos|dolares|usd|cop|cada|horas?|dias?|de|y|para|a|que|le)$/i.test(km[1])) {
      quantity = n;
      description = km[1].charAt(0).toUpperCase() + km[1].slice(1);
      break;
    }
  }

  // Digits: "5 ventiladores", "3 helados"
  if (quantity === 1) {
    const digitMatch = cleanText.match(/\b(\d+)\s+([a-zA-ZáéíóúñÑ]+)/i);
    if (digitMatch && !/^(mil|millon|millones|pesos|dolares|usd|cop|cada)$/i.test(digitMatch[2])) {
      const q = parseInt(digitMatch[1], 10);
      if (q > 0 && q < 500) {
        quantity = q;
        description = digitMatch[2].charAt(0).toUpperCase() + digitMatch[2].slice(1);
      }
    }
  }

  // Fallback description: find key nouns (cocina, muebles, etc.)
  if (description === 'Servicio / Suministro profesional') {
    const itemMatch = cleanText.match(/(?:cocina|mueble|termo|puerta|ventana|reforma|pintura|instalación|calentador|helado|comedor)\w*/i);
    if (itemMatch) {
      description = itemMatch[0].charAt(0).toUpperCase() + itemMatch[0].slice(1);
    }
  }

  return {
    clientName,
    clientAddress: 'Dirección acordada con el cliente',
    items: [
      {
        id: 'v-' + Date.now(),
        description: description,
        quantity: quantity,
        unitPrice: price
      }
    ],
    notes: `Cotización generada automáticamente por nota de voz: "${text}"`,
    depositPercent: 30
  };
}
