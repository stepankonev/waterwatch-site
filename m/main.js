/* WaterWatch.ai — Telegram mini-app, map only.
 * No NL toggle, no report card, no how-it-works — just dots on the map.
 */

// Telegram WebApp handshake (no-op outside Telegram)
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// Pick NL copy when Telegram tells us the user is Dutch (or the browser is).
(function localizeNotice() {
  const lang = (
    tg?.initDataUnsafe?.user?.language_code ||
    navigator.language ||
    "en"
  ).toLowerCase();
  if (!lang.startsWith("nl")) return;
  const el = document.getElementById("notice");
  if (el) {
    el.textContent =
      "Voorlopig voorbeelddata — echte meldingen vervangen deze zodra burgers melden.";
  }
})();

// Google Analytics (loaded only if site.json carries an ID).
// Same Measurement ID as the apex page — GA4 will report /m/ as its
// own page_path so we can see mini-app traffic separately.
function loadGA(id) {
  if (!id || /[^A-Za-z0-9-]/.test(id)) return;
  if (window.__ga_loaded) return;
  window.__ga_loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

fetch("/data/site.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((meta) => loadGA(meta?.ga_id || ""))
  .catch(() => {});

const AMSTERDAM = [4.895168, 52.370216]; // [lon, lat]

const PROBLEM_LABEL = {
  trash: "Litter / dumped object",
  blooming: "Algal blooming",
  petroleum: "Petroleum / oil",
  debris: "Natural debris",
  other: "Other issue",
  none: "Looks clean",
};

const CRIT_COLORS = {
  1: "#4a90e2",
  2: "#f0c75e",
  3: "#f08a3e",
  4: "#d24b3b",
  5: "#6b1715",
};

function critColor(c) {
  if (c == null) return CRIT_COLORS[1];
  return CRIT_COLORS[Math.min(5, Math.max(1, c))] || CRIT_COLORS[1];
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/positron",
  center: AMSTERDAM,
  zoom: 12.5,
  attributionControl: false,
});

map.addControl(
  new maplibregl.AttributionControl({
    compact: true,
    customAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; <a href="https://openfreemap.org/">OpenFreeMap</a>',
  }),
  "bottom-right",
);
map.addControl(
  new maplibregl.NavigationControl({ showCompass: false, showZoom: true }),
  "bottom-left",
);

const WATER_FILL = "#8fc8e3";

map.on("style.load", () => {
  if (map.getLayer("water")) {
    map.setPaintProperty("water", "fill-color", WATER_FILL);
    map.setPaintProperty("water", "fill-opacity", 0.92);
  }
  for (const id of ["waterway", "waterway_line", "water_line", "river"]) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  }
  loadReports();
});

function loadReports() {
  fetch("/data/reports.json")
    .then((r) => (r.ok ? r.json() : { reports: [] }))
    .then((data) => {
      const reports = data.reports || [];
      const countEl = document.getElementById("count");
      if (countEl)
        countEl.textContent = `${reports.length} ${reports.length === 1 ? "report" : "reports"}`;

      const features = reports.map((r) => ({
        type: "Feature",
        properties: {
          problem_type: r.problem_type || "other",
          criticality: r.criticality ?? 1,
          rationale: r.rationale || "",
          canal_name: r.canal_name || "",
          created_at: r.created_at || "",
          color: critColor(r.criticality),
        },
        geometry: { type: "Point", coordinates: [r.lon, r.lat] },
      }));

      if (map.getSource("reports")) {
        map.getSource("reports").setData({ type: "FeatureCollection", features });
        return;
      }

      map.addSource("reports", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });
      map.addLayer({
        id: "reports-circle",
        type: "circle",
        source: "reports",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, ["+", 4, ["*", 1.0, ["get", "criticality"]]],
            14, ["+", 6, ["*", 1.6, ["get", "criticality"]]],
            18, ["+", 10, ["*", 2.4, ["get", "criticality"]]],
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#0a2540",
          "circle-stroke-width": 1.4,
          "circle-opacity": 0.95,
        },
      });

      map.on("click", "reports-circle", (e) => {
        const f = e.features[0];
        const p = f.properties;
        const label = PROBLEM_LABEL[p.problem_type] || p.problem_type || "Issue";
        const date = String(p.created_at || "").slice(0, 10);
        const where = p.canal_name ? `<em>${escapeHtml(p.canal_name)}</em><br>` : "";
        const rationale = p.rationale ? `<p>${escapeHtml(p.rationale)}</p>` : "";
        new maplibregl.Popup({ closeButton: true, maxWidth: "280px" })
          .setLngLat(f.geometry.coordinates)
          .setHTML(
            `<strong>${escapeHtml(label)}</strong>${where}` +
              `Criticality ${p.criticality}/5 · ${escapeHtml(date)}${rationale}`,
          )
          .addTo(map);
      });

      map.on("mouseenter", "reports-circle", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "reports-circle", () => {
        map.getCanvas().style.cursor = "";
      });
    })
    .catch((err) => console.warn("reports.json fetch failed:", err));
}
