import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Hero} from '~/components/Hero';
import {CollectionCarouselSection} from '~/components/CollectionCarouselSection';
import {BestSellers} from '~/components/BestSellers';
import {OnSale} from '~/components/OnSale';
import {ValueProps} from '~/components/ValueProps';
import {BrandStory} from '~/components/BrandStory';
import {ProductCarousel} from '~/components/ProductCarousel';
import {FranchiseCameo} from '~/components/FranchiseCameo';

const HOMEPAGE_FRANCHISE_TAGS = ['Starwars', 'Batman', 'One piece'];

// Exact real collection titles (case-insensitive match against the
// storefront) used to pick which collections populate the Shop by
// Franchise / Shop by Category homepage sections. Order here is the
// display order, not the order Shopify returns them in.
const FRANCHISE_TITLES = [
  'Star Wars',
  'Batman 3D Prints',
  'Marvel',
  'Dc Comics',
  'One Piece',
  'Dragon ball',
  'Pokémon',
  'Lord of The Rings',
  'Avengers',
  'F1',
];

const CATEGORY_TITLES = [
  'Home Decor',
  'Wall Art',
  'Toys',
  'Desk Items',
  'Key Chain',
  'Phone Stands',
  'Storage Box',
  'Vase',
  'Jewelry Box',
];

// Additional curated collection rails (beyond Franchise + Category).
// Each entry maps to a CollectionCarouselSection; titles are matched
// exactly against real store collections in buildTilePools.
const ANIME_TITLES = ['One Piece', 'Dragon ball', 'Pokémon'];
const SUPERHERO_TITLES = ['Marvel', 'Dc Comics', 'Avengers', 'Batman 3D Prints'];
const DESK_HOME_TITLES = [
  'Desk Items',
  'Home Decor',
  'Storage Box',
  'Phone Stands',
  'Vase',
];

// Signature blockbuster franchises shown as their own dedicated rail.
// Only collections that actually exist on the store are rendered (the
// matcher skips nonexistent titles); Lord of the Rings / F1 aren't on the
// store yet, so only Batman and Star Wars currently resolve, in this order.
const BLOCKBUSTER_TITLES = [
  'Batman',
  'Star Wars',
  'Lord of The Rings',
  'F1',
];

// Configuration for every collection rail on the homepage. Adding a new
// section is just adding one entry here (plus its title pool above).
const COLLECTION_SECTIONS = [
  {
    key: 'franchise',
    eyebrow: 'Franchises',
    title: 'Shop by Franchise',
    bg: 'bg-white',
    handle: 'franchiseCollections',
  },
  {
    key: 'anime',
    eyebrow: 'Worlds We Love',
    title: 'Anime & Manga',
    bg: 'bg-neutral-50',
    handle: 'animeCollections',
  },
  {
    key: 'superheroes',
    eyebrow: 'Heroes & Villains',
    title: 'Superheroes',
    bg: 'bg-white',
    handle: 'superheroCollections',
  },
  {
    key: 'category',
    eyebrow: 'Collections',
    title: 'Shop by Category',
    bg: 'bg-neutral-50',
    handle: 'categoryCollections',
  },
  {
    key: 'deskhome',
    eyebrow: 'Everyday Essentials',
    title: 'Desk & Home',
    bg: 'bg-white',
    handle: 'deskHomeCollections',
  },
  {
    key: 'blockbuster',
    eyebrow: 'Iconic Universes',
    title: 'Batman, Star Wars, LOTR & F1',
    bg: 'bg-neutral-50',
    handle: 'blockbusterCollections',
  },
];

/**
 * Picks collections from a fetched list by exact (case-insensitive) title
 * match, in the order given by `titles`, skipping any that don't exist on
 * this store or have zero products.
 */
function pickByTitles(collections, titles) {
  const byTitle = new Map(
    (collections || []).map((c) => [c.title.trim().toLowerCase(), c]),
  );
  return titles
    .map((t) => byTitle.get(t.trim().toLowerCase()))
    .filter((c) => c && c.products?.nodes?.length > 0);
}

/**
 * Builds the final Shop by Franchise / Shop by Category tile lists.
 * Named picks (FRANCHISE_TITLES / CATEGORY_TITLES) come first, in that
 * order, so curated collections stay pinned at the front. Any other real
 * collection on the store that isn't already claimed by either curated
 * list is then appended to Shop by Franchise, so the section is never
 * sparse just because a title didn't exactly match one of our guesses.
 */
function buildTilePools(allCollections, franchiseTitles, categoryTitles) {
  const titlePools = [
    {handle: 'franchiseCollections', titles: franchiseTitles},
    {handle: 'animeCollections', titles: ANIME_TITLES},
    {handle: 'superheroCollections', titles: SUPERHERO_TITLES},
    {handle: 'categoryCollections', titles: categoryTitles},
    {handle: 'deskHomeCollections', titles: DESK_HOME_TITLES},
    {handle: 'blockbusterCollections', titles: BLOCKBUSTER_TITLES},
  ];

  const pools = {};
  const used = new Set();

  for (const {handle, titles} of titlePools) {
    const picked = pickByTitles(allCollections, titles);
    pools[handle] = picked;
    for (const c of picked) used.add(c.handle);
  }

  // Leftovers: any real collection not claimed by a curated list. They are
  // appended to the franchise pool so Shop by Franchise never sits sparse
  // when a guessed title doesn't exactly match a real collection.
  const leftovers = (allCollections || []).filter(
    (c) =>
      c &&
      c.products?.nodes?.length > 0 &&
      !used.has(c.handle) &&
      !isJunkCollection(c),
  );
  pools.franchiseCollections = [...pools.franchiseCollections, ...leftovers];

  return pools;
}

/**
 * Matches internal/scaffold collections that should never surface as tiles
 * (e.g. "Home Page", "Frontpage", "Automated Collection" placeholders).
 * Title and handle are checked case-insensitively; any match excludes the
 * collection from the leftover pool.
 */
const JUNK_COLLECTION_PATTERNS = [
  /^home page$/i,
  /^frontpage$/i,
  /automated collect/i,
];

function isJunkCollection(c) {
  const title = (c.title || '').toLowerCase();
  const handle = (c.handle || '').toLowerCase();
  return JUNK_COLLECTION_PATTERNS.some(
    (re) => re.test(title) || re.test(handle),
  );
}

/**
 * Automated collections in Shopify don't get an image unless one is set
 * manually, which is why tiles were showing as blank gray boxes. Falls
 * back to the first product's featured image so every tile with at least
 * one product still shows a picture.
 */
function withFallbackImage(collections) {
  return (collections || []).map((c) => ({
    ...c,
    image: c.image || c.products?.nodes?.[0]?.featuredImage || null,
  }));
}

/**
 * Filters out known scaffold/junk products (leftover Hydrogen demo data)
 * that shouldn't appear in any product rail.
 */
function filterJunkProducts(nodes) {
  return (nodes || []).filter(
    (p) =>
      p.featuredImage &&
      p.title &&
      !p.title.includes('Single line text') &&
      p.title !== 'Frame',
  );
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Third Dimension | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Everything the homepage needs to render its first paint is fetched here,
 * awaited, so ShopByFranchise / ShopByCategory / BestSellers
 * always receive real resolved arrays (never a pending Promise).
 */
async function loadCriticalData({context}) {
  const [bestSellersResult, allCollectionsResult, saleResult] = await Promise.all([
    context.storefront.query(BEST_SELLERS_QUERY),
    context.storefront.query(ALL_COLLECTIONS_QUERY),
    context.storefront.query(ON_SALE_QUERY),
  ]);

  const allCollections = allCollectionsResult?.collections?.nodes || [];
  const pools = buildTilePools(
    allCollections,
    FRANCHISE_TITLES,
    CATEGORY_TITLES,
  );

  // Apply the image-fallback to every curated collection rail.
  for (const handle of Object.keys(pools)) {
    pools[handle] = withFallbackImage(pools[handle]);
  }

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    franchiseTag:
      HOMEPAGE_FRANCHISE_TAGS[
        Math.floor(Math.random() * HOMEPAGE_FRANCHISE_TAGS.length)
      ],
    bestSellers: filterJunkProducts(bestSellersResult?.products?.nodes),
    onSale: filterJunkProducts(saleResult?.products?.nodes).filter(
      (p) =>
        p.compareAtPriceRange?.minVariantPrice &&
        parseFloat(p.compareAtPriceRange.minVariantPrice.amount) >
          parseFloat(p.priceRange?.minVariantPrice?.amount || '0'),
    ),
    ...pools,
  };
}

/**
 * Only the "Recommended" rail stays deferred/streamed — it's the one
 * section already correctly wrapped in <Suspense><Await> by
 * ProductCarousel, so there's no benefit to blocking first paint on it.
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .then((data) => {
      if (!data?.products?.nodes) return data;
      data.products.nodes = filterJunkProducts(data.products.nodes);
      return data;
    })
    .catch(() => null);

  return {recommendedProducts};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div>
      {data.isShopLinked ? null : <MockShopNotice />}
      <FranchiseCameo tags={[data.franchiseTag]} trigger="scroll" />
      <Hero />

      {COLLECTION_SECTIONS.map((section) => (
        <CollectionCarouselSection
          key={section.key}
          eyebrow={section.eyebrow}
          title={section.title}
          bg={section.bg}
          collections={data[section.handle]}
        />
      ))}

      <BestSellers products={data.bestSellers} />
      {data.onSale?.length > 0 && <OnSale products={data.onSale} />}
      <ValueProps />
      <BrandStory />
      <ProductCarousel products={data.recommendedProducts} />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Queries
   ────────────────────────────────────────────── */

const COLLECTION_TILE_FRAGMENT = `#graphql
  fragment CollectionTile on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        id
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

// Fetches every collection once; the homepage then picks Shop by
// Franchise / Shop by Category members from this single list by exact
// title match (see pickByTitles above) rather than relying on a fuzzy
// search string, which isn't reliable for exact-title lookups.
const ALL_COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_TILE_FRAGMENT}
  query AllCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 250) {
      nodes {
        ...CollectionTile
      }
    }
  }
`;

const PRODUCT_TILE_FRAGMENT = `#graphql
  fragment ProductTile on Product {
    id
    title
    handle
    tags
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_TILE_FRAGMENT}
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductTile
      }
    }
  }
`;

const BEST_SELLERS_QUERY = `#graphql
  ${PRODUCT_TILE_FRAGMENT}
  query BestSellers($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: BEST_SELLING) {
      nodes {
        ...ProductTile
      }
    }
  }
`;

// On-sale products = items whose compare-at price exceeds their current
// price. The filter is applied so only real discounts show here.
const ON_SALE_QUERY = `#graphql
  ${PRODUCT_TILE_FRAGMENT}
  query OnSale($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 24, sortKey: BEST_SELLING) {
      nodes {
        ...ProductTile
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
