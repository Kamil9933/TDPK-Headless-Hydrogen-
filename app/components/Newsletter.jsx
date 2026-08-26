import {Reveal} from '~/components/Reveal';

/**
 * Newsletter — a simple newsletter signup section.
 *
 * This is a visual placeholder; it does not wire up to any email marketing
 * backend. Replace the form action with your real newsletter endpoint when
 * one is available.
 */
export function Newsletter() {
  return (
    <section className="bg-neutral-950 py-20 px-6">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Stay in the Loop
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get first access to new drops
          </h2>
          <p className="mb-8 text-neutral-400">
            Be the first to know about limited runs, new licenses, and
            behind-the-scenes looks at our process.
          </p>
        </Reveal>

        <Reveal>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Subscribe
            </button>
          </form>
        </Reveal>

        <Reveal>
          <p className="mt-4 text-xs text-neutral-600">
            No spam, ever. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
