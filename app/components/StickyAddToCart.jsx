import {useState, useEffect, useRef} from 'react';
import {CartForm, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * StickyAddToCart — mobile-only bottom bar that appears once the user
 * scrolls past the main Add to Cart / Buy it Now buttons, so checkout is
 * always reachable without scrolling back up. Hidden on sm+ (the full
 * ProductForm buttons are always visible on desktop).
 *
 * @param {{
 *   product: {id: string, title: string};
 *   selectedVariant: any;
 *   productUrl: string;
 * }}
 */
export function StickyAddToCart({product, selectedVariant, productUrl}) {
  const {open} = useAside();
  const [visible, setVisible] = useState(false);
  const mainButtonsRef = useRef(null);

  useEffect(() => {
    // Find the main action buttons rendered by ProductForm to detect when
    // they scroll out of view.
    mainButtonsRef.current = document.querySelector('.product-form-buttons');

    const onScroll = () => {
      const anchor = mainButtonsRef.current;
      if (!anchor) {
        // If unavailable, show after scrolling 400px so it still appears.
        setVisible(window.scrollY > 400 && window.innerWidth < 640);
        return;
      }
      const rect = anchor.getBoundingClientRect();
      setVisible(rect.bottom < 0 && window.innerWidth < 640);
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAvailable = selectedVariant?.availableForSale;
  const price = selectedVariant?.price;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white px-4 pb-[env(safe-area-inset-bottom)] pt-3 transition-transform duration-300 sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={productUrl}
            className="truncate text-sm font-semibold text-black hover:text-[#8252f1]"
          >
            {product.title}
          </a>
          {price && (
            <p className="text-sm font-semibold text-black">
              <Money data={price} />
            </p>
          )}
        </div>

        <AddToCartButton
          disabled={!selectedVariant || !isAvailable}
          onClick={() => open('cart')}
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
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              isAvailable
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-neutral-300 text-neutral-500'
            }`}
          >
            Add to Cart
          </span>
        </AddToCartButton>
      </div>
    </div>
  );
}
