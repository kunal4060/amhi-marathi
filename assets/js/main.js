/* Amhi Marathi Association — site interactions.
   Dependency-free. Map geometry: geoBoundaries gbOpen ADM2 (2021, LGD India), ODbL 1.0. */
(function () {
  "use strict";

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById("siteNav");
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") navLinks.classList.remove("open");
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- hero Maharashtra silhouette ---------- */
  var heroSvg = document.getElementById("heroSilhouette");
  if (heroSvg && typeof DISTRICTS !== "undefined") {
    var hns = "http://www.w3.org/2000/svg";
    DISTRICTS.forEach(function (d) {
      var p = document.createElementNS(hns, "path");
      p.setAttribute("d", d.d);
      p.setAttribute("fill", "#E8720C");
      p.setAttribute("fill-opacity", "0.10");
      p.setAttribute("stroke", "#B4500A");
      p.setAttribute("stroke-opacity", "0.18");
      p.setAttribute("stroke-width", "1.5");
      heroSvg.appendChild(p);
    });
  }

  /* ---------- district map ---------- */
  var svg = document.getElementById("districtMap");
  var tip = document.getElementById("mapTip");
  var mapWrap = document.getElementById("mapWrap");
  if (!svg || typeof DISTRICTS === "undefined") return;

  var counts = (typeof STUDENT_DATA !== "undefined") ? STUDENT_DATA : {};
  var vals = DISTRICTS.map(function (d) { return counts[d.name] || 0; });
  var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);

  // choropleth stops: ivory-cream -> kesari -> bhagwa -> maroon
  var STOPS = [
    [0.0, [250, 240, 220]],
    [0.35, [232, 114, 12]],
    [0.7, [180, 80, 10]],
    [1.0, [110, 29, 29]]
  ];
  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function colorFor(v) {
    var t = (mx === mn) ? 0 : (v - mn) / (mx - mn);
    t = Math.pow(t, 0.65);
    for (var i = 1; i < STOPS.length; i++) {
      if (t <= STOPS[i][0]) {
        var t0 = STOPS[i - 1][0], c0 = STOPS[i - 1][1];
        var t1 = STOPS[i][0], c1 = STOPS[i][1];
        var k = (t - t0) / (t1 - t0 || 1);
        return "rgb(" + lerp(c0[0], c1[0], k) + "," + lerp(c0[1], c1[1], k) + "," + lerp(c0[2], c1[2], k) + ")";
      }
    }
    var last = STOPS[STOPS.length - 1][1];
    return "rgb(" + last[0] + "," + last[1] + "," + last[2] + ")";
  }

  var NS = "http://www.w3.org/2000/svg";
  function showTip(name, x, y) {
    var c = counts[name] || 0;
    tip.querySelector(".tip-district").textContent = name;
    tip.querySelector(".tip-count").innerHTML = "<b>" + c + "</b> students";
    tip.style.opacity = "1";
    var r = mapWrap.getBoundingClientRect();
    tip.style.left = Math.min(x + 14, r.width - 180) + "px";
    tip.style.top = Math.max(y - 12, 8) + "px";
  }
  function hideTip() { tip.style.opacity = "0"; }

  var total = 0;
  DISTRICTS.forEach(function (d) {
    total += (counts[d.name] || 0);
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", d.d);
    p.setAttribute("class", "district");
    p.style.fill = colorFor(counts[d.name] || 0);
    p.addEventListener("mousemove", function (e) {
      var r = mapWrap.getBoundingClientRect();
      showTip(d.name, e.clientX - r.left, e.clientY - r.top);
    });
    p.addEventListener("mouseleave", hideTip);
    p.addEventListener("click", function (e) {
      var r = mapWrap.getBoundingClientRect();
      showTip(d.name, e.clientX - r.left, e.clientY - r.top);
      clearTimeout(window.__mapTipT);
      window.__mapTipT = setTimeout(hideTip, 2600);
    });
    svg.appendChild(p);
  });

  var totalEl = document.getElementById("studentTotal");
  if (totalEl) totalEl.textContent = total.toLocaleString("en-IN");

  // legend swatches
  var legend = document.getElementById("mapLegend");
  if (legend) {
    for (var i = 0; i < 7; i++) {
      var s = document.createElement("span");
      s.className = "swatch";
      s.style.background = colorFor(mn + (mx - mn) * (i / 6));
      legend.appendChild(s);
    }
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
