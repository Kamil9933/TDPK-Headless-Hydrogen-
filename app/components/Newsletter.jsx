import {Reveal} from '~/components/Reveal';

/**
 * Newsletter — a simple newsletter signup section.
 * Light background, purple accent, black CTA button.
 * This is a visual placeholder; it does not wire up to any email marketing
 * backend.
 */
export function Newsletter() {
  return (
    <section className="bg-neutral-50 py-20 px-6">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Stay in the Loop
          </p>
          <h2
            className="mb-4 text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Get first access to new drops
          </h2>
          <p className="mb-8 text-neutral-500">
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
              className="flex-1 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm text-black placeholder-neutral-400 outline-none transition focus:border-[#8252f1] focus:ring-1 focus:ring-[#8252f1]"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Subscribe
            </button>
          </form>
        </Reveal>

        <Reveal>
          <p className="mt-4 text-xs text-neutral-400">
            No spam, ever. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
