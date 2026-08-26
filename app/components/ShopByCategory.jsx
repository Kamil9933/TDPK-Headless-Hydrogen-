import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/Reveal';

/**
 * ShopByCategory — responsive grid of category collection tiles.
 * Data is fetched in the homepage loader and passed as props.
 * Null/empty collections are filtered out.
 *
 * @param {{ collections: Array<{id: string, title: string, handle: string, image?: {url: string, altText?: string}, productCount: number} | null> }}
 */
export function ShopByCategory({collections}) {
  const valid = (collections || []).filter(
    (c) => c && c.products?.nodes?.length > 0,
  );

  if (valid.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
                style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
              >
                Collections
              </p>
              <h2
                className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                style={{fontFamily: 'var(--font-heading)'}}
              >
                Shop by Category
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {valid.map((col) => (
            <Reveal key={col.id} threshold={0.05}>
              <Link
                to={`/collections/${col.handle}`}
                className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  {col.image && (
                    <Image
                      data={col.image}
                      sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw"
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
          ))}
        </div>
      </div>
    </section>
  );
}
