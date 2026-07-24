export interface ThemeDef {
  id: string;
  label: string;
  color: string;
}

/**
 * The deck-wide key-themes list. The slide→theme mapping lives in each slide's
 * meta.themes; cumulative sidebar state is COMPUTED from deck order (lib/themeState.ts).
 */
export const THEMES: ThemeDef[] = [
  { id: "clarity", label: "Clarity of intent", color: "#7dd3fc" },
  { id: "evidence", label: "Evidence over assertion", color: "#fbbf24" },
  { id: "impact", label: "Measurable impact", color: "#6ee7b7" },
];
