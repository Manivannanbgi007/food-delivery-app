/**
 * The place of a block in a list, for the `stagger` utility (index.css): with `motion-safe:animate-rise-in stagger`
 * (or animate-pop-in) it comes into view a little after the block before it.
 */
export function stagger(index) {
  return { '--stagger': index };
}

/**
 * The visitor asked their system for less motion, or the browser cannot tell (the tests' jsdom): figures then show
 * their value at once instead of counting up to it.
 */
export function prefersReducedMotion() {
  return (
    typeof window.matchMedia !== 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
