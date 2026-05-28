# CHANGES - 2026-05-26T14:22:15Z

## Modified Files

### 1. `d:\dashboard-cost\2-warm-timber\app.js`
- **Wrapping in IIFE**: Wrapped all dashboard code inside a strict-mode IIFE `(function () { "use strict"; ... })();` to protect global scope and ensure compliance with our strict-mode constraint.
- **Dynamic visual perks injection**: Injected dynamic styling for premium `.chart-line-revenue-flow`, `.chart-line-cost-flow`, `.chart-node.active`, elastic grid lines, KPI card hover glows, and body perspective.
- **3D Parallax & card tilt**: Implemented 3D layout perspective tracking and LERPed KPI card tilt (up to 8 degrees) with cursor-following radial glow highlights.
- **Hooke's Law spring physics**: Converted vertical lines to quadratic SVG Bézier path strings (`d="M 50 y Q 300 yMid 550 y"`), updating displacement and velocity using spring-mass physics (k=0.08, c=0.12, dt=0.16).
- **Consolidated `requestAnimationFrame` loop**: Consolidated parallax drift updates, card 3D tilt adjustments, grid spring-mass vibrations, fluid ember sparks updates, and tooltip coordinate glide tracking into a single unified high-performance loop `unifiedTick()`.
- **4-octave FBM sparks field**: Built a true 4-octave Fractal Brownian Motion noise vector field directing sparks rising and swirling. Swirl vortex forces (180px) are deflected by the cursor.
- **LERP Tooltip tracking**: Replaced rigid immediate tooltip updating with coordinate interpolation glide bám đuổi (`0.12` decay factor) via `unifiedTick()`.
- **Zero Audio**: Removed all sound, synth plucking triggers, oscillators, and comment remnants.

### 2. `d:\dashboard-cost\3-autumn\app.js`
- **Wrapping in IIFE**: Wrapped the entire script inside a strict-mode IIFE `(function () { "use strict"; ... })();`.
- **Consolidated `requestAnimationFrame` loop**: Consolidated parallax drift updates, card tilt adjustments, grid spring-mass vibration decay, leaf wind vector simulation, and tooltip coordinate glide tracking into a single unified `unifiedTick()` loop.
- **4-octave FBM swaying leaves**: Created a true 4-octave FBM wind field directing leaf particle vectors. Included detailed falling leaf shapes (ellipse path + center vein line) and organic leaf sway/flutter oscillations.
- **Soft velocity additions**: Programmed organic vortex/attract deflection forces within 150px to add directly to leaf velocities (`this.vx += ...; this.vy += ...;`) instead of modifying coordinates directly, ensuring smooth, realistic, inertia-based drift.
- **LERP Tooltip tracking**: Configured LERP-based bám đuổi glide coordination tracking for the chart tooltip.
- **Hooke's Law grid lines**: Implemented silent plucking elastic grid lines with Spring-Mass physics.
- **Zero Audio**: Verified and ensured zero sound oscillators, Web Audio context, and UI triggers are present.
