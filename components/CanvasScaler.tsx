"use client";

import { useEffect, useState, type ReactNode } from "react";

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;

/**
 * Fixed-canvas scaling (non-negotiable design rule): slides are authored in
 * absolute pixels on a 1920×1080 canvas; this component scales the whole canvas
 * to fit the real viewport (letterboxed, centred). Slides look identical on any
 * projector or window size.
 */
export default function CanvasScaler({ children }: { children: ReactNode }) {
  // null until measured on the client. Server HTML and the first client render must be
  // IDENTICAL (React refuses to patch mismatched attributes on hydration — a divergent
  // lazy initializer left the canvas stuck at scale(1) until the next re-render), so the
  // canvas hydrates hidden at scale(1) and the effect applies the real scale post-mount.
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    // Mobile Safari's window.innerHeight does not track the toolbars sliding in/out, so the
    // canvas ends up sized against the wrong height and never quite fills the screen. The
    // Visual Viewport reports the *actually-visible* area, so we scale against that when
    // available (desktop has no visualViewport quirk; the fallback is identical there).
    const update = () => {
      const vv = window.visualViewport;
      const w = vv?.width ?? window.innerWidth;
      const h = vv?.height ?? window.innerHeight;
      setScale(Math.min(w / CANVAS_W, h / CANVAS_H));
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  const s = scale ?? 1;
  return (
    // 100dvh (not inset-0) so the centring box tracks the dynamic viewport as the mobile
    // toolbars expand/collapse — keeping the slide centred in the visible area, not behind
    // the toolbar. Matches the visualViewport-based scale above.
    <div
      className="fixed left-0 top-0 flex items-center justify-center bg-bg"
      style={{ width: "100vw", height: "100dvh" }}
    >
      {/* The flex item is the SCALED canvas size (1920·s × 1080·s) with flex-shrink:0.
          Why: a flex item sized to the raw 1920px with the default flex-shrink:1 gets
          collapsed to the (narrower) viewport width by the flex container, and the inner
          overflow-hidden then clips the slide's right edge (~312px on a 1512px laptop).
          Sizing the item to the on-screen dimensions makes flex-centring exact and removes
          all shrink, so content within the 1920 canvas is never cut. The inner box stays
          1920×1080 and scales from its top-left to fill the wrapper precisely. */}
      <div
        style={{
          width: CANVAS_W * s,
          height: CANVAS_H * s,
          flexShrink: 0,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${s})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
