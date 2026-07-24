import type { DeckEntry } from "@/lib/types";
// Layouts
import * as layoutBigStatement from "@/slides/layout-big-statement/Slide";
import * as layoutSplitBeforeAfter from "@/slides/layout-split-before-after/Slide";
import * as layoutBento from "@/slides/layout-bento/Slide";
import * as layoutMosaic2x2 from "@/slides/layout-mosaic-2x2/Slide";
import * as layoutFullBleed from "@/slides/layout-full-bleed/Slide";
import * as layoutPoster from "@/slides/layout-poster/Slide";
// Data / metrics
import * as dataAgentsLine from "@/slides/data-agents-line/Slide";
import * as dataBarRace from "@/slides/data-bar-race/Slide";
import * as dataCounterWall from "@/slides/data-counter-wall/Slide";
import * as dataGauges from "@/slides/data-gauges/Slide";
import * as dataTableSort from "@/slides/data-table-sort/Slide";
import * as dataCalendarHeat from "@/slides/data-calendar-heat/Slide";
import * as dataDotGrid from "@/slides/data-dot-grid/Slide";
// Diagrams / devices
import * as layoutHubSpoke from "@/slides/layout-hub-spoke/Slide";
import * as deviceIceberg from "@/slides/device-iceberg/Slide";
import * as deviceFlipCards from "@/slides/device-flip-cards/Slide";
import * as deviceScoreboard from "@/slides/device-scoreboard/Slide";
import * as deviceLadder from "@/slides/device-ladder/Slide";
import * as deviceRevealStack from "@/slides/device-reveal-stack/Slide";
import * as deviceFormula from "@/slides/device-formula/Slide";
// Typography
import * as typeNumerals from "@/slides/type-numerals/Slide";
import * as typeKinetic from "@/slides/type-kinetic/Slide";
import * as typeSerifDisplay from "@/slides/type-serif-display/Slide";
import * as typeVariableWeight from "@/slides/type-variable-weight/Slide";
// Palettes
import * as paletteInsuranceNavy from "@/slides/palette-insurance-navy/Slide";
import * as paletteBwContrast from "@/slides/palette-bw-contrast/Slide";
// Chat
import * as chatMobileBubbles from "@/slides/chat-mobile-bubbles/Slide";

/**
 * THE deck registry. Ordering is owned HERE and only here — slide folders are
 * order-agnostic (no numeric prefixes). Each entry imports the slide's own
 * exported meta, so step counts etc. are never duplicated.
 */
export const deck: DeckEntry[] = [
  // Layouts
  { meta: layoutBigStatement.meta, Component: layoutBigStatement.default },
  { meta: layoutSplitBeforeAfter.meta, Component: layoutSplitBeforeAfter.default },
  { meta: layoutBento.meta, Component: layoutBento.default },
  { meta: layoutMosaic2x2.meta, Component: layoutMosaic2x2.default },
  { meta: layoutFullBleed.meta, Component: layoutFullBleed.default },
  { meta: layoutPoster.meta, Component: layoutPoster.default },
  // Data / metrics
  { meta: dataAgentsLine.meta, Component: dataAgentsLine.default },
  { meta: dataBarRace.meta, Component: dataBarRace.default },
  { meta: dataCounterWall.meta, Component: dataCounterWall.default },
  { meta: dataGauges.meta, Component: dataGauges.default },
  { meta: dataTableSort.meta, Component: dataTableSort.default },
  { meta: dataCalendarHeat.meta, Component: dataCalendarHeat.default },
  { meta: dataDotGrid.meta, Component: dataDotGrid.default },
  // Diagrams / devices
  { meta: layoutHubSpoke.meta, Component: layoutHubSpoke.default },
  { meta: deviceIceberg.meta, Component: deviceIceberg.default },
  { meta: deviceFlipCards.meta, Component: deviceFlipCards.default },
  { meta: deviceScoreboard.meta, Component: deviceScoreboard.default },
  { meta: deviceLadder.meta, Component: deviceLadder.default },
  { meta: deviceRevealStack.meta, Component: deviceRevealStack.default },
  { meta: deviceFormula.meta, Component: deviceFormula.default },
  // Typography
  { meta: typeNumerals.meta, Component: typeNumerals.default },
  { meta: typeKinetic.meta, Component: typeKinetic.default },
  { meta: typeSerifDisplay.meta, Component: typeSerifDisplay.default },
  { meta: typeVariableWeight.meta, Component: typeVariableWeight.default },
  // Palettes
  { meta: paletteInsuranceNavy.meta, Component: paletteInsuranceNavy.default },
  { meta: paletteBwContrast.meta, Component: paletteBwContrast.default },
  // Chat
  { meta: chatMobileBubbles.meta, Component: chatMobileBubbles.default },
];
