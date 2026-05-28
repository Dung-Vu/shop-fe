## 2026-05-26T14:17:35Z
Complete the front-end overhaul of Showcase Hub (`index.html`) at project root AND Dashboard 1 (`1-ice-frost/app.js`, `1-ice-frost/index.html`, `1-ice-frost/style.css`) as the Pioneer Dashboard, elevating them to AAA-grade visual breakthroughs under 60 FPS, with absolute zero audio.

Mandatory Guidelines & Constraints:
- DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
- Strict Mode: Wrap all JavaScript in `"use strict"` inside self-encapsulating IIFEs.
- No external CSS or JS libraries (D3, Chart.js, etc.) are allowed.
- Zero Audio: Delete any existing oscillators, playSynth hooks, Web Audio Context objects, sound comments/leftovers, or "Sound toggle / Speaker" sidebar HTML/CSS/JS buttons in Dashboard 1 and the Showcase Hub.

Features to Implement:

1. **Advanced FBM Particle Engine (Dashboard 1: Ice Swirl)**:
   - Enhance the canvas particles algorithm in `1-ice-frost/app.js` (`class FluidParticle`) to use a true Fractional Brownian Motion (FBM) noise mathematical representation.
   - Implement an FBM noise generator function using multi-octave (3 to 4 octaves) harmonic sine/cosine wave superposition with lacunarity (e.g. frequency * 2) and gain (amplitude * 0.5):
     $$FBM(x, y, t) = \sum_{i=1}^4 a_i \cdot \sin(x \cdot f_i + t \cdot s_i) \cdot \cos(y \cdot f_i - t \cdot s_i)$$
   - Float organic "Ice crystal/frost flake" particles drifting smoothly in this turbulent vector flow.
   - Ensure mouse cursor coordinates within 180px apply natural vortex/swirl forces to deflect particles.

2. **Premium SVG Interactive Charts (Dashboard 1)**:
   - SVG progressive draw: Add SVG dash-array and dash-offset CSS animation transition so path (`.chart-line-revenue`, `.chart-line-cost`) draws itself smoothly from left to right on page load and Period tab change.
   - Data nodes sequential bouncy scale-in: Sequential scaling transition for circle elements `.chart-data-node` with a bouncy cubic-bezier: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
   - Tooltip hover tracking: Zoom transition (scale 0.9 to 1.0) and glassmorphic backdrop-filter blur. Hover coords must follow cursor smoothly with interpolation.
   - Spring-Mass physical grid bounce: Hovering near horizontal lines plucks them elastically using Hooke's Law Spring-Mass decay model (k=0.08, c=0.12, dt=0.16) in a silent physics update.

3. **3D Parallax & Light Shine (Dashboard 1)**:
   - Layered perspective 1200px: Throttled mouse tracking drifts `.bg-blur-container` with opposite ratio `-25` (scale 1.06), `.sidebar` with ratio `8`, and `.main-content` with ratio `12`.
   - 3D Card tilting: Interactive hover card tilt on `.kpi-card` and `.chart-container` elements.
   - Radial light shine: Track mouse position gradient update.
   - Path flow pulse: CSS animation moving glowing flow pulse along the SVG paths.

4. **Showcase Hub (index.html) Portal Overhaul**:
   - 3D Ring Carousel: Cylindrical carousel snapping to the nearest face (60-deg increments) on Y-axis. Drag and mouse-scroll wheel navigation support.
   - Background Glow Orbs: Seamlessly transition background gradients to match the color theme of the active card (cyan, timber, autumn orange, winter blue, forest green, river teal).
   - Launch Spark Particle Canvas Transition: On launching a dashboard, generate a spectacular spark particle explosion from the center of the card, transitioning cleanly with NO sound.

5. **Performance & Scheduling Optimization**:
   - Combine grid plucking physics and particle canvas loops into a single unified `requestAnimationFrame` tick loop in `1-ice-frost/app.js`.
   - Throttle the heavy mousemove event handlers (parallax, tilt) using a single requestAnimationFrame tick to guarantee zero paint jank and locked 60 FPS.
   - Ensure no memory leaks or redundant listeners exist.

Deliverables:
- Implement the requested overhauls on `index.html` (Showcase Hub) and `1-ice-frost/` (app.js, index.html, style.css).
- Run and verify the changes in a browser (or check syntactical and logical flow).
- Write a detailed `changes.md` and `handoff.md` inside your directory `d:\dashboard-cost\.agents\teamwork_preview_worker_m2_1\`.
- When done, report back to the Project Orchestrator (conversation ID: b10f388f-c1f9-4f8a-8c1f-ae517bd3e4b3).
