# Project: AURA Fire Magma Blog Overhaul (Style 7)

## Architecture
- **Single Page Application / Interactive Blog Reader**: Clean, premium dark charcoal theme with neon lava red/orange accents.
- **Pure HTML5 / CSS3 / Vanilla JS**: 100% native Web standards, no libraries (no Chart.js, no Tailwind, etc.).
- **Background Simulation**: Vector field canvas FBM fluid dynamics simulating slow-flowing lava.
- **Physics Engine**: Hooke's spring-mass-damping physics ($F = -kx - cv$) driving card/title hover elastic wobbling.
- **Mathematical Forecaster**: Ordinary Least Squares (OLS) linear regression calculated manually in JS to predict article views.
- **Persistent Data Store**: Standard browser `localStorage` keyed under `aura_data_fire`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Exploration & Strategy | Analyze existing styles, layout, and formulate implementation plan | None | PLANNED |
| 2 | Premium Visual Overhaul & Blog catalog | Rebuild 7-fire-magma/index.html & style.css into a premium interactive blog with 15+ skills in Vietnamese | M1 | PLANNED |
| 3 | AURA V5.0 Blog Pillars Integration | Implement Live Configurator, OLS forecast, Settings slider panel, Compare Mode, Export/Print PDF | M2 | PLANNED |
| 4 | Spring Physics & Canvas Optimization | Integrate Hooke spring grids, FBM mouse attraction particles, 60 FPS lock, Zero Audio elimination | M3 | PLANNED |
| 5 | Portal Snapping & E2E Test Suite | Align root index.html snap angles, E2E app.e2e.js with 11 tests & onscreen overlay, verify all tests pass | M4 | PLANNED |

## Interface Contracts
### `aura_data_fire` LocalStorage Schema
```ts
interface SkillArticle {
  id: string;
  desc: string;
  category: "Hosting" | "Marketing" | "Team" | "APIs"; // Mapped to Cấu trúc 3D, Dữ liệu Gen, Tra cứu Y học, Dược lý & Lâm sàng
  time: string;
  amount: number; // Execution count / views
  status: "success" | "pending";
  purpose: string; // Programming Purpose (Công dụng lập trình)
  role: string; // Repository Dev Role (Tác dụng phát triển Repo trong AI Workflow)
  comments: { author: string; content: string; time: string }[];
  viewsHistory: number[]; // 7 days of views history
}
```

## Code Layout
- `7-fire-magma/index.html` - Core Blog markup and overlay layout.
- `7-fire-magma/style.css` - Charcoal carbon styling, neon glowing borders, @media print A4 high-contrast print layouts.
- `7-fire-magma/app.js` - Unified FBM & Spring loops inside IIFE, persistent store handler, OLS linear forecaster, compare mode.
- `7-fire-magma/app.e2e.js` - Native automated E2E test runner containing 11 tests.
- `index.html` - Hub Portal index with cylindrical snapping carousel (calc(360deg / 7)).
- `showcase-hub.e2e.js` - E2E tests for the Hub Portal (assert cards.length === 7).
