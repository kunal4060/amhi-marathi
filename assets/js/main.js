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
    var tw = tip.offsetWidth || 180;
    tip.style.left = Math.min(x + 14, Math.max(0, r.width - tw - 8)) + "px";
    tip.style.top = Math.max(y - 12, 8) + "px";
  }
  function hideTip() { tip.style.opacity = "0"; openDistrict = null; }
  var openDistrict = null;

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
    p.setAttribute("tabindex", "0");
    p.setAttribute("role", "img");
    p.setAttribute("aria-label", d.name + ", " + (counts[d.name] || 0) + " students");
    p.addEventListener("click", function (e) {
      if (openDistrict === d.name) { hideTip(); clearTimeout(window.__mapTipT); return; }
      openDistrict = d.name;
      var r = mapWrap.getBoundingClientRect();
      showTip(d.name, e.clientX - r.left, e.clientY - r.top);
      clearTimeout(window.__mapTipT);
      window.__mapTipT = setTimeout(hideTip, 2600);
    });
    p.addEventListener("focus", function () {
      openDistrict = d.name;
      var r = mapWrap.getBoundingClientRect();
      var b = p.getBoundingClientRect();
      showTip(d.name, b.left - r.left + b.width / 2, b.top - r.top + b.height / 2);
    });
    p.addEventListener("blur", hideTip);
    svg.appendChild(p);
  });

  var totalEl = document.getElementById("studentTotal");
  if (totalEl) totalEl.textContent = total.toLocaleString("en-IN");

  // legend swatches — NOTE: colors rescale to the data range (mn..mx). When the real
  // per-district counts land in data.js, the choropleth stretches to the new max automatically.

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

  /* ---------- aajcha shabd (word of the day) ---------- */
  var SHABD = [
    { w: "\u091D\u0941\u0902\u091C", t: "jhunj", m: "\u0927\u093E\u0921\u0938\u0940 \u0932\u0922\u093E", g: "a spirited fight", e: "\u0906\u092F\u0941\u0937\u094D\u092F \u0939\u0940 \u090F\u0915 \u091D\u0941\u0902\u091C \u0906\u0939\u0947." },
    { w: "\u092E\u093E\u0924\u0940", t: "m\u0101t\u012B", m: "\u092E\u093E\u092F\u092D\u0942\u092E\u0940", g: "one\u2019s native soil", e: "\u092E\u093E\u0924\u0940\u091A\u0940 \u0913\u0922 \u0915\u0927\u0940\u091A \u0938\u0902\u092A\u0924 \u0928\u093E\u0939\u0940." },
    { w: "\u0935\u093E\u0930\u0940", t: "v\u0101r\u012B", m: "\u092A\u0902\u0922\u0930\u092A\u0942\u0930\u091A\u0940 \u092A\u093E\u092F\u0940 \u092F\u093E\u0924\u094D\u0930\u093E", g: "the pilgrim march to Pandharpur", e: "\u0935\u093E\u0930\u0940 \u092E\u094D\u0939\u0923\u091C\u0947 \u092D\u0915\u094D\u0924\u0940\u091A\u093E \u092E\u0939\u093E\u0938\u094B\u0939\u0933\u093E." },
    { w: "\u0922\u094B\u0932", t: "\u1E0Dhol", m: "\u092E\u094B\u0920\u093E \u0922\u094B\u0932", g: "the big drum", e: "\u0922\u094B\u0932 \u0935\u093E\u091C\u0932\u093E \u0915\u0940 \u092A\u093E\u092F \u0906\u092A\u094B\u0906\u092A \u0925\u093F\u0930\u0915\u0924\u093E\u0924." },
    { w: "\u0905\u092D\u093F\u092E\u093E\u0928", t: "abhim\u0101n", m: "\u0917\u0930\u094D\u0935", g: "pride", e: "\u092E\u0930\u093E\u0920\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u091A\u093E \u0905\u092D\u093F\u092E\u093E\u0928 \u092C\u093E\u0933\u0917\u093E." },
    { w: "\u0938\u0923", t: "sa\u1E47", m: "\u0909\u0924\u094D\u0938\u0935", g: "festival", e: "\u0926\u093F\u0935\u093E\u0933\u0940 \u0939\u093E \u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093E\u091A\u093E \u092E\u094B\u0920\u093E \u0938\u0923." },
    { w: "\u091C\u0932\u094D\u0932\u094B\u0937", t: "jallo\u1E63", m: "\u0906\u0928\u0902\u0926\u094B\u0924\u094D\u0938\u0935", g: "jubilant celebration", e: "\u0935\u093F\u091C\u092F\u093E\u0928\u0902\u0924\u0930 \u0938\u0917\u0933\u0940\u0915\u0921\u0947 \u091C\u0932\u094D\u0932\u094B\u0937 \u091D\u093E\u0932\u093E." },
    { w: "\u0913\u0922", t: "o\u1E0Dh", m: "\u0924\u0933\u092E\u0933, \u0906\u0915\u0930\u094D\u0937\u0923", g: "deep longing", e: "\u0938\u0941\u091F\u094D\u091F\u0940\u0924 \u0918\u0930\u0940 \u091C\u093E\u0923\u094D\u092F\u093E\u091A\u0940 \u0913\u0922." },
    { w: "\u0917\u091C\u0930", t: "gajar", m: "\u091C\u092F\u0918\u094B\u0937", g: "thunderous chant", e: "\u0917\u0923\u092A\u0924\u0940 \u092C\u093E\u092A\u094D\u092A\u093E \u092E\u094B\u0930\u092F\u093E\u091A\u093E \u0917\u091C\u0930." },
    { w: "\u092A\u093E\u090A\u0932", t: "p\u0101\u016Bl", m: "\u092A\u093E\u092F\u0930\u0940", g: "a step forward", e: "\u092F\u0936\u093E\u0915\u0921\u0947 \u092A\u0939\u093F\u0932\u0902 \u092A\u093E\u090A\u0932 \u091F\u093E\u0915\u093E." },
    { w: "\u0935\u0938\u093E", t: "vas\u0101", m: "\u092A\u0930\u0902\u092A\u0930\u093E\u0917\u0924 \u0920\u0947\u0935\u093E", g: "inherited legacy", e: "\u0936\u093F\u0935\u0930\u093E\u092F\u093E\u0902\u091A\u093E \u0935\u0938\u093E \u0906\u092A\u0923 \u091A\u093E\u0932\u0935\u0942\u092F\u093E." },
    { w: "\u0927\u094D\u092F\u093E\u0938", t: "dhy\u0101s", m: "\u090F\u0915\u093E\u091A \u0927\u094D\u092F\u0947\u092F\u093E\u091A\u0940 \u0924\u0933\u092E\u0933", g: "single-minded pursuit", e: "\u0927\u094D\u092F\u093E\u0938 \u0918\u0947\u0924\u0932\u093E \u0915\u0940 \u092F\u0936 \u0926\u0942\u0930 \u0928\u0938\u0924\u0902." },
    { w: "\u091C\u093F\u0935\u094D\u0939\u093E\u0933\u093E", t: "jivh\u0101\u1E37\u0101", m: "\u092E\u0928\u093E\u092A\u093E\u0938\u0942\u0928\u091A\u0940 \u0906\u092A\u0941\u0932\u0915\u0940", g: "heartfelt warmth", e: "\u092E\u0930\u093E\u0920\u0940 \u092E\u093E\u0923\u0938\u093E\u0902\u0924\u0932\u093E \u091C\u093F\u0935\u094D\u0939\u093E\u0933\u093E \u0935\u0947\u0917\u0933\u093E\u091A." },
    { w: "\u092E\u093E\u092F", t: "m\u0101y", m: "\u0906\u0908, \u092E\u093E\u092F\u093E", g: "mother; affection", e: "\u092E\u093E\u092F \u092E\u0930\u093E\u0920\u0940 \u2014 \u0906\u092A\u0932\u0940 \u092D\u093E\u0937\u093E, \u0906\u092A\u0932\u093E \u0905\u092D\u093F\u092E\u093E\u0928." }
  ];
  var shabdEl = document.getElementById("shabdWord");
  if (shabdEl && typeof SHABD !== "undefined") {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var day = Math.floor((now - start) / 864e5);
    var s = SHABD[day % SHABD.length];
    shabdEl.textContent = s.w;
    document.getElementById("shabdTranslit").textContent = s.t;
    document.getElementById("shabdMeaning").innerHTML =
      '<span class="mr">' + s.m + "</span> \u2014 <span class=\"gloss\">" + s.g + "</span>";
    document.getElementById("shabdExample").innerHTML =
      '<span class="mr">\u201C' + s.e + "\u201D</span>";
  }

  /* ---------- diwali countdown ---------- */
  var cd = document.getElementById("countdown");
  if (cd) {
    var target = new Date(cd.getAttribute("data-target")).getTime();
    var dEl = document.getElementById("cdD"), hEl = document.getElementById("cdH"),
        mEl = document.getElementById("cdM"), sEl = document.getElementById("cdS");
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        cd.innerHTML = '<span class="cd-done"><span class="mr">\u0936\u0941\u092D \u0926\u0940\u092A\u093E\u0935\u0932\u0940!</span></span>';
        return;
      }
      var d = Math.floor(diff / 864e5),
          h = Math.floor(diff / 36e5) % 24,
          m = Math.floor(diff / 6e4) % 60,
          s = Math.floor(diff / 1e3) % 60;
      dEl.textContent = d; hEl.textContent = h; mEl.textContent = m; sEl.textContent = s;
    }
    tick();
    setInterval(tick, 1000);
  }
})();
