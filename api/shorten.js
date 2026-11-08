export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.query.url || req.body?.url;
  if (!url) {
    return res.status(400).json({ error: 'Falta el parámetro url' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TinyURL responded with status: ${response.status}`);
    }

    const shortUrl = await response.text();
    if (shortUrl && shortUrl.startsWith('http')) {
      return res.status(200).json({ shortUrl: shortUrl.trim(), success: true });
    } else {
      throw new Error('Respuesta inválida del acortador');
    }
  } catch (err) {
    console.error('Error shortening url:', err.message);
    // Return original url as fallback so app never breaks
    return res.status(200).json({ shortUrl: url, success: false, error: err.message });
  }
}
