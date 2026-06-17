/**
 * directive-interactions.js — Client-side JS for interactive markdown directives
 *
 * Handles: tab switching, copy buttons, blur/psw reveal, folding/folders,
 * asciinema player loading, gallery lightbox, and video player.
 */

/** Guard: e.target may not be an Element (e.g. Text node, Document) */
function closest(el, sel) {
  return el && el.closest ? el.closest(sel) : null;
}

function initTabs() {
  document.addEventListener('click', (e) => {
    const tabBtn = closest(e.target, '.md-tab-btn');
    if (!tabBtn) {return;}

    const tabsId = tabBtn.dataset.tabsId;
    if (!tabsId) {return;}

    const container = document.getElementById(tabsId);
    if (!container) {return;}

    // Deactivate all tabs in this group
    container.querySelectorAll('.md-tab-btn').forEach((btn) => {
      btn.classList.remove('md-tab-active');
      btn.setAttribute('aria-selected', 'false');
    });
    container.querySelectorAll('.md-tab-pane').forEach((pane) => {
      pane.classList.remove('md-tab-visible');
    });

    // Activate clicked tab
    tabBtn.classList.add('md-tab-active');
    tabBtn.setAttribute('aria-selected', 'true');

    const tabIndex = tabBtn.dataset.tabIndex;
    const targetPane = container.querySelector(`#${tabsId}-pane-${tabIndex}`);
    if (targetPane) {
      targetPane.classList.add('md-tab-visible');
    }

    // Sync tabs across groups with the same data-tabs-sync value
    const syncId = container.dataset.tabsSync;
    if (syncId) {
      const clickedLabel = tabBtn.textContent.trim();
      const clickedIndex = tabBtn.dataset.tabIndex;
      document.querySelectorAll(`[data-tabs-sync="${syncId}"]`).forEach((syncedContainer) => {
        if (syncedContainer === container) {return;}
        // Find matching tab by label text, fall back to index
        let matchingBtn = Array.from(syncedContainer.querySelectorAll('.md-tab-btn')).find(
          (btn) => btn.textContent.trim() === clickedLabel
        );
        if (!matchingBtn && clickedIndex) {
          matchingBtn = syncedContainer.querySelector(`.md-tab-btn[data-tab-index="${clickedIndex}"]`);
        }
        if (!matchingBtn) {return;}
        // Deactivate all, activate matching
        syncedContainer.querySelectorAll('.md-tab-btn').forEach((btn) => {
          btn.classList.remove('md-tab-active');
          btn.setAttribute('aria-selected', 'false');
        });
        syncedContainer.querySelectorAll('.md-tab-pane').forEach((pane) => {
          pane.classList.remove('md-tab-visible');
        });
        matchingBtn.classList.add('md-tab-active');
        matchingBtn.setAttribute('aria-selected', 'true');
        const syncedTabsId = matchingBtn.dataset.tabsId;
        const syncedTabIndex = matchingBtn.dataset.tabIndex;
        const syncedPane = syncedContainer.querySelector(`#${syncedTabsId}-pane-${syncedTabIndex}`);
        if (syncedPane) {
          syncedPane.classList.add('md-tab-visible');
        }
      });
    }
  });
}

function initCopy() {
  document.addEventListener('click', (e) => {
    const copyBtn = closest(e.target, '.md-copy-btn, .md-segment-copy, .md-code-copy-btn');
    if (!copyBtn) {return;}

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

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(copyBtn);
      });
    } else {
      // Fallback for older browsers
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        target.select();
        document.execCommand('copy');
      } else {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
      }
      showCopyFeedback(copyBtn);
    }
  });
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
  // Click to toggle blur/psw reveal — only toggle the relevant class
  document.addEventListener('click', (e) => {
    const el = closest(e.target, '.md-tag-blur, .md-tag-psw');
    if (el) {
      e.preventDefault();
      if (el.classList.contains('md-tag-blur')) {
        el.classList.toggle('md-tag-blur--revealed');
      } else {
        el.classList.toggle('md-tag-psw--revealed');
      }
      return;
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const el = closest(e.target, '.md-tag-blur, .md-tag-psw');
      if (el) {
        e.preventDefault();
        if (el.classList.contains('md-tag-blur')) {
          el.classList.toggle('md-tag-blur--revealed');
        } else {
          el.classList.toggle('md-tag-psw--revealed');
        }
      }
    }
  });
}

function initAsciinema() {
  // Lazy-load asciinema player and initialize with AsciinemaPlayer.create()
  const containers = document.querySelectorAll('.md-asciinema-container[data-src]');
  if (!containers.length) {return;}

  let scriptLoaded = false;
  const pendingPlayers = [];

  function createPlayer(el) {
    const src = el.getAttribute('data-src');
    const cols = parseInt(el.getAttribute('data-cols') || '80', 10);
    const rows = parseInt(el.getAttribute('data-rows') || '24', 10);
    const hasPreload = el.hasAttribute('data-preload');
    if (typeof AsciinemaPlayer !== 'undefined') {
      // Clear container before mounting — AsciinemaPlayer.create() appends its
      // UI into the element, so any pre-existing content would show as a
      // duplicate frame around the player.
      el.textContent = '';
      AsciinemaPlayer.create(src, el, {
        cols: cols,
        rows: rows,
        preload: hasPreload,
        autoPlay: false,
        fit: 'width',
        terminalFontSize: '14px',
        terminalFontFamily: 'var(--font-mono, monospace)',
        theme: 'auto/asciinema',
      });
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {continue;}
        const el = entry.target;
        observer.unobserve(el);

        if (!scriptLoaded) {
          scriptLoaded = true;
          // Load CSS first
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.min.css';
          document.head.appendChild(css);
          // Then load JS
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.min.js';
          script.async = true;
          script.onload = () => {
            // Initialize all pending containers
            for (const p of pendingPlayers) {
              createPlayer(p);
            }
            pendingPlayers.length = 0;
          };
          script.onerror = () => {
            console.warn('[directive] Failed to load asciinema-player script');
          };
          document.head.appendChild(script);
        }

        if (typeof AsciinemaPlayer !== 'undefined') {
          createPlayer(el);
        } else {
          pendingPlayers.push(el);
        }
      }
    },
    { rootMargin: '200px' },
  );

  containers.forEach((el) => observer.observe(el));
}

function initGallery() {
  let overlay = null;

  document.addEventListener('click', (e) => {
    const img = closest(e.target, '.md-gallery-cell img');
    if (!img) {
      // Close overlay if clicking outside the image
      if (overlay && e.target === overlay) {
        closeOverlay();
      }
      return;
    }

    e.preventDefault();
    overlay = document.createElement('div');
    overlay.className = 'md-gallery-overlay';
    overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
    overlay.addEventListener('click', closeOverlay);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('md-gallery-overlay--visible'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay) {
      closeOverlay();
    }
  });

  function closeOverlay() {
    if (!overlay) {return;}
    overlay.classList.remove('md-gallery-overlay--visible');
    setTimeout(() => {
      overlay.remove();
      overlay = null;
    }, 300);
  }
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
  initGallery();
  initVideo();
  initFoldersAccordion();
  initCodeTree();
  initAnnotation();
}

/**
 * Re-initialize directives that need per-page setup after Swup transitions.
 * Delegated handlers (tabs, copy, blur, gallery, video) survive navigation,
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
  // Click file in sidebar to switch code panel
  // Folders use native <details>/<summary> — no JS handler needed for toggle
  document.addEventListener('click', (e) => {
    const fileInfo = closest(e.target, '.md-code-tree-sidebar .vp-file-tree-info.file');
    if (!fileInfo) {return;}

    const ctId = fileInfo.dataset.ctId;
    const ctIndex = fileInfo.dataset.ctIndex;
    if (!ctId || ctIndex === undefined) {return;}

    const container = document.getElementById(ctId);
    if (!container) {return;}

    // Deactivate all files and panels
    container.querySelectorAll('.md-code-tree-file-active').forEach((f) => {
      f.classList.remove('md-code-tree-file-active');
    });
    container.querySelectorAll('.md-code-tree-panel').forEach((p) => {
      p.classList.remove('md-code-tree-panel-active');
    });

    // Activate clicked file and its panel
    fileInfo.classList.add('md-code-tree-file-active');
    const panel = container.querySelector(`#${ctId}-panel-${ctIndex}`);
    if (panel) {
      panel.classList.add('md-code-tree-panel-active');
    }
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
