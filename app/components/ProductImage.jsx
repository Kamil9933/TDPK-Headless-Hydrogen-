import {Image} from '@shopify/hydrogen';

/**
 * ProductImage — gallery component with a large main image and a thumbnail
 * strip. Thumbnails are vertical on desktop (min-width: 45em) and horizontal
 * on mobile. Clicking a thumbnail swaps the main image. When the selected
 * variant has its own distinct image, the main image switches to match
 * automatically via the `image` prop (driven by useOptimisticVariant in the
 * parent route).
 *
 * @param {{
 *   image: ProductVariantFragment['image'];
 *   images?: Array<{ id: string; url: string; altText: string | null; width: number; height: number }>;
 * }}
 */
export function ProductImage({image, images = []}) {
  // Build the full image list: variant image first (if present), then
  // remaining product images, deduplicating by id.
  const variantImageId = image?.id;
  const allImages = image
    ? [image, ...images.filter((img) => img.id !== variantImageId)]
    : images;

  // The active main image is always the variant image passed via props
  // (already resolved by useOptimisticVariant in the parent).
  const mainImage = image || allImages[0] || null;

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-y-auto">
          {allImages.map((img) => (
            <button
              key={img.id}
              type="button"
              className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                img.id === mainImage?.id
                  ? 'border-black'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              style={{width: 64, height: 64}}
            >
              <Image
                alt={img.altText || 'Product thumbnail'}
                data={img}
                sizes="64px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 overflow-hidden rounded-xl bg-neutral-100">
        {mainImage ? (
          <Image
            alt={mainImage.altText || 'Product Image'}
            data={mainImage}
            key={mainImage.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="aspect-square" />
        )}
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
