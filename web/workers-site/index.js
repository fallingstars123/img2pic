/**
 * Cloudflare Workers script for serving static files
 * This script handles requests to your img2pic web application
 */

import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

// Cache configuration
const CACHE_TTL = {
  html: 60 * 60 * 2, // 2 hours
  css: 60 * 60 * 24 * 30, // 30 days
  js: 60 * 60 * 24 * 30, // 30 days
  images: 60 * 60 * 24 * 30, // 30 days
  fonts: 60 * 60 * 24 * 30, // 30 days
  default: 60 * 60 * 2, // 2 hours
};

/**
 * The main fetch handler for the worker
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

/**
 * Handle the fetch event
 */
async function handleEvent(event) {
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // Handle API routes if needed
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(event.request, pathname);
  }

  // Handle static assets
  return handleAssetRequest(event.request, pathname);
}

/**
 * Handle API requests (add your API logic here)
 */
async function handleApiRequest(request, pathname) {
  // Example API endpoint
  if (pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // 404 for other API endpoints
  return new Response('API endpoint not found', { status: 404 });
}

/**
 * Handle static asset requests
 */
async function handleAssetRequest(request, pathname) {
  // Default to index.html for SPA routing
  if (pathname === '/' || !pathname.includes('.')) {
    const url = new URL(request.url);
    url.pathname = '/index.html';
    request = new Request(url, request);
  }

  try {
    // Map request to asset and serve from KV
    const asset = await getAssetFromKV(event, {
      mapRequestToAsset: req => {
        // First try to get the exact path
        return mapRequestToAsset(req);
      },
    });

    // Determine content type and set cache headers
    const contentType = asset.headers.get('content-type') || 'text/plain';
    const cacheTime = getCacheTime(contentType, pathname);

    // Set security headers
    const response = new Response(asset.body, asset);

    // Cache headers
    response.headers.set('Cache-Control', `public, max-age=${cacheTime}`);

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Enable Gzip compression
    if (shouldCompress(pathname)) {
      response.headers.set('Content-Encoding', 'gzip');
    }

    return response;
  } catch (e) {
    // If asset not found, return 404 or fallback to index.html for SPA
    if (e.status === 404 && shouldServeIndex(pathname)) {
      try {
        const indexAsset = await getAssetFromKV(event, {
          mapRequestToAsset: req => {
            const url = new URL(req.url);
            url.pathname = '/index.html';
            return new Request(url, req);
          },
        });

        return new Response(indexAsset.body, indexAsset);
      } catch (indexError) {
        return new Response('Application not found', { status: 404 });
      }
    }

    return new Response('Asset not found', { status: 404 });
  }
}

/**
 * Get cache time based on content type
 */
function getCacheTime(contentType, pathname) {
  if (contentType.includes('text/html')) return CACHE_TTL.html;
  if (contentType.includes('text/css')) return CACHE_TTL.css;
  if (contentType.includes('application/javascript')) return CACHE_TTL.js;
  if (contentType.includes('image/')) return CACHE_TTL.images;
  if (contentType.includes('font/')) return CACHE_TTL.fonts;

  // Check file extensions as fallback
  if (pathname.match(/\.(css|js)$/)) return CACHE_TTL.css;
  if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) return CACHE_TTL.images;
  if (pathname.match(/\.(woff|woff2|ttf|eot)$/)) return CACHE_TTL.fonts;

  return CACHE_TTL.default;
}

/**
 * Check if file should be compressed
 */
function shouldCompress(pathname) {
  return pathname.match(/\.(js|css|html|txt|xml|json)$/);
}

/**
 * Check if should serve index.html for SPA routing
 */
function shouldServeIndex(pathname) {
  // Don't serve index for static assets
  if (pathname.includes('.')) return false;

  // Don't serve index for API routes
  if (pathname.startsWith('/api/')) return false;

  // Serve index for all other routes (SPA routing)
  return true;
}

/**
 * Handle CORS preflight requests
 */
function handleCors(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  return null;
}