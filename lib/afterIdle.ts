// Runs `callback` once the page has loaded and the browser is idle, plus an optional extra
// `delay`, so heavy effects (and their one-time GPU shader compiles on a first visit) don't
// compete with the first paint or with each other. Returns a cancel function.
export function afterIdle(callback: () => void, delay = 0): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    if (cancelled) return;
    if (delay > 0) timeoutId = setTimeout(() => !cancelled && callback(), delay);
    else callback();
  };
  const schedule = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(run, { timeout: 1500 });
    else timeoutId = setTimeout(run, 200);
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}
