/* WaterWatch.ai — public-site i18n (English + Dutch).
 *
 * Lookup via data-i18n="path.to.key" attributes; values may contain a small
 * subset of inline HTML (<br>, <em>, <strong>, <span>) so the title can keep
 * its line breaks and italic pull-out word.
 *
 * Language preference resolution: localStorage > browser locale > "en".
 * The choice is stored under "ww-lang" so it survives reloads.
 */

const I18N = {
  en: {
    "nav.report": "Report",
    "nav.how": "How it works",

    "cta.openBotShort": "Open bot",
    "cta.openBot": "Open the bot",
    "cta.todayReport": "Today's report",
    "cta.learnMore": "Learn more",

    "hero.overline": "since 2026 · amsterdam, nl",
    "hero.eyebrow": "LIVE · Amsterdam",
    "hero.title": "Amsterdam canals water quality, mapped live.",
    "hero.sub":
      "Citizens send photos. AI reads them. The map updates. Mobile-only Telegram bot, no signup.",
    "hero.qrCaption": "Scan to open the bot",

    "metric.reports": "REPORTS · 7D",
    "metric.canals": "CANALS",
    "metric.severe": "MAX SEVERITY",

    "map.legendTitle": "SEVERITY",
    "map.notice": "Sample data for now — real reports will replace these as citizens submit.",

    "report.eyebrow": "▸ WEEKLY REPORT",
    "report.title": "This week in the canals.",
    "report.sub": "Reading the signal in the last seven days.",
    "report.loading": "Loading the latest summary…",
    "report.empty":
      "No new approved reports this week — the canals stayed quiet, at least in the data we received.",
    "report.outlookEyebrow": "⛅ The week ahead",
    "report.noReport": "No daily report has been published yet. Check back later.",

    "how.eyebrow": "▸ HOW IT WORKS",
    "how.title": "From a phone in your pocket to a map on the web.",
    "how.step1.title": "Snap and share",
    "how.step1.body":
      "Open the Telegram bot on your phone — send a photo of what you see, then share your location with one tap. The bot is mobile only.",
    "how.step2.title": "Auto-classified",
    "how.step2.body":
      "Google's <strong>Gemma 4</strong> vision model reads the photo, identifies the issue (litter, algal bloom, oil sheen, dead fish, dumped objects) and scores how serious it looks — running on a local GPU, no cloud round-trip.",
    "how.step3.title": "Pinned to the map",
    "how.step3.body":
      "Reports appear on the map shortly, pinned to the canal's actual name.",

    "banner.eyebrow": "▸ CONTRIBUTE",
    "banner.title": "See something? Tell us in ten seconds.",
    "banner.sub": "No signup, no app. Our Telegram bot runs on your phone — mobile only.",
    "banner.cta": "Open WaterWatch on Telegram",
    "banner.qrCaption": "scan to open",

    // Day-of formatting (used by the report meta line in map.js)
    "report.updated": "Updated {date}",
    "report.lastBuild": "Last build · {date}",

    "footer.poweredBy": "Powered by <strong>Gemma 4</strong>",

    // Trend chip phrasing
    "trend.steady": "→ steady ({current} this week, {prior} prior)",
    "trend.up": "▲ +{delta} vs prior week ({prior} → {current})",
    "trend.down": "▼ {delta} vs prior week ({prior} → {current})",

    // Per-type cards
    "type.trash": "Trash & dumping",
    "type.blooming": "Algal blooming",
    "type.petroleum": "Petroleum / oil",
    "type.debris": "Natural debris",
    "type.other": "Other anomalies",
    "type.none": "Looks clean",

    "type.report": "report",
    "type.reports": "reports",
    "type.maxSeverity": "max severity {n}/5",
    "type.noNarrative": "No narrative available for this type.",
  },

  nl: {
    "nav.report": "Verslag",
    "nav.how": "Hoe het werkt",

    "cta.openBotShort": "Open bot",
    "cta.openBot": "Open de bot",
    "cta.todayReport": "Verslag van vandaag",
    "cta.learnMore": "Meer info",

    "hero.overline": "sinds 2026 · amsterdam, nl",
    "hero.eyebrow": "LIVE · Amsterdam",
    "hero.title": "Waterkwaliteit van de Amsterdamse grachten, live op de kaart.",
    "hero.sub":
      "Burgers sturen foto's. AI leest ze. De kaart werkt zich bij. Telegram-bot, alleen op mobiel, geen registratie.",
    "hero.qrCaption": "Scan om de bot te openen",

    "metric.reports": "MELDINGEN · 7D",
    "metric.canals": "GRACHTEN",
    "metric.severe": "MAX ERNST",

    "map.legendTitle": "ERNST",
    "map.notice": "Voorlopig voorbeelddata — echte meldingen vervangen deze zodra burgers melden.",

    "report.eyebrow": "▸ WEEKVERSLAG",
    "report.title": "Deze week in de grachten.",
    "report.sub": "De signalen van de afgelopen zeven dagen.",
    "report.loading": "De samenvatting wordt geladen…",
    "report.empty":
      "Geen nieuwe goedgekeurde meldingen deze week — de grachten waren rustig, in elk geval in onze data.",
    "report.outlookEyebrow": "⛅ De komende week",
    "report.noReport": "Er is nog geen dagverslag gepubliceerd. Kom later terug.",

    "how.eyebrow": "▸ HOE HET WERKT",
    "how.title": "Van een telefoon in je broekzak tot een kaart op het web.",
    "how.step1.title": "Foto en plaats",
    "how.step1.body":
      "Open de Telegram-bot op je telefoon — stuur een foto van wat je ziet en deel daarna je locatie met één tik. De bot werkt alleen op mobiel.",
    "how.step2.title": "Automatisch geclassificeerd",
    "how.step2.body":
      "Het <strong>Gemma 4</strong> vision-model van Google leest de foto, herkent het probleem (afval, algenbloei, olielaag, dode vissen, gedumpte objecten) en geeft een ernstscore — draait lokaal op een GPU, geen cloud-rondreis.",
    "how.step3.title": "Op de kaart",
    "how.step3.body":
      "Meldingen verschijnen kort daarna op de kaart, gekoppeld aan de naam van de gracht.",

    "banner.eyebrow": "▸ MELDEN",
    "banner.title": "Zie je iets? Laat het binnen tien seconden weten.",
    "banner.sub": "Geen registratie, geen app. Onze Telegram-bot draait op je telefoon — alleen mobiel.",
    "banner.cta": "Open WaterWatch op Telegram",
    "banner.qrCaption": "scan om te openen",

    "report.updated": "Bijgewerkt {date}",
    "report.lastBuild": "Laatste build · {date}",

    "footer.poweredBy": "Aangedreven door <strong>Gemma 4</strong>",

    "trend.steady": "→ stabiel ({current} deze week, {prior} ervoor)",
    "trend.up": "▲ +{delta} t.o.v. vorige week ({prior} → {current})",
    "trend.down": "▼ {delta} t.o.v. vorige week ({prior} → {current})",

    "type.trash": "Afval & dumping",
    "type.blooming": "Algenbloei",
    "type.petroleum": "Olielaag",
    "type.debris": "Drijvend natuurlijk materiaal",
    "type.other": "Overige afwijkingen",
    "type.none": "Geen problemen",

    "type.report": "melding",
    "type.reports": "meldingen",
    "type.maxSeverity": "max ernst {n}/5",
    "type.noNarrative": "Geen tekst beschikbaar voor dit type.",
  },
};

const LANG_KEY = "ww-lang";

function detectLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && I18N[stored]) return stored;
  const browser = (navigator.language || "en").toLowerCase();
  return browser.startsWith("nl") ? "nl" : "en";
}

let currentLang = detectLang();

function t(key, vars) {
  const dict = I18N[currentLang] || I18N.en;
  let s = dict[key] ?? I18N.en[key] ?? key;
  if (vars) {
    for (const k in vars) {
      s = s.replaceAll("{" + k + "}", String(vars[k]));
    }
  }
  return s;
}

function applyLang(lang) {
  if (!I18N[lang]) lang = "en";
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = I18N[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll(".lang button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });

  // Notify dynamic renderers (map.js report cards) so they can re-render in
  // the new language using the new t().
  window.dispatchEvent(new CustomEvent("ww:langchange", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", () => {
  applyLang(currentLang);
  document.querySelectorAll(".lang button").forEach((b) => {
    b.addEventListener("click", () => applyLang(b.dataset.lang));
  });
});

// Expose to map.js
window.WW = { t, get lang() { return currentLang; }, applyLang };
