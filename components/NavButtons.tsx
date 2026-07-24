"use client";

const BTN =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/10 " +
  "bg-white/[0.04] text-2xl text-white/35 backdrop-blur transition-colors " +
  "hover:bg-white/10 hover:text-white/80";

export default function NavButtons({
  onPrev,
  onNext,
  onOverview,
  onFullscreen,
}: {
  onPrev: () => void;
  onNext: () => void;
  onOverview: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex gap-3">
      <button type="button" aria-label="Previous" className={BTN} onClick={onPrev}>
        ‹
      </button>
      <button type="button" aria-label="Overview" className={`${BTN} text-base`} onClick={onOverview}>
        ▦
      </button>
      <button type="button" aria-label="Fullscreen" className={`${BTN} text-base`} onClick={onFullscreen}>
        ⛶
      </button>
      <button type="button" aria-label="Next" className={BTN} onClick={onNext}>
        ›
      </button>
    </div>
  );
}
