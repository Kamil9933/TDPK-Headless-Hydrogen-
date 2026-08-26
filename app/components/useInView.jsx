import {useEffect, useRef, useState} from 'react';

/**
 * useInView — a lightweight scroll-reveal hook built on the native
 * IntersectionObserver API.
 *
 * How it works (for a portfolio README):
 *
 * 1. A `ref` is attached to the DOM element you want to watch. The hook
 *    creates an IntersectionObserver the first time that ref is set, storing
 *    the observer instance in a `useRef` so it persists across renders
 *    without triggering re-renders itself.
 *
 * 2. When the observer is created it checks `prefers-reduced-motion` via
 *    `window.matchMedia`. If the user has requested reduced motion (e.g.
 *    Windows Settings > Ease of Access > Show animations), the hook
 *    immediately sets `isVisible` to `true` and never creates an observer,
 *    so the content appears instantly without any animation.
 *
 * 3. The observer is configured with a `threshold` of 0.15 — meaning the
 *    callback fires once at least 15 % of the target element is visible in
 *    the viewport. This avoids triggering the reveal while only a sliver of
 *    the section is on screen.
 *
 * 4. Once the threshold is crossed, `isVisible` flips to `true` and the
 *    observer disconnects itself (`observer.disconnect()`). The reveal is
 *    one-way: once visible, the element stays visible and the observer is
 *    cleaned up so it doesn't keep running in the background.
 *
 * 5. The ref callback pattern is used (instead of useRef) so the observer
 *    is created exactly once when the DOM node mounts and torn down
 *    automatically on unmount via the cleanup function returned from
 *    useEffect.
 *
 * @param {Object}   options
 * @param {number}  [options.threshold=0.15] - Percentage of element that must be visible (0-1)
 * @param {boolean} [options.triggerOnce=true] - If true, once visible the observer disconnects
 * @returns {{ ref: (node: HTMLElement | null) => void, isVisible: boolean }}
 */
export function useInView({threshold = 0.15, triggerOnce = true} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  // Ref callback — called when the DOM element mounts/unmounts.
  // We intentionally do NOT use useRef for the watched element because a
  // ref callback lets us create the observer the moment the node exists and
  // tear it down when the node disappears.
  const ref = (node) => {
    // If we already have an observer watching a previous node, disconnect it.
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Guard: if the node is null (unmounting), just bail.
    if (!node) return;

    // If the user prefers reduced motion, skip the observer entirely and
    // show the content immediately.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    // Create a new IntersectionObserver. When the observed element crosses
    // the threshold, the callback fires.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // `entry.isIntersecting` is true when the element is at least
        // `threshold` pixels/percent visible in the viewport.
        if (entry.isIntersecting) {
          setIsVisible(true);

          // If triggerOnce is true (default), disconnect immediately so
          // the callback never fires again. This is both a performance
          // optimisation and prevents the element from toggling if the
          // user scrolls it back out of view.
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          // If triggerOnce is false, allow the element to "re-hide" when
          // it scrolls back out of view.
          setIsVisible(false);
        }
      },
      {threshold},
    );

    // Start watching the element.
    observer.observe(node);

    // Store the observer so we can disconnect it on the next ref change
    // or on unmount.
    observerRef.current = observer;
  };

  // Clean up the observer when the component unmounts.
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {ref, isVisible};
}
