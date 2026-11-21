(function () {
  // Runs before first paint (anti-flash). Order of precedence:
  //   1. the visitor's own choice via the toggle (localStorage "theme"),
  //   2. otherwise the device setting (prefers-color-scheme),
  //   3. otherwise light.
  // Privacy: the device setting is read in the browser only. Nothing is
  // sent anywhere, and nothing is stored unless the visitor uses the toggle.
  var root = document.documentElement;
  var mq = null;
  try {
    mq = window.matchMedia("(prefers-color-scheme: dark)");
  } catch (e) {
    /* matchMedia unavailable: light default applies */
  }
  function stored() {
    try {
      var t = localStorage.getItem("theme");
      return t === "dark" || t === "light" ? t : null;
    } catch (e) {
      return null; /* storage unavailable (private mode, disabled) */
    }
  }
  function apply() {
    root.setAttribute("data-theme", stored() || (mq && mq.matches ? "dark" : "light"));
  }
  apply();
  // Follow a device switch (e.g. automatic dark mode at sunset) while the
  // page is open, unless the visitor has chosen a theme themselves.
  if (mq) {
    var onChange = function () {
      if (!stored()) apply();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
