/**
 * Cloudflare Workers script for serving static files
 * This script handles requests to your img2pic web application
 */

import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

/**
 * Main fetch handler for the worker
 */
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle API routes if needed
      if (pathname.startsWith('/api/')) {
        return handleApiRequest(request, pathname);
      }

      // For SPA routing: if path doesn't have a file extension and isn't an API route,
      // try to serve the requested file first, then fall back to index.html
      let asset;
      try {
        asset = await getAssetFromKV(request, {
          mapRequestToAsset: mapRequestToAsset,
        });
      } catch (e) {
        // If asset not found and it's a SPA route, serve index.html
        if (shouldServeIndex(pathname)) {
          const indexUrl = new URL(request.url);
          indexUrl.pathname = '/index.html';
          const indexRequest = new Request(indexUrl, request);
          try {
            asset = await getAssetFromKV(indexRequest, {
              mapRequestToAsset: mapRequestToAsset,
            });
          } catch (indexError) {
            return new Response('Application not found', { status: 404 });
          }
        } else {
          return new Response('Asset not found', { status: 404 });
        }
      }

      // Set cache headers based on content type
      const contentType = asset.headers.get('content-type') || 'text/plain';
      const cacheTime = getCacheTime(contentType, pathname);

      // Create response with proper headers
      const response = new Response(asset.body, asset);
      response.headers.set('Cache-Control', `public, max-age=${cacheTime}`);

      // Security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    } catch (e) {
      console.error('Worker error:', e);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

/**
 * Handle API requests
 */
function handleApiRequest(request, pathname) {
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
 * Get cache time based on content type
 */
function getCacheTime(contentType, pathname) {
  const CACHE_TTL = {
    html: 60 * 60 * 2, // 2 hours
    css: 60 * 60 * 24 * 30, // 30 days
    js: 60 * 60 * 24 * 30, // 30 days
    images: 60 * 60 * 24 * 30, // 30 days
    fonts: 60 * 60 * 24 * 30, // 30 days
    default: 60 * 60 * 2, // 2 hours
  };

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
 * Check if should serve index.html for SPA routing
 */
function shouldServeIndex(pathname) {
  // Don't serve index for static assets (files with extensions)
  if (pathname.includes('.')) return false;

  // Don't serve index for API routes
  if (pathname.startsWith('/api/')) return false;

  // Serve index for all other routes (SPA routing)
  return true;
}
