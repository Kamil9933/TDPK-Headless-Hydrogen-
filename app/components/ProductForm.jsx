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
          option.name.toLowerCase() === 'color';

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
      <div className="flex flex-col gap-3 pt-2">
        {/* Add to Cart */}
        <AddToCartButton
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
          <span
            className={`w-full cursor-pointer rounded-full px-8 py-3.5 text-center text-sm font-semibold tracking-wide transition ${
              isAvailable
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'cursor-not-allowed bg-neutral-300 text-neutral-500'
            }`}
          >
            {isAvailable ? 'Add to Cart' : 'Sold Out'}
          </span>
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
 * ColorSwatchButton — circular swatch for color-type options.
 * Shows the swatch color/image inside a circle. Selected state uses a
 * black border + ring. Links for combined-listing products, buttons otherwise.
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
