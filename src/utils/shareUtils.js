// Safe URL-based compression and state sharing for quotes
import { DEFAULT_BUSINESS } from './storage';

function toBase64Url(str) {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(str))));
  }
}

function fromBase64Url(b64url) {
  try {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
      b64 += '=';
    }
    return decodeURIComponent(escape(atob(b64)));
  }
}

/**
 * Encodes a quote and its associated business info into an ultra-compact URL payload (v2).
 */
export function encodeQuoteForUrl(quote, business = {}) {
  try {
    const compact = {
      v: 2,
      id: quote.id,
      c: quote.clientName,
      // items as compact tuples: [description, quantity, unitPrice]
      i: (quote.items || []).map(it => [
        it.description || '',
        Number(it.quantity) || 1,
        Number(it.unitPrice) || 0
      ]),
      b: business.name || 'Mi Empresa'
    };

    if (quote.clientPhone) compact.cp = quote.clientPhone;
    if (quote.clientAddress) compact.ca = quote.clientAddress;
    if (quote.clientEmail) compact.ce = quote.clientEmail;
    if (quote.date) compact.d = quote.date;
    if (quote.validDays && quote.validDays !== 15) compact.vd = quote.validDays;
    if (quote.status && quote.status !== 'sent') compact.st = quote.status;
    if (quote.taxPercent) compact.tx = quote.taxPercent;
    if (quote.discountPercent) compact.dc = quote.discountPercent;
    if (quote.depositPercent && quote.depositPercent !== 30) compact.dp = quote.depositPercent;
    if (quote.depositPaid) compact.dpd = 1;
    if (quote.notes) compact.n = quote.notes.slice(0, 160);

    if (business.phone) compact.bp = business.phone;
    if (business.slogan) compact.bs = business.slogan;
    if (business.currency && business.currency !== 'COP') compact.bc = business.currency;
    if (business.currencySymbol && business.currencySymbol !== '$') compact.bsy = business.currencySymbol;

    const jsonStr = JSON.stringify(compact);
    return toBase64Url(jsonStr);
  } catch (err) {
    console.error('Error encoding quote:', err);
    return null;
  }
}

/**
 * Decodes a quote and business from URL parameters (supports v2 compact and legacy v1 formats).
 */
export function decodeQuoteFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('q');
    if (!encoded) return null;

    let payload = null;

    // Try decoding base64url or standard base64
    try {
      const jsonStr = fromBase64Url(encoded);
      payload = JSON.parse(jsonStr);
    } catch {
      // Fallback for legacy format
      const b64 = decodeURIComponent(encoded);
      const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      payload = JSON.parse(jsonStr);
    }

    if (!payload) return null;

    // Check if v2 compact format
    if (payload.v === 2 || payload.c) {
      const quote = {
        id: payload.id || `COT-${new Date().getFullYear()}-001`,
        clientName: payload.c || 'Cliente',
        clientPhone: payload.cp || '',
        clientEmail: payload.ce || '',
        clientAddress: payload.ca || '',
        date: payload.d || new Date().toISOString().split('T')[0],
        validDays: payload.vd || 15,
        status: payload.st || 'sent',
        notes: payload.n || '',
        discountPercent: payload.dc || 0,
        taxPercent: payload.tx !== undefined ? payload.tx : 19,
        depositPercent: payload.dp !== undefined ? payload.dp : 30,
        depositPaid: Boolean(payload.dpd),
        depositAmount: null,
        depositPaidAt: null,
        paymentMethod: null,
        transactionId: null,
        items: (payload.i || []).map((it, idx) => ({
          id: String(idx + 1),
          description: Array.isArray(it) ? it[0] : (it.description || ''),
          quantity: Array.isArray(it) ? it[1] : (it.quantity || 1),
          unitPrice: Array.isArray(it) ? it[2] : (it.unitPrice || 0)
        })),
        signedAt: null,
        signedBy: null,
        signatureDataUrl: null
      };

      const business = {
        name: payload.b || DEFAULT_BUSINESS.name,
        slogan: payload.bs || DEFAULT_BUSINESS.slogan,
        phone: payload.bp || DEFAULT_BUSINESS.phone,
        email: DEFAULT_BUSINESS.email,
        address: DEFAULT_BUSINESS.address,
        currency: payload.bc || DEFAULT_BUSINESS.currency,
        currencySymbol: payload.bsy || DEFAULT_BUSINESS.currencySymbol,
        defaultTerms: DEFAULT_BUSINESS.defaultTerms
      };

      return { quote, business };
    }

    // Legacy v1 payload format: { q: {...}, b: {...} }
    if (payload.q && payload.b) {
      return {
        quote: payload.q,
        business: payload.b
      };
    }

    return null;
  } catch (err) {
    console.warn('Could not decode quote from URL:', err);
    return null;
  }
}

/**
 * Returns the direct canonical shareable URL with the compact payload.
 */
export function getShareableQuoteUrl(quote, business) {
  const code = encodeQuoteForUrl(quote, business);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?q=${code}`;
}

// Memory cache for shortened URLs to avoid duplicate API requests
const shortUrlCache = new Map();

/**
 * Attempts to shorten the quote URL via serverless endpoint.
 * Falls back safely to canonical compact URL if unavailable or offline.
 */
export async function getShortQuoteUrl(quote, business) {
  const longUrl = getShareableQuoteUrl(quote, business);
  if (!longUrl) return '';

  if (shortUrlCache.has(longUrl)) {
    return shortUrlCache.get(longUrl);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`/api/shorten?url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shortUrl) {
        shortUrlCache.set(longUrl, data.shortUrl);
        return data.shortUrl;
      }
    }
  } catch (err) {
    // Graceful fallback to longUrl
  }

  // Fallback to compact direct URL
  return longUrl;
}
