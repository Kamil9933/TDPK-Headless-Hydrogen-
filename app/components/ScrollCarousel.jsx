import {useRef} from 'react';

/**
 * ScrollCarousel — reusable horizontal scroll-snap container.
 * Uses CSS scroll-snap for native-feeling horizontal scrolling.
 * Left/right arrow buttons for mouse users.
 *
 * @param {{
 *   children: import('react').ReactNode;
 *   className?: string;
 *   ariaLabel?: string;
 * }}
 */
export function ScrollCarousel({children, className = '', ariaLabel}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({left: dir * amount, behavior: 'smooth'});
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm transition hover:border-[#8252f1] hover:text-[#8252f1] sm:-left-5"
        aria-label="Scroll left"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm transition hover:border-[#8252f1] hover:text-[#8252f1] sm:-right-5"
        aria-label="Scroll right"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <div
        ref={scrollRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
        style={{scrollbarWidth: 'none'}}
      >
        {children}
      </div>
    </div>
  );
}
