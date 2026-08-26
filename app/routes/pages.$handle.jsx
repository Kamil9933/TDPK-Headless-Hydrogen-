import {useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `ThirdDimension | ${data?.page.title ?? ''}`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {handle: params.handle},
    }),
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {page};
}

function loadDeferredData() {
  return {};
}

/**
 * Page — renders Shopify page body HTML with brand-identity styles.
 * Used for About, Contact, FAQ, and any other /pages/* routes.
 */
export default function Page() {
  const {page} = useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1
        className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
        style={{fontFamily: 'var(--font-heading)'}}
      >
        {page.title}
      </h1>

      {/*
       * Shopify page body is rendered as raw HTML.
       * We apply brand-aware styles via inline CSS overrides on common
       * HTML elements since @tailwindcss/typography is not available.
       */}
      <div
        className="page-content space-y-6 text-base leading-relaxed text-neutral-700"
        dangerouslySetInnerHTML={{__html: page.body}}
      />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
