/**
 * asset-swapper.js
 * --------------------------------------------------------------
 * Dev-only tool. Lets non-dev team members swap images/videos by
 * clicking placeholders in the browser. Files download to
 * ~/Downloads/ with an encoded filename. A developer (or Claude)
 * then moves them into the right paths.
 *
 * Usage:
 *   1. Add this script to any page:
 *        <script src="/js/asset-swapper.js" defer></script>
 *   2. Mark swappable elements with `data-asset`:
 *        <img data-asset="images/hero.jpg" src="...">
 *        <video data-asset="videos/00.mp4">...</video>
 *   3. Open the site on localhost. Click any marked element.
 *   4. Pick a new file. It downloads as
 *        __SWAP__images__hero.jpg
 *   5. Tell your dev: "swap done" — they move files from
 *      Downloads into the right paths.
 *
 * The script ONLY runs on localhost / 127.0.0.1 / file:// — it is
 * a no-op in production.
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // ---- Guard: dev only -----------------------------------------
  var host = location.hostname;
  var isDev =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||                 // file://
    host.endsWith('.local');
  if (!isDev) return;

  // ---- Config --------------------------------------------------
  var PREFIX = '__SWAP__';         // download filename prefix
  var SEP = '__';                  // path-separator replacement
  var STORAGE_KEY = 'asset-swapper:log';
  var EDIT_KEY = 'asset-swapper:edit';

  // ---- Utilities -----------------------------------------------
  function encodePath(assetPath) {
    // "images/hero.jpg" -> "__SWAP__images__hero.jpg"
    return PREFIX + assetPath.replace(/^\/+/, '').replace(/\//g, SEP);
  }

  function getExt(name) {
    var m = /\.([a-z0-9]+)$/i.exec(name);
    return m ? m[1].toLowerCase() : '';
  }

  function mediaType(ext) {
    if (/^(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(ext)) return 'image';
    if (/^(mp4|webm|mov|m4v|ogv)$/i.test(ext)) return 'video';
    return null;
  }

  function swapExt(path, newExt) {
    if (!newExt) return path;
    if (/\.[a-z0-9]+$/i.test(path)) return path.replace(/\.[a-z0-9]+$/i, '.' + newExt);
    return path + '.' + newExt;
  }

  function readLog() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }
  function writeLog(entries) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
    catch (_) {}
  }
  function pushLog(entry) {
    var log = readLog();
    // Dedupe by target — keep only the latest swap per asset path
    log = log.filter(function (e) { return e.target !== entry.target; });
    log.push(entry);
    writeLog(log);
    renderToolbar();
  }
  function clearLog() {
    writeLog([]);
    renderToolbar();
  }

  function restoreAll() {
    // Restore <img>, <video>, <source> originals
    var els = document.querySelectorAll('[data-as-original]');
    els.forEach(function (el) {
      var orig = el.getAttribute('data-as-original');
      el.removeAttribute('data-as-original');
      if (el.tagName === 'IMG' || el.tagName === 'SOURCE' || el.tagName === 'VIDEO') {
        if (orig) el.src = orig; else el.removeAttribute('src');
        if (el.tagName === 'SOURCE') {
          var v = el.closest('video');
          if (v) v.load();
        } else if (el.tagName === 'VIDEO') {
          el.load();
        }
      }
    });
    // Restore background-image originals
    var bgs = document.querySelectorAll('[data-as-original-bg]');
    bgs.forEach(function (el) {
      var orig = el.getAttribute('data-as-original-bg');
      el.removeAttribute('data-as-original-bg');
      el.style.backgroundImage = orig || '';
      el.classList.remove('is-filled');
    });
    // Reload <video> elements that contain restored sources
    var vids = document.querySelectorAll('video');
    vids.forEach(function (v) { try { v.load(); } catch (_) {} });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---- File picker ---------------------------------------------
  function pickFile(accept) {
    return new Promise(function (resolve) {
      var input = document.createElement('input');
      input.type = 'file';
      if (accept) input.accept = accept;
      input.style.display = 'none';
      input.addEventListener('change', function () {
        resolve(input.files && input.files[0] ? input.files[0] : null);
      });
      document.body.appendChild(input);
      input.click();
      // input remains in DOM until garbage collection — safe enough
    });
  }

  // ---- Swap action ---------------------------------------------
  async function swap(el) {
    var assetPath = el.getAttribute('data-asset');
    if (!assetPath) return;

    // Always allow both media types — Claude handles HTML/CSS rewrite on commit
    var file = await pickFile('image/*,video/*');
    if (!file) return;

    var targetExt = getExt(assetPath);
    var pickedExt = getExt(file.name);
    var targetType = mediaType(targetExt);
    var pickedType = mediaType(pickedExt);
    var typeChange = targetType && pickedType && targetType !== pickedType;

    if (typeChange) {
      var ok = confirm(
        'Media-type change: ' + targetType + ' → ' + pickedType + '\n\n' +
        'Target: ' + assetPath + '\n' +
        'Picked: .' + pickedExt + ' (' + file.name + ')\n\n' +
        'Claude will rewrite the HTML element and move the file to the right folder ' +
        'on commit. Live preview is disabled for this swap.\n\nProceed?'
      );
      if (!ok) return;
    }

    // Use picked extension in the encoded filename so Claude knows the new format.
    // Folder stays as-is in data-asset; Claude reroutes (images/ ↔ videos/) on commit.
    var newPath = pickedExt ? swapExt(assetPath, pickedExt) : assetPath;
    var downloadName = encodePath(newPath);
    downloadBlob(file, downloadName);

    pushLog({
      target: 'public/' + newPath,
      originalTarget: 'public/' + assetPath,
      mediaTypeChange: typeChange ? targetType + '->' + pickedType : null,
      source: file.name,
      size: file.size,
      type: file.type,
      downloadedAs: downloadName,
      at: new Date().toISOString()
    });

    // Live-preview only when media type is unchanged (cross-type preview is
    // intentionally skipped — element tag would need to change, complicating restore)
    if (!typeChange) {
      try {
        var blobUrl = URL.createObjectURL(file);
        if (el.tagName === 'IMG') {
          if (!el.hasAttribute('data-as-original')) el.setAttribute('data-as-original', el.getAttribute('src') || '');
          el.src = blobUrl;
        } else if (el.tagName === 'VIDEO') {
          var src = el.querySelector('source');
          if (src) {
            if (!src.hasAttribute('data-as-original')) src.setAttribute('data-as-original', src.getAttribute('src') || '');
            src.src = blobUrl;
          } else {
            if (!el.hasAttribute('data-as-original')) el.setAttribute('data-as-original', el.getAttribute('src') || '');
            el.src = blobUrl;
          }
          el.load();
        } else if (el.tagName === 'SOURCE') {
          if (!el.hasAttribute('data-as-original')) el.setAttribute('data-as-original', el.getAttribute('src') || '');
          el.src = blobUrl;
          var v = el.closest('video');
          if (v) v.load();
        } else {
          if (!el.hasAttribute('data-as-original-bg')) el.setAttribute('data-as-original-bg', el.style.backgroundImage || '');
          el.style.backgroundImage = 'url(' + blobUrl + ')';
          el.classList.add('is-filled');
        }
      } catch (_) {}
    }

    flash(el);
  }

  function flash(el) {
    var prev = el.style.outline;
    el.style.outline = '3px solid #00d26a';
    setTimeout(function () { el.style.outline = prev; }, 600);
  }

  // ---- Prompt resolver -----------------------------------------
  // Find the image-gen prompt for a given [data-asset] element.
  // Tries (in order): data-prompt attr → descendant .placeholder__prompt pre →
  // ancestor figure's .placeholder__prompt pre → <template data-prompt-for="<path>">
  function resolvePrompt(el) {
    if (!el) return null;
    var direct = el.getAttribute && el.getAttribute('data-prompt');
    if (direct && direct.trim()) return direct.trim();
    if (el.querySelector) {
      var pre = el.querySelector('.placeholder__prompt pre');
      if (pre && pre.textContent.trim()) return pre.textContent.trim();
    }
    if (el.closest) {
      var fig = el.closest('figure, .image-placeholder, .video-placeholder');
      if (fig) {
        var pre2 = fig.querySelector('.placeholder__prompt pre');
        if (pre2 && pre2.textContent.trim()) return pre2.textContent.trim();
      }
    }
    var path = el.getAttribute && el.getAttribute('data-asset');
    if (path) {
      try {
        var tpl = document.querySelector('template[data-prompt-for="' + path.replace(/"/g, '\\"') + '"]');
        if (tpl) {
          var content = (tpl.innerHTML || '').trim();
          if (content) return content;
        }
      } catch (_) {}
    }
    return null;
  }

  // ---- Cleanup any legacy injected buttons ---------------------
  // Earlier versions of this script injected a "Copy prompt" button into
  // placeholder figures, which polluted host layout. Edit:ON overlay buttons
  // are now the only mechanism (zero layout impact).
  function cleanupLegacyInjections() {
    document.querySelectorAll('[data-as-copy-prompt]').forEach(function (b) {
      b.remove();
    });
  }

  // ---- Hover hint + click handler ------------------------------
  function isSwappable(el) {
    return el && el.nodeType === 1 && el.hasAttribute('data-asset');
  }

  function onClick(e) {
    if (!isEditMode()) return;
    // In edit mode, route clicks through overlay hits → original element
    var hit = e.target.closest('[data-as-overlay-for]');
    if (hit) {
      e.preventDefault();
      e.stopPropagation();
      var sel = hit.getAttribute('data-as-overlay-for');
      var target = document.querySelector('[data-asset="' + sel + '"]');
      if (!target) return;
      var actBtn = e.target.closest('[data-as-act]');
      var act = actBtn ? actBtn.getAttribute('data-as-act') : 'swap';
      if (act === 'copy-prompt') {
        var text = resolvePrompt(target);
        if (!text) return;
        navigator.clipboard.writeText(text).then(function () {
          if (!actBtn) return;
          var orig = actBtn.textContent;
          actBtn.textContent = '✓ Copied';
          setTimeout(function () { actBtn.textContent = orig; }, 1200);
        }).catch(function () {
          if (actBtn) actBtn.textContent = '✗ Failed';
        });
      } else {
        swap(target);
      }
      return;
    }
    var el = e.target.closest('[data-asset]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    swap(el);
  }

  // ---- Edit mode -----------------------------------------------
  function isEditMode() {
    try { return localStorage.getItem(EDIT_KEY) === '1'; } catch (_) { return false; }
  }
  function setEditMode(on) {
    try { localStorage.setItem(EDIT_KEY, on ? '1' : '0'); } catch (_) {}
    applyEditMode();
  }

  function applyEditMode() {
    var on = isEditMode();
    document.documentElement.classList.toggle('as-edit', on);
    // Remove old overlays
    var olds = document.querySelectorAll('[data-as-overlay-for]');
    for (var i = 0; i < olds.length; i++) olds[i].remove();
    if (!on) return;
    // Place a clickable overlay on top of each [data-asset]
    var els = document.querySelectorAll('[data-asset]');
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      var ov = document.createElement('div');
      ov.className = 'as-overlay';
      ov.setAttribute('data-as-overlay-for', el.getAttribute('data-asset'));
      ov.style.cssText =
        'position:absolute;left:' + (rect.left + window.scrollX) + 'px;' +
        'top:' + (rect.top + window.scrollY) + 'px;' +
        'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
        'z-index:2147483645;cursor:pointer;' +
        'outline:2px dashed #2962ff;outline-offset:-2px;' +
        'background:rgba(41,98,255,.06);' +
        'display:flex;align-items:center;justify-content:center;' +
        'font:600 13px/1 -apple-system,BlinkMacSystemFont,sans-serif;color:#2962ff;' +
        'pointer-events:auto';
      var path = el.getAttribute('data-asset');
      var hasPrompt = !!resolvePrompt(el);
      var btnStyle =
        'background:#fff;padding:6px 10px;border-radius:6px;' +
        'box-shadow:0 2px 8px rgba(0,0,0,.15);border:1px solid #2962ff;' +
        'font:inherit;color:#2962ff;cursor:pointer;white-space:nowrap';
      var html = '<div class="as-overlay-actions" style="display:flex;flex-direction:column;gap:6px;align-items:center;pointer-events:none">';
      html += '<button type="button" data-as-act="swap" style="' + btnStyle + ';pointer-events:auto">📷 Swap ' + path + '</button>';
      if (hasPrompt) {
        html += '<button type="button" data-as-act="copy-prompt" style="' + btnStyle + ';pointer-events:auto">📋 Copy prompt</button>';
      }
      html += '</div>';
      ov.innerHTML = html;
      document.body.appendChild(ov);
    });
  }

  // Keep overlays aligned on scroll/resize
  var rafId = null;
  function scheduleRealign() {
    if (!isEditMode()) return;
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      applyEditMode();
    });
  }

  // ---- Toolbar -------------------------------------------------
  var toolbarEl = null;
  function renderToolbar() {
    if (!toolbarEl) return;
    var log = readLog();
    var count = log.length;
    toolbarEl.querySelector('[data-count]').textContent = String(count);
    toolbarEl.querySelector('[data-actions]').style.display =
      count > 0 ? 'flex' : 'none';
  }

  function buildToolbar() {
    var bar = document.createElement('div');
    bar.id = 'asset-swapper-toolbar';
    bar.innerHTML =
      '<div class="as-pill">' +
        '<button data-act="toggle" class="as-toggle">Edit: OFF</button>' +
        '<span class="as-sep"></span>' +
        '<span><b data-count>0</b> pending</span>' +
        '<div data-actions style="display:none;gap:6px">' +
          '<button data-act="copy" title="Copy message for your dev">Copy</button>' +
          '<button data-act="export" title="Download swap log JSON">Log</button>' +
          '<button data-act="clear" title="Clear pending list">Clear</button>' +
        '</div>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '#asset-swapper-toolbar{position:fixed;right:12px;bottom:12px;z-index:2147483646;' +
        'font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#0a0a0a}' +
      '#asset-swapper-toolbar .as-pill{display:flex;align-items:center;gap:8px;' +
        'background:rgba(255,255,255,.92);backdrop-filter:blur(8px);' +
        'border:1px solid rgba(0,0,0,.08);border-radius:999px;padding:6px 12px;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.12)}' +
      '#asset-swapper-toolbar .as-sep{width:1px;height:14px;background:rgba(0,0,0,.15)}' +
      '#asset-swapper-toolbar button{font:inherit;padding:3px 8px;border-radius:6px;' +
        'border:1px solid rgba(0,0,0,.12);background:#fff;cursor:pointer}' +
      '#asset-swapper-toolbar button:hover{background:#f3f3f3}' +
      '#asset-swapper-toolbar .as-toggle{font-weight:600}' +
      'html.as-edit #asset-swapper-toolbar .as-toggle{background:#2962ff;color:#fff;border-color:#2962ff}';

    document.head.appendChild(style);
    document.body.appendChild(bar);
    toolbarEl = bar;

    bar.addEventListener('click', function (e) {
      var act = e.target.getAttribute('data-act');
      if (act === 'toggle') {
        var next = !isEditMode();
        setEditMode(next);
        e.target.textContent = 'Edit: ' + (next ? 'ON' : 'OFF');
      } else if (act === 'clear') {
        if (confirm(
          'Reset all pending swaps?\n\n' +
          '• Pending list will be cleared\n' +
          '• Original images/videos will be restored on this page\n' +
          '• Files already in ~/Downloads/ will NOT be deleted (delete manually if unwanted)'
        )) {
          restoreAll();
          clearLog();
          if (isEditMode()) applyEditMode(); // re-align overlays after restore
        }
      } else if (act === 'export') {
        var blob = new Blob([JSON.stringify(readLog(), null, 2)], { type: 'application/json' });
        downloadBlob(blob, 'swap-log.json');
      } else if (act === 'copy') {
        var log = readLog();
        if (!log.length) return;
        var lines = log.map(function (e) {
          return '- ' + e.downloadedAs + '  →  ' + e.target;
        }).join('\n');
        var msg =
          'Swap done. Please move these files from ~/Downloads/ into place:\n\n' +
          lines;
        navigator.clipboard.writeText(msg).then(function () {
          var btn = bar.querySelector('[data-act="copy"]');
          var orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = orig; }, 1200);
        });
      }
    });

    // Reflect saved edit-mode state in toggle label
    bar.querySelector('[data-act="toggle"]').textContent =
      'Edit: ' + (isEditMode() ? 'ON' : 'OFF');

    renderToolbar();
  }

  // ---- Init ----------------------------------------------------
  function init() {
    document.addEventListener('click', onClick, true);
    buildToolbar();
    cleanupLegacyInjections();
    applyEditMode();
    window.addEventListener('scroll', scheduleRealign, { passive: true });
    window.addEventListener('resize', scheduleRealign);
    // eslint-disable-next-line no-console
    console.info(
      '%casset-swapper%c active — click any [data-asset] element to swap.',
      'background:#2962ff;color:#fff;padding:2px 6px;border-radius:3px',
      'color:inherit'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
