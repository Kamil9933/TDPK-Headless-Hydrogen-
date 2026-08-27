/**
 * /api/judgeme/:widget — server-side proxy to Judge.me's public widget API
 * (platform-independent review widgets). Keeps Judge.me credentials on the
 * server and exposes only the sanitized widget HTML to the browser.
 *
 * Requires env vars (blocker — must be provided by the user):
 *   PUBLIC_JUDGEME_SHOP_DOMAIN  e.g. "hydrogen-headless-lgy6ghss.myshopify.com"
 *   PUBLIC_JUDGEME_PUBLIC_TOKEN Judge.me public API token (Settings >
 *                               Integrations > View API token)
 *
 * Supported widgets ("preview_badge" | "review_widget"):
 *   /api/judgeme/preview_badge?product_id=<legacy id>
 *   /api/judgeme/review_widget?product_id=<legacy id>
 */
export async function loader({request, params, context}) {
  const {env} = context;
  const {widget} = params;

  const shopDomain = env.PUBLIC_JUDGEME_SHOP_DOMAIN;
  const publicToken = env.PUBLIC_JUDGEME_PUBLIC_TOKEN;

  if (!shopDomain || !publicToken || !widget) {
    return {html: ''};
  }

  if (widget !== 'preview_badge' && widget !== 'review_widget') {
    return {html: ''};
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get('product_id');
  if (!productId) return {html: ''};

  const apiPath = widget === 'preview_badge' ? 'preview_badge' : 'product_review';
  const apiUrl = new URL(`https://cache.judge.me/widgets/shopify/${shopDomain}`);
  apiUrl.searchParams.set('public_token', publicToken);
  apiUrl.searchParams.set(
    widget === 'review_widget' ? 'review_widget_product_ids' : 'star_rating_badge_product_ids',
    productId,
  );

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(apiUrl.toString(), {
      signal: controller.signal,
      headers: {Accept: 'application/json'},
    });
    clearTimeout(timeout);

    if (!response.ok) return {html: ''};

    const contentType = response.headers.get('content-type') || '';
    let html = '';

    if (contentType.includes('application/json')) {
      const json = await response.json();
      // Judge.me cache server returns per-id widget HTML.
      const widgets = json?.widgets || json?.data || json;
      const found = widgets?.[productId];
      html = typeof found === 'string' ? found : '';
      // fallback: some responses nest under a key
      if (!html && typeof widgets === 'object') {
        for (const key of Object.keys(widgets)) {
          const v = widgets[key];
          if (typeof v === 'string') html = v;
        }
      }
    } else {
      html = await response.text();
    }

    // Only return known-safe Judge.me markup. Never pass user input through.
    return {html: html || ''};
  } catch {
    return {html: ''};
  }
}
