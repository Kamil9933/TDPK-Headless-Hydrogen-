import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ScrollCarousel} from '~/components/ScrollCarousel';
import {Reveal} from '~/components/Reveal';

/**
 * CollectionCarouselSection — reusable homepage section showing a row
 * of collection tiles. On mobile (< sm) renders a 2-col grid; on sm+
 * renders a horizontal scroll-snap carousel via ScrollCarousel.
 *
 * @param {{
 *   eyebrow: string;
 *   title: string;
 *   collections: Array<{id: string, title: string, handle: string, image?: any, products?: {nodes: Array<any>}}>;
 *   viewAllLink?: string;
 *   bg?: string;
 * }}
 */
export function CollectionCarouselSection({
  eyebrow,
  title,
  collections,
  viewAllLink = '/collections/all',
  bg = 'bg-white',
}) {
  const valid = (collections || []).filter(
    (c) => c && c.products?.nodes?.length > 0,
  );

  if (valid.length === 0) return null;

  return (
    <section className={`${bg} py-14 px-6 sm:py-20`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
                style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
              >
                {eyebrow}
              </p>
              <h2
                className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                style={{fontFamily: 'var(--font-heading)'}}
              >
                {title}
              </h2>
            </div>
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="hidden text-sm font-medium text-neutral-500 transition hover:text-[#8252f1] sm:block"
              >
                View all &rarr;
              </Link>
            )}
          </div>
        </Reveal>

        {/* Mobile: 2-col grid. sm+: horizontal scroll carousel */}
        <div className="sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {valid.map((col) => (
              <CollectionTile key={col.id} col={col} />
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <ScrollCarousel ariaLabel={title}>
            {valid.map((col) => (
              <CollectionTile key={col.id} col={col} carousel />
            ))}
          </ScrollCarousel>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="mt-6 block text-center text-sm font-medium text-neutral-500 transition hover:text-[#8252f1] sm:hidden"
          >
            View all &rarr;
          </Link>
        )}
      </div>
    </section>
  );
}

function CollectionTile({col, carousel = false}) {
  return (
    <Reveal threshold={0.05} className={carousel ? '' : ''}>
      <Link
        to={`/collections/${col.handle}`}
        className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
        style={
          carousel ? {minWidth: '200px', maxWidth: '200px'} : undefined
        }
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {col.image && (
            <Image
              data={col.image}
              sizes={
                carousel
                  ? '(min-width: 640px) 200px, 40vw'
                  : '(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw'
              }
              alt={col.image.altText || col.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-3">
          <h3
            className="truncate text-sm font-semibold text-black"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            {col.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
