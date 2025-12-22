/**
 * Cloudflare Workers script for serving static files
 */
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

// 1. 关键修复：导入资源清单
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const ASSET_MANIFEST = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle API routes if needed
      if (pathname.startsWith('/api/')) {
        return handleApiRequest(request, pathname);
      }

      // 定义获取资源的配置选项
      const options = {
        mapRequestToAsset: mapRequestToAsset,
        manifest: ASSET_MANIFEST, // 2. 关键修复：传入清单
        ASSET_NAMESPACE: env.__STATIC_CONTENT, // 3. 关键修复：传入 KV 命名空间绑定
      };

      let asset;
      try {
        // 尝试获取资源
        asset = await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          options
        );
      } catch (e) {
        // If asset not found and it's a SPA route, serve index.html
        if (shouldServeIndex(pathname)) {
          const indexUrl = new URL(request.url);
          indexUrl.pathname = '/index.html';

          // 修改为查找 index.html
          const indexRequest = new Request(indexUrl, request);

          try {
            asset = await getAssetFromKV(
              {
                request: indexRequest,
                waitUntil: ctx.waitUntil.bind(ctx),
              },
              options
            );
          } catch (indexError) {
            // 这里就是你看到的错误来源
            return new Response('Application not found', { status: 404 });
          }
        } else {
          return new Response('Asset not found', { status: 404 });
        }
      }

      // Set cache headers based on content type
      const contentType = asset.headers.get('content-type') || 'text/plain';
      const cacheTime = getCacheTime(contentType, pathname);

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
      return new Response('Internal Server Error: ' + e.message, { status: 500 });
    }
  },
};

// ... (后面的 handleApiRequest, getCacheTime, shouldServeIndex 函数保持不变) ...
function handleApiRequest(request, pathname) {
  if (pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
  return new Response('API endpoint not found', { status: 404 });
}

function getCacheTime(contentType, pathname) {
  const CACHE_TTL = {
    html: 60 * 60 * 2,
    css: 60 * 60 * 24 * 30,
    js: 60 * 60 * 24 * 30,
    images: 60 * 60 * 24 * 30,
    fonts: 60 * 60 * 24 * 30,
    default: 60 * 60 * 2,
  };
  if (contentType.includes('text/html')) return CACHE_TTL.html;
  if (contentType.includes('text/css')) return CACHE_TTL.css;
  if (contentType.includes('application/javascript')) return CACHE_TTL.js;
  if (contentType.includes('image/')) return CACHE_TTL.images;
  if (contentType.includes('font/')) return CACHE_TTL.fonts;
  if (pathname.match(/\.(css|js)$/)) return CACHE_TTL.css;
  if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) return CACHE_TTL.images;
  if (pathname.match(/\.(woff|woff2|ttf|eot)$/)) return CACHE_TTL.fonts;
  return CACHE_TTL.default;
}

function shouldServeIndex(pathname) {
  if (pathname.includes('.')) return false;
  if (pathname.startsWith('/api/')) return false;
  return true;
}
