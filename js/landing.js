// Candy Store — landing "Noche": scroll transitions.
// Content is fully visible without this script; it only adds motion.
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Sticky nav gets a border once the page scrolls.
  var nav = document.querySelector(".nav");

  // Reveal on enter (fade + rise), once per element.
  var reveals = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce.matches) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Scroll-linked effects: product window straightens, statement lines light up.
  var win = document.querySelector(".window");
  var lines = document.querySelectorAll(".statement .line");
  var ticking = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    ticking = false;
    var vh = window.innerHeight || doc.clientHeight;
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    if (reduce.matches) return;

    if (win) {
      var top = win.getBoundingClientRect().top;
      win.style.setProperty("--p", clamp((vh - top) / (vh * 0.75)).toFixed(3));
    }
    lines.forEach(function (line) {
      var t = line.getBoundingClientRect().top;
      line.style.setProperty("--lit", clamp((vh * 0.8 - t) / (vh * 0.25)).toFixed(3));
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
