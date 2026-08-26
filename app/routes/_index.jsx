import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Hero} from '~/components/Hero';
import {FeaturedCollection} from '~/components/FeaturedCollection';
import {ShopByFranchise} from '~/components/ShopByFranchise';
import {ShopByCategory} from '~/components/ShopByCategory';
import {NewArrivals} from '~/components/NewArrivals';
import {BestSellers} from '~/components/BestSellers';
import {ValueProps} from '~/components/ValueProps';
import {BrandStory} from '~/components/BrandStory';
import {ProductCarousel} from '~/components/ProductCarousel';
import {Newsletter} from '~/components/Newsletter';
import {FranchiseCameo} from '~/components/FranchiseCameo';

const FEATURED_COLLECTION_HANDLE = 'hydrogen';

const HOMEPAGE_FRANCHISE_TAGS = ['Starwars', 'Batman', 'One piece'];
const HOMEPAGE_FRANCHISE_TAG =
  HOMEPAGE_FRANCHISE_TAGS[
    Math.floor(Math.random() * HOMEPAGE_FRANCHISE_TAGS.length)
  ];

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
 * awaited, so ShopByFranchise / ShopByCategory / NewArrivals / BestSellers
 * always receive real resolved arrays (never a pending Promise).
 */
async function loadCriticalData({context}) {
  const [
    {collection},
    newArrivalsResult,
    bestSellersResult,
    allCollectionsResult,
  ] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: FEATURED_COLLECTION_HANDLE},
    }),
    context.storefront.query(NEW_ARRIVALS_QUERY),
    context.storefront.query(BEST_SELLERS_QUERY),
    context.storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  const allCollections = allCollectionsResult?.collections?.nodes || [];

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collection,
    newArrivals: filterJunkProducts(newArrivalsResult?.products?.nodes),
    bestSellers: filterJunkProducts(bestSellersResult?.products?.nodes),
    franchiseCollections: pickByTitles(allCollections, FRANCHISE_TITLES),
    categoryCollections: pickByTitles(allCollections, CATEGORY_TITLES),
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
      <FranchiseCameo tags={[HOMEPAGE_FRANCHISE_TAG]} trigger="scroll" />
      <Hero />
      <FeaturedCollection collection={data.featuredCollection} />
      <ShopByFranchise collections={data.franchiseCollections} />
      <ShopByCategory collections={data.categoryCollections} />
      <NewArrivals products={data.newArrivals} />
      <BestSellers products={data.bestSellers} />
      <ValueProps />
      <BrandStory />
      <ProductCarousel products={data.recommendedProducts} />
      <Newsletter />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Queries
   ────────────────────────────────────────────── */

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...FeaturedCollection
    }
  }
`;

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

const NEW_ARRIVALS_QUERY = `#graphql
  ${PRODUCT_TILE_FRAGMENT}
  query NewArrivals($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: CREATED_AT, reverse: true) {
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

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
