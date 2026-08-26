import {useInView} from '~/components/useInView';

/**
 * Reveal — a thin wrapper that fades + slides its children into view when
 * they scroll into the viewport. Uses the useInView hook internally.
 *
 * For users with `prefers-reduced-motion: reduce`, the animation is skipped
 * entirely and content appears immediately (handled inside useInView).
 *
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 *   as?: keyof JSX.IntrinsicElements;
 *   threshold?: number;
 * }} props
 */
export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  threshold = 0.15,
}) {
  const {ref, isVisible} = useInView({threshold});

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
