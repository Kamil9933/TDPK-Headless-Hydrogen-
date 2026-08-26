import {Suspense, useState} from 'react';
import {Await, NavLink} from 'react-router';

/**
 * Footer — ThirdDimension brand identity.
 * White background, black text, #8252f1 purple links/hover.
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        {/* Top: Wordmark + Newsletter */}
        <div className="mb-12 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* TD Wordmark */}
          <div>
            <span
              className="text-4xl font-bold tracking-tight text-black"
              style={{fontFamily: 'var(--font-heading)'}}
            >
              TD
            </span>
            <p className="mt-2 max-w-xs text-sm text-neutral-500">
              3D-printed collectibles, crafted with obsessive attention to
              detail.
            </p>
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-sm">
            <h3
              className="mb-2 text-sm font-semibold uppercase tracking-wider text-black"
              style={{fontFamily: 'var(--font-accent)'}}
            >
              Stay in the Loop
            </h3>
            <p className="mb-3 text-sm text-neutral-500">
              New drops, restocks, and exclusives. No spam.
            </p>
            {subscribed ? (
              <p className="text-sm font-medium" style={{color: '#8252f1'}}>
                You&apos;re subscribed!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-black placeholder-neutral-400 outline-none transition focus:border-[#8252f1]"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-lg bg-[#8252f1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6b3fd4]"
                  style={{fontFamily: 'var(--font-accent)'}}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle: Footer nav columns */}
        <Suspense fallback={null}>
          <Await resolve={footerPromise}>
            {(footer) => (
              <div className="grid grid-cols-2 gap-8 border-t border-neutral-200 py-10 sm:grid-cols-4">
                {/* Column 1: Quick Links */}
                <div>
                  <h4
                    className="mb-4 text-sm font-semibold uppercase tracking-wider text-black"
                    style={{fontFamily: 'var(--font-accent)'}}
                  >
                    Quick Links
                  </h4>
                  <ul className="space-y-2">
                    <FooterLink to="/collections/all">Shop All</FooterLink>
                    <FooterLink to="/pages/contact">Contact</FooterLink>
                    <FooterLink to="/pages/about">About</FooterLink>
                  </ul>
                </div>

                {/* Column 2: Support */}
                <div>
                  <h4
                    className="mb-4 text-sm font-semibold uppercase tracking-wider text-black"
                    style={{fontFamily: 'var(--font-accent)'}}
                  >
                    Support
                  </h4>
                  <ul className="space-y-2">
                    <FooterLink to="/pages/faq">FAQ</FooterLink>
                    <FooterLink to="/policies/shipping-policy">
                      Shipping
                    </FooterLink>
                    <FooterLink to="/policies/refund-policy">
                      Returns
                    </FooterLink>
                    <FooterLink to="/policies/privacy-policy">
                      Privacy Policy
                    </FooterLink>
                    <FooterLink to="/policies/terms-of-service">
                      Terms of Service
                    </FooterLink>
                  </ul>
                </div>

                {/* Column 3: Connect */}
                <div>
                  <h4
                    className="mb-4 text-sm font-semibold uppercase tracking-wider text-black"
                    style={{fontFamily: 'var(--font-accent)'}}
                  >
                    Connect
                  </h4>
                  <ul className="space-y-2">
                    <FooterExternalLink href="https://instagram.com">
                      Instagram
                    </FooterExternalLink>
                    <FooterExternalLink href="https://facebook.com">
                      Facebook
                    </FooterExternalLink>
                    <FooterExternalLink href="https://tiktok.com">
                      TikTok
                    </FooterExternalLink>
                  </ul>
                </div>

                {/* Column 4: Dynamic menu from Shopify */}
                {footer?.menu && (
                  <div>
                    <h4
                      className="mb-4 text-sm font-semibold uppercase tracking-wider text-black"
                      style={{fontFamily: 'var(--font-accent)'}}
                    >
                      More
                    </h4>
                    <ul className="space-y-2">
                      {(footer.menu || []).items.map((item) => {
                        if (!item.url) return null;
                        const url =
                          item.url.includes('myshopify.com') ||
                          item.url.includes(publicStoreDomain) ||
                          (header?.shop?.primaryDomain?.url &&
                            item.url.includes(header.shop.primaryDomain.url))
                            ? new URL(item.url).pathname
                            : item.url;
                        const isExternal = !url.startsWith('/');
                        return isExternal ? (
                          <li key={item.id}>
                            <a
                              href={url}
                              rel="noopener noreferrer"
                              target="_blank"
                              className="text-sm text-neutral-500 transition hover:text-[#8252f1]"
                            >
                              {item.title}
                            </a>
                          </li>
                        ) : (
                          <li key={item.id}>
                            <NavLink
                              end
                              prefetch="intent"
                              to={url}
                              className="text-sm text-neutral-500 transition hover:text-[#8252f1]"
                            >
                              {item.title}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Await>
        </Suspense>

        {/* Bottom: Copyright */}
        <div className="border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} ThirdDimension. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({to, children}) {
  return (
    <li>
      <NavLink
        end
        prefetch="intent"
        to={to}
        className="text-sm text-neutral-500 transition hover:text-[#8252f1]"
      >
        {children}
      </NavLink>
    </li>
  );
}

function FooterExternalLink({href, children}) {
  return (
    <li>
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className="text-sm text-neutral-500 transition hover:text-[#8252f1]"
      >
        {children}
      </a>
    </li>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
