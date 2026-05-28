# Plan - Overhaul Dashboard 6 (River Theme) to AAA Quality

This plan describes the step-by-step approach to overhauling Dashboard 6. Every step is designed to be self-contained and independently verifiable.

## 1. Code Analysis & Audit
- [x] Read `6-river/index.html` to map CSS classes and SVG nodes.
- [x] Read `6-river/app.js` to understand data structures, SVG drawing mechanisms, spring physics, and canvas particle system.
- [x] Read `6-river/style.css` to locate styling definitions, animations, and keyframes.

## 2. Eliminate Any Audio Elements (Zero Audio Requirement)
- [ ] Inspect files and completely delete/omit any audio contexts, Web Audio oscillators, synth triggers, speaker/sound icons, or comments referencing sounds.
- [ ] Confirm no sound UI elements exist in `index.html` or `style.css`.

## 3. High-Performance Throttled Mousemove & Single `requestAnimationFrame` Loop
- [ ] Centralize mouse tracking state (`clientX`, `clientY`, `targetParallaxX`, `targetParallaxY`, `curParallaxX`, `curParallaxY`, etc.).
- [ ] Throttle window `mousemove` handlers using a single frame-rate RAF tick.
- [ ] Create a single, consolidated `requestAnimationFrame` loop that updates:
  1. Multi-layer Holographic 3D Parallax (LERPed values).
  2. 3D card tilt & light shine for hovered `.kpi-card` and `.chart-container`.
  3. Hooke's Law Spring-Mass grid lines physics ($k=0.08, c=0.12, dt=0.16$).
  4. Ambient Canvas Particles (`class Bubble`) with a 4-octave FBM noise wind field.
  5. Click water ripples (`class Ripple`) expanding and exerting a strong circumference-based radial push.
  6. Chart cursor scanning line position, LERPed Tooltip coordinates, and node active state updates.

## 4. Implement 4-Octave FBM Noise Field & River Physics
- [ ] Define a multi-octave Fractional Brownian Motion (FBM) noise function in JavaScript:
  $$\text{fbm}(x, y, t) = \sum_{i=0}^{3} a_i \sin(x f_i + t \cdot w_i) \cos(y f_i - t \cdot h_i)$$
- [ ] Integrate this noise vector field to affect the rising bubble clusters (`Bubble` velocity updates).
- [ ] Refine cursor repulsion and expanding click ripple physical radial pushing force.

## 5. Implement Premium SVG Chart & LERP Tooltip Glide Tracking
- [ ] Add SVG self-drawing stroke animation on path (`.chart-line-revenue`, `.chart-line-cost`).
- [ ] Style bouncy node popping circles with sequential delay using `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- [ ] Implement LERP coordinate glide tracking for the glassmorphic tooltip to make transitions extremely smooth.

## 6. Verification
- [ ] Open index.html in a local browser (or perform structural and code checks) to verify absolute silence, high-performance rendering (60 FPS, 0% paint jank), robust FBM drift, smooth card tilt, LERP glide tracking of tooltip, and spring physics.
- [ ] Run a lint-like pass over the JS code to ensure `"use strict"` and no strict errors.
- [ ] Save changes.md and handoff.md.
