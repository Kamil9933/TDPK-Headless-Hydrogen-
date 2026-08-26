import {Suspense, useRef} from 'react';
import {Await, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/Reveal';

/**
 * ProductCarousel — horizontally scrollable row of product cards.
 * Replaces the grid-based RecommendedProducts on the homepage.
 */
export function ProductCarousel({products}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({left: dir * amount, behavior: 'smooth'});
  };

  return (
    <section className="bg-neutral-50 py-20 px-6" aria-labelledby="product-carousel">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Just Dropped
          </p>
          <h2
            id="product-carousel"
            className="mb-8 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Recommended
          </h2>
        </Reveal>

        <div className="relative">
          {/* Arrow buttons */}
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm transition hover:border-[#8252f1] hover:text-[#8252f1] sm:-left-5"
            aria-label="Scroll left"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm transition hover:border-[#8252f1] hover:text-[#8252f1] sm:-right-5"
            aria-label="Scroll right"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <Suspense
            fallback={
              <div className="flex gap-4 overflow-hidden">
                {['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e', 'sk-f'].map((id) => (
                  <div key={id} className="min-w-[220px] animate-pulse rounded-xl bg-white shadow-sm">
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
                if (!response) return null;
                return (
                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-none"
                    style={{scrollbarWidth: 'none'}}
                  >
                    {response.products.nodes.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function ProductCard({product}) {
  const image = product.featuredImage;
  const hasSale =
    product.compareAtPriceRange?.minVariantPrice?.amount &&
    Number(product.compareAtPriceRange.minVariantPrice.amount) >
      Number(product.priceRange.minVariantPrice.amount);

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group min-w-[220px] max-w-[220px] flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {image && (
          <Image
            data={image}
            sizes="(min-width: 640px) 220px, 45vw"
            alt={image.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {hasSale && (
          <span className="absolute left-2 top-2 rounded-full bg-[#8252f1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <h3
          className="truncate text-sm font-semibold text-black"
          style={{fontFamily: 'var(--font-heading)'}}
        >
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-black">
            {product.priceRange.minVariantPrice.amount}{' '}
            {product.priceRange.minVariantPrice.currencyCode}
          </span>
          {hasSale && (
            <span className="text-xs text-neutral-400 line-through">
              {product.compareAtPriceRange.minVariantPrice.amount}{' '}
              {product.compareAtPriceRange.minVariantPrice.currencyCode}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
