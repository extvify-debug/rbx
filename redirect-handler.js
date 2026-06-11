(function () {
  function getConfig() { return window.LANDING_CONFIG || {}; }

  function getRedirectUrl() {
    return String(getConfig().redirectUrl || "#").trim();
  }

  function shouldRedirect(url) {
    return url && url !== "#" && !/^REPLACE/i.test(url);
  }

  function goRedirect(reason) {
    var url = getRedirectUrl();
    if (!shouldRedirect(url)) return false;
    killLockers();
    var cfg = getConfig();
    if (cfg.openInNewTab) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    return true;
  }

  window.LandingRedirect = { go: goRedirect, url: getRedirectUrl };

  /* ── Kill all locker/popup DOM overlays ── */
  function killLockers() {
    var overlaySelectors = [
      "#locker", "#locker-overlay", "#locker-container", "#locker-wrapper",
      ".locker", ".locker-overlay", ".locker-wrapper", ".locker-container",
      "#taprain-locker", "#tr-locker", ".taprain", ".tr-locker",
      "#offer-wall", ".offer-wall", "#offerwall", ".offerwall",
      "#cpa-overlay", ".cpa-overlay", "#cpa-locker", ".cpa-locker",
      "[id*='locker']", "[class*='locker']", "[id*='offerwall']",
      ".modal-backdrop", "#overlay", ".overlay-bg"
    ];
    overlaySelectors.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          el.style.display = "none";
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.remove();
        });
      } catch (e) {}
    });
    document.body && (document.body.style.overflow = "");
    document.documentElement && (document.documentElement.style.overflow = "");
  }

  /* ── Neutralize locker globals so they can't rebuild overlays ── */
  var lockerNames = [
    "_TG", "_ET", "_Kx", "_xA", "_Tu", "_nS", "_Wi", "_qW", "_Xy", "_eN",
    "call_locker", "openLocker", "openOffer", "openOfferwall", "og_load",
    "initLocker", "startLocker", "loadLocker", "showLocker",
    "TapRain", "taprain", "ContentLocker", "contentLocker"
  ];

  function neutralizeGlobal(name) {
    try {
      Object.defineProperty(window, name, {
        get: function () { return function () { goRedirect(name); return null; }; },
        set: function () {},
        configurable: false
      });
    } catch (e) {}
  }

  lockerNames.forEach(neutralizeGlobal);

  /* Also scan for any dynamic keys that look like offer/locker funcs */
  function neutralizeDynamic() {
    Object.keys(window).forEach(function (key) {
      if (/offerwall|locker|taprain/i.test(key) && typeof window[key] === "function") {
        neutralizeGlobal(key);
      }
    });
  }

  /* ── Block offer-URL window.open calls ── */
  function isOfferUrl(url) {
    var v = String(url || "").toLowerCase();
    if (!/^https?:\/\//i.test(v)) return false;
    if (/roblox\.com\/users\/profile/i.test(v)) return false;
    return /(offer|locker|survey|reward|rainawards|v8trck|track|feed\.php|cloudfront\.net\/public\/offers)/i.test(v);
  }

  var _origOpen = window.open;
  window.open = function (url) {
    if (isOfferUrl(url)) { goRedirect("window.open"); return null; }
    return _origOpen.apply(window, arguments);
  };

  /* ── Intercept final-action button clicks ── */
  function isFinalAction(text, onclick) {
    var v = ((text || "") + " " + (onclick || "")).toLowerCase();
    if (/(_tg|_et|_kx|_xa|_tu|_ns|_wi|_qw|_xy|_en|openofferwall|landingredirect)/i.test(v)) return true;
    if (/(verify|claim now|claim reward|unlock|redeem|collect|download|get badge|earn your reward|final step)/i.test(v)) return true;
    if (/^(next|back|search|start|restock|x)$/i.test((text || "").trim())) return false;
    return false;
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, a, .btn, .button, [role='button'], [onclick]");
    if (!t || t.dataset.rhDone === "1") return;
    var text = (t.innerText || t.textContent || "").replace(/\s+/g, " ").trim();
    var onclick = t.getAttribute("onclick") || "";
    var href = t.getAttribute("href") || "";
    if (!isFinalAction(text, onclick) && !isOfferUrl(href)) return;
    if (isOfferUrl(href)) ev.preventDefault();
    t.dataset.rhDone = "1";
    goRedirect(text || onclick || "click");
    setTimeout(function () { t.dataset.rhDone = ""; }, 2000);
  }, true);

  /* ── Hide non-button loaders on load ── */
  function hideLoaders() {
    [".loading", ".preloader", ".loader-wrapper", "#loader-wrapper"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest && el.closest("button, .btn")) return;
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      });
    });
  }

  /* ── Image fallbacks ── */
  var fallbackSrc = "assets/local-images/fallback-image.svg";
  function applyFallbacks() {
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.getAttribute("src")) img.setAttribute("src", fallbackSrc);
      if (img.dataset.fbReady) return;
      img.dataset.fbReady = "1";
      img.addEventListener("error", function () {
        if (img.dataset.fbApplied) return;
        img.dataset.fbApplied = "1";
        img.setAttribute("src", fallbackSrc);
      });
    });
  }

  /* ── Init ── */
  function init() {
    killLockers();
    neutralizeDynamic();
    hideLoaders();
    applyFallbacks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("load", function () { init(); killLockers(); });
  setTimeout(function () { init(); killLockers(); }, 500);
  setTimeout(function () { neutralizeDynamic(); killLockers(); }, 1500);
})();
