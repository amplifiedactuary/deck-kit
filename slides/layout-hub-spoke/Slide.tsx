"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import type { SlideMeta, SlideProps } from "@/lib/types";
import rawData from "./data/agents.json";

export const meta: SlideMeta = {
  id: "layout-hub-spoke",
  title: "Hub & spoke",
  steps: 3,
  themes: [],
  group: "layouts",
  hasSafeMode: true,
};

/* ------------------------------------------------------------------ */
/* Data + geometry                                                     */
/* ------------------------------------------------------------------ */

type Kind = "research" | "build" | "review";

interface NodeDef {
  id: string;
  label: string;
  kind: Kind;
  ring: 0 | 1;
  angle: number;
  parent?: string;
  labeled: boolean;
}

interface AgentData {
  hub: { label: string; sub: string };
  stats: {
    peakConcurrent: number;
    launches: number;
    foreground: number;
    background: number;
    medianSeconds: number;
    windowHours: number;
    shown: number;
  };
  rings: [number, number];
  nodes: NodeDef[];
}

const DATA = rawData as unknown as AgentData;

const CX = 960;
const CY = 590;
const HUB_R = 64;
const NODE_R: [number, number] = [20, 11];

const KIND_COLOR: Record<Kind, string> = {
  research: "#7dd3fc", // accent
  build: "#fbbf24", // amber
  review: "#e8edf5", // ink
};

const KIND_LABEL: Record<Kind, string> = {
  research: "advisory",
  build: "operations",
  review: "oversight",
};

function polar(angleDeg: number, r: number): { x: number; y: number } {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

/** Line between two points, trimmed back from each end so it never touches a node. */
function trimmedLine(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  trim1: number,
  trim2: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: p1.x + ux * trim1,
    y1: p1.y + uy * trim1,
    x2: p2.x - ux * trim2,
    y2: p2.y - uy * trim2,
  };
}

function labelPlacement(angleDeg: number, r: number) {
  const p = polar(angleDeg, r);
  const c = Math.cos((angleDeg * Math.PI) / 180);
  const s = Math.sin((angleDeg * Math.PI) / 180);
  const anchor: "start" | "middle" | "end" =
    c > 0.35 ? "start" : c < -0.35 ? "end" : "middle";
  const dy = s > 0.85 ? 16 : s < -0.85 ? -4 : 7;
  return { x: p.x, y: p.y + dy, anchor };
}

/* ------------------------------------------------------------------ */
/* SVG primitives (animated vs static)                                 */
/* ------------------------------------------------------------------ */

function Spoke({
  line,
  show,
  safeMode,
  delay,
  width,
  opacity,
}: {
  line: { x1: number; y1: number; x2: number; y2: number };
  show: boolean;
  safeMode: boolean;
  delay: number;
  width: number;
  opacity: number;
}) {
  if (safeMode) {
    if (!show) return null;
    return <line {...line} stroke="#8b95a7" strokeWidth={width} opacity={opacity} />;
  }
  return (
    <motion.line
      {...line}
      stroke="#8b95a7"
      strokeWidth={width}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: show ? delay : 0 }}
    />
  );
}

function NodeLabel({ node, ringRadius }: { node: NodeDef; ringRadius: number }) {
  if (!node.labeled) return null;
  const r = NODE_R[node.ring];
  const lp = labelPlacement(node.angle, ringRadius + r + (node.ring === 0 ? 30 : 24));
  return (
    <text
      x={lp.x}
      y={lp.y}
      textAnchor={lp.anchor}
      fontSize={node.ring === 0 ? 21 : 19}
      fill={node.ring === 0 ? "#e8edf5" : "#8b95a7"}
      className="font-mono"
    >
      {node.label}
    </text>
  );
}

function AgentNode({
  node,
  ringRadius,
  show,
  safeMode,
  delay,
}: {
  node: NodeDef;
  ringRadius: number;
  show: boolean;
  safeMode: boolean;
  delay: number;
}) {
  const p = polar(node.angle, ringRadius);
  const r = NODE_R[node.ring];
  const colour = KIND_COLOR[node.kind];
  const fillOpacity = node.ring === 0 ? 0.95 : 0.7;

  if (safeMode) {
    if (!show) return null;
    return (
      <g>
        <circle cx={p.x} cy={p.y} r={r} fill={colour} fillOpacity={fillOpacity} />
        <NodeLabel node={node} ringRadius={ringRadius} />
      </g>
    );
  }
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.35, delay: show ? delay : 0 }}
    >
      <motion.circle
        cx={p.x}
        cy={p.y}
        fill={colour}
        fillOpacity={fillOpacity}
        initial={{ r: 0 }}
        animate={{ r: show ? r : 0 }}
        transition={{
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1],
          delay: show ? delay : 0,
        }}
      />
      <NodeLabel node={node} ringRadius={ringRadius} />
    </motion.g>
  );
}

function Hub({ safeMode }: { safeMode: boolean }) {
  const body = (
    <>
      <circle
        cx={CX}
        cy={CY}
        r={HUB_R}
        fill="#10141c"
        stroke="#e8edf5"
        strokeWidth={2.5}
      />
      <text
        x={CX}
        y={CY - 2}
        textAnchor="middle"
        fontSize={23}
        fill="#e8edf5"
        fontWeight={600}
        className="font-mono"
      >
        {DATA.hub.label}
      </text>
      <text
        x={CX}
        y={CY + 26}
        textAnchor="middle"
        fontSize={15}
        fill="#8b95a7"
        className="font-mono"
      >
        {DATA.hub.sub}
      </text>
    </>
  );
  if (safeMode) return <g>{body}</g>;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${CX}px ${CY}px` }}
    >
      {body}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/* Slide                                                               */
/* ------------------------------------------------------------------ */

export default function Slide({ step, safeMode }: SlideProps) {
  const [innerR, outerR] = DATA.rings;
  const inner = DATA.nodes.filter((n) => n.ring === 0);
  const outer = DATA.nodes.filter((n) => n.ring === 1);
  const byId = new Map(DATA.nodes.map((n) => [n.id, n]));
  const s = DATA.stats;

  return (
    <div className="relative h-full w-full">
      {/* Title block */}
      <div className="absolute left-[80px] top-[64px] w-[600px]">
        <Reveal show safeMode={safeMode}>
          <p className="font-mono text-[19px] tracking-[0.25em] text-accent">
            LAYOUT LAB · 13 / HUB &amp; SPOKE
          </p>
          <h1 className="mt-3 font-display text-[62px] font-semibold leading-none">
            One head office, many teams
          </h1>
          <p className="mt-5 text-[26px] leading-snug text-dim">
            Head office sits at the centre — every spoke is a division or team.
          </p>
        </Reveal>
      </div>

      {/* Radial graph */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        className="absolute inset-0"
        aria-hidden
      >
        {/* Ring guides */}
        <circle
          cx={CX}
          cy={CY}
          r={innerR}
          fill="none"
          stroke="#1d2533"
          strokeWidth={1}
          strokeDasharray="2 10"
          opacity={step >= 1 ? 1 : 0}
          style={safeMode ? undefined : { transition: "opacity 0.6s" }}
        />
        <circle
          cx={CX}
          cy={CY}
          r={outerR}
          fill="none"
          stroke="#1d2533"
          strokeWidth={1}
          strokeDasharray="2 10"
          opacity={step >= 2 ? 1 : 0}
          style={safeMode ? undefined : { transition: "opacity 0.6s" }}
        />

        {/* Hub → inner spokes */}
        {inner.map((n, i) => (
          <Spoke
            key={`spoke-${n.id}`}
            line={trimmedLine(
              { x: CX, y: CY },
              polar(n.angle, innerR),
              HUB_R + 12,
              NODE_R[0] + 8,
            )}
            show={step >= 1}
            safeMode={safeMode}
            delay={i * 0.07}
            width={1.6}
            opacity={0.32}
          />
        ))}

        {/* Inner → outer branches */}
        {outer.map((n, i) => {
          const parent = n.parent ? byId.get(n.parent) : undefined;
          if (!parent) return null;
          return (
            <Spoke
              key={`branch-${n.id}`}
              line={trimmedLine(
                polar(parent.angle, innerR),
                polar(n.angle, outerR),
                NODE_R[0] + 8,
                NODE_R[1] + 6,
              )}
              show={step >= 2}
              safeMode={safeMode}
              delay={i * 0.045}
              width={1.2}
              opacity={0.22}
            />
          );
        })}

        {/* Inner ring nodes */}
        {inner.map((n, i) => (
          <AgentNode
            key={n.id}
            node={n}
            ringRadius={innerR}
            show={step >= 1}
            safeMode={safeMode}
            delay={i * 0.07 + 0.18}
          />
        ))}

        {/* Outer ring nodes */}
        {outer.map((n, i) => (
          <AgentNode
            key={n.id}
            node={n}
            ringRadius={outerR}
            show={step >= 2}
            safeMode={safeMode}
            delay={i * 0.045 + 0.12}
          />
        ))}

        <Hub safeMode={safeMode} />
      </svg>

      {/* Legend — bottom left */}
      <div className="absolute bottom-[72px] left-[80px]">
        <Reveal show={step >= 1} safeMode={safeMode}>
          <div className="flex flex-col gap-3 font-mono text-[19px] text-dim">
            {(Object.keys(KIND_COLOR) as Kind[]).map((kind) => (
              <div key={kind} className="flex items-center gap-4">
                <span
                  className="inline-block h-[16px] w-[16px] rounded-full"
                  style={{ backgroundColor: KIND_COLOR[kind] }}
                />
                {KIND_LABEL[kind]}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Stat caption — bottom right */}
      <div className="absolute bottom-[64px] right-[80px] text-right">
        <Reveal show={step >= 2} safeMode={safeMode} delay={0.55}>
          <p className="font-display text-[88px] font-semibold leading-none text-amber">
            {s.peakConcurrent}
            <span className="ml-4 text-[30px] font-normal text-ink">
              divisions on inner ring
            </span>
          </p>
          <p className="mt-4 font-mono text-[21px] text-dim">
            {s.launches} branch offices · {s.foreground} direct teams · {s.shown}{" "}
            of {s.launches} shown
          </p>
        </Reveal>
      </div>
    </div>
  );
}
