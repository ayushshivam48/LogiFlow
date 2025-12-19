// Catch-all proxy for API routes defined under app/api/*.js
// This lets you keep classic (req, res) handler files in app/api while
// exposing them to Next.js via pages/api.

export default async function handler(req, res) {
  try {
    const slug = req.query.route || [];
    const route = Array.isArray(slug) ? slug.join('/') : slug;

    if (!route) {
      return res.status(404).json({ message: 'API route not specified' });
    }

    // Only allow simple file names to prevent directory traversal beyond app/api
    if (route.includes('..')) {
      return res.status(400).json({ message: 'Invalid route' });
    }

    // Load the corresponding handler from app/api/<route>.js
    // Example: /api/create-order -> app/api/create-order.js
    let mod;
    try {
      mod = await import(`../../app/api/${route}.js`);
    } catch (e) {
      return res.status(404).json({ message: 'API route not found' });
    }

    const fn = mod && (mod.default || mod);
    if (typeof fn !== 'function') {
      return res.status(500).json({ message: 'Invalid API handler exported' });
    }

    return fn(req, res);
  } catch (err) {
    return res.status(500).json({ message: 'Unexpected server error', error: String(err && err.message || err) });
  }
}
