import {Suspense, useState, useRef, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/**
 * Site header with:
 * - TD wordmark (left)
 * - Desktop nav: Categories dropdown, Shop All, Contact
 * - Right CTAs: Sign in, Search, Cart
 * - Mobile: hamburger opens the mobile menu aside
 *
 * @param {HeaderProps}
 */
export function Header({isLoggedIn, cart, collections}) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        {/* Left: Logo */}
        <NavLink prefetch="intent" to="/" className="td-wordmark mr-8">
          TD
        </NavLink>

        {/* Center: Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <CategoriesDropdown collections={collections} />
          <NavLink
            to="/collections/all"
            prefetch="intent"
            className="text-sm font-medium text-black transition hover:text-[#8252f1]"
            style={{fontFamily: 'var(--font-accent)'}}
          >
            Shop All
          </NavLink>
          <NavLink
            to="/pages/contact"
            prefetch="intent"
            className="text-sm font-medium text-black transition hover:text-[#8252f1]"
            style={{fontFamily: 'var(--font-accent)'}}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right: CTAs */}
        <div className="ml-auto flex items-center gap-4">
          <NavLink
            prefetch="intent"
            to="/account"
            className="hidden text-sm font-medium text-black transition hover:text-[#8252f1] sm:block"
          >
            <Suspense fallback="Sign in">
              <Await resolve={isLoggedIn} errorElement="Sign in">
                {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
              </Await>
            </Suspense>
          </NavLink>

          <SearchButton />

          <CartBadge cart={cart} />

          {/* Mobile hamburger */}
          <MobileMenuToggle />
        </div>
      </div>
    </header>
  );
}

/**
 * CategoriesDropdown — hover-activated dropdown that lists collections
 * fetched from the Storefront API. Falls back to a plain "Shop All" link
 * if the query returned zero collections or is still loading.
 */
function CategoriesDropdown({collections}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-black transition hover:text-[#8252f1]"
        style={{fontFamily: 'var(--font-accent)'}}
      >
        Categories
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <Suspense fallback={null}>
          <Await resolve={collections}>
            {(resolved) => {
              const nodes = resolved?.collections?.nodes || [];
              if (nodes.length === 0) return null;

              return (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-neutral-200 bg-white py-2 shadow-lg">
                  {nodes.map((col) => (
                    <NavLink
                      key={col.id}
                      to={`/collections/${col.handle}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm text-black transition hover:bg-neutral-50 hover:text-[#8252f1]"
                    >
                      {col.title}
                    </NavLink>
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      )}
    </div>
  );
}

function SearchButton() {
  const {open} = useAside();
  return (
    <button
      type="button"
      onClick={() => open('search')}
      className="text-black transition hover:text-[#8252f1]"
      aria-label="Search"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
  );
}

/**
 * @param {{cart: HeaderProps['cart']}}
 */
function CartBadge({cart}) {
  return (
    <Suspense fallback={<CartCount count={0} />}>
      <Await resolve={cart}>
        <CartCountFromValue />
      </Await>
    </Suspense>
  );
}

function CartCountFromValue() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartCount count={cart?.totalQuantity ?? 0} />;
}

/**
 * @param {{count: number}}
 */
function CartCount({count}) {
  const {open} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart: analyticsCart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="relative text-black transition hover:text-[#8252f1]"
      aria-label={`Cart (${count} items)`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8252f1] text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      onClick={() => open('mobile')}
      className="text-black transition hover:text-[#8252f1] md:hidden"
      aria-label="Open menu"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  );
}

/**
 * HeaderMenu — used only by the mobile aside menu now.
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about-us',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : '#8252f1',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {Promise<{collections: {nodes: Array<{id: string; title: string; handle: string}>}}|null>} [collections]
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
