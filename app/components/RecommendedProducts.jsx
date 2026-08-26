import {Suspense} from 'react';
import {Await} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import {Reveal} from '~/components/Reveal';

/**
 * RecommendedProducts — restyled for light brand identity.
 * White background, black text, skeleton loaders with light grey tones.
 *
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
export function RecommendedProducts({products}) {
  return (
    <section
      className="bg-neutral-50 py-20 px-6"
      aria-labelledby="recommended-products"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Just Dropped
          </p>
          <h2
            id="recommended-products"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Recommended
          </h2>
        </Reveal>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {['skeleton-a', 'skeleton-b', 'skeleton-c', 'skeleton-d'].map(
                (id) => (
                  <div
                    key={id}
                    className="animate-pulse rounded-xl bg-white shadow-sm"
                  >
                    <div className="aspect-square rounded-t-xl bg-neutral-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 rounded bg-neutral-200" />
                      <div className="h-3 w-1/2 rounded bg-neutral-200" />
                    </div>
                  </div>
                ),
              )}
            </div>
          }
        >
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {response
                  ? response.products.nodes.map((product, index) => (
                      <Reveal key={product.id} threshold={0.05}>
                        <ProductItem
                          product={product}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      </Reveal>
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
