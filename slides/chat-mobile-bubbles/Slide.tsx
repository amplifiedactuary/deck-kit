"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SlideMeta, SlideProps } from "@/lib/types";
import rawConversation from "./data/conversation.json";

export const meta: SlideMeta = {
  id: "chat-mobile-bubbles",
  title: "Mobile bubbles",
  steps: 6,
  themes: [],
  group: "chat",
  hasSafeMode: true,
};

/* ---------------------------------- data ---------------------------------- */

type Sender = "manager" | "analyst";

interface MessageItem {
  type: "message";
  id: string;
  sender: Sender;
  text: string;
  step: number;
}

interface DividerItem {
  type: "divider";
  id: string;
  day: string;
  time: string;
  step: number;
}

interface ReceiptItem {
  type: "receipt";
  id: string;
  label: string;
  step: number;
}

type ChatItem = MessageItem | DividerItem | ReceiptItem;

interface ConversationData {
  contactName: string;
  contactStatus: string;
  items: ChatItem[];
}

const DATA = rawConversation as unknown as ConversationData;

/* --------------------------------- styling -------------------------------- */

const CANVAS_BG = "#06080f";
const BLUE_TOP = "#3d8bff";
const BLUE_BOTTOM = "#0a64f0";
const GREY = "#e9e9ee";
const DARK_TEXT = "#15161c";
const FAINT = "rgba(235,235,245,0.45)";
const CHAT_FONT =
  '-apple-system, "SF Pro Text", "Helvetica Neue", "Segoe UI", system-ui, sans-serif';

const SPRING = { type: "spring", stiffness: 420, damping: 26, mass: 0.9 } as const;

/** ms after the step starts before each item pops (analyst items show typing dots while waiting). */
const ARRIVAL_MS: Record<string, number> = {
  d1: 0,
  m1: 150,
  m2: 1000,
  m3: 1000,
  m4: 200,
  m5: 1000,
  m6: 2000,
  d2: 0,
  m7: 1100,
  m8: 2200,
  r1: 3000,
};

const DOT_STYLE = {
  width: 13,
  height: 13,
  borderRadius: 7,
  background: "#8e8e96",
  display: "inline-block",
} as const;

/* --------------------------------- helpers -------------------------------- */

type RowState = "hidden" | "arriving" | "shown";

function rowState(itemStep: number, step: number, direction: 1 | -1): RowState {
  if (itemStep > step) return "hidden";
  if (itemStep < step) return "shown";
  return direction === 1 ? "arriving" : "shown";
}

function marginFor(i: number): number {
  if (i === 0) return 8;
  const item = DATA.items[i];
  const prev = DATA.items[i - 1];
  if (item.type === "divider") return 26;
  if (item.type === "receipt") return 8;
  if (prev.type === "divider") return 16;
  if (prev.type === "message" && item.type === "message" && prev.sender === item.sender) {
    return 7;
  }
  return 18;
}

/** iMessage groups bubbles: only the last visible bubble of a same-sender run gets a tail. */
function tailFor(i: number, step: number): boolean {
  const item = DATA.items[i] as MessageItem;
  const next = DATA.items[i + 1];
  if (!next || next.type !== "message") return true;
  if (next.sender !== item.sender) return true;
  return next.step > step;
}

/** True once the item's arrival delay has elapsed (instant for already-shown items). */
function useArrived(state: RowState, waitMs: number): boolean {
  // No reset on re-arrival: slides remount on replay (restartKey), which is the
  // supported way to re-run the choreography; revisiting a step shows instantly.
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (state !== "arriving") return;
    const t = setTimeout(() => setDone(true), waitMs);
    return () => clearTimeout(t);
  }, [state, waitMs]);
  if (state === "shown") return true;
  if (state === "hidden") return false;
  return done;
}

/* ------------------------------ chrome pieces ------------------------------ */

function Avatar() {
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{ width: 56, height: 56, background: "linear-gradient(180deg,#e08a64,#c65f3c)" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M5.6 5.6l12.8 12.8" />
          <path d="M18.4 5.6L5.6 18.4" />
        </g>
      </svg>
    </div>
  );
}

function ChatHeader() {
  return (
    <div
      className="relative flex shrink-0 items-center justify-between"
      style={{
        height: 96,
        borderBottom: "1px solid rgba(255,255,255,0.09)",
        padding: "0 28px",
      }}
    >
      <svg width="20" height="34" viewBox="0 0 20 34" fill="none" aria-hidden="true">
        <path
          d="M17 2 L3 17 L17 32"
          stroke={BLUE_TOP}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
        style={{ gap: 16 }}
      >
        <Avatar />
        <div>
          <div
            className="font-display"
            style={{ fontSize: 28, fontWeight: 600, color: "#f4f4f6", lineHeight: "32px" }}
          >
            {DATA.contactName}
          </div>
          <div
            className="flex items-center"
            style={{ fontSize: 17, color: "rgba(235,235,245,0.5)", gap: 8 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 5,
                background: "#30d158",
                display: "inline-block",
              }}
            />
            {DATA.contactStatus}
          </div>
        </div>
      </div>
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke={BLUE_TOP} strokeWidth="2.5" />
        <path d="M25 9 L32.5 4.5 V19.5 L25 15 Z" fill={BLUE_TOP} />
      </svg>
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: CANVAS_BG }}>
      <div
        className="absolute"
        style={{
          left: "50%",
          top: -300,
          width: 1200,
          height: 620,
          transform: "translateX(-50%)",
          background: "radial-gradient(closest-side, rgba(61,139,255,0.10), transparent)",
        }}
      />
      <div
        className="absolute left-1/2 flex h-full -translate-x-1/2 flex-col"
        style={{
          width: 920,
          fontFamily: CHAT_FONT,
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <ChatHeader />
        <div className="flex w-full flex-1 flex-col" style={{ padding: "10px 8px 26px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- chat pieces ------------------------------- */

function Tail({ mine }: { mine: boolean }) {
  const color = mine ? BLUE_BOTTOM : GREY;
  return mine ? (
    <>
      <span
        className="absolute"
        style={{
          right: -10,
          bottom: 0,
          width: 28,
          height: 26,
          background: color,
          borderBottomLeftRadius: 22,
        }}
      />
      <span
        className="absolute"
        style={{
          right: -16,
          bottom: -1,
          width: 16,
          height: 30,
          background: CANVAS_BG,
          borderBottomLeftRadius: 16,
        }}
      />
    </>
  ) : (
    <>
      <span
        className="absolute"
        style={{
          left: -10,
          bottom: 0,
          width: 28,
          height: 26,
          background: color,
          borderBottomRightRadius: 22,
        }}
      />
      <span
        className="absolute"
        style={{
          left: -16,
          bottom: -1,
          width: 16,
          height: 30,
          background: CANVAS_BG,
          borderBottomRightRadius: 16,
        }}
      />
    </>
  );
}

function Bubble({ msg, tail }: { msg: MessageItem; tail: boolean }) {
  const mine = msg.sender === "manager";
  return (
    <div
      className="relative"
      style={{
        maxWidth: 640,
        padding: "12px 21px",
        borderRadius: 26,
        background: mine ? `linear-gradient(180deg, ${BLUE_TOP}, ${BLUE_BOTTOM})` : GREY,
        color: mine ? "#ffffff" : DARK_TEXT,
      }}
    >
      <p className="relative" style={{ fontSize: 30, lineHeight: "37px", margin: 0, zIndex: 1 }}>
        {msg.text}
      </p>
      {tail && <Tail mine={mine} />}
    </div>
  );
}

function TypingPill() {
  return (
    <div
      className="relative flex items-center"
      style={{
        gap: 9,
        padding: "19px 22px",
        borderRadius: 26,
        background: GREY,
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={DOT_STYLE}
          animate={{ y: [0, -7, 0], opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: 1.0, delay: i * 0.16, ease: "easeInOut" }}
        />
      ))}
      <Tail mine={false} />
    </div>
  );
}

function DividerLabel({ item }: { item: DividerItem }) {
  return (
    <>
      <span style={{ fontWeight: 700 }}>{item.day}</span> {item.time}
    </>
  );
}

/* ------------------------------ animated rows ------------------------------ */

function MessageRow({
  msg,
  state,
  waitMs,
  tail,
  marginTop,
}: {
  msg: MessageItem;
  state: RowState;
  waitMs: number;
  tail: boolean;
  marginTop: number;
}) {
  const arrived = useArrived(state, waitMs);
  const mine = msg.sender === "manager";
  const visible = state !== "hidden" && arrived;
  const typing = !mine && state === "arriving" && !arrived;
  return (
    <div
      className="relative flex w-full"
      style={{ marginTop, justifyContent: mine ? "flex-end" : "flex-start" }}
    >
      <motion.div
        className="flex w-full"
        initial={false}
        animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.55, y: 18 }}
        transition={visible && state === "arriving" ? SPRING : { duration: 0 }}
        style={{
          transformOrigin: mine ? "100% 100%" : "0% 100%",
          justifyContent: mine ? "flex-end" : "flex-start",
        }}
      >
        <Bubble msg={msg} tail={tail} />
      </motion.div>
      {typing && (
        <motion.div
          className="absolute"
          style={{ left: 0, bottom: 0 }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <TypingPill />
        </motion.div>
      )}
    </div>
  );
}

function DividerRow({
  item,
  state,
  marginTop,
}: {
  item: DividerItem;
  state: RowState;
  marginTop: number;
}) {
  const visible = state !== "hidden";
  return (
    <motion.div
      className="w-full text-center"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: state === "arriving" ? 0.4 : 0 }}
      style={{ marginTop, fontSize: 19, color: FAINT }}
    >
      <DividerLabel item={item} />
    </motion.div>
  );
}

function ReceiptRow({
  item,
  state,
  waitMs,
  marginTop,
}: {
  item: ReceiptItem;
  state: RowState;
  waitMs: number;
  marginTop: number;
}) {
  const arrived = useArrived(state, waitMs);
  const visible = state !== "hidden" && arrived;
  return (
    <motion.div
      className="w-full text-right"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: visible && state === "arriving" ? 0.45 : 0 }}
      style={{ marginTop, fontSize: 18, fontWeight: 600, color: FAINT, paddingRight: 8 }}
    >
      {item.label}
    </motion.div>
  );
}

/* ------------------------------- static path ------------------------------- */

/** Distinct safe-mode markup: the full conversation up to `step`, no motion, no typing dots. */
function StaticChat({ step }: { step: number }) {
  return (
    <Frame>
      {DATA.items.map((item, i) => {
        const hidden = item.step > step;
        const marginTop = marginFor(i);
        if (item.type === "divider") {
          return (
            <div
              key={item.id}
              className="w-full text-center"
              style={{ marginTop, opacity: hidden ? 0 : 1, fontSize: 19, color: FAINT }}
            >
              <DividerLabel item={item} />
            </div>
          );
        }
        if (item.type === "receipt") {
          return (
            <div
              key={item.id}
              className="w-full text-right"
              style={{
                marginTop,
                opacity: hidden ? 0 : 1,
                fontSize: 18,
                fontWeight: 600,
                color: FAINT,
                paddingRight: 8,
              }}
            >
              {item.label}
            </div>
          );
        }
        const mine = item.sender === "manager";
        return (
          <div
            key={item.id}
            className="flex w-full"
            style={{
              marginTop,
              opacity: hidden ? 0 : 1,
              justifyContent: mine ? "flex-end" : "flex-start",
            }}
          >
            <Bubble msg={item} tail={tailFor(i, step)} />
          </div>
        );
      })}
    </Frame>
  );
}

/* ---------------------------------- slide ---------------------------------- */

export default function Slide({ step, direction, safeMode, isActive }: SlideProps) {
  if (safeMode || !isActive) {
    return <StaticChat step={step} />;
  }
  return (
    <Frame>
      {DATA.items.map((item, i) => {
        const state = rowState(item.step, step, direction);
        const marginTop = marginFor(i);
        if (item.type === "divider") {
          return <DividerRow key={item.id} item={item} state={state} marginTop={marginTop} />;
        }
        if (item.type === "receipt") {
          return (
            <ReceiptRow
              key={item.id}
              item={item}
              state={state}
              waitMs={ARRIVAL_MS[item.id] ?? 200}
              marginTop={marginTop}
            />
          );
        }
        return (
          <MessageRow
            key={item.id}
            msg={item}
            state={state}
            waitMs={ARRIVAL_MS[item.id] ?? 200}
            tail={tailFor(i, step)}
            marginTop={marginTop}
          />
        );
      })}
    </Frame>
  );
}
