---
name: "deck-kit:check-your-environment"
description: Use when you're not sure what your machine can run, whether you're allowed to install anything, or which build to choose — before you follow getting-started.
---

# Check Your Environment

> **Deck Kit** — build a presentation deck as code with your coding agent.

This kit is a Node.js project: the full experience needs Node installed and the ability to run `npm install`. Plenty of people — especially on a locked-down work laptop — don't know whether they have Node, or whether they're even allowed to install it. This skill is the step before *getting-started*: find out what your machine can actually run, then pick the build that fits.

The common mistake is assuming you must install a full toolchain, hitting a permissions wall, and giving up — when your agent could have told you where you stand in thirty seconds, and there's a lighter path if the full kit is blocked.

## When to use this

- You don't know if Node is installed, or whether you're allowed to install it.
- You're on a managed / corporate machine and installers or admin rights may be restricted.
- You want to know, before you start, whether to use the full kit or a lighter no-install approach.
- You're briefing a coding agent and want it to check your setup for you rather than assuming.

## Let your agent check for you

You don't need to know any of this yourself — that's the point. Ask your coding agent to check, and it will run the right commands for your operating system and read back what you have. Hand it something like:

> Check my setup for the Deck Kit. Tell me: do I have Node.js and npm? Do I have git? What OS am I on? And can you tell whether I'm able to install software (admin rights / a package manager), or whether this looks like a locked-down machine? Then recommend which build I should use.

What it's checking (you can run these yourself too):

```bash
node -v          # Node.js version — the kit needs this (18+ is ideal)
npm -v           # npm — installs the kit's dependencies
git --version    # git — to clone the kit (optional; you can also download a zip)
```

If `node -v` prints a version, you can run the full kit. If it says "command not found", you either install Node or take the lighter path below.

## What you're allowed to install

On a personal machine you can almost always install Node from [nodejs.org](https://nodejs.org). On a **managed work machine** it's often different: installers may be blocked, you may not have admin rights, or a proxy may block downloads. Rather than guess, ask your agent to check whether you can install, and to try the smallest thing first. If you genuinely can't install Node, that's not a dead end — it just means the plain-HTML path below.

## Pick your build

| Path | What you need | What you get | The trade-off |
|------|---------------|--------------|---------------|
| **The full kit** (this repo) | Node + the ability to run `npm install` | The engine — slides auto-scale to 1920×1080, step navigation, an overview gallery, safe mode, and the one-folder-per-slide workflow the skills teach | Heavier to set up; blocked if you can't install Node |
| **Plain HTML/JS** (one file) | Any web browser | A single `.html` file you can open anywhere, e-mail, or drop on a shared drive — nothing to install | You're not using this kit's engine; your agent re-creates scaling and navigation by hand. Fine for a simple, mostly-linear deck; it strains on anything rich |

If you can install Node, use the full kit and continue with *getting-started*. If you can't, ask your agent to build you a **single self-contained HTML file** instead — one deck, inline CSS and JS, arrow keys to advance. You give up the kit's engine, but the way you *work* with your agent is the same.

## Worked example: check against the kit's own requirements

1. Ask your agent: "Read this kit's `package.json` and tell me what it needs to run." It points at the `scripts` block — `npm run dev` and `npm run build` — which both need Node and the installed dependencies. That's the bar your machine has to clear.
2. Have it run the checks: `node -v`, `npm -v`. Say it reports "Node not found, and this looks like a managed machine — installers may be blocked."
3. You decide: get Node installed (ask IT, or nodejs.org if you're allowed) and use the full kit, **or** take the plain-HTML path now and revisit later.
4. If plain-HTML: "Build me a single self-contained HTML slide deck — one file, no dependencies, left/right arrows to move between slides — starting with a title slide and three content slides." You're presenting in minutes.

## Try it with your agent

When you're ready to start, hand your agent the whole job:

> Check my setup for the Deck Kit — do I have Node and npm, and am I able to install software on this machine? Tell me which build to use. If I can't install Node, build me a single self-contained HTML slide deck instead (one file, no dependencies, arrow keys to move). Otherwise get the full kit running and we'll continue with getting-started.

## Related skills

- `getting-started` — the next step once you know you can install Node: get the full kit running and learn the slide / registry / shell model.
- `pick-a-form` — once you're building, choose the right form for each slide.
