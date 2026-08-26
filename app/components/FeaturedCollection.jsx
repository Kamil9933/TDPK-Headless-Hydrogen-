import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/Reveal';

/**
 * FeaturedCollection — restyled featured collection section.
 * Receives the same collection data from the loader (unchanged).
 * Uses Tailwind utility classes instead of the original CSS class names.
 *
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
export function FeaturedCollection({collection}) {
  if (!collection) return null;

  const image = collection?.image;

  return (
    <section className="bg-neutral-950 py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Featured
          </p>
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {collection.title}
          </h2>
        </Reveal>

        <Reveal threshold={0.1}>
          <Link
            to={`/collections/${collection.handle}`}
            className="group block overflow-hidden rounded-2xl"
          >
            {image && (
              <div className="aspect-[16/7] overflow-hidden">
                <Image
                  data={image}
                  sizes="100vw"
                  alt={image.altText || collection.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex items-center justify-between bg-neutral-900 px-6 py-5">
              <span className="text-lg font-semibold text-white">
                View Collection
              </span>
              <span className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-white">
                &rarr;
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
