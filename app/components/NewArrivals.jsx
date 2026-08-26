import {ProductItem} from '~/components/ProductItem';
import {ScrollCarousel} from '~/components/ScrollCarousel';
import {Reveal} from '~/components/Reveal';

/**
 * NewArrivals — horizontal scroll-snap carousel of the newest products.
 * Data is fetched in the homepage loader and passed as props.
 *
 * @param {{ products: Array<{id: string, title: string, handle: string, featuredImage?: any, priceRange: any, compareAtPriceRange: any}> }}
 */
export function NewArrivals({products}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Just Dropped
          </p>
          <h2
            className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            New Arrivals
          </h2>
        </Reveal>

        <ScrollCarousel ariaLabel="New arrivals">
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
    </section>
  );
}
