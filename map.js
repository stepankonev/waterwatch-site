/* WaterWatch.ai map + page wiring (MapLibre GL JS) */

const AMSTERDAM = [4.895168, 52.370216]; // [lon, lat] for MapLibre

// Translator shortcut. i18n.js sets up window.WW; map.js loads after it.
// Named `tr` (not `t`) so it doesn't collide with the global `t` that
// maplibre-gl's minified bundle leaks to window scope.
const tr = (key, vars) => (window.WW ? window.WW.t(key, vars) : key);

const PROBLEM_META = {
  trash:    { icon: "🛒" },
  blooming: { icon: "🌿" },
  petroleum:{ icon: "🛢️" },
  debris:   { icon: "🍂" },
  other:    { icon: "⚠️" },
  none:     { icon: "💧" },
};

const PROBLEM_TYPE_ORDER = ["trash", "blooming", "petroleum", "debris", "other", "none"];

const CRIT_COLORS = {
  1: "#4a90e2",
  2: "#f0c75e",
  3: "#f08a3e",
  4: "#d24b3b",
  5: "#6b1715",
};

function criticalityColor(c) {
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

/* ---------- Map ----------------------------------------------------- */

const map = new maplibregl.Map({
  container: "map",
  // OpenFreeMap "positron" — same minimal palette, vector source, fully styleable.
  style: "https://tiles.openfreemap.org/styles/positron",
  center: AMSTERDAM,
  zoom: 12.5,
  attributionControl: false,
});

map.addControl(
  new maplibregl.AttributionControl({
    compact: false,
    customAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; <a href="https://openfreemap.org/">OpenFreeMap</a>',
  }),
  "bottom-right",
);
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

// Soft Delft-blue water — a touch brighter than full pastel, still calm.
const WATER_FILL = "#8fc8e3";
const WATER_LINE = "#5d9bbb";

map.on("style.load", () => {
  if (map.getLayer("water")) {
    map.setPaintProperty("water", "fill-color", WATER_FILL);
    map.setPaintProperty("water", "fill-opacity", 0.92);
  }
  // Hide all line waterways — only the polygon water bodies should show.
  for (const id of ["waterway", "waterway_line", "water_line", "river"]) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", "none");
    }
  }
  // Warm-paper land tint to match the page palette.
  for (const id of ["background", "land", "landcover", "earth"]) {
    if (map.getLayer(id)) {
      try {
        map.setPaintProperty(id, "background-color", "#f4ecd8");
      } catch (e) { /* layer type doesn't take background-color */ }
    }
  }

  setupReportLayer();
});

/* ---------- Report markers as a circle layer ----------------------- */

function reportFeatureCollection(reports) {
  return {
    type: "FeatureCollection",
    features: reports.map((r) => ({
      type: "Feature",
      properties: {
        id: r.id,
        problem_type: r.problem_type || "other",
        criticality: r.criticality ?? 1,
        rationale: r.rationale || "",
        canal_name: r.canal_name || "",
        created_at: r.created_at || "",
        color: criticalityColor(r.criticality),
      },
      geometry: { type: "Point", coordinates: [r.lon, r.lat] },
    })),
  };
}

function setupReportLayer() {
  if (map.getSource("reports")) return;
  map.addSource("reports", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
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

  // Click → popup
  map.on("click", "reports-circle", (e) => {
    const f = e.features[0];
    const p = f.properties;
    const label = tr("type." + p.problem_type) || p.problem_type;
    const date = String(p.created_at || "").slice(0, 10);
    const where = p.canal_name ? `<em>${escapeHtml(p.canal_name)}</em><br>` : "";
    const rationale = p.rationale ? `<p>${escapeHtml(p.rationale)}</p>` : "";
    const sevWord = tr("map.legendTitle");
    new maplibregl.Popup({ closeButton: true, maxWidth: "280px" })
      .setLngLat(f.geometry.coordinates)
      .setHTML(
        `<strong>${escapeHtml(label)}</strong>${where}` +
          `${escapeHtml(sevWord)} ${p.criticality ?? "?"}/5 · ${escapeHtml(date)}${rationale}`,
      )
      .addTo(map);
  });

  map.on("mouseenter", "reports-circle", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "reports-circle", () => {
    map.getCanvas().style.cursor = "";
  });

  // If reports loaded before style, hydrate now.
  if (window.__pendingReports) {
    map.getSource("reports").setData(reportFeatureCollection(window.__pendingReports));
    window.__pendingReports = null;
  }
}

function plotReports(reports) {
  const src = map.getSource && map.getSource("reports");
  if (src) {
    src.setData(reportFeatureCollection(reports));
  } else {
    window.__pendingReports = reports;
  }
}

/* ---------- Stats --------------------------------------------------- */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fillStats(_data) {
  // Stats currently aren't rendered on the page — kept as a no-op so future
  // dashboards can re-enable per-element hooks without changing the call site.
}

/* ---------- Bot links / QR ----------------------------------------- */

function wireBotLinks(botUrl) {
  for (const id of ["header-cta", "hero-cta", "cta-bot"]) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (botUrl) {
      el.href = botUrl;
    } else {
      el.href = "#";
      el.removeAttribute("target");
    }
  }
  // Hydrate every QR image on the page (hero + CTA banner) with the same
  // cache-bust so we don't show a stale code if the bot username changes.
  const stamp = Date.now();
  document.querySelectorAll("img.qr-img").forEach((qr) => {
    qr.onload = () => qr.removeAttribute("hidden");
    qr.onerror = () => qr.setAttribute("hidden", "");
    qr.src = "data/bot_qr.png?t=" + stamp;
  });
}

/* ---------- Today's report ----------------------------------------- */

function trendChip(trend) {
  if (!trend || trend.current == null) return "";
  const d = trend.delta ?? 0;
  if (d === 0)
    return `<span class="trend trend-flat">${escapeHtml(
      tr("trend.steady", { current: trend.current, prior: trend.prior }),
    )}</span>`;
  if (d > 0)
    return `<span class="trend trend-up">${escapeHtml(
      tr("trend.up", { delta: d, prior: trend.prior, current: trend.current }),
    )}</span>`;
  return `<span class="trend trend-down">${escapeHtml(
    tr("trend.down", { delta: d, prior: trend.prior, current: trend.current }),
  )}</span>`;
}

function renderTypeCard(type, stats, narrative) {
  const meta = PROBLEM_META[type] || PROBLEM_META.other;
  const label = tr("type." + type) || type;
  const canals = (stats.top_canals || [])
    .map((c) => `<span class="canal-chip">${escapeHtml(c)}</span>`)
    .join("");
  const wordReport = tr(stats.count === 1 ? "type.report" : "type.reports");
  const narrativeHtml = narrative || `<p>${escapeHtml(tr("type.noNarrative"))}</p>`;
  const maxCrit =
    stats.max_criticality && stats.max_criticality > 0
      ? `<span class="type-crit">${escapeHtml(tr("type.maxSeverity", { n: stats.max_criticality }))}</span>`
      : "";
  return `
    <article class="type-card type-${type}">
      <header class="type-card-head">
        <span class="type-icon" aria-hidden="true">${meta.icon}</span>
        <div>
          <h3>${escapeHtml(label)}</h3>
          <p class="type-meta">
            <span class="type-count">${stats.count}</span>${" "}${escapeHtml(wordReport)}${maxCrit ? " · " + maxCrit : ""}
          </p>
        </div>
      </header>
      ${canals ? `<div class="canal-chips" aria-label="Top canals">${canals}</div>` : ""}
      <div class="type-narrative">${narrativeHtml}</div>
    </article>
  `;
}

function renderStructuredReport(report) {
  const stats = report.stats || {};
  const narrative = report.narrative || {};
  const trend = report.trend || {};
  const byType = stats.by_type || {};
  const activeTypes = PROBLEM_TYPE_ORDER.filter((tp) => byType[tp]);

  let html = "";

  html += `<section class="report-intro">`;
  if (narrative.intro) {
    html += narrative.intro;
  } else if (stats.total === 0) {
    html += `<p>${escapeHtml(tr("report.empty"))}</p>`;
  } else {
    html += `<p>${escapeHtml(tr("report.loading"))}</p>`;
  }
  const chip = trendChip(trend);
  if (chip) html += chip;
  html += `</section>`;

  if (activeTypes.length) {
    html += `<div class="type-grid">`;
    for (const tp of activeTypes) {
      html += renderTypeCard(tp, byType[tp], (narrative.by_type || {})[tp] || "");
    }
    html += `</div>`;
  }

  if (narrative.outlook) {
    html += `<section class="report-outlook">
      <p class="report-outlook-eyebrow">${escapeHtml(tr("report.outlookEyebrow"))}</p>
      <div class="report-outlook-body">${narrative.outlook}</div>
    </section>`;
  }

  if (narrative.thanks) {
    html += `<section class="report-thanks">${narrative.thanks}</section>`;
  }

  return html;
}

let _lastReport = null;

function setReport(report) {
  if (report) _lastReport = report;
  const body = document.getElementById("report-body");
  const meta = document.getElementById("report-meta");
  const footerUpdated = document.getElementById("footer-updated");

  if (!report && !_lastReport) {
    body.innerHTML = `<p>${escapeHtml(tr("report.noReport"))}</p>`;
    return;
  }
  const r = report || _lastReport;
  if (r.generated_at) {
    const d = new Date(r.generated_at);
    const dt = d.toLocaleString(window.WW?.lang || undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    meta.textContent = tr("report.updated", { date: dt });
    if (footerUpdated) {
      const short = d.toLocaleDateString(window.WW?.lang || undefined, {
        month: "short", day: "numeric",
      });
      footerUpdated.textContent = tr("report.lastBuild", { date: short });
    }
  }

  if (r.narrative || r.stats) {
    body.innerHTML = renderStructuredReport(r);
    return;
  }

  body.innerHTML = r.html || `<p>${escapeHtml(r.text || "")}</p>`;
}

// Re-render dynamic UI on language switch.
window.addEventListener("ww:langchange", () => {
  if (_lastReport) setReport(_lastReport);
});

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
    ".section-head, .map-card, .steps, .report-card, .qr-card, .cta-content",
  )
  .forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

/* ---------- Data fetches ------------------------------------------- */

fetch("data/site.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((meta) => wireBotLinks(meta?.bot_url || ""))
  .catch(() => wireBotLinks(""));

fetch("data/reports.json")
  .then((r) => (r.ok ? r.json() : { reports: [] }))
  .then((data) => {
    plotReports(data.reports || []);
    fillStats(data);
  })
  .catch((err) => {
    console.warn("No report data yet:", err);
    fillStats({ reports: [], count: 0 });
  });

fetch("data/report.json")
  .then((r) => (r.ok ? r.json() : null))
  .then(setReport)
  .catch(() => setReport(null));
