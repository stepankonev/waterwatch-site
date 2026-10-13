/* WaterWatch.ai — landing page wiring: ride-along player, scroll reveal,
 * analytics and the footer build stamp. */

/* ---------- Hero loop ---------------------------------------------- */

(function wireHeroVideo() {
  const video = document.getElementById("hero-video");
  const btn = document.getElementById("hero-pause");
  if (!video || !btn) return;
  const sync = () => {
    btn.querySelector("use").setAttribute("href", video.paused ? "#i-play" : "#i-pause");
    btn.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.removeAttribute("autoplay");
    video.pause();
  }
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  btn.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
  sync();
})();

/* ---------- Ride-along: boat footage + synced route map ------------- */

// run/route.json carries one entry per video frame (run/boat-run.mp4 is
// every survey frame at `fps`), so frame index = currentTime * fps.
// `xy` is already projected into the 900×700 pixel space of route-map.jpg.
(function wireRideAlong() {
  const video = document.getElementById("ride-video");
  const svg = document.getElementById("ride-route");
  if (!video || !svg) return;

  const full = svg.querySelector(".route-full");
  const done = svg.querySelector(".route-done");
  const dots = svg.querySelectorAll(".route-dot, .route-dot-halo");
  const range = document.getElementById("ride-range");
  const toggle = document.getElementById("ride-toggle");
  const bigPlay = document.getElementById("ride-bigplay");
  const frameEl = document.getElementById("ride-frame");
  const timeEl = document.getElementById("ride-time");
  const coordEl = document.getElementById("ride-coords");

  let route = null;
  let start = 0, span = 0, lastIdx = -1;
  let userPaused = false;

  const toPath = (pts) =>
    pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join("");

  function frameIndex() {
    if (!route) return 0;
    return Math.min(route.xy.length - 1, Math.max(0, Math.round(video.currentTime * route.fps)));
  }

  function draw(force) {
    if (!route) return;
    const i = frameIndex();
    if (i === lastIdx && !force) return;
    lastIdx = i;
    const [x, y] = route.xy[i];
    done.setAttribute("d", toPath(route.xy.slice(0, i + 1)));
    dots.forEach((c) => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
    if (document.activeElement !== range) range.value = i;
    const n = route.xy.length;
    frameEl.textContent = `frame ${i + 1} / ${n}`;
    const [lon, lat] = route.points[i];
    coordEl.textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    const t = new Date(start + (span * i) / (n - 1));
    timeEl.textContent = t.toLocaleTimeString("en-GB", { timeZone: "Europe/Amsterdam" });
  }

  // Frame-accurate sync where supported, rAF otherwise.
  function tick() {
    draw();
    if (video.paused) return;
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(tick);
    else requestAnimationFrame(tick);
  }

  function setPlaying(playing) {
    const icon = playing ? "#i-pause" : "#i-play";
    toggle.querySelector("use").setAttribute("href", icon);
    toggle.setAttribute("aria-label", playing ? "Pause" : "Play");
    bigPlay.hidden = playing;
  }

  function play() {
    if (video.ended || frameIndex() >= (route ? route.xy.length - 1 : Infinity)) video.currentTime = 0;
    video.play().catch(() => {});
  }

  video.addEventListener("play", () => { setPlaying(true); tick(); });
  video.addEventListener("pause", () => setPlaying(false));
  video.addEventListener("ended", () => setPlaying(false));
  video.addEventListener("seeked", () => draw(true));
  function togglePlay() {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); }
  }
  video.addEventListener("click", togglePlay);
  toggle.addEventListener("click", togglePlay);
  bigPlay.addEventListener("click", () => { userPaused = false; play(); });

  range.addEventListener("input", () => {
    if (!route) return;
    video.pause();
    userPaused = true;
    video.currentTime = (parseInt(range.value, 10) + 0.5) / route.fps;
  });

  fetch("run/route.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !data.xy?.length) return;
      route = data;
      start = Date.parse(data.start);
      span = Date.parse(data.end) - start;
      range.max = data.xy.length - 1;
      full.setAttribute("d", toPath(data.xy));
      draw(true);
    })
    .catch(() => {});

  // Start once the player scrolls into view; pause when it leaves. An
  // explicit pause by the visitor is respected — we don't auto-resume.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !userPaused && video.paused && !video.ended) play();
        else if (!e.isIntersecting && !video.paused) video.pause();
      }
    },
    { threshold: 0.5 },
  ).observe(video);
})();

/* ---------- Reveal on scroll --------------------------------------- */

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(
    ".section-head, .split, .tech-grid, .pipeline, .card-grid, .standards, .ride",
  )
  .forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

/* ---------- Google Analytics (loaded only if site.json carries an ID) ---- */

function loadGA(measurementId) {
  if (!measurementId || /[^A-Za-z0-9-]/.test(measurementId)) return;
  if (window.__ga_loaded) return;
  window.__ga_loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
}

fetch("data/site.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((meta) => loadGA(meta?.ga_id || ""))
  .catch(() => {});

// Build stamp written by scripts/publish_site.sh — drives the footer date.
fetch("data/build.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((b) => {
    const el = document.getElementById("footer-updated");
    if (!el || !b?.built_at) return;
    const d = new Date(b.built_at);
    el.textContent = "  ·  Last build " + d.toLocaleDateString("en-GB", {
      year: "numeric", month: "short", day: "numeric",
    });
  })
  .catch(() => {});
