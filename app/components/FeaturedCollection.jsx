import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Reveal} from '~/components/Reveal';

/**
 * FeaturedCollection — restyled for light brand identity.
 * White background, black text, purple accent.
 *
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
export function FeaturedCollection({collection}) {
  if (!collection) return null;

  const image = collection?.image;

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Featured
          </p>
          <h2
            className="mb-12 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            {collection.title}
          </h2>
        </Reveal>

        <Reveal threshold={0.1}>
          <Link
            to={`/collections/${collection.handle}`}
            className="group block overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
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

            <div className="flex items-center justify-between bg-black px-6 py-5">
              <span
                className="text-lg font-semibold text-white"
                style={{fontFamily: 'var(--font-accent)'}}
              >
                View Collection
              </span>
              <span className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#8252f1]">
                &rarr;
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
