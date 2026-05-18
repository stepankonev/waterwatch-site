<div align="center">

# WaterWatch.ai

### *The canals keep their own records.*

[**→ waterwatch.ai**](https://waterwatch.ai) &nbsp;·&nbsp; Amsterdam &nbsp;·&nbsp; since 2026

</div>

---

The Amsterdam canal system carries **165 km of water** through the heart of the city. Most of what happens in it goes unseen — a shopping cart pushed in at night, a slow algal patch in early summer, a rainbow sheen behind a barge, a few dead fish after a heat wave.

WaterWatch is built on a simple idea:

> *People walking along the canals already see these things. We just need a way to capture and pin them.*

No app to install. No form to fill in. No signup.

## How a report happens

You're walking along the **Prinsengracht**. You see something off in the water — a half-submerged shopping cart, a bloom forming, a milky-grey discharge near a drain. You open a **Telegram bot** on your phone, send a photo, share your location with one tap.

Within minutes, three things happen:

1. **A vision model reads the photo.** It identifies what kind of issue it is — floating trash, algal blooming, petroleum, debris, something else, or *"looks fine"* — and scores how serious it looks.
2. **A human moderator reviews it.** Not every photo becomes a pin; nothing reaches the public map without a person looking at it first.
3. **The approved report appears on the map**, tied to the canal's actual name (resolved from OpenStreetMap), with a short factual rationale.

Every week, a quieter routine runs: the same model writes a brief summary of what citizens have reported, framed against the upcoming weather. *"Three petroleum sheens were spotted on the Amstel this week. Calm, dry weather should let them persist; rain on Wednesday should help disperse them."*

That's the whole loop.

## What it adds up to

Run that loop with enough eyes, long enough, and the city has something it never had before: **an open, real-time, narrated record of canal life kept by the people who live alongside it.**

Not a database. Not a dashboard. A living public chart.

## Visit

<div align="center">

### [waterwatch.ai](https://waterwatch.ai)

The live map and this week's report.

</div>

## What this isn't

WaterWatch is a hobby project. It is **not** an official water-quality service, not a dispatch system, not a hotline to any authority. The official monitoring of Amsterdam's canals is handled by the people whose job it is to handle it; we don't substitute for them.

Think of WaterWatch instead as **a public commonplace book** — citizens annotating their own city, the way someone might pencil margin notes into a borrowed atlas. If the public record is useful to anyone — researchers, journalists, the city, a neighbourhood association — it's there to be read.

## Two principles

1. **The data belongs to the city, not to us.** Every observation comes from a citizen and goes onto a public map. No paywall, no scraping API, no membership tier.
2. **A human reviews every public pin.** No auto-approval. The vision model is fast and useful, but the public map is curated.

## On the technology

A small Telegram bot, a local Gemma 4 vision model running on a GPU in an apartment, OpenStreetMap, and a static page on GitHub.

That's enough infrastructure to keep an eye on a city.

## Where this code lives

This repository is the **published static page** that GitHub Pages serves at `waterwatch.ai`. Updates flow into it once a day from the upstream project, which holds the bot, the moderation queue, and the publishing pipeline. Files in this repo are auto-overwritten on each publish — please don't edit them by hand.

---

<div align="center">

*Walked past a canal today? See anything?*

[**Open the bot →**](https://t.me/waterwatch_ai_bot)

</div>
