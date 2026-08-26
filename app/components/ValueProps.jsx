import {Reveal} from '~/components/Reveal';

const PROPS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Precision Detail',
    text: 'Industrial-grade printers capture every micro-detail of the design.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'Original Designs',
    text: 'In-house sculpted pieces alongside licensed collaborations.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: 'Made to Order',
    text: 'No warehouse waste. Each piece is printed just for you.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0v-.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v.375m-4.5 0v.375c0 .621-.504 1.125-1.125 1.125H8.25c-.621 0-1.125-.504-1.125-1.125v-.375m8.25 0h1.5" />
      </svg>
    ),
    title: 'Pakistan-Wide Shipping',
    text: 'Carefully packaged and delivered to your doorstep.',
  },
];

/**
 * ValueProps — "why buy from us" row on light background.
 * Purple accent icons, black text.
 */
export function ValueProps() {
  return (
    <section className="border-t border-b border-neutral-200 bg-neutral-50 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="mb-12 text-center text-sm font-semibold uppercase tracking-[0.2em]"
            style={{color: '#8252f1', fontFamily: 'var(--font-accent)'}}
          >
            Why Third Dimension
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {PROPS.map((prop) => (
            <Reveal key={prop.title} threshold={0.1}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-purple-200 bg-purple-50"
                  style={{color: '#8252f1'}}
                >
                  {prop.icon}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-black">
                  {prop.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {prop.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
