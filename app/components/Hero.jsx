import {Link} from 'react-router';

/**
 * Hero — near-full-viewport hero section with a light gradient background,
 * headline, subheadline, and a primary CTA linking to /collections/all.
 *
 * Brand identity: white/near-white background, black text, purple (#8252f1)
 * accent, Bungee heading font.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
      {/* Subtle dot grid overlay for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #8252f1 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.25em]"
          style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
        >
          3D-Printed Collectibles
        </p>

        <h1
          className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
          style={{fontFamily: 'var(--font-heading)'}}
        >
          Precision Crafted.
          <br />
          <span style={{color: '#8252f1'}}>Limitlessly Detailed.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-neutral-600">
          Original and licensed designs brought to life with industrial-grade
          3D printing. Every piece is made to order with obsessive attention
          to detail.
        </p>

        <Link
          to="/collections/all"
          className="inline-block rounded-full bg-black px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:bg-neutral-800 hover:shadow-xl"
        >
          Browse the Collection
        </Link>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-neutral-400">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
