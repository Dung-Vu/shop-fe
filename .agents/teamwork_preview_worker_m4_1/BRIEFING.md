# BRIEFING — 2026-05-26T21:24:00+07:00

## Mission
Overhaul Dashboard 4 (Winter) and Dashboard 5 (Forest) to AAA-grade visual quality based on Pioneer architecture with strict constraints (zero audio, single RAF, FBM snow/fireflies, offscreen canvas pre-rendering, interactive cards, etc.).

## 🔒 My Identity
- Archetype: Replication Worker for Dashboards 4-5
- Roles: implementer, qa, specialist
- Working directory: d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\
- Original parent: b10f388f-c1f9-4f8a-8c1f-ae517bd3e4b3
- Milestone: Milestone 4

## 🔒 Key Constraints
- DO NOT CHEAT. Genuine implementations only.
- Strict Mode: `"use strict"` inside IIFEs in JS.
- Zero Audio: No audio nodes, oscillators, synth plucking triggers, speaker/sound UI toggle buttons.
- Consolidate grid physics and ambient particles into a single `requestAnimationFrame` loop.
- Throttle window mousemove handlers using a single frame-rate RAF tick.
- Snowflake: drift under wind (4-octave FBM noise), aerodynamic repulsion <= 140px.
- Firefly: drift (4-octave FBM noise), attraction <= 200px.
- Performance: Fireflies MUST use offscreen canvas sprite pre-renderer at load time, drawn using `ctx.drawImage` to avoid `shadowBlur` bottleneck.
- Pioneer Features:
  - SVG self-drawing stroke animation on path (`.chart-line-revenue`, `.chart-line-cost`).
  - Sequential bouncy node popping circles (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
  - Glassmorphic tooltip with LERP coordinate interpolation glide tracking.
  - Hooke's Law Spring-Mass silent plucking grid physics (k=0.08, c=0.12, dt=0.16).
  - 3D Parallax: perspective 1200px drifts (Backdrop opposite drift ratio -25 with scale 1.06, Sidebar 8, Main Content 12).
  - Card Visuals: Interactive card 3D tilt (up to 8 degrees) on `.kpi-card` and `.chart-container`, radial hover shine light cursor follow, and glowing flow pulse animation along SVG curves.

## Current Parent
- Conversation ID: b10f388f-c1f9-4f8a-8c1f-ae517bd3e4b3
- Updated: 2026-05-26T21:24:00+07:00

## Task Summary
- **What to build**: AAA-grade winter and forest dashboards.
- **Success criteria**: Strict adherence to constraints, no audio, correct particle physics, spring-mass plucking grid, SVG path rendering, glassmorphic tooltips, 3D parallax, 3D card tilt & hover radial shine.
- **Interface contracts**: Standard Dashboard 4 & 5 HTML, CSS, and JS structure.
- **Code layout**: Modern web app, clean JS, CSS, and HTML.

## Key Decisions Made
- Wrap both `app.js` files in a `"use strict"` IIFE.
- Build a robust 4-octave FBM noise vector field from scratch for natural wind dynamics.
- Consolidate ALL animation states (card tilts, multi-layer parallax, grid spring vibration, snowflake/firefly particles, vertical crosshair and tooltip LERP glides) inside EXACTLY ONE `requestAnimationFrame` loop.
- Throttle raw `mousemove` event listeners to purely capture coordinates, performing all DOM updates and styles transformations asynchronously inside the RAF tick to avoid layout reflow paint janks.
- Implement an offscreen canvas rendering engine for Forest's Fireflies to completely eliminate the CPU `shadowBlur` bottleneck.

## Artifact Index
- d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\original_prompt.md — Original task prompt
- d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\BRIEFING.md — Briefing file
- d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\progress.md — Task tracking details
- d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\changes.md — Log of modifications applied
- d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\handoff.md — Complete handoff report
