## 2026-05-26T21:19:58Z

You are the Replication Worker for Dashboards 4-5 (teamwork_preview_worker). Your working directory is d:\dashboard-cost\.agents\teamwork_preview_worker_m4_1\.

Task:
Overhaul Dashboard 4 (`4-winter/app.js`, `index.html`, `style.css`) and Dashboard 5 (`5-forest/app.js`, `index.html`, `style.css`) to AAA-grade visual quality based on our verified Pioneer architecture.

Mandatory Guidelines & Constraints:
- DO NOT CHEAT. All implementations must be genuine. A Forensic Auditor will independently verify your work.
- Strict Mode: Wrap all JavaScript in `"use strict"` inside IIFEs.
- Zero Audio: Delete any oscillators, Web Audio contexts, synth plucking triggers, speaker/sound UI toggle buttons in sidebars, or comments.
- Combine grid physics and ambient canvas particles into a single consolidated `requestAnimationFrame` loop.
- Throttle window mousemove handlers using a single frame-rate RAF tick to ensure locked 60 FPS and 0% paint jank.

Theme Specifics:
1. **Dashboard 4 (Winter)**:
   - Particles: `class Snowflake` falling snow crystals. Drift under wind computed from 4-octave FBM noise vector field.
   - Mouse hover within 140px exerts aerodynamic repulsion, pushing snowflakes away from cursor.
2. **Dashboard 5 (Forest)**:
   - Particles: `class Firefly` glowing and pulsing under 4-octave FBM vector field.
   - Mouse hover within 200px attracts fireflies (swarming behavior).
   - **PERFORMANCE ENHANCEMENT**: Fireflies use CPU shadow blurs. You MUST implement an **offscreen canvas sprite pre-renderer** at load time. Paint the glowing firefly sprite onto an offscreen canvas once, and draw using `ctx.drawImage` to eliminate the heavy CPU shadowBlur bottleneck!

Pioneer Shared Features:
- Premium SVG Charts: SVG self-drawing stroke animation on path (`.chart-line-revenue`, `.chart-line-cost`), sequential bouncy node popping circles (`cubic-bezier(0.34, 1.56, 0.64, 1)`), glassmorphic tooltip with LERP coordinate interpolation glide tracking, Hooke's Law Spring-Mass silent plucking grid physics (k=0.08, c=0.12, dt=0.16).
- 3D Parallax: perspective 1200px drifts (Backdrop opposite drift ratio -25 with scale 1.06, Sidebar 8, Main Content 12).
- Card Visuals: Interactive card 3D tilt (up to 8 degrees) on `.kpi-card` and `.chart-container`, radial hover shine light cursor follow, and glowing flow pulse animation along SVG curves.

Write a detailed `changes.md` and `handoff.md` in your working directory. Report completion back to the Project Orchestrator (conversation ID: b10f388f-c1f9-4f8a-8c1f-ae517bd3e4b3).
