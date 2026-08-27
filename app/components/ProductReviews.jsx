import {useFetcher} from 'react-router';
import {useEffect, useState} from 'react';

/**
 * ProductReviews — Judge.me public review widget on the product page.
 * Fetches Judge.me's public review-widget HTML server-side via the
 * /api/judgeme/review_widget resource route (reads PUBLIC_JUDGEME_* from
 * env) and renders it. Shows nothing until Judge.me credentials are set.
 *
 * @param {{ productId: string }}
 */
export function ProductReviews({productId}) {
  const legacyId = productId?.split('/').pop();
  const fetcher = useFetcher();
  const [html, setHtml] = useState(null);

  useEffect(() => {
    if (!legacyId) return;
    fetcher.load(`/api/judgeme/review_widget?product_id=${legacyId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyId]);

  const loadedHtml = fetcher.data?.html;

  useEffect(() => {
    if (loadedHtml) setHtml(loadedHtml);
  }, [loadedHtml]);

  if (!html) return null;

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8">
      <h2
        className="mb-4 text-xl font-bold tracking-tight text-black"
        style={{fontFamily: 'var(--font-heading)'}}
      >
        Reviews
      </h2>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </section>
  );
}
