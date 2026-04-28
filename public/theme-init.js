(function () {
  try {
    var t = localStorage.getItem("theme");
    // Default = light (warm trattoria); override to dark on user choice.
    if (t === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch {
    /* no-op: localStorage unavailable (e.g. private browsing, disabled) */
  }
})();
