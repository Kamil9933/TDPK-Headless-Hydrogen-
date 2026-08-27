import {Link} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import {ScrollCarousel} from '~/components/ScrollCarousel';
import {Reveal} from '~/components/Reveal';

/**
 * BestSellers — horizontal scroll-snap carousel of best-selling products.
 * Data is fetched in the homepage loader and passed as props.
 *
 * @param {{ products: Array<{id: string, title: string, handle: string, featuredImage?: any, priceRange: any, compareAtPriceRange: any}> }}
 */
export function BestSellers({products}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-14 px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
                style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
              >
                Crowd Favorites
              </p>
              <h2
                className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                style={{fontFamily: 'var(--font-heading)'}}
              >
                Best Sellers
              </h2>
            </div>
            <Link
              to="/collections/all"
              className="hidden text-sm font-medium text-neutral-500 transition hover:text-[#8252f1] sm:block"
            >
              View all &rarr;
            </Link>
          </div>
        </Reveal>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} loading="lazy" />
          ))}
        </div>

        {/* sm+: horizontal scroll carousel */}
        <div className="hidden sm:block">
          <ScrollCarousel ariaLabel="Best sellers">
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

        <Link
          to="/collections/all"
          className="mt-6 block text-center text-sm font-medium text-neutral-500 transition hover:text-[#8252f1] sm:hidden"
        >
          View all &rarr;
        </Link>
      </div>
    </section>
  );
}
