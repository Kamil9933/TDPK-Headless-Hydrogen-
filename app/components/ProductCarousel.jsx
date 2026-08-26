import {Suspense} from 'react';
import {Await} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import {ScrollCarousel} from '~/components/ScrollCarousel';
import {Reveal} from '~/components/Reveal';

/**
 * ProductCarousel — horizontally scrollable row of product cards.
 * Uses ScrollCarousel for scroll-snap behavior and ProductItem for consistent card styling.
 *
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
export function ProductCarousel({products}) {
  return (
    <section className="bg-white py-20 px-6" aria-labelledby="product-carousel">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Curated for You
          </p>
          <h2
            id="product-carousel"
            className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Recommended
          </h2>
        </Reveal>

        <Suspense
          fallback={
            <div className="flex gap-4 overflow-hidden">
              {['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e', 'sk-f'].map((id) => (
                <div
                  key={id}
                  className="min-w-[220px] animate-pulse rounded-xl bg-neutral-100"
                >
                  <div className="aspect-square rounded-t-xl bg-neutral-200" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="h-3 w-1/2 rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <Await resolve={products}>
            {(response) => {
              if (!response?.products?.nodes?.length) return null;
              return (
                <ScrollCarousel ariaLabel="Recommended products">
                  {response.products.nodes.map((product) => (
                    <div
                      key={product.id}
                      className="snap-start flex-shrink-0"
                      style={{minWidth: '220px', maxWidth: '220px'}}
                    >
                      <ProductItem product={product} loading="lazy" />
                    </div>
                  ))}
                </ScrollCarousel>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
