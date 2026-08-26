import {useLoaderData, useFetcher} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {useEffect, useRef, useState} from 'react';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Products`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {products: initialProducts} = useLoaderData();
  const [products, setProducts] = useState(initialProducts.nodes);
  const [pageInfo, setPageInfo] = useState(initialProducts.pageInfo);
  const fetcher = useFetcher();
  const sentinelRef = useRef(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (fetcher.data?.products) {
      setProducts((prev) => [...prev, ...fetcher.data.products.nodes]);
      setPageInfo(fetcher.data.products.pageInfo);
      fetchingRef.current = false;
    }
  }, [fetcher.data]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !pageInfo.hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          pageInfo.endCursor &&
          !fetchingRef.current
        ) {
          fetchingRef.current = true;
          fetcher.submit(
            {cursor: pageInfo.endCursor},
            {method: 'get', action: '/collections/all'},
          );
        }
      },
      {threshold: 0.1},
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pageInfo, fetcher]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1
        className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
        style={{fontFamily: 'var(--font-heading)'}}
      >
        All Products
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {pageInfo.hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {fetcher.state !== 'idle' && (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
          )}
        </div>
      )}
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
