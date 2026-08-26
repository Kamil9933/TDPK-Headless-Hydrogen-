import {Link} from 'react-router';

/**
 * Hero — near-full-viewport hero section with a gradient background,
 * headline, subheadline, and a primary CTA linking to /collections/all.
 *
 * Uses a CSS gradient rather than an image asset so we don't need to
 * fetch or host anything. The gradient colours are intentionally neutral
 * to work as a placeholder until real brand imagery is added.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      {/* Subtle grid overlay for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
          3D-Printed Collectibles
        </p>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Precision Crafted.
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Limitlessly Detailed.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-neutral-300">
          Original and licensed designs brought to life with industrial-grade
          3D printing. Every piece is made to order with obsessive attention
          to detail.
        </p>

        <Link
          to="/collections/all"
          className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-neutral-950 shadow-lg transition hover:bg-neutral-200 hover:shadow-xl"
        >
          Browse the Collection
        </Link>
      </div>
    </section>
  );
}
