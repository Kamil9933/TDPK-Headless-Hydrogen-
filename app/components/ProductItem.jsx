import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {JudgeMeBadge} from '~/components/JudgeMeBadge';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  // Determine if this product is on sale by comparing min variant price
  // against the compare-at price range from the Storefront API.
  const price = product.priceRange?.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    price &&
    compareAt &&
    parseFloat(compareAt.amount) > parseFloat(price.amount);

  // Surface one short descriptor line under the title using only real
  // product data from the API — e.g. a badge-style tag when available.
  const tag = (product.tags || []).find(
    (t) => !['New Arrival', '3D Printed', 'Collectible', 'Gift Ideas'].includes(t),
  );

  return (
    <Link
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative overflow-hidden">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {isOnSale && (
          <span
            className="absolute left-2 top-2 rounded-full bg-[#8252f1] px-2.5 py-0.5 text-xs font-semibold text-white"
          >
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="mb-1 text-sm font-semibold leading-snug text-black line-clamp-2">
          {product.title}
        </h4>
        <JudgeMeBadge productId={product.id} />
        {tag && (
          <p className="mt-1 truncate text-xs uppercase tracking-wide text-neutral-400">
            {tag}
          </p>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-black">
            <Money data={price} />
          </span>
          {isOnSale && (
            <span className="text-xs font-normal text-neutral-400 line-through">
              <Money data={compareAt} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
