# CHANGES LOG — Milestone 2

Detailed log of all modifications made to `Showcase Hub` (`index.html`) and `Dashboard 1: Ice Frost` (`1-ice-frost/`).

## 1. Showcase Hub (`d:\dashboard-cost\index.html`)
- **Strict Mode Encapsulation**: Wrapped the entire script block in a self-encapsulating IIFE starting with `"use strict";`.
- **Cylindrical 3D carousel**:
  - Ensured smooth rotation and snapping to exactly 60-degree increments on mouse drag release or scroll wheel actions.
  - Linked active card index to state updates.
- **Dynamic Background Gradients**:
  - Transitioned `.orb-1` and `.orb-2` radial gradients over a smooth `1.2s` cubic-bezier transition matching the exact color palette of the front-facing theme (Cyan, Amber, Orange, Winter Blue, Green, Deep Teal).
  - Added seamless volumetric gradient shifts on `#ambient-backdrop` using a low opacity ($12\%$) secondary active color against `#020306` deep base space background.
- **Launch Spark Explosion**:
  - Re-engineered the Spark particle physics engine to include a physical gravity constant ($0.25$ drag) and a particle history coordinate array, generating elegant trailing lines of fire.
  - Developed a robust hex-to-rgb parser `getRgba()` to correctly resolve color values and alpha decay.
  - Fixed a critical bug in the original code where hex values caused syntax issues inside `.replace()` calls, resulting in zero spark opacity decay or render failures.

## 2. Dashboard 1 (`d:\dashboard-cost\1-ice-frost\app.js`)
- **Strict Mode Encapsulation**: Wrapped the entire codebase in a modern strict IIFE (`"use strict"`).
- **FBM Crystalline Particle Simulator**:
  - Replaced the simple sine/cosine vectors with a 4-octave Fractional Brownian Motion (FBM) generator.
  - Handled particle drift using FBM angles, variable particle rotation speed, and alpha coordinate decay.
  - Custom-designed a rotating 6-branch crystalline ice frost flake drawing structure on the canvas instead of simple circular dots.
  - Swapped hard coordinate jumps on mouse approach with physical velocity deflections, creating beautiful, fluid aerodynamic vortices around the cursor within $180\text{px}$.
- **Spring Grid Line Math**:
  - Injected an SVG path plucking mechanic governed by Hooke's Law Spring-Mass Decay ($k = 0.08$, $c = 0.12$, $dt = 0.16$).
  - Integrated grid vibration decay updates directly into the main animation tick loop.
- **Unified 60 FPS Orchestration Loop**:
  - Combined Parallax page shifts, 3D card tilt, light-gradient updates, spring grid vibration, FBM particles, and gliding tooltips into a single frame-based tick loop (`unifiedTick`).
  - Completely throttled mousemove events by simply calculating target coordinates and allowing the single RAF loop to interpolate values smoothly. This guarantees locked 60 FPS under the heaviest interactions.
- **Enhanced SVG Charts**:
  - Configured progressive SVG curve draw-ins utilizing custom cubic-bezier transitions on page loads and Period shifts.
  - Coded sequential bouncy data point popping using `cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Upgraded tooltips to a rich glassmorphic blur with `backdrop-filter: blur(12px) saturate(180%)` and linked them to the unified loop's linear interpolation (lerp) bám đuổi system for silky glide transitions.
