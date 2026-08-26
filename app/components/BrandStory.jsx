import {Reveal} from '~/components/Reveal';

/**
 * BrandStory — a short, scrolly band that introduces the brand.
 * Light background, black text, purple accent headings.
 */
export function BrandStory() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Our Story
          </p>
        </Reveal>

        <Reveal>
          <h2
            className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Born from a love of craft and technology
          </h2>
        </Reveal>

        <Reveal>
          <p className="mb-6 text-lg leading-relaxed text-neutral-600">
            Third Dimension started as a workshop experiment &mdash; a team of
            designers and engineers obsessed with pushing what consumer-grade 3D
            printing can achieve. We believe collectible figures shouldn&apos;t
            be mass-produced compromise. Every model we release is prototyped in
            house, printed on demand, and inspected by hand before it ships.
          </p>
        </Reveal>

        <Reveal>
          <p className="text-lg leading-relaxed text-neutral-600">
            From original characters to licensed properties, we bring digital
            sculpts into the real world with layer resolutions and material
            choices that mass manufacturing can&apos;t match.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
