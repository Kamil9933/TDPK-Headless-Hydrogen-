import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

/**
 * ============================================================================
 * FRANCHISE CAMEO CONFIGURATION
 * ============================================================================
 *
 * Each key is the product tag that triggers a cameo (exact, case-sensitive match
 * against the tags array passed via props). Each value is an object with:
 *
 *   - name:   Human-readable franchise name (for debugging)
 *   - assets: Array of GIF/image URLs used by this franchise's scenarios
 *   - scenarios: Array of scenario definition objects (see below)
 *
 * SCENARIO SHAPES
 * ---------------
 * There are three built-in scenario types you can reuse for any franchise.
 * Pick the one(s) that fit and wire them up in the `scenarios` array:
 *
 * 1. "ground-battle"
 *    Multiple GIFs spawned at staggered horizontal positions near the bottom
 *    of the viewport. Each one fades out after `duration` ms.
 *    Config keys: assets (array of GIF URLs), count, duration, yPosition
 *
 * 2. "runner"
 *    A single GIF crossing the screen left-to-right or right-to-left (randomly
 *    flipped). Fades out after `duration` ms.
 *    Config keys: assets (pick one URL), duration, yPosition
 *
 * 3. "dogfight"
 *    Two assets cross on diagonal paths using the Web Animations API, with a
 *    laser image trailing. Requires exactly 3 asset URLs:
 *      [0] = Ship A (e.g. X-wing)
 *      [1] = Ship B (e.g. TIE fighter)
 *      [2] = Laser image
 *    Config keys: assets[0..2], duration
 *
 * TO ADD A NEW FRANCHISE:
 *   1. Copy any existing entry (Star Wars is the most complete example).
 *   2. Change the tag key to match your Shopify product tag exactly.
 *   3. Replace the assets array with your GIF/image CDN URLs.
 *   4. Adjust which scenario shapes you want and their parameters.
 *   5. That's it — no component code changes needed.
 * ============================================================================
 */
const FRANCHISE_CONFIG = {
  /* -----------------------------------------------------------------------
   * STAR WARS (tag: "Starwars")
   * Two scenarios: ground battle + dogfight (66%) or jedi sprint (34%)
   * ----------------------------------------------------------------------- */
  Starwars: {
    name: 'Star Wars',
    assets: [
      // Ground battle GIFs
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/ab106dd86f4691e3a56ac84621144d-unscreen.gif?v=1748175945',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/56f8d5864f527-unscreen.gif?v=1748175944',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/212629-unscreen.gif?v=1748175944',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/e964444076ea81fef7cdb3c25cfee8-unscreen.gif?v=1748175944',
      // Jedi sprint GIF
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/star-wars-unscreen_1.gif?v=1748176960',
      // Dogfight assets: X-wing, TIE fighter, laser
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/xwing.webp?v=1747512617',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/tie-fighter.png?v=1747512604',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/laser.png?v=1747512538',
    ],
    scenarios: [
      // 66% chance: ground battle + dogfight together
      {
        type: 'ground-battle-and-dogfight',
        weight: 0.66,
      },
      // 34% chance: jedi sprint alone
      {
        type: 'runner',
        weight: 0.34,
        assets: [
          'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/star-wars-unscreen_1.gif?v=1748176960',
        ],
        duration: 6000,
        yPosition: '30%',
        width: 200,
      },
    ],
  },

  /* -----------------------------------------------------------------------
   * BATMAN (tag: "Batman")
   * One of two scenarios chosen at random: run across or slow walk
   * ----------------------------------------------------------------------- */
  Batman: {
    name: 'Batman',
    assets: [
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/958ff6136f8a90a68ac3c9777c9f88-unscreen.gif?v=1748170402',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/7283.gif?v=1748168958',
    ],
    scenarios: [
      {
        type: 'runner',
        weight: 0.5,
        assets: [
          'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/958ff6136f8a90a68ac3c9777c9f88-unscreen.gif?v=1748170402',
        ],
        duration: 4000,
        yPosition: '40%',
        width: 180,
      },
      {
        type: 'runner',
        weight: 0.5,
        assets: [
          'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/7283.gif?v=1748168958',
        ],
        duration: 20000,
        yPosition: '75%',
        width: 250,
      },
    ],
  },

  /* -----------------------------------------------------------------------
   * ONE PIECE (tag: "One piece")
   * One of two scenarios: chibi Luffy run or Gear 5 laugh
   * ----------------------------------------------------------------------- */
  'One piece': {
    name: 'One Piece',
    assets: [
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/711eabdcb2a98390783f75007ff6895d.gif?v=1749932173',
      'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/i3h64r89k0bb1.gif?v=1749932269',
    ],
    scenarios: [
      {
        type: 'runner',
        weight: 0.5,
        assets: [
          'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/711eabdcb2a98390783f75007ff6895d.gif?v=1749932173',
        ],
        duration: 15000,
        yPosition: '50%',
        width: 200,
      },
      {
        type: 'centered-fade',
        weight: 0.5,
        assets: [
          'https://cdn.shopify.com/s/files/1/0674/1429/4702/files/i3h64r89k0bb1.gif?v=1749932269',
        ],
        duration: 3500,
        yPosition: '65%',
        width: 280,
      },
    ],
  },

  /* -----------------------------------------------------------------------
   * PLACEHOLDER FRANCHISES — add real asset URLs to activate
   *
   * Each entry below has the correct shape but empty assets arrays.
   * A tag with an empty assets array silently does nothing — no errors,
   * no blank overlays. Just paste in real CDN URLs and it works.
   *
   * To choose a scenario type, reference the entries above:
   *   - Star Wars uses "ground-battle-and-dogfight" and "runner"
   *   - Batman uses two "runner" variants
   *   - One Piece uses "runner" and "centered-fade"
   *
   * Supported scenario types:
   *   "runner"              — GIF crosses screen left<->right
   *   "centered-fade"       — GIF appears centered, fades after duration
   *   "ground-battle-and-dogfight" — (Star Wars only, hard-coded logic)
   * ----------------------------------------------------------------------- */
  LOTR: {
    name: 'Lord of the Rings',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
      // Example: { type: 'runner', weight: 1, assets: ['YOUR_GIF_URL'], duration: 6000, yPosition: '40%', width: 200 },
    ],
  },
  Naruto: {
    name: 'Naruto',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
    ],
  },
  Pokemon: {
    name: 'Pokemon',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
    ],
  },
  'Dragon Ball': {
    name: 'Dragon Ball',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
    ],
  },
  Avengers: {
    name: 'Avengers',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
    ],
  },
  F1: {
    name: 'Formula 1',
    assets: [],
    scenarios: [
      // TODO: Pick a scenario type from the examples above.
    ],
  },
};

/**
 * Picks a random scenario from a franchise config based on weighted probabilities.
 * Each scenario has a `weight` property; we normalise them to sum to 1, then use
 * Math.random() to select one. This mirrors the original Liquid theme's approach.
 *
 * @param {Array} scenarios - The scenarios array from a franchise config entry
 * @returns {Object|null} - The selected scenario, or null if the array is empty
 */
function pickScenario(scenarios) {
  if (!scenarios || scenarios.length === 0) return null;

  const totalWeight = scenarios.reduce((sum, s) => sum + (s.weight || 1), 0);
  let roll = Math.random() * totalWeight;

  for (const scenario of scenarios) {
    roll -= scenario.weight || 1;
    if (roll <= 0) return scenario;
  }

  // Fallback (floating-point edge case)
  return scenarios[scenarios.length - 1];
}

/**
 * FranchiseCameo — a config-driven overlay that spawns a random franchise
 * animation when a product with a matching tag is viewed.
 *
 * Props:
 *   - tags:      Array of product tag strings (e.g. product.tags)
 *   - trigger:   "load" — fire once on mount (matches original page-load behaviour)
 *                "scroll" — fire once the component scrolls into view (IntersectionObserver),
 *                           only fires once per mount even if you scroll away and back
 *
 * The component renders via a React portal into document.body with a fixed-position
 * overlay that never blocks clicks or scrolling (pointer-events: none).
 *
 * Respects prefers-reduced-motion: reduce — skips the cameo entirely.
 */
export function FranchiseCameo({tags = [], trigger = 'load'}) {
  const [isActive, setIsActive] = useState(false);
  const hasFired = useRef(false);

  // --- Reduced-motion check ---
  // If the user has requested reduced motion, we bail immediately and
  // never create any DOM elements or observers.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll trigger via IntersectionObserver ---
  // When trigger="scroll", we observe the wrapper div. Once it enters the
  // viewport (threshold 0.1 = 10% visible), we fire the cameo and disconnect.
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || hasFired.current) return;
    if (trigger !== 'scroll') return;

    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFired.current) {
          hasFired.current = true;
          setIsActive(true);
          observer.disconnect();
        }
      },
      {threshold: 0.1},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, prefersReducedMotion]);

  // --- Load trigger ---
  // When trigger="load", fire once on mount.
  useEffect(() => {
    if (prefersReducedMotion || hasFired.current) return;
    if (trigger !== 'load') return;

    hasFired.current = true;
    setIsActive(true);
  }, [trigger, prefersReducedMotion]);

  // --- Find matching franchise from tags ---
  // We iterate the config keys and check if any product tag matches exactly.
  // If multiple match, we take the first one — no simultaneous cameos.
  const matchedTag = Object.keys(FRANCHISE_CONFIG).find((tag) =>
    tags.includes(tag),
  );

  const franchise = matchedTag ? FRANCHISE_CONFIG[matchedTag] : null;

  // No match or assets empty — render only the invisible scroll trigger wrapper
  if (!franchise || franchise.assets.length === 0 || !isActive) {
    return <div ref={wrapperRef} className="sr-only" aria-hidden="true" />;
  }

  const scenario = pickScenario(franchise.scenarios);
  if (!scenario) return <div ref={wrapperRef} className="sr-only" aria-hidden="true" />;

  return (
    <>
      {/* Invisible wrapper for scroll observation */}
      <div ref={wrapperRef} className="sr-only" aria-hidden="true" />

      {/* Portal the overlay into document.body so it sits above everything */}
      {createPortal(
        <CameoOverlay franchise={franchise} scenario={scenario} />,
        document.body,
      )}
    </>
  );
}

/**
 * CameoOverlay — renders the actual animated elements inside a fixed overlay.
 * Cleans itself up after the longest animation finishes.
 */
function CameoOverlay({franchise, scenario}) {
  const overlayRef = useRef(null);

  // Auto-remove the overlay after the scenario duration + 1s buffer.
  // The longest scenario is 20s (Batman slow walk); we add a buffer for fade-out.
  useEffect(() => {
    const maxDuration = scenario.duration || 20000;
    const timer = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.remove();
      }
    }, maxDuration + 1000);

    return () => clearTimeout(timer);
  }, [scenario]);

  // Dispatch to the correct renderer based on scenario type.
  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {scenario.type === 'ground-battle-and-dogfight' && (
        <GroundBattleAndDogfight assets={franchise.assets} />
      )}
      {scenario.type === 'runner' && (
        <RunnerScenario scenario={scenario} />
      )}
      {scenario.type === 'centered-fade' && (
        <CenteredFadeScenario scenario={scenario} />
      )}
    </div>
  );
}

/**
 * GroundBattleAndDogfight — Star Wars signature scenario.
 * Spawns 4 ground-battle GIFs at staggered horizontal positions near the bottom,
 * then also runs a dogfight with X-wing and TIE fighter crossing on diagonal paths.
 *
 * The ground battle GIFs are positioned at 10%, 35%, 60%, 85% from the left,
 * each with a slight randomised vertical offset around 80% from the top.
 * They fade out after ~6 seconds.
 *
 * The dogfight uses the Web Animations API (element.animate()) to move two ships
 * on diagonal keyframe paths, with a laser trailing behind.
 */
function GroundBattleAndDogfight({assets}) {
  const containerRef = useRef(null);

  // Ground battle GIFs (first 4 assets)
  const groundGifs = assets.slice(0, 4);
  // Dogfight assets: X-wing [4], TIE fighter [5], laser [6]
  const xwingUrl = assets[4];
  const tieUrl = assets[5];
  const laserUrl = assets[6];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- GROUND BATTLE ---
    // Spawn GIFs at staggered horizontal positions near the bottom of the viewport.
    const positions = [10, 35, 60, 85]; // percentage from left
    const groundElements = groundGifs.map((gif, i) => {
      const el = document.createElement('img');
      el.src = gif;
      el.style.cssText = `
        position: absolute;
        bottom: ${5 + Math.random() * 10}%;
        left: ${positions[i]}%;
        width: 120px;
        height: auto;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      container.appendChild(el);

      // Fade in after a staggered delay
      setTimeout(() => {
        el.style.opacity = '1';
      }, i * 200);

      // Fade out and remove after 6 seconds
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
      }, 6000);

      return el;
    });

    // --- DOGFIGHT ---
    // X-wing and TIE fighter cross the screen on diagonal paths using the
    // Web Animations API. The vertical position and which ship leads are randomised.
    if (xwingUrl && tieUrl) {
      const dogfightY = 15 + Math.random() * 30; // random Y between 15-45%
      const reversed = Math.random() > 0.5; // which direction the ships travel

      // Create X-wing element
      const xwing = document.createElement('img');
      xwing.src = xwingUrl;
      xwing.style.cssText = `
        position: absolute;
        top: ${dogfightY}%;
        width: 100px;
        height: auto;
        z-index: 1;
      `;
      container.appendChild(xwing);

      // Create TIE fighter element
      const tie = document.createElement('img');
      tie.src = tieUrl;
      tie.style.cssText = `
        position: absolute;
        top: ${dogfightY + 5 + Math.random() * 10}%;
        width: 80px;
        height: auto;
        z-index: 1;
      `;
      container.appendChild(tie);

      // Create laser element (trails behind the leading ship)
      const laser = document.createElement('img');
      laser.src = laserUrl;
      laser.style.cssText = `
        position: absolute;
        top: ${dogfightY + 3}%;
        width: 60px;
        height: auto;
        opacity: 0;
        z-index: 2;
      `;
      container.appendChild(laser);

      // Animate ships using Web Animations API (element.animate).
      // We create keyframes that move each ship diagonally across the viewport.
      const shipDuration = 5000;
      const xwingStart = reversed ? '110vw' : '-15vw';
      const xwingEnd = reversed ? '-15vw' : '110vw';
      const tieStart = reversed ? '115vw' : '-15vw';
      const tieEnd = reversed ? '-15vw' : '115vw';

      xwing.animate(
        [
          {left: xwingStart, top: `${dogfightY}%`},
          {left: xwingEnd, top: `${dogfightY + 8}%`},
        ],
        {duration: shipDuration, easing: 'linear', fill: 'forwards'},
      );

      tie.animate(
        [
          {left: tieStart, top: `${dogfightY + 8}%`},
          {left: tieEnd, top: `${dogfightY}%`},
        ],
        {duration: shipDuration, easing: 'linear', fill: 'forwards'},
      );

      // Laser fires partway through, trailing between the ships
      setTimeout(() => {
        laser.style.opacity = '0.8';
        laser.animate(
          [
            {left: reversed ? '110vw' : '-10vw', opacity: 0.8},
            {left: reversed ? '-10vw' : '110vw', opacity: 0},
          ],
          {duration: 2000, easing: 'linear', fill: 'forwards'},
        );
      }, 1500);

      // Clean up dogfight elements after animation
      setTimeout(() => {
        xwing.remove();
        tie.remove();
        laser.remove();
      }, shipDuration + 200);
    }

    // Cleanup all ground elements on unmount
    return () => {
      groundElements.forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  return <div ref={containerRef} style={{position: 'absolute', inset: 0}} />;
}

/**
 * RunnerScenario — a single GIF crossing the screen left-to-right or right-to-left.
 * Direction is randomised; the image is flipped horizontally if running right-to-left.
 * The GIF fades in, travels across the viewport, and fades out.
 */
function RunnerScenario({scenario}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scenario.assets[0]) return;

    const goRight = Math.random() > 0.5;
    const gifUrl = scenario.assets[0];
    const duration = scenario.duration || 6000;
    const width = scenario.width || 180;

    const el = document.createElement('img');
    el.src = gifUrl;
    el.style.cssText = `
      position: absolute;
      top: ${scenario.yPosition || '40%'};
      width: ${width}px;
      height: auto;
      transform: scaleX(${goRight ? 1 : -1});
      opacity: 0;
      transition: opacity 0.3s;
    `;
    container.appendChild(el);

    // Fade in
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });

    // Animate across screen using Web Animations API
    const startX = goRight ? '-15vw' : '115vw';
    const endX = goRight ? '115vw' : '-15vw';

    el.animate([{left: startX}, {left: endX}], {
      duration,
      easing: 'linear',
      fill: 'forwards',
    });

    // Fade out and remove near the end
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, duration - 300);

    return () => el.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  return <div ref={containerRef} style={{position: 'absolute', inset: 0}} />;
}

/**
 * CenteredFadeScenario — a GIF appears centered near the bottom of the viewport,
 * stays for a few seconds, then fades out. Used for things like Gear 5 Luffy's
 * laugh.
 */
function CenteredFadeScenario({scenario}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scenario.assets[0]) return;

    const gifUrl = scenario.assets[0];
    const duration = scenario.duration || 3500;
    const width = scenario.width || 280;

    const el = document.createElement('img');
    el.src = gifUrl;
    el.style.cssText = `
      position: absolute;
      bottom: ${scenario.yPosition || '10%'};
      left: 50%;
      transform: translateX(-50%);
      width: ${width}px;
      height: auto;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
    `;
    container.appendChild(el);

    // Fade in
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });

    // Fade out and remove
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 400);
    }, duration);

    return () => el.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  return <div ref={containerRef} style={{position: 'absolute', inset: 0}} />;
}
