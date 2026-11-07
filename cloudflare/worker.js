/**
 * CREOX Digital Marketplace — Cloudflare Worker for Secure R2 Product Downloads
 * Domain: download.creox.com
 *
 * Validates HMAC signed download tokens or queries Creox API before streaming
 * files from the private 'creox-products' R2 bucket.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only allow GET and HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Extract path: /download/:token
    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2 || pathSegments[0] !== 'download') {
      return new Response('Invalid Download URL', { status: 400 });
    }

    const token = pathSegments[1];

    try {
      // 1. Verify download token with primary CREOX API
      const verifyUrl = `${env.API_BASE_URL || 'https://creox.com'}/api/delivery/verify-token?token=${encodeURIComponent(token)}`;
      const verifyRes = await fetch(verifyUrl, {
        headers: { 'X-Worker-Secret': env.WORKER_SECRET || 'creox-worker-secret' }
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json().catch(() => ({}));
        return new Response(errorData.message || 'Download link expired or invalid', {
          status: verifyRes.status,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      const { r2Key, fileName, mimeType } = await verifyRes.json();

      // 2. Fetch object from private R2 bucket binding: env.CREOX_PRODUCTS
      const object = await env.CREOX_PRODUCTS.get(r2Key);
      if (!object) {
        return new Response('Requested file not found in storage', { status: 404 });
      }

      // 3. Increment download counter
      await fetch(`${env.API_BASE_URL || 'https://creox.com'}/api/delivery/increment-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Worker-Secret': env.WORKER_SECRET || 'creox-worker-secret'
        },
        body: JSON.stringify({ token })
      }).catch(err => console.error('Failed to increment download count:', err));

      // 4. Return streaming response with attachment disposition
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Content-Type', mimeType || object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${fileName || 'download'}"`);
      headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

      return new Response(object.body, { headers });
    } catch (err) {
      return new Response(`Error retrieving file: ${err.message}`, { status: 500 });
    }
  }
};
