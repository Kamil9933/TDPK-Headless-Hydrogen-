import {useFetcher} from 'react-router';
import {useEffect, useState} from 'react';

/**
 * JudgeMeBadge — small star-rating "preview badge" shown on product cards.
 * Fetches Judge.me's public preview-badge widget HTML server-side via the
 * /api/judgeme/preview_badge resource route (reads PUBLIC_JUDGEME_* from
 * env) and renders it. Degrades to nothing when credentials aren't set or
 * the widget returns no HTML (no reviews).
 *
 * @param {{ productId: string }}
 */
export function JudgeMeBadge({productId}) {
  const legacyId = productId?.split('/').pop();
  const fetcher = useFetcher();
  const [html, setHtml] = useState(null);

  useEffect(() => {
    if (!legacyId) return;
    fetcher.load(`/api/judgeme/preview_badge?product_id=${legacyId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyId]);

  const loadedHtml = fetcher.data?.html;

  useEffect(() => {
    if (loadedHtml) setHtml(loadedHtml);
  }, [loadedHtml]);

  if (!html) return null;

  return (
    <div
      className="mt-1"
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
}
