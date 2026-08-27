import {ProductItem} from '~/components/ProductItem';
import {ScrollCarousel} from '~/components/ScrollCarousel';
import {Reveal} from '~/components/Reveal';

/**
 * OnSale — horizontal scroll-snap carousel of discounted products.
 * Mobile: 2-col grid. sm+: scroll carousel.
 *
 * @param {{ products: Array<{id: string, title: string, handle: string, featuredImage?: any, priceRange: any, compareAtPriceRange: any}> }}
 */
export function OnSale({products}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-14 px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Deals
          </p>
          <h2
            className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            On Sale
          </h2>
        </Reveal>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} loading="lazy" />
          ))}
        </div>

        {/* sm+: horizontal scroll carousel */}
        <div className="hidden sm:block">
          <ScrollCarousel ariaLabel="On sale">
            {products.map((product) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0"
                style={{minWidth: '220px', maxWidth: '220px'}}
              >
                <ProductItem product={product} loading="lazy" />
              </div>
            ))}
          </ScrollCarousel>
        </div>
      </div>
    </section>
  );
}
