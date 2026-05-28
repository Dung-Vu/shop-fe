## 2026-05-26T14:19:58Z
You are the Replication Worker for Dashboard 6 (teamwork_preview_worker). Your working directory is d:\dashboard-cost\.agents\teamwork_preview_worker_m5_1\.

Task:
Overhaul Dashboard 6 (`6-river/app.js`, `index.html`, `style.css`) to AAA-grade visual quality based on our verified Pioneer architecture.

Mandatory Guidelines & Constraints:
- DO NOT CHEAT. All implementations must be genuine. A Forensic Auditor will independently verify your work.
- Strict Mode: Wrap all JavaScript in `"use strict"` inside IIFEs.
- Zero Audio: Delete any oscillators, Web Audio contexts, synth plucking triggers, speaker/sound UI toggle buttons in sidebars, or comments.
- Combine grid physics and ambient canvas particles into a single consolidated `requestAnimationFrame` loop.
- Throttle window mousemove handlers using a single frame-rate RAF tick to ensure locked 60 FPS and 0% paint jank.

Theme Specifics:
- **Dashboard 6 (River)**:
  - Particles: `class Bubble` rising bubble clusters.
  - Clicks: Window click spawns dynamic `class Ripple`.
  - Wind: Bubbles rise and drift under the influence of a 4-octave FBM noise vector field.
  - Interaction: Bubbles are repelled from the cursor position. When a click ripple expands, it exerts a smooth, strong physical radial pushing force on bubbles situated along the expanding ripple circumference.

Pioneer Shared Features:
- Premium SVG Charts: SVG self-drawing stroke animation on path (`.chart-line-revenue`, `.chart-line-cost`), sequential bouncy node popping circles (`cubic-bezier(0.34, 1.56, 0.64, 1)`), glassmorphic tooltip with LERP coordinate interpolation glide tracking, Hooke's Law Spring-Mass silent plucking grid physics (k=0.08, c=0.12, dt=0.16).
- 3D Parallax: perspective 1200px drifts (Backdrop opposite drift ratio -25 with scale 1.06, Sidebar 8, Main Content 12).
- Card Visuals: Interactive card 3D tilt (up to 8 degrees) on `.kpi-card` and `.chart-container`, radial hover shine light cursor follow, and glowing flow pulse animation along SVG curves.

Write a detailed `changes.md` and `handoff.md` in your working directory. Report completion back to the Project Orchestrator (conversation ID: b10f388f-c1f9-4f8a-8c1f-ae517bd3e4b3).
