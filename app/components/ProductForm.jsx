import {Link, useNavigate} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * ProductForm — renders variant option selectors and purchase buttons.
 *
 * Option rendering by type:
 *   - "Color" options: circular swatches using swatch.color / swatch.image.
 *   - All other options (Size, etc.): rectangular buttons with the value text.
 *
 * Two full-width action buttons at the bottom:
 *   1. "Add to Cart" — adds the selected variant, opens the cart aside.
 *      Disabled + reads "Sold out" when the variant is unavailable.
 *   2. "Buy it Now" — adds to cart and redirects straight to checkout.
 *
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const isAvailable = selectedVariant?.availableForSale;

  return (
    <div className="flex flex-col gap-5">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        const isColorOption =
          option.name.toLowerCase() === 'color' ||
          option.name.toLowerCase() === 'colour';

        return (
          <div key={option.name}>
            <h5
              className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500"
              style={{fontFamily: 'var(--font-accent)'}}
            >
              {option.name}
            </h5>

            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isColorOption) {
                  return (
                    <ColorSwatchButton
                      key={option.name + name}
                      name={name}
                      swatch={swatch}
                      selected={selected}
                      available={available}
                      exists={exists}
                      isDifferentProduct={isDifferentProduct}
                      handle={handle}
                      variantUriQuery={variantUriQuery}
                      navigate={navigate}
                    />
                  );
                }

                return (
                  <OptionButton
                    key={option.name + name}
                    name={name}
                    selected={selected}
                    available={available}
                    exists={exists}
                    isDifferentProduct={isDifferentProduct}
                    handle={handle}
                    variantUriQuery={variantUriQuery}
                    navigate={navigate}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* --- ACTION BUTTONS --- */}
      <div className="product-form-buttons flex flex-col gap-3 pt-2">
        {/* Add to Cart */}
        <AddToCartButton
          className={`w-full cursor-pointer rounded-full px-8 py-3.5 text-center text-sm font-semibold tracking-wide transition ${
            isAvailable
              ? 'bg-black text-white hover:bg-neutral-800'
              : 'cursor-not-allowed bg-neutral-300 text-neutral-500'
          }`}
          disabled={!selectedVariant || !isAvailable}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {isAvailable ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>

        {/* Buy it Now — adds to cart and redirects to checkout */}
        <CartForm
          route="/cart"
          inputs={
            selectedVariant
              ? {
                  lines: [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                    },
                  ],
                }
              : {lines: []}
          }
          action={CartForm.ACTIONS.LinesAdd}
        >
          <button
            type="submit"
            disabled={!selectedVariant || !isAvailable}
            className={`w-full cursor-pointer rounded-full border-2 border-black px-8 py-3.5 text-center text-sm font-semibold tracking-wide transition ${
              isAvailable
                ? 'border-black bg-white text-black hover:bg-neutral-100'
                : 'cursor-not-allowed border-neutral-200 bg-white text-neutral-300'
            }`}
          >
            Buy it Now
          </button>
        </CartForm>
      </div>
    </div>
  );
}

/**
 * Fallback hex map for common color names when Shopify hasn't provided a
 * swatch.color/swatch.image. Only used for recognized color names; any
 * unrecognized value falls back to a plain-letter swatch so size/material
 * options are never mislabeled as colors.
 */
const COLOR_HEX_MAP = {
  white: '#ffffff',
  black: '#000000',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  red: '#e11d48',
  maroon: '#800000',
  green: '#16a34a',
  lime: '#84cc16',
  blue: '#2563eb',
  navy: '#1e3a8a',
  yellow: '#eab308',
  gold: '#d4af37',
  orange: '#f97316',
  brown: '#92400e',
  pink: '#ec4899',
  magenta: '#d946ef',
  purple: '#a855f7',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  turquoise: '#2dd4bf',
  beige: '#d6c7a9',
  cream: '#f5f0e1',
  coral: '#ff7f50',
  khaki: '#bdb76b',
  tan: '#d2b48c',
  'dark blue': '#1e3a8a',
  'light blue': '#93c5fd',
  'dark grey': '#4b5563',
  'light grey': '#d1d5db',
  transparent: 'transparent',
};

/**
 * Returns a hex color for a recognizable color name, or null when the value
 * isn't a known color (so non-color options keep plain text styling).
 */
function hexForColorName(name) {
  if (!name) return null;
  const lower = name.trim().toLowerCase();
  if (COLOR_HEX_MAP[lower]) return COLOR_HEX_MAP[lower];
  // Allow tokens like "2xl", "red" mixed with descriptors: match on the
  // first word if it's a known color.
  const firstWord = lower.split(/\s+/)[0];
  return COLOR_HEX_MAP[firstWord] || null;
}

/**
 * ColorSwatchButton — circular swatch for color-type options.
 * Priority: swatch.image -> swatch.color -> color-name→hex fallback ->
 * plain-letter. Selected state uses a black border + ring.
 * Links for combined-listing products, buttons otherwise.
 */
function ColorSwatchButton({
  name,
  swatch,
  selected,
  available,
  exists,
  isDifferentProduct,
  handle,
  variantUriQuery,
  navigate,
}) {
  const swatchColor = swatch?.color;
  const swatchImage = swatch?.image?.previewImage?.url;
  const fallbackHex = hexForColorName(name);

  const swatchContent = swatchImage ? (
    <img
      src={swatchImage}
      alt={name}
      className="h-full w-full rounded-full object-cover"
    />
  ) : swatchColor ? (
    <span
      className="block h-full w-full rounded-full"
      style={{backgroundColor: swatchColor}}
    />
  ) : fallbackHex ? (
    <span
      className="block h-full w-full rounded-full border border-neutral-300"
      style={{backgroundColor: fallbackHex}}
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-600">
      {name}
    </span>
  );

  const className = `flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
    selected
      ? 'border-black ring-2 ring-black ring-offset-1'
      : 'border-neutral-300 hover:border-neutral-500'
  } ${!available ? 'opacity-30' : ''}`;

  if (isDifferentProduct) {
    return (
      <Link
        className={className}
        title={name}
        aria-label={name}
        prefetch="intent"
        preventScrollReset
        replace
        to={`/products/${handle}?${variantUriQuery}`}
      >
        {swatchContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      title={name}
      aria-label={name}
      disabled={!exists}
      onClick={() => {
        if (!selected) {
          void navigate(`?${variantUriQuery}`, {
            replace: true,
            preventScrollReset: true,
          });
        }
      }}
    >
      {swatchContent}
    </button>
  );
}

/**
 * OptionButton — rectangular button for size / fallback options.
 * Selected state: black bg + white text. Unselected: white bg + black text.
 */
function OptionButton({
  name,
  selected,
  available,
  exists,
  isDifferentProduct,
  handle,
  variantUriQuery,
  navigate,
}) {
  const className = `rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
    selected
      ? 'border-black bg-black text-white'
      : 'border-neutral-300 bg-white text-black hover:border-black'
  } ${!available ? 'opacity-30' : ''}`;

  if (isDifferentProduct) {
    return (
      <Link
        className={className}
        prefetch="intent"
        preventScrollReset
        replace
        to={`/products/${handle}?${variantUriQuery}`}
      >
        {name}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      disabled={!exists}
      onClick={() => {
        if (!selected) {
          void navigate(`?${variantUriQuery}`, {
            replace: true,
            preventScrollReset: true,
          });
        }
      }}
    >
      {name}
    </button>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
