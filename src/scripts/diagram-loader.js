/**
 * Shared lazy loader for markdown diagram engines.
 *
 * Markdown plugins only emit a data marker. The first diagram of each engine
 * that approaches the viewport loads that engine once; page transitions then
 * reuse the same module promise and only trigger a lightweight rescan.
 */

const ENGINE_LOADERS = new Map([
  ["mermaid", () => import("../plugins/mermaid-render-script.js")],
  ["markmap", () => import("../plugins/markmap-render-script.js")],
  ["plantuml", () => import("../plugins/plantuml-render-script.js")],
  ["vega-lite", () => import("../plugins/vega-lite-render-script.js")],
]);

const enginePromises = new Map();
let coordinatorPromise;
let observer;
let mutationObserver;
let scanQueued = false;

function getEngine(container) {
  const engine = container.getAttribute("data-tsukimi-diagram");
  return engine && ENGINE_LOADERS.has(engine) ? engine : null;
}

/** Register a renderer chunk without coupling markdown plugins to its loader. */
function registerDiagramEngine(name, loader) {
  if (typeof name !== "string" || !name || typeof loader !== "function") {
    return;
  }
  if (!ENGINE_LOADERS.has(name)) {
    ENGINE_LOADERS.set(name, loader);
  }
}

function ensureCoordinator() {
  if (!coordinatorPromise) {
    coordinatorPromise = import("../plugins/diagram-theme-coordinator.js");
  }
  return coordinatorPromise;
}

function loadEngine(engine) {
  if (!enginePromises.has(engine)) {
    const loader = ENGINE_LOADERS.get(engine);
    const promise = ensureCoordinator()
      .then(() => loader())
      .catch((error) => {
        enginePromises.delete(engine);
        throw error;
      });
    enginePromises.set(engine, promise);
  }
  return enginePromises.get(engine);
}

function markFailed(container, error) {
  container.setAttribute("data-tsukimi-diagram-state", "error");
  // Keep the source available as a graceful fallback and avoid breaking the article.
  console.warn("Failed to load markdown diagram engine:", error);
}

function loadForContainer(container) {
  const engine = getEngine(container);
  if (!engine) return;

  const state = container.getAttribute("data-tsukimi-diagram-state");
  if (state === "loading" || state === "loaded") return;

  container.setAttribute("data-tsukimi-diagram-state", "loading");
  void loadEngine(engine)
    .then((module) => {
      // New engines can render one container at a time. Legacy engines expose
      // an auto-initialising module and keep their existing lifecycle.
      if (typeof module?.renderDiagram === "function") {
        return module.renderDiagram(container);
      }
    })
    .then(() => {
      container.setAttribute("data-tsukimi-diagram-state", "loaded");
    })
    .catch((error) => markFailed(container, error));
}

function scan() {
  scanQueued = false;
  const containers = document.querySelectorAll("[data-tsukimi-diagram]");

  if (!observer) {
    containers.forEach(loadForContainer);
    return;
  }

  containers.forEach((container) => {
    const engine = getEngine(container);
    if (!engine) return;
    const state = container.getAttribute("data-tsukimi-diagram-state");
    if (state !== "loading" && state !== "loaded") {
      observer.observe(container);
    }
  });
}

function scheduleScan() {
  if (scanQueued) return;
  scanQueued = true;
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(scan);
  } else {
    setTimeout(scan, 0);
  }
}

function init() {
  if (window.__tsukimiDiagramLoaderInitialized) return;
  window.__tsukimiDiagramLoaderInitialized = true;

  if (typeof IntersectionObserver === "function") {
    observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          currentObserver.unobserve(entry.target);
          loadForContainer(entry.target);
        });
      },
      { rootMargin: "300px 0px" },
    );
  }

  document.addEventListener("astro:page-load", scheduleScan);
  document.addEventListener("swup:content:replace", scheduleScan);

  if (typeof MutationObserver === "function" && document.body) {
    mutationObserver = new MutationObserver(scheduleScan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  scheduleScan();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export { init as initDiagramLoader, registerDiagramEngine };
