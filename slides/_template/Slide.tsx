"use client";

import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";

export const meta: SlideMeta = {
  id: "template",
  title: "Template slide",
  steps: 2,
  themes: [],
  hasSafeMode: false,
};

export default function Slide({ step, safeMode }: SlideProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      {/* Step-0 content: always shown; Reveals animate in on every mount/restart by design. */}
      <Reveal show safeMode={safeMode}>
        <h1 className="font-display text-7xl font-semibold">Template slide</h1>
      </Reveal>
      <Reveal show={step >= 1} safeMode={safeMode}>
        <p className="text-3xl text-dim">This second line appears on the next step.</p>
      </Reveal>
    </div>
  );
}
