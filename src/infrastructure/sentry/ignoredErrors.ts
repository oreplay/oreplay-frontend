/**
 * Error messages Sentry drops before sending, passed to `Sentry.init` as `ignoreErrors`.
 *
 * They come from the network, the browser or the Android app's WebView rather than from a bug in
 * this app, and none of them can be fixed here:
 * - `*DynamicImport`: a dynamic import that does not go through `lazyWithRetry` failed to fetch
 *   its chunk, in the wording of each browser engine, usually right after a deploy. The patterns
 *   are anchored so they never match a `ChunkLoadError`, whose message wraps the browser's one:
 *   the error boundary reports that error when a reload does not fix it.
 * - `serviceWorker*`: the browser could not fetch or register the service worker (offline,
 *   blocked by the user or by a privacy setting).
 * - `webViewBridge`: the Android WebView tore down its JavaScript bridge while the page was
 *   still using it.
 *
 * Sentry matches each pattern against the exception's message and against `Type: message`.
 */
export const IGNORED_ERRORS = {
  chromiumDynamicImport: /^Failed to fetch dynamically imported module/,
  firefoxDynamicImport: /^error loading dynamically imported module/,
  safariDynamicImport: /^Importing a module script failed/,
  serviceWorkerRegistration: /Failed to register a ServiceWorker/,
  serviceWorkerScript: /^Script \S+\/sw\.js load failed/,
  webViewBridge: /Java object is gone/,
} as const satisfies Record<string, RegExp>
