(function () {
  var openButton = document.getElementById("open-claim");
  var closeButton = document.getElementById("close-claim");
  var form = document.getElementById("claim-form");
  var username = document.getElementById("username");
  var statusSpan = document.getElementById("claim-status");
  var finalButton = form.querySelector(".final-button");
  var countdownEls = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function openModal() {
    form.hidden = false;
    statusSpan.textContent = "";
    finalButton.disabled = false;
    finalButton.textContent = "Claim reward";
    setTimeout(function () {
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
    if (cfg.openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = username.value.trim().replace(/^@+/, "");
    if (value.length < 3) {
      username.focus();
      return;
    }
    username.value = value;
    finalButton.disabled = true;
    finalButton.textContent = "Verifying...";
    statusSpan.textContent = "Preparing final link for " + value + ".";
    setTimeout(goRedirect, 700);
  });

  var remaining = 1 * 86400 + 12 * 3600 + 17 * 60 + 56;
  setInterval(function () {
    remaining = Math.max(0, remaining - 1);
    var days = Math.floor(remaining / 86400);
    var hours = Math.floor((remaining % 86400) / 3600);
    var minutes = Math.floor((remaining % 3600) / 60);
    var seconds = remaining % 60;
    countdownEls.days.textContent = String(days);
    countdownEls.hours.textContent = String(hours);
    countdownEls.minutes.textContent = String(minutes);
    countdownEls.seconds.textContent = String(seconds).padStart(2, "0");
  }, 1000);
})();
