import {Link} from 'react-router';
import {Reveal} from '~/components/Reveal';

const CATEGORIES = [
  {title: 'Star Wars', handle: 'star-wars', emoji: '⭐'},
  {title: 'Batman', handle: 'batman', emoji: '🦇'},
  {title: 'One Piece', handle: 'one-piece', emoji: '🏴‍☠️'},
  {title: 'Dragon Ball', handle: 'dragon-ball', emoji: '🐉'},
  {title: 'Naruto', handle: 'naruto', emoji: '🍥'},
  {title: 'Pokemon', handle: 'pokemon', emoji: '⚡'},
  {title: 'Avengers', handle: 'avengers', emoji: '🛡️'},
  {title: 'LOTR', handle: 'lord-of-the-rings', emoji: '💍'},
  {title: 'F1', handle: 'f1', emoji: '🏎️'},
];

export function ShopByCategory() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Browse
          </p>
          <h2
            className="mb-12 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl"
            style={{fontFamily: 'var(--font-heading)'}}
          >
            Shop by Category
          </h2>
        </Reveal>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.handle} threshold={0.05}>
              <Link
                to={`/collections/${cat.handle}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-[#8252f1] hover:bg-purple-50 hover:shadow-md"
              >
                <span className="text-4xl transition-transform group-hover:scale-110">
                  {cat.emoji}
                </span>
                <span
                  className="text-sm font-semibold text-black transition-colors group-hover:text-[#8252f1]"
                  style={{fontFamily: 'var(--font-accent)'}}
                >
                  {cat.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
