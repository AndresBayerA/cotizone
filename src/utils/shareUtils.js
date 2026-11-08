// Safe URL-based compression and state sharing for quotes without servers

export function encodeQuoteForUrl(quote, business) {
  try {
    const payload = {
      q: {
        id: quote.id,
        clientName: quote.clientName,
        clientPhone: quote.clientPhone,
        clientEmail: quote.clientEmail,
        clientAddress: quote.clientAddress,
        date: quote.date,
        validDays: quote.validDays,
        status: quote.status,
        notes: quote.notes,
        discountPercent: quote.discountPercent || 0,
        taxPercent: quote.taxPercent || 0,
        depositPercent: quote.depositPercent || 30,
        depositPaid: quote.depositPaid || false,
        depositAmount: quote.depositAmount || null,
        depositPaidAt: quote.depositPaidAt || null,
        paymentMethod: quote.paymentMethod || null,
        transactionId: quote.transactionId || null,
        items: quote.items || [],
        signedAt: quote.signedAt,
        signedBy: quote.signedBy,
        signatureDataUrl: quote.signatureDataUrl
      },
      b: {
        name: business.name,
        slogan: business.slogan,
        phone: business.phone,
        email: business.email,
        address: business.address,
        currency: business.currency || 'COP',
        currencySymbol: business.currencySymbol || '$',
        defaultTerms: business.defaultTerms
      }
    };

    const jsonStr = JSON.stringify(payload);
    // Safe UTF-8 Base64 encoding
    const b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));

    return encodeURIComponent(b64);
  } catch (err) {
    console.error('Error encoding quote:', err);
    return null;
  }
}

export function decodeQuoteFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('q');
    if (!encoded) return null;

    const b64 = decodeURIComponent(encoded);
    const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonStr);
    if (payload && payload.q && payload.b) {
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

export function getShareableQuoteUrl(quote, business) {
  const code = encodeQuoteForUrl(quote, business);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?q=${code}`;
}
