# Context & Discoveries

## Directory Layout Mappings
- `.agents/orchestrator/` - Project Orchestrator metadata
- `1-ice-frost/` - Ice Theme Dashboard (app.js, style.css, index.html)
- `2-warm-timber/` - Timber Theme Dashboard (app.js, style.css, index.html)
- `3-autumn/` - Autumn Theme Dashboard (app.js, style.css, index.html)
- `4-winter/` - Winter Theme Dashboard (app.js, style.css, index.html)
- `5-forest/` - Forest Theme Dashboard (app.js, style.css, index.html)
- `6-river/` - River Theme Dashboard (app.js, style.css, index.html)
- `index.html` - Showcase Hub Portal

## Explorer Key Discoveries (Milestone 1)
- **Audio System Status:** Zero Web Audio implemented, but comments and synth UI controls might exist. We must remove all audio comments, button toggles, oscillator wrappers, or Web Audio leftovers.
- **Trigonometric "FBM" Wind Formula:**
  - Standard formula in app.js currently: `Math.sin(this.x * scale + t) * Math.cos(this.y * scale - t) * Math.PI * [1.5 to 2.5]`
  - Needs true FBM noise: We need to implement a multi-octave FBM generator (using at least 3-4 octaves of layered sine/cosine functions or standard noise) to create natural turbulence.
- **Interactive Chart Spline Logic:**
  - Horizontal-tangent cubic Bézier spline interpolation is calculated via `getCurvePathD()` inside `renderChart()`.
- **Spring-Mass Grid Lines Physics Parameters:**
  - Stiffness $k = 0.08$
  - Damping coefficient $c = 0.12$
  - Time delta $dt = 0.16$
  - Vibration decay occurs until displacement $< 0.01$.
- **Parallax Layer Ratios:**
  - Backdrop (`.bg-blur-container`): Drift ratio `-25` (moves opposite to mouse), scale factor `1.06`.
  - Sidebar (`.sidebar`): Drift ratio `8` (moves positive).
  - Main Content (`.main-content`): Drift ratio `12` (moves positive).
- **Showcase Hub Carousel Layout:**
  - 6 cards arranged on a cylindrical ring with Y-axis rotation increments of 60 degrees, translated outwards by 460px on the Z-axis.
  - Snapshot snap: `Math.round(targetAngle / 60) * 60`.
  - Background Orbs: Cyan and Purple radial gradients.

## Critical Performance Bottlenecks to Fix:
1. **Unthrottled Mousemove:** Holographic Parallax directly updates blurred glassmorphic layers on every single pixel movement. We need to throttle this inside a `requestAnimationFrame` loop.
2. **CPU shadowBlur in Forest:** `5-forest/app.js` runs Gaussian blur in CPU every frame (`shadowBlur = 8`, `shadowColor`). We must optimize this by pre-rendering a single glowing firefly particle onto an offscreen canvas sprite.
3. **Dual RAF Loops:** Grid physics and particles run in parallel RAF loops. We must consolidate them into a single, unified main game-loop tick per dashboard.
