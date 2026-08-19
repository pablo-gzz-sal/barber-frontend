/**
 * False during the build-time prerender pass, true in the browser.
 *
 * `yarn build` now renders every page in Node before deploying it, and Node has no
 * `window`, `document.body`, `localStorage` or `requestAnimationFrame`. Anything that
 * touches those during construction or `ngOnInit` has to be skipped there — not because
 * the behaviour is unwanted, but because there is nothing to act on yet.
 *
 * Evaluated once at module load. The browser and server bundles are built separately, so
 * each resolves this to a literal and drops the branch it does not need.
 *
 * Event handlers do not need this guard: nothing clicks during a prerender.
 */
export const IS_BROWSER = typeof window !== 'undefined';
