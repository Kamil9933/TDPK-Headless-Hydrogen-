import {Money} from '@shopify/hydrogen';

/**
 * ProductPrice — displays a product's price with optional sale treatment.
 * When compareAtPrice is higher than price, shows the current price followed
 * by a strikethrough original price and a small "Sale" badge.
 *
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice}) {
  const isOnSale =
    price &&
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div aria-label="Price" className="flex items-center gap-2" role="group">
      {isOnSale ? (
        <>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
            style={{backgroundColor: '#8252f1'}}
          >
            Sale
          </span>
          <span className="text-lg font-semibold text-black">
            <Money data={price} />
          </span>
          <span className="text-sm text-neutral-400 line-through">
            <Money data={compareAtPrice} />
          </span>
        </>
      ) : price ? (
        <span className="text-lg font-semibold text-black">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
