/**
 * directive-interactions.js — Client-side JS for interactive markdown directives
 *
 * Handles: tab switching, copy buttons, blur/psw reveal, folding/folders,
 * asciinema player loading, and video player controls.
 */

/** Guard: e.target may not be an Element (e.g. Text node, Document) */
function closest(el, sel) {
  return el && el.closest ? el.closest(sel) : null;
}

function getTabs(container) {
  return Array.from(container.querySelectorAll('.md-tab-btn')).filter(
    (btn) => btn.dataset.tabsId === container.id,
  );
}

function getTabPanes(container) {
  const prefix = `${container.id}-pane-`;
  return Array.from(container.querySelectorAll('.md-tab-pane')).filter((pane) =>
    pane.id.startsWith(prefix),
  );
}

function activateTab(container, tabBtn, { focus = false, sync = true } = {}) {
  getTabs(container).forEach((btn) => {
    const active = btn === tabBtn;
    btn.classList.toggle('md-tab-active', active);
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;
  });
  getTabPanes(container).forEach((pane) => {
    const active = pane.id === tabBtn.getAttribute('aria-controls');
    pane.classList.toggle('md-tab-visible', active);
    pane.setAttribute('aria-hidden', String(!active));
  });

  if (focus) tabBtn.focus();
  if (!sync) return;

  const syncId = container.dataset.tabsSync;
  if (!syncId) return;
  const clickedLabel = tabBtn.textContent.trim();
  const clickedIndex = tabBtn.dataset.tabIndex;
  document.querySelectorAll('[data-tabs-sync]').forEach((syncedContainer) => {
    if (syncedContainer === container || syncedContainer.dataset.tabsSync !== syncId) return;
    const syncedTabs = getTabs(syncedContainer);
    const matchingBtn = syncedTabs.find((btn) => btn.textContent.trim() === clickedLabel)
      || syncedTabs.find((btn) => btn.dataset.tabIndex === clickedIndex);
    if (matchingBtn) activateTab(syncedContainer, matchingBtn, { sync: false });
  });
}

function initTabs() {
  document.addEventListener('click', (e) => {
    const tabBtn = closest(e.target, '.md-tab-btn');
    if (!tabBtn) {return;}

    e.preventDefault();

    const tabsId = tabBtn.dataset.tabsId;
    if (!tabsId) {return;}

    const container = document.getElementById(tabsId);
    if (!container) {return;}

    activateTab(container, tabBtn);
  });

  document.addEventListener('keydown', (e) => {
    const tabBtn = closest(e.target, '.md-tab-btn');
    if (!tabBtn || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const container = document.getElementById(tabBtn.dataset.tabsId || '');
    if (!container) return;
    const tabs = getTabs(container);
    const currentIndex = tabs.indexOf(tabBtn);
    if (currentIndex < 0) return;

    e.preventDefault();
    let nextIndex = currentIndex;
    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = tabs.length - 1;
    activateTab(container, tabs[nextIndex], { focus: true });
  });
}

function initCopy() {
  document.addEventListener('click', (e) => {
    const copyBtn = closest(e.target, '.md-copy-btn, .md-segment-copy, .md-code-copy-btn');
    if (!copyBtn) {return;}

    e.preventDefault();

    const targetId = copyBtn.dataset.copyTarget;
    if (!targetId) {return;}

    const target = document.getElementById(targetId);
    if (!target) {return;}

    let text = '';
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
      text = target.value;
    } else {
      text = target.textContent || '';
    }

    const onCopied = () => showCopyFeedback(copyBtn);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onCopied).catch(() => {
        if (copyWithFallback(target)) onCopied();
      });
    } else if (copyWithFallback(target)) {
      onCopied();
    }
  });
}

function copyWithFallback(target) {
  try {
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
      target.select();
      return document.execCommand('copy');
    }
    const range = document.createRange();
    range.selectNodeContents(target);
    const selection = window.getSelection();
    if (!selection) return false;
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand('copy');
    selection.removeAllRanges();
    return copied;
  } catch {
    return false;
  }
}

function showCopyFeedback(btn) {
  // Prevent re-triggering while already showing feedback
  if (btn._copyFeedbackActive) return;
  btn._copyFeedbackActive = true;

  const original = btn.innerHTML;
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  btn.classList.add('md-copy-btn--copied');
  if (btn.classList.contains('md-segment-copy')) {
    btn.classList.add('md-copy-success');
  }
  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove('md-copy-btn--copied', 'md-copy-success');
    btn._copyFeedbackActive = false;
  }, 2000);
}

function initBlurReveal() {
  const toggleReveal = (el) => {
    const className = el.classList.contains('md-tag-blur')
      ? 'md-tag-blur--revealed'
      : 'md-tag-psw--revealed';
    const revealed = el.classList.toggle(className);
    el.setAttribute('aria-expanded', String(revealed));
  };

  // Click to toggle blur/psw reveal — only toggle the relevant class
  document.addEventListener('click', (e) => {
    const el = closest(e.target, '.md-tag-blur, .md-tag-psw');
    if (el) {
      e.preventDefault();
      toggleReveal(el);
      return;
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const el = closest(e.target, '.md-tag-blur, .md-tag-psw');
      if (el) {
        e.preventDefault();
        toggleReveal(el);
      }
    }
  });
}

let asciinemaAssetsPromise = null;

function loadAsciinemaPlayer() {
  if (globalThis.AsciinemaPlayer) {
    return Promise.resolve(globalThis.AsciinemaPlayer);
  }
  if (asciinemaAssetsPromise) return asciinemaAssetsPromise;

  if (!document.querySelector('link[data-asciinema-player]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.min.css';
    css.dataset.asciinemaPlayer = 'true';
    document.head.appendChild(css);
  }

  asciinemaAssetsPromise = new Promise((resolve, reject) => {
    let script = document.querySelector('script[data-asciinema-player]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.min.js';
      script.async = true;
      script.dataset.asciinemaPlayer = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve(globalThis.AsciinemaPlayer), { once: true });
    script.addEventListener('error', () => {
      script.remove();
      reject(new Error('Failed to load asciinema-player'));
    }, { once: true });
  }).catch((error) => {
    asciinemaAssetsPromise = null;
    throw error;
  });

  return asciinemaAssetsPromise;
}

function initAsciinema() {
  // Lazy-load asciinema player and initialize with AsciinemaPlayer.create()
  const containers = Array.from(
    document.querySelectorAll('.md-asciinema-container[data-src]'),
  ).filter((el) => !el.dataset.asciinemaInitialized);
  if (!containers.length) {return;}

  async function createPlayer(el) {
    const src = el.getAttribute('data-src');
    const cols = parseInt(el.getAttribute('data-cols') || '80', 10);
    const rows = parseInt(el.getAttribute('data-rows') || '24', 10);
    const hasPreload = el.hasAttribute('data-preload');
    try {
      const player = await loadAsciinemaPlayer();
      if (!player || !el.isConnected) return;
      // Clear container before mounting — AsciinemaPlayer.create() appends its
      // UI into the element, so any pre-existing content would show as a
      // duplicate frame around the player.
      el.textContent = '';
      player.create(src, el, {
        cols: cols,
        rows: rows,
        preload: hasPreload,
        autoPlay: false,
        fit: 'width',
        terminalFontSize: '14px',
        terminalFontFamily: 'var(--font-mono, monospace)',
        theme: 'auto/asciinema',
      });
      el.dataset.asciinemaInitialized = 'true';
    } catch {
      delete el.dataset.asciinemaInitialized;
      console.warn('[directive] Failed to load asciinema-player script');
    }
  }

  if (!('IntersectionObserver' in window)) {
    containers.forEach((el) => {
      el.dataset.asciinemaInitialized = 'pending';
      createPlayer(el);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {continue;}
        const el = entry.target;
        observer.unobserve(el);
        createPlayer(el);
      }
    },
    { rootMargin: '200px' },
  );

  containers.forEach((el) => {
    el.dataset.asciinemaInitialized = 'pending';
    observer.observe(el);
  });
}

// Initialization guard — prevent duplicate event listener registration
// when initDirectiveInteractions() is called from multiple layout files
// and the auto-init block.
let _initialized = false;

// Initialize all directive interactions
export function initDirectiveInteractions() {
  if (_initialized) return;
  _initialized = true;
  initTabs();
  initCopy();
  initBlurReveal();
  initAsciinema();
  initVideo();
  initFoldersAccordion();
  initCodeTree();
  initAnnotation();
}

/**
 * Re-initialize directives that need per-page setup after Swup transitions.
 * Delegated handlers (tabs, copy, blur, video) survive navigation,
 * but IntersectionObserver-based handlers (asciinema) must be re-created.
 */
export function reinitDirectiveInteractions() {
  initAsciinema();
}

// ─── Video Player ────────────────────────────────────────────────────────────

function initVideo() {
  // Handle video play/pause, poster visibility, and PiP
  document.addEventListener('click', (e) => {
    const playBtn = closest(e.target, '.md-video-play-btn');
    const pipBtn = closest(e.target, '.md-video-pip-btn');

    if (playBtn) {
      const container = playBtn.closest('.md-directive-video');
      if (!container) return;
      const video = container.querySelector('video');
      if (!video) return;

      // Always ensure controls are available for user interaction
      if (!video.hasAttribute('controls')) {
        video.setAttribute('controls', '');
      }

      // Hide poster and overlay so video controls are accessible
      const poster = container.querySelector('.md-video-poster-img');
      const overlay = container.querySelector('.md-video-overlay');
      if (poster) { poster.style.opacity = '0'; poster.style.pointerEvents = 'none'; }
      if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }

      if (video.paused) {
        // Start muted to guarantee playback within the user gesture context,
        // then attempt to unmute. If unmuting causes a pause (autoplay policy),
        // the video stays muted-but-playing rather than stopping entirely.
        video.muted = true;
        video.play().then(() => {
          container.classList.add('md-video-playing');
          // Try unmuting after a tick — if the browser blocks it, the video
          // keeps playing muted and the user can unmute via native controls.
          video.muted = false;
          // If unmuting caused the browser to pause, revert to muted
          if (video.paused) {
            video.muted = true;
            video.play().catch(() => {});
          }
        }).catch(() => {
          // Even muted play failed — controls are visible, user can start manually.
        });
      } else {
        video.pause();
        container.classList.remove('md-video-playing');
        // For poster videos, show overlay again when paused
        if (container.classList.contains('md-video-has-poster')) {
          if (poster) { poster.style.opacity = ''; poster.style.pointerEvents = ''; }
          if (overlay) { overlay.style.opacity = ''; overlay.style.pointerEvents = ''; }
        }
      }
      return;
    }

    if (pipBtn) {
      const container = pipBtn.closest('.md-directive-video');
      if (!container) return;
      const video = container.querySelector('video');
      if (!video) return;

      if (document.pictureInPictureEnabled && !video.hasAttribute('disablePictureInPicture')) {
        if (document.pictureInPictureElement === video) {
          document.exitPictureInPicture().catch(() => {});
        } else {
          video.requestPictureInPicture().catch(() => {});
        }
      }
      return;
    }
  });

  // Handle video events via delegation
  document.addEventListener('play', (e) => {
    if (e.target.tagName !== 'VIDEO') return;
    const container = e.target.closest('.md-directive-video');
    if (!container) return;
    container.classList.add('md-video-playing');
    const poster = container.querySelector('.md-video-poster-img');
    const overlay = container.querySelector('.md-video-overlay');
    if (poster) { poster.style.opacity = '0'; poster.style.pointerEvents = 'none'; }
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
  }, true);

  document.addEventListener('pause', (e) => {
    if (e.target.tagName !== 'VIDEO') return;
    const container = e.target.closest('.md-directive-video');
    if (!container) return;
    // Only show overlay again for poster-mode videos.
    // Delay slightly to avoid race: if play() was just attempted but
    // failed (autoplay policy), the overlay should stay hidden so the
    // native controls remain accessible.
    const hasPoster = container.classList.contains('md-video-has-poster');
    if (hasPoster) {
      // Use a micro-delay so that an immediately-failing play() doesn't
      // re-show the overlay before the user can interact with native controls.
      setTimeout(() => {
        // Only restore if the video is still paused after the delay
        const video = container.querySelector('video');
        if (video && video.paused) {
          const overlay = container.querySelector('.md-video-overlay');
          const poster = container.querySelector('.md-video-poster-img');
          if (overlay) { overlay.style.opacity = ''; overlay.style.pointerEvents = ''; }
          if (poster) { poster.style.opacity = ''; poster.style.pointerEvents = ''; }
        }
      }, 100);
    }
    container.classList.remove('md-video-playing');
  }, true);

  document.addEventListener('ended', (e) => {
    if (e.target.tagName !== 'VIDEO') return;
    const container = e.target.closest('.md-directive-video');
    if (!container) return;
    container.classList.remove('md-video-playing');
    const poster = container.querySelector('.md-video-poster-img');
    const overlay = container.querySelector('.md-video-overlay');
    if (poster) { poster.style.opacity = ''; poster.style.pointerEvents = ''; }
    if (overlay) { overlay.style.opacity = ''; overlay.style.pointerEvents = ''; }
  }, true);
}

function initFoldersAccordion() {
  // Accordion mode: opening one <details> closes others in the same group
  document.addEventListener('click', (e) => {
    const summary = closest(e.target, '.md-folders-accordion > details > summary');
    if (!summary) {return;}

    const currentDetails = summary.parentElement;
    const group = currentDetails.parentElement;
    if (!group || !group.classList.contains('md-folders-accordion')) {return;}

    // Close other <details> in this accordion group
    group.querySelectorAll(':scope > details').forEach((d) => {
      if (d !== currentDetails && d.hasAttribute('open')) {
        d.removeAttribute('open');
      }
    });
  });
}

function initCodeTree() {
  const activateFile = (fileInfo, focus = false) => {
    const ctId = fileInfo.dataset.ctId;
    if (!ctId) return;
    const container = document.getElementById(ctId);
    if (!container) return;
    const files = Array.from(
      container.querySelectorAll('.md-code-tree-sidebar .vp-file-tree-info.file[data-ct-id]'),
    ).filter((file) => file.dataset.ctId === ctId);

    files.forEach((file) => {
      const active = file === fileInfo;
      file.classList.toggle('md-code-tree-file-active', active);
      file.setAttribute('aria-selected', String(active));
      file.tabIndex = active ? 0 : -1;
    });
    container.querySelectorAll('.md-code-tree-panel').forEach((panel) => {
      const active = panel.id === fileInfo.getAttribute('aria-controls');
      panel.classList.toggle('md-code-tree-panel-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    if (focus) fileInfo.focus();
  };

  // Folders use native <details>/<summary>; file rows switch code panels.
  document.addEventListener('click', (e) => {
    const fileInfo = closest(e.target, '.md-code-tree-sidebar .vp-file-tree-info.file');
    if (!fileInfo) {return;}
    activateFile(fileInfo);
  });

  document.addEventListener('keydown', (e) => {
    const fileInfo = closest(e.target, '.md-code-tree-sidebar .vp-file-tree-info.file');
    if (!fileInfo || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    const container = document.getElementById(fileInfo.dataset.ctId || '');
    if (!container) return;
    const files = Array.from(
      container.querySelectorAll('.md-code-tree-sidebar .vp-file-tree-info.file[data-ct-id]'),
    ).filter((file) => file.dataset.ctId === container.id);
    const currentIndex = files.indexOf(fileInfo);
    if (currentIndex < 0) return;

    e.preventDefault();
    let nextIndex = currentIndex;
    if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + files.length) % files.length;
    if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % files.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = files.length - 1;
    activateFile(files[nextIndex], true);
  });
}

function initAnnotation() {
  // Hover/focus shows annotation tooltip
  document.addEventListener('mouseenter', (e) => {
    const anno = closest(e.target, '.md-tag-annotation');
    if (anno) { anno.classList.add('md-annotation-hover'); }
  }, true);
  document.addEventListener('mouseleave', (e) => {
    const anno = closest(e.target, '.md-tag-annotation');
    if (anno) { anno.classList.remove('md-annotation-hover'); }
  }, true);
  document.addEventListener('focusin', (e) => {
    const anno = closest(e.target, '.md-tag-annotation');
    if (anno) { anno.classList.add('md-annotation-hover'); }
  });
  document.addEventListener('focusout', (e) => {
    const anno = closest(e.target, '.md-tag-annotation');
    if (anno) { anno.classList.remove('md-annotation-hover'); }
  });
}

// Auto-init for non-module usage
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectiveInteractions);
  } else {
    initDirectiveInteractions();
  }
}
