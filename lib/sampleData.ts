// lib/sampleData.ts — neutral, fictional corporate sample data for example slides.
// Nothing here is real; "Northwind Insurance" is a fictional company.
//
// This is a starter library for slides you build: import what you need, or copy the
// values into a slide's own data/*.json. Not every export is referenced by an example
// slide — they're here as a consistent, reusable set to build new slides from.

export const quarterlyRevenue = [
  { period: "Q1", value: 4.2 }, { period: "Q2", value: 4.8 },
  { period: "Q3", value: 5.1 }, { period: "Q4", value: 6.3 },
]; // $M

export const regionalHeadcount = [
  { region: "North", value: 312 }, { region: "South", value: 268 },
  { region: "East", value: 401 }, { region: "West", value: 189 },
];

export const claimsRatio = [
  { year: 2022, value: 0.71 }, { year: 2023, value: 0.66 },
  { year: 2024, value: 0.63 }, { year: 2025, value: 0.59 },
];

export const productMix = [
  { name: "Motor", value: 38 }, { name: "Home", value: 27 },
  { name: "Life", value: 21 }, { name: "Travel", value: 14 },
]; // %

export const npsOverTime = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1, value: 20 + Math.round(18 * Math.sin(i / 2) + i),
}));

export const headlineKpis = {
  revenueM: 20.4, growthPct: 23, customers: 84200,
  satisfaction: 4.6, retentionPct: 91, claimsRatio: 0.59,
};
