(function () {
  function getConfig() {
    return window.LANDING_CONFIG || {};
  }

  function getRedirectUrl() {
    var cfg = getConfig();
    return String(cfg.redirectUrl || "#").trim();
  }

  function shouldRedirectUrl(url) {
    return url && url !== "#" && !/^REPLACE/i.test(url);
  }

  function goRedirect(reason) {
    var cfg = getConfig();
    var url = getRedirectUrl();
    if (!shouldRedirectUrl(url)) {
      console.info("Redirect URL is not configured yet.", reason || "");
      return false;
    }
    if (cfg.openInNewTab) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    return true;
  }

  window.LandingRedirect = { go: goRedirect, url: getRedirectUrl };

  var lockerFunctionNames = [
    "_TG", "_ET", "_Kx", "_xA", "_Tu", "_nS", "_Wi", "_qW", "_Xy", "_eN",
    "call_locker", "openLocker", "openOffer", "openOfferwall", "og_load"
  ];

  function wrapFunction(name) {
    var original = window[name];
    if (original && original.__landingRedirectWrapped) return;
    var wrapped = function () {
      var result;
      if (typeof original === "function") {
        try { result = original.apply(this, arguments); } catch (error) { console.warn(error); }
      }
      window.setTimeout(function () { goRedirect(name); }, Number(getConfig().redirectDelayMs || 700));
      return result;
    };
    wrapped.__landingRedirectWrapped = true;
    window[name] = wrapped;
  }

  function wrapKnownFunctions() {
    lockerFunctionNames.forEach(wrapFunction);
    Object.keys(window).forEach(function (key) {
      if (/^openOfferwall/i.test(key)) wrapFunction(key);
    });
  }

  function isFinalAction(text, onclick) {
    var value = ((text || "") + " " + (onclick || "")).toLowerCase();
    if (/(_tg|_et|_kx|_xa|_tu|_ns|_wi|_qw|_xy|_en|openofferwall|landingredirect)/i.test(value)) return true;
    if (/(verify|claim now|claim reward|unlock|redeem|collect|download|get badge|earn your reward|earen your reward|final step)/i.test(value)) return true;
    if (/^(next|back|search|start|restock|x)$/i.test((text || "").trim())) return false;
    return false;
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("button, a, .btn, .button, [role='button'], [onclick]");
    if (!target || target.dataset.redirectHandled === "1") return;
    var text = (target.innerText || target.textContent || "").replace(/\s+/g, " ").trim();
    var onclick = target.getAttribute("onclick") || "";
    if (!isFinalAction(text, onclick)) return;
    target.dataset.redirectHandled = "1";
    window.setTimeout(function () {
      goRedirect(text || onclick || "click");
      target.dataset.redirectHandled = "";
    }, Number(getConfig().redirectDelayMs || 700));
  }, true);

  wrapKnownFunctions();
  window.setTimeout(wrapKnownFunctions, 1200);
  window.setTimeout(wrapKnownFunctions, 3000);
})();

(function () {
  function hideBlockingLoaders() {
    var selectors = [".loading", ".preloader", ".loader-wrapper", "#loader-wrapper"];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.closest && el.closest("button, .btn")) return;
        el.style.display = "none";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hideBlockingLoaders);
  else hideBlockingLoaders();
  window.addEventListener("load", hideBlockingLoaders);
  window.setTimeout(hideBlockingLoaders, 900);
  window.setTimeout(hideBlockingLoaders, 2200);
})();
(function () {
  var fallbackSrc = "assets/local-images/fallback-image.svg";

  function applyImageFallbacks() {
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.getAttribute("src")) img.setAttribute("src", fallbackSrc);
      if (img.dataset.fallbackReady === "1") return;
      img.dataset.fallbackReady = "1";
      img.addEventListener("error", function () {
        if (img.dataset.fallbackApplied === "1") return;
        img.dataset.fallbackApplied = "1";
        img.setAttribute("src", fallbackSrc);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyImageFallbacks);
  else applyImageFallbacks();
  window.addEventListener("load", applyImageFallbacks);
  window.setTimeout(applyImageFallbacks, 1200);
  window.setTimeout(applyImageFallbacks, 3000);
})();

