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

  // 1. Client Name: preserve exactly whatever name was spoken/written (e.g. "Don Matthew", "Carlos", etc.)
  let clientName = 'Cliente';
  const clientMatch = text.match(/(?:para|cotizar a|cliente|don|doña|señor|señora)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)(?:,|\.|necesito|cotizar|cotices|quiero|por favor|instalar|cambiar|reparar|poner|hacer|\b(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\b|\$|$)/i);
  if (clientMatch && clientMatch[1]) {
    const raw = clientMatch[1].trim();
    if (raw.length > 1) {
      clientName = raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  // 2. Quantity & Concept
  let quantity = 1;
  let description = 'Servicio profesional';

  // Check word numbers: "tres helados"
  for (const [w, n] of Object.entries(NUMBER_WORDS)) {
    const regex = new RegExp(`\\b${w}\\s+([a-zA-ZáéíóúñÑ]+)`, 'i');
    const m = text.match(regex);
    if (m && !/^(mil|k|pesos|dolares|usd|cop|cada|horas?|dias?|mes|meses|y)$/i.test(m[1])) {
      quantity = n;
      description = m[1].charAt(0).toUpperCase() + m[1].slice(1);
      break;
    }
  }

  // Check digit numbers: "5 ventiladores", "3 helados"
  if (quantity === 1) {
    const digitMatches = [...text.matchAll(/\b(\d+)\s+([a-zA-ZáéíóúñÑ]+)/gi)];
    for (const dm of digitMatches) {
      if (!/^(mil|k|pesos|dolares|usd|cop|cada|horas?|dias?)$/i.test(dm[2])) {
        const q = parseInt(dm[1], 10);
        if (q > 0 && q < 500) {
          quantity = q;
          description = dm[2].charAt(0).toUpperCase() + dm[2].slice(1);
          break;
        }
      }
    }
  }

  // Fallback description if still generic
  if (description === 'Servicio profesional') {
    const actionMatch = text.match(/(?:instalar|reparar|cambiar|poner|hacer|mantenimiento|suministro)\s+([^,\.\$]+?)(?:\s+a\s+\$|\s+a\s+\d|\s+por\s+\$|\$|$)/i);
    if (actionMatch && actionMatch[1]) {
      description = actionMatch[1].trim().charAt(0).toUpperCase() + actionMatch[1].trim().slice(1);
    }
  }

  // 3. Price: look for price markers: "a $50,000", "a 120 mil", "a 380.000", "$50000"
  let price = 50000;
  const priceMatch = text.match(/(?:a|\$|precio|valor|por|total)\s*\$?\s*([\d\.\,]+)\s*(mil|k)?(?:\s*(?:pesos|cop))?/i)
    || text.match(/\$?\s*([\d\.\,]+)\s*(mil|k)(?:\s*(?:pesos|cop))?/i)
    || text.match(/\$\s*([\d\.\,]+)/);

  if (priceMatch) {
    let clean = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
    let val = parseFloat(clean) || 0;
    if (priceMatch[2] || (val > 0 && val < 1000)) {
      val = val * 1000;
    }
    if (val > 0) price = val;
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
