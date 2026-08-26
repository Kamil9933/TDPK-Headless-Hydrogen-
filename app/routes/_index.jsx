import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Hero} from '~/components/Hero';
import {FeaturedCollection} from '~/components/FeaturedCollection';
import {RecommendedProducts} from '~/components/RecommendedProducts';
import {ValueProps} from '~/components/ValueProps';
import {BrandStory} from '~/components/BrandStory';
import {Newsletter} from '~/components/Newsletter';
import {FranchiseCameo} from '~/components/FranchiseCameo';

const FEATURED_COLLECTION_HANDLE = 'hydrogen'; // swap for a real collection handle later

// Randomly pick one of the configured franchise tags for the homepage
// scroll-trigger cameo. This gives each page load a different signature animation.
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
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
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

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
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
      <ValueProps />
      <BrandStory />
      <RecommendedProducts products={data.recommendedProducts} />
      <Newsletter />
    </div>
  );
}

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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
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
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
