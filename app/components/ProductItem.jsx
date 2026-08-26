import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

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
        <h4 className="mb-1 text-sm font-semibold text-black line-clamp-1">
          {product.title}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black">
            <Money data={price} />
          </span>
          {isOnSale && (
            <span className="text-xs text-neutral-400 line-through">
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
