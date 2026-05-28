# Project Plan - AURA Enterprise Analytics Suite V5.0 Overhaul

## Strategy: The Pioneer Overhaul & Parallel Replication Track

To complete the 5 high-end pillars (R1 to R5) across the 6 Cost Dashboards and the Showcase Hub Portal while maintaining absolute architectural consistency and zero-defect velocity, we employ the **Pioneer Dashboard Pattern** combined with a **Dual-Track Testing Strategy**:

1. **E2E Testing Track**:
   - We will design and implement a robust automated E2E testing framework. Since these are frontend-only HTML/JS/CSS dashboards, we will create a browser-based testing tool or a custom verification script (e.g. using Puppeteer or a pure Node/JSDOM harness) to verify features programmatically.
   - We will implement Tiers 1-4 tests covering Feature Coverage, Boundary/Corner cases, Cross-Feature Combinations, and Real-World Scenarios.
   
2. **Pioneer Overhaul (Dashboard 1: Ice Frost)**:
   - We will implement all 5 pillars (R1 to R5) on **Dashboard 1 (Ice Frost)** first.
   - We will verify and refine the custom forecast regression/Holt-Winters logic, spring-mass physics controls, localStorage state, multi-dashboard comparative chart drawing, and print stylesheets.
   - Once the Pioneer is 100% verified, it serves as the golden master.

3. **Replication Track (Dashboards 2 to 6)**:
   - We will replicate the verified Golden Master architecture, styles, and controllers across the remaining 5 dashboards.
   - We will group the replication tasks to run parallel subagent iterations.

4. **Forensic Integrity Audit & Hardening**:
   - Run the E2E test suite on all dashboards, perform white-box adversarial coverage checks, and secure a clean Forensic Auditor verdict.

---

## Milestones & Status

| # | Milestone Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| **M1** | Test Infra & Pioneer Overhaul | Set up E2E test runner, implement all 5 pillars on `1-ice-frost` | None | DONE |
| **M2** | Replication Part 1 (Dashboards 2-3) | Replicate pillars R1-R5 to `2-warm-timber` & `3-autumn` | M1 | DONE |
| **M3** | Replication Part 2 (Dashboards 4-5) | Replicate pillars R1-R5 to `4-winter` & `5-forest` | M1 | DONE |
| **M4** | Replication Part 3 (Dashboard 6) | Replicate pillars R1-R5 to `6-river` | M1 | DONE |
| **M5** | E2E Testing Tiers 1-4 | Execute full E2E test suite (Tiers 1-4) on all dashboards | M2, M3, M4 | DONE |
| **M6** | Audit & Hardening (Tier 5) | Perform adversarial verification, run Forensic Auditor, report success | M5 | DONE |

---

## Interface & Configuration Design (Pillars R1-R5)

### R1. Live Interactive Budget Configurator
- Chart interaction: Click nodes on chart to show modal to edit value.
- Table interaction: "Add Transaction" button triggers modal. Rows in table will have an inline "Edit" and "Delete" button.
- Calculations: Adding/editing/deleting transactions will update KPI values (Revenue, Cost, Users, Conversion) and re-draw the SVG path.
- State: Persisted in `localStorage` as `aura_data_<style>` (JSON). A "Reset Default Data" button will restore mock datasets.

### R2. Auto-Forecasting Financial Engine
- Logic: Implement a pure JS Linear Regression or Holt-Winters smoothing algorithm.
- Rendering: A dashed line representing the predicted values for the next period, plus a shaded `<path>` representing the confidence interval ($95\%$ band).
- Control: A Forecast toggle checkbox/button in the chart controls.

### R3. Interactive Theme & Particle Controller Console
- UI: Floating frosted glass settings panel (`.theme-controller-console`) with slide-in/out animation.
- Controls (range sliders):
  - Particle Count (`min=10, max=200, step=5`)
  - Particle Velocity/Wind Speed (`min=0.1, max=5.0, step=0.1`)
  - Spring constant $k$ (`min=0.01, max=0.5, step=0.01`)
  - Damping coefficient $c$ (`min=0.01, max=0.5, step=0.01`)
  - Background Opacity (`min=0.0, max=1.0, step=0.05`)

### R4. Cross-Dashboard Comparative Mode
- UI: A "Compare Mode" toggle and a dropdown select listing the other 5 styles.
- Rendering: Load dataset of selected style from `localStorage` (or defaults) and draw a secondary line using that theme's primary color.

### R5. Professional CSV/JSON Export & PDF Designer
- Export buttons: "Export CSV" and "Export JSON".
- Print PDF: `@media print` styling:
  - Hide `.sidebar`, `.theme-controller-console`, `canvas`, `#add-tx-dialog`, `.date-filter-group`, search bar, action buttons.
  - Set main content, cards, tables to white background, high-contrast black text.
  - Format chart and table to fit perfectly onto A4 Portrait page without truncation.

---

## Milestone 7: Magma Fire Theme & Antigravity Skills Interactive Database

We will implement a brand new style (Style 7: Magma / Fire) and integrate it into the Showcase Hub.

### 1. Portal 3D Carousel Integration
- We must update the Snapping logic in the Showcase Hub `index.html` from 60 degrees to `360 / 7` (~51.43 degrees).
- We must define a 7th `.theme-card` child in CSS with `rotateY(calc(360deg / 7 * 6)) translateZ(490px)`. We will adjust the outer translation radius `translateZ` from `460px` to `490px` to prevent card overlapping.
- Let's specify color tokens: `--theme-color: #ff3c00; --theme-rgb: 255, 60, 0;` (Magma Orange-Red).
- We must add a 7th `.dropdown-item` in the Hub's dropdown.
- Update `updateCardHighlights()` theme colors arrays to support the 7th element:
  - Active color: `#ff3c00`
  - Active secondary color: `#3d0c02` (deep dark burgundy/crimson)
- Adjust the click "Launch" handler spark explosions to spawn red-orange fiery sparks.

### 2. Magma Style Dashboard (`7-fire-magma/` folder)
- **Visuals**: Gamut of red, orange, gold/yellow, charcoal carbon dark background, neon glowing fire accents. 3D Card tilting and spotlight cursor reflection.
- **FBM Canvas Engine**: Organic fluid vector grid using multiple octaves of sine/cosine values to simulate lava flows, combined with high-temperature sparkling ashes that swarm and chase the cursor. Consolidated into the main rendering loop at 60 FPS.
- **Antigravity Skills Database**:
  - operational metrics: KPI cards display "Total Executions" (Execution Frequency) and "Peak CPU Load" (Computational Load).
  - Main chart plots these two variables over time.
  - Transactions list converted to an AI Skill Execution Log with at least 15 real Antigravity skills.
- **Hologram Modal**:
  - Interactive glassmorphic modal triggered by double-clicking a node or clicking a row.
  - Explains:
    1. **Programming Purpose**: Medical/biomedical/informatics problems solved.
    2. **Repository Dev Role**: AI workflow usage in code research, data loading, generation, testing, optimization.
- **AURA V5.0 Pillars Integration**:
  - Live configurator & persistence (key `aura_data_fire`).
  - OLS Forecast: Hand-written regression predicting frequencies, with orange-red confidence interval shading.
  - Settings panel: Slider adjustments for Canvas/Spring values.
  - Compare mode: Side-by-side dashed line comparison of Fire frequencies with other styles (Ice, River, etc.) loaded from their respective keys (`aura_data_ice`, `aura_data_river`).
  - Exports & PDF designer: CSV/JSON downloads, `@media print` print styling hide controls, format high-contrast for A4 page.
- **Audio & Perf**: Absolute zero audio, pure Vanilla JS encapsulated in strict IIFEs, 60 FPS performance.

