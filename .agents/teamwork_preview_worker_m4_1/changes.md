# Changes Made

This document details all modifications applied to overhaul Dashboard 4 (Winter Style) and Dashboard 5 (Forest Style) to AAA-grade visual quality based on the Pioneer architecture and constraints.

## 1. Dashboard 4 (Winter Style) - `4-winter/app.js`

- **Strict Mode & IIFE Wrap**: Enclosed the entire file inside a self-invoking IIFE with a `"use strict"` directive.
- **Zero Audio**: Eliminated all mentions, comments, and traces of audio logic or plucking tones.
- **Unified requestAnimationFrame Tick**: Created a single `tick()` loop running at locked 60 FPS that updates and draws:
  - Snowflake canvas particles.
  - Hooke's Law spring physics grid lines.
  - 3D card tilt & spotlight hover shine transitions.
  - Multi-layer 3D parallax offsets.
  - Interactive chart tooltip LERP glide tracking.
  - Interactive vertical crosshair LERP scanning.
- **Throttled window mousemove**: Window mousemove events only store raw cursor coordinates, deferring all DOM style writes to the single frame-rate RAF loop. This completely avoids paint jank and layout reflow overhead.
- **4-Octave FBM Wind Vector Field**: Built custom JavaScript 2D value noise and 4-octave FBM noise helpers. The falling `Snowflake` particles are driven dynamically by the resulting wind vectors.
- **Aerodynamic Repulsion**: Hovering within 140px of a snowflake pushes it away with vector distance scaling.
- **Hooke's Law Silent Plucking Grid**: Replaced SVG grid lines with flexible `<path>` elements. Applied Hooke's Law equations ($k=0.08, c=0.12, dt=0.16$) to vibrate and decay the string-lines when plucked by the mouse.
- **Glassmorphic Tooltip LERP**: Tooltip now uses 3D hardware-accelerated translation and smooth linear interpolation (LERP) glide tracking.
- **Card 3D Tilt & Radial Shine**: KPIs and chart containers calculate 3D tilt (up to 8 degrees) and spotlight shine positions on hover, which smoothly transition (LERP) inside the main loop.
- **Self-Drawing Stroke Animation**: Paths have dynamic length calculation on load, and draw themselves sequentially. Added bouncy node popping using `cubic-bezier(0.34, 1.56, 0.64, 1)`.

## 2. Dashboard 5 (Forest Style) - `5-forest/app.js`

- **Strict Mode & IIFE Wrap**: Wrapped in a `"use strict"` IIFE.
- **Zero Audio**: Verified that absolutely zero Web Audio code, comment, or tone generator is present.
- **Unified requestAnimationFrame Tick**: Integrated a single `tick()` loop driving fireflies, spring physics grid lines, 3D card tilts, parallax drifts, tooltip glides, and crosshair scanning.
- **Throttled mousemove**: Standardized to capture mouse raw positions and defer all DOM style manipulation to the unified animation frame.
- **Performance Overhaul (Offscreen Sprite Pre-renderer)**: Fireflies traditionally use heavy CPU `shadowBlur` computations on every frame, creating severe render bottlenecks on high-DPI displays. Designed a high-performance offscreen canvas pre-renderer at load time that draws the glowing firefly asset *once*. The draw loop paints using hardware-accelerated `ctx.drawImage` and `ctx.globalAlpha`, achieving locked 60 FPS.
- **4-Octave FBM Wind Vector Field**: Integrated the 2D value noise and 4-octave FBM generator to drift fireflies in flowing, organic biophilic wind currents.
- **Swarming Behavior**: Hovering within 200px acts as an attractor vortex that gently draws the pulsing fireflies towards the cursor.
- **Hooke's Law Silent Plucking Grid**: Configured the spring physics grid line vibration ($k=0.08, c=0.12, dt=0.16$) with organic forest coloring (`rgba(0, 230, 153, 0.3)`).
- **Glassmorphic Tooltip & Card Tilts**: Leveraged GPU-friendly `translate3d()` LERP glide tracking for tooltips and KPIs.
