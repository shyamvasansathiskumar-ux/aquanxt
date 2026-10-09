# AquaNXT

**One brain, three filters.** Gravity water filters that tell you, with measured numbers, how they're doing. For a kitchen, a backpack and a school.

**Website:** [shyamvasansathiskumar-ux.github.io/aquanxt](https://shyamvasansathiskumar-ux.github.io/aquanxt/) · A Rajalakshmi Engineering College project for ASU Venture X 2026 · Work in progress.

## Why

Most Indian homes now have a tap. The harder problem is what comes out of it: supply that stops and starts, and water that is sometimes contaminated, with nobody checking it where people actually drink.

- 81.71% of rural households had a tap connection by March 2026; the same assessment found about 1 in 4 households weren't free of bacterial contamination ([source](https://www.newkerala.com/news/a/8171-pc-rural-households-tap-water-supply-somanna-583.htm)).
- India had 462,220 diarrhoeal deaths in 2023 ([GBD 2023](https://www.sciencedirect.com/science/article/pii/S2052297526000685)).

## Three prototypes

| | Home | Go | Station |
|---|---|---|---|
| For | Families, kitchen counter | Travel, field, relief work | Schools, village taps |
| How | Countertop gravity filter, 11 L per fill | Bag hung from any hook, filter pod, bottle | Solar-powered slow-sand (biosand) column |
| Power | Filters with none | Filters with none | Off-grid solar |
| Status | Main prototype, being built | Built only if Home is on track by 20 Oct | Column maturing (~30 days) |

## Neer

Neer (நீர், "water") is the on-board assistant: a small face and one short line, each one based on something it measured. It forecasts filter life from real wear, turns amber when it isn't sure, and never says the water is "safe". Neer doesn't filter anything: gravity does. Neer watches, explains and locks, and every lock fails closed.

## What we will and won't claim

After testing we'll report the bacteria reduction an NABL-accredited lab measures (E. coli and total coliform), litres treated and filter life from measured data, and each stress test we ran on film. We won't claim virus removal until it's tested, removal of dissolved salts, arsenic or fluoride, that Neer detects germs, or that the water is "safe".

## What's in this repo

- `docs/`: the website (Three.js + GSAP, no build step).
- Internal designs (sensor layout, valve mechanism, firmware rules, CAD and parts lists) are kept private until the provisional patent is filed.
