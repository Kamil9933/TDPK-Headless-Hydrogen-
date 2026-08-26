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

async function loadCriticalData({context}) {
  const [{collection}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {handle: FEATURED_COLLECTION_HANDLE},
    }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collection,
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch(() => null);

  const franchiseCollections = context.storefront
    .query(FRANCHISE_COLLECTIONS_QUERY)
    .catch(() => null);

  const categoryCollections = context.storefront
    .query(CATEGORY_COLLECTIONS_QUERY)
    .catch(() => null);

  const newArrivals = context.storefront
    .query(NEW_ARRIVALS_QUERY)
    .catch(() => null);

  const bestSellers = context.storefront
    .query(BEST_SELLERS_QUERY)
    .catch(() => null);

  return {
    recommendedProducts,
    franchiseCollections,
    categoryCollections,
    newArrivals,
    bestSellers,
  };
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
      <ShopByFranchise collections={data.franchiseCollections?.collections?.nodes} />
      <ShopByCategory collections={data.categoryCollections?.collections?.nodes} />
      <NewArrivals products={data.newArrivals?.products?.nodes} />
      <BestSellers products={data.bestSellers?.collection?.products?.nodes} />
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

const FRANCHISE_COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_TILE_FRAGMENT}
  query FranchiseCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections: collections(
      first: 10,
      query: "star-wars OR batman-3d-prints OR marvel OR dc-comics OR one-piece OR dragon-ball OR pokemon OR lord-of-the-rings OR avengers OR f1"
    ) {
      nodes {
        ...CollectionTile
      }
    }
  }
`;

const CATEGORY_COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_TILE_FRAGMENT}
  query CategoryCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections: collections(
      first: 9,
      query: "home-decor OR wall-art OR toys OR desk-items OR key-chain OR phone-stands OR storage-box OR vase OR jewelry-box"
    ) {
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
    collection(handle: "best-sellers") {
      id
      title
      products(first: 12) {
        nodes {
          ...ProductTile
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
