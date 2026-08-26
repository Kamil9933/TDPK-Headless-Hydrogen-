import {redirect, useLoaderData, useFetcher} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {useEffect, useRef, useState} from 'react';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData();
  const [products, setProducts] = useState(collection.products.nodes);
  const [pageInfo, setPageInfo] = useState(collection.products.pageInfo);
  const fetcher = useFetcher();
  const sentinelRef = useRef(null);
  const fetchingRef = useRef(false);

  // Append new products when fetcher returns data
  useEffect(() => {
    if (fetcher.data?.products) {
      setProducts((prev) => [...prev, ...fetcher.data.products.nodes]);
      setPageInfo(fetcher.data.products.pageInfo);
      fetchingRef.current = false;
    }
  }, [fetcher.data]);

  // Infinite scroll: observe sentinel, fetch next page when visible
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
            {method: 'get', action: `/collections/${collection.handle}`},
          );
        }
      },
      {threshold: 0.1},
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pageInfo, fetcher, collection.handle]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1
        className="mb-2 text-3xl font-bold tracking-tight text-black sm:text-4xl"
        style={{fontFamily: 'var(--font-heading)'}}
      >
        {collection.title}
      </h1>
      {collection.description && (
        <p className="mb-8 max-w-2xl text-neutral-500">
          {collection.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel — when this enters the viewport the next page loads */}
      {pageInfo.hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {fetcher.state !== 'idle' && (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
          )}
        </div>
      )}

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
