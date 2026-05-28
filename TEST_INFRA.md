# TEST_INFRA — AURA Enterprise Analytics Suite V5.0 Automated E2E Test Suite

## Overview
This document specifies the E2E automated testing infrastructure for the **AURA Enterprise Analytics Suite V5.0** (across all 6 dashboards and the Showcase Hub Portal).

Our E2E testing framework is designed to be **elegant, lightweight, highly reliable, and dependency-minimal**. It runs in standard Node.js on Windows without requiring heavy global installations (like Cypress, Puppeteer, or Playwright), utilizing **JSDOM** to create high-fidelity virtual DOM environments for each dashboard, execute their strict encapsulation IIFE scripts, and programmatically assert behavior under standard and edge-case user interactions.

---

## 1. Directory Layout & Co-location
In compliance with the project's layout rules, all E2E test files are **co-located** within their respective dashboard directories:

```
d:\dashboard-cost\
├── 1-ice-frost/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for Ice Frost (R1-R5)
├── 2-warm-timber/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for Warm Timber (R1-R5)
├── 3-autumn/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for Autumn (R1-R5)
├── 4-winter/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for Winter (R1-R5)
├── 5-forest/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for Forest (R1-R5)
├── 6-river/
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   └── app.e2e.js          <-- Co-located E2E test cases for River (R1-R5)
├── showcase-hub.e2e.js     <-- Co-located E2E test cases for Showcase Hub Portal
├── index.html              <-- Showcase Hub Portal
├── package.json            <-- Test dependency definition
├── run-tests.js            <-- Centralized automated E2E test runner
└── TEST_INFRA.md           <-- This infrastructure specification
```

*Note: All agent-specific metadata (plans, heartbeat progress, handoffs) remains strictly inside `.agents/worker_e2e/` to avoid layout contamination.*

---

## 2. Test Runner Architecture
The test runner (`run-tests.js`) is a custom Node.js script. When executed:
1. It scans all dashboard directories for `app.e2e.js` files, plus `showcase-hub.e2e.js`.
2. For each test suite:
   - It reads the target `index.html` file.
   - It instantiates a new **JSDOM** environment, enabling JavaScript execution.
   - It injects global browser mocks to mimic standard browser APIs not natively supported or fully simulated by JSDOM (e.g., `requestAnimationFrame`, `localStorage`, system print `window.print`, SVG path measurement `SVGPathElement.prototype.getTotalLength`, and dialog HTML5 API `showModal`/`close`).
   - It loads and evaluates the dashboard's corresponding `app.js` within the JSDOM context.
   - It loads and executes the assertions in `app.e2e.js` against the initialized DOM.
3. It aggregates results, counting successes and failures, and prints a comprehensive console report.
4. It exits with code `0` on success, or `1` if any test fails, integrating seamlessly with CI/CD.

---

## 3. Test Design Methodology (Tiers 1-4)
Our automated E2E test cases span **75 distinct tests** organized into a strict 4-tier testing hierarchy:

| Tier | Focus | Description | Total Tests |
|---|---|---|---|
| **Tier 1** | **Feature Coverage** | Happy path flows for each of the 5 high-end pillars (R1-R5) on all 6 styles, plus the Showcase Hub Portal central carousel and transitions. | **35 Tests** |
| **Tier 2** | **Boundary & Corner Cases** | Edge-case inputs, empty states, limits, invalid strings, overflow conditions, extreme configurations, and rapid event triggers. | **30 Tests** |
| **Tier 3** | **Cross-Feature Combinations** | Pairwise and multi-feature interactions (e.g., editing data under active forecast mode, combined forecast & compare modes, etc.). | **5 Tests** |
| **Tier 4** | **Real-World User Flows** | End-to-end user journeys (e.g., The Financial Auditor's Journey, The Theme Optimizer Flow, Data Sync Resilience, and Hub Navigation). | **5 Tests** |

---

## 4. Environment Prerequisites & Installation
Ensure you have **Node.js (v18+)** installed.

1. Navigate to the project root:
   ```powershell
   cd d:\dashboard-cost
   ```
2. Install the lightweight testing dependency (JSDOM):
   ```powershell
   npm install
   ```

---

## 5. Execution Commands
To run the E2E test suite in the Windows/NodeJS command line:

- **Run all E2E test suites:**
  ```powershell
  npm test
  ```
  *(Or execute directly via Node: `node run-tests.js`)*

- **Run tests for a specific dashboard (e.g., Ice Frost):**
  ```powershell
  node run-tests.js --style=ice
  ```

- **Run a specific Tier of tests (e.g., Tier 2):**
  ```powershell
  node run-tests.js --tier=2
  ```

---

## 6. Zero Audio & Performance Assertions
Every test in the runner enforces the project's strict mandates:
- **Zero Audio Assertion:** Scans the active DOM and evaluates window state to verify **absolute zero references** to `AudioContext`, `webkitAudioContext`, speaker toggle elements, oscillator objects, or audio variables.
- **60 FPS Structure Verification:** Inspects the Javascript execution loops to verify that event throttling is in place and all animations are bound to a single unified `requestAnimationFrame` loop.
