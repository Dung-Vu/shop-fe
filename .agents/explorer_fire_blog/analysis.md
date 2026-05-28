# AURA Premium Fire Magma Blog - Overhaul Implementation Plan

This document provides a comprehensive read-only analysis and a structured, step-by-step engineering plan to overhaul the Magma Fire theme (`7-fire-magma`) from a dashboard layout into a premium, interactive **Fire Magma Blog** dedicated to AI Skills. 

---

## 1. Visual Overhaul Layout

### Current Dashboard Layout (`7-fire-magma/index.html`)
The current layout consists of a standard grid system:
- **Left Sidebar (`.sidebar`)**: A fixed 260px navigation panel listing tabs (Tổng quan Skill, Phân tích Tải CPU, Nhật ký Vận hành, Cấu hình Kỹ năng) and a status panel reflecting simulated CPU temperature.
- **Top Header (`.content-header`)**: Page title ("Bách khoa toàn thư Kỹ năng AI"), search input, date tabs, and user profile card.
- **KPI Cards (`.kpi-grid`)**: Four quantitative metrics boxes (Execution count, Coverage, CPU Load, Conversion rate) with simple SVG sparklines.
- **Charts Grid (`.charts-grid`)**: Two panels; a major line chart displaying real-time calls/CPU frequency in SVG and a minor doughnut chart representing the category breakdown.
- **Logs Table (`.table-section`)**: A CRUD layout logging skill executions, supporting actions to add logs, edit, delete, or trigger reports export.

### Overhauled Blog Layout (Premium Fire Magma Blog)
The overhaul will transform the dashboard wrapper into a responsive, double-column interactive catalog blog. The UI will look like a premium editorial catalog, where each AI skill is treated as a "scientific blog post."

#### Adaptations to `7-fire-magma/index.html`
1. **Master Structure**:
   - Wrap the main interface in a `.blog-wrapper` layout split into a **Left Scrollable Article Directory Sidebar (360px wide)** and a **Right Interactive Reading View (fluid)**.
2. **Left Sidebar - Skill Articles Directory (`.blog-sidebar-directory`)**:
   - Embed an elegant glowing search field at the top to filter the 17 skills in real-time.
   - List the 17 AI Skills as article cards. Each card displays:
     - A small glowing code indicator (e.g. `pymol`, `openfda`).
     - Modern bold title (e.g., "PyMOL Structural Visualizer").
     - A brief 1-line Vietnamese summary.
     - A small view badge showing total views.
   - Clicking an article in the directory highlights the card with a burning crimson outline and loads the article content into the right panel dynamically.
3. **Right Panel - Interactive Reading View (`.blog-reading-panel`)**:
   - **Article Header**: Large geometric typography for the title, sub-author tag (e.g., "Written by: Antigravity Lead AI"), date, read-time, and active view counts.
   - **Article Content**:
     - *Công dụng lập trình (Programming Purpose)*: Rendered as a prominent typographic block inside a glass panel with glowing magma scanlines.
     - *Tác dụng phát triển Repo (Repository Dev Role)*: Rendered in a parallel glowing panel.
   - **Interactive Views Chart**: Positioned inline below the text. This renders the specific article's 7-day views history + 3-day forecasting and Confidence Interval band in a responsive SVG chart.
   - **Live Comments Thread (`.blog-comments-section`)**:
     - A clean form allowing visitors to input a Name, star rating (1 to 5), and review text.
     - Dynamic comments feed listing existing comments. Comments are bound specifically to each skill ID and saved persistently.
   - **Configurator Panel (`.blog-configurator-card`)**:
     - Standardized sliding panel (or integrated card) housing range inputs for FBM density, Speed, Hooke constants ($k$ and $c$), and Canvas Opacity.
   - **System Actions Bar (`.blog-actions-bar`)**:
     - Premium action buttons for CSV/JSON views reports, reset to default, and print PDF report.

---

## 2. Catalog of 17 Antigravity Skills

The overalled blog will incorporate **17 highly detailed AI Skills** in its catalog. In the original `7-fire-magma/app.js`, only 15 skills were defined. We will add the two missing required skills: `literature-search-arxiv` and `chembl-database`. 

### Complete Skills Modeling Catalog

Below is the structured data mapping for the 17 skills, containing exact Vietnamese purpose descriptions and repo development roles:

| # | Skill ID (Unique) | Skill Name (`desc`) | Category Group | Vietnamese Description (`purpose`) | Vietnamese Development Role (`role`) |
|---|---|---|---|---|---|
| 1 | `pymol` | PyMOL Structural Visualizer | Cấu trúc 3D (`Hosting`) | Trực quan hóa, phân tích cấu trúc 3D của protein và phân tử sinh học, đo khoảng cách liên kết, căn chỉnh cấu trúc. | AI dùng để kiểm tra tính tương thích không gian của mô hình protein sinh ra, tự động render ảnh kết quả 3D và xuất báo cáo cấu trúc. |
| 2 | `ncbi-sequence-fetch` | NCBI Sequence Fetcher | Dữ liệu Gen (`Marketing`) | Tải các chuỗi nucleotide và protein trực tiếp từ cơ sở dữ liệu NCBI bằng E-utilities. | AI dùng để lấy dữ liệu gen/protein chuẩn từ NCBI làm đầu vào cho các thuật toán căn chuỗi và sinh code sinh học. |
| 3 | `ensembl-database` | Ensembl Genome Query | Dữ liệu Gen (`Marketing`) | Truy vấn thông tin cấu trúc gen, exon, chuỗi transcript, dịch mã protein và dự đoán ảnh hưởng đột biến gen (VEP). | AI sử dụng để dịch mã chuỗi RNA/DNA tự động, phân tích tác động của đột biến và tối ưu hóa thiết kế các dòng mã sinh học. |
| 4 | `clinical-trials-database` | ClinicalTrials.gov Explorer | Dược lý & Lâm sàng (`APIs`) | Truy vấn dữ liệu thử nghiệm lâm sàng từ ClinicalTrials.gov theo bệnh lý, dược chất, nhà tài trợ, tiêu chí tuyển chọn. | AI tự động phân tích độ phủ lâm sàng, đối sánh bệnh nhân với các thử nghiệm hiện có và xây dựng báo cáo phân tích thị trường. |
| 5 | `alphagenome-single-variant-analysis` | AlphaGenome Variant Analyzer | Dữ liệu Gen (`Marketing`) | Dự đoán ảnh hưởng đột biến không mã hóa đến biểu hiện gen (RNA-seq), chromatin accessibility (DNASE), và histone marks. | AI dùng để sàng lọc nhanh các biến thể di truyền có khả năng gây bệnh cao, khoanh vùng các enhancer/promoter hoạt động trong các dòng tế bào cụ thể. |
| 6 | `literature-search-openalex` | OpenAlex Literature Search | Tra cứu Y học (`Team`) | Tìm kiếm và trích xuất thông tin học thuật, DOI, liên kết tác giả, thống kê trích dẫn từ hàng triệu bài báo khoa học. | AI tự động tra cứu tài liệu tham khảo, đối chiếu các nghiên cứu y sinh mới nhất để lập luận và viết tài liệu hướng dẫn kỹ thuật. |
| 7 | `uniprot-database` | UniProt Protein Database | Dược lý & Lâm sàng (`APIs`) | Tra cứu protein học thuật, chú giải chức năng, các domain hoạt động, vị trí sửa đổi sau dịch mã và dữ liệu taxonomy. | AI dùng để lấy thông tin sinh học của protein mục tiêu, tìm các bài báo liên quan và ánh xạ ID protein chéo giữa các database. |
| 8 | `pubchem-database` | PubChem Chemical Search | Dược lý & Lâm sàng (`APIs`) | Tra cứu cấu trúc hóa học, số CID, biểu thức SMILES, hoạt tính sinh học và các thông số hóa lý của hợp chất. | AI dùng làm nền tảng cheminformatics, sàng lọc ảo các phân tử thuốc tiềm năng và tự động sinh cấu trúc hóa học 2D/3D. |
| 9 | `quickgo-database` | QuickGO Ontology Mapper | Dữ liệu Gen (`Marketing`) | Ánh xạ gen và protein sang các thuật ngữ Gene Ontology (chức năng phân tử, quá trình sinh học, thành phần tế bào). | AI tự động gán nhãn chức năng cho danh sách gen/protein đầu ra và vẽ sơ đồ phân tích enrichment chuyên nghiệp. |
| 10 | `reactome-database` | Reactome Pathway Analyzer | Dược lý & Lâm sàng (`APIs`) | Phân tích pathway sinh học, ánh xạ gen/hợp chất vào các con đường chuyển hóa tín hiệu thực tế ở người và sinh vật khác. | AI dùng để xác định vị trí tác động của protein trong hệ thống mạng lưới tế bào, tìm tác dụng phụ tiềm năng của thuốc. |
| 11 | `string-database` | STRING Interaction Predictor | Cấu trúc 3D (`Hosting`) | Dự báo mạng lưới tương tác protein-protein (PPI) dựa trên bằng chứng thực nghiệm, văn bản học thuật và homology. | AI phân tích các protein đồng biểu hiện hoặc tương tác vật lý trực tiếp với protein mục tiêu để thiết kế dược tính của thuốc. |
| 12 | `pdb-database` | PDB Coordinate Downloader | Cấu trúc 3D (`Hosting`) | Tìm kiếm và tải về các file tọa độ 3D (.pdb, .cif) được xác định bằng thực nghiệm cho các đại phân tử. | AI dùng để lấy tọa độ nguyên tử làm khuôn mẫu cho các mô phỏng động lực học phân tử và tính toán docking. |
| 13 | `openfda-database` | openFDA Safety Monitor | Dược lý & Lâm sàng (`APIs`) | Truy vấn dữ liệu FDA về tác dụng phụ của thuốc, thu hồi thiết bị y tế, nhãn mác, thiếu hụt dược chất và đăng ký NDC. | AI tự động giám sát an toàn sau bán hàng, phát hiện các tín hiệu cảnh báo về tác dụng phụ y khoa và hỗ trợ tuân thủ pháp lý. |
| 14 | `clinvar-database` | ClinVar Pathogenicity Classifier | Dữ liệu Gen (`Marketing`) | Tra cứu phân loại lâm sàng của biến thể di truyền (gây bệnh, lành tính, chưa rõ ý nghĩa VUS) kèm theo chứng cứ y khoa đi kèm. | AI tự động phân loại mức độ nguy hiểm của đột biến gen tìm thấy ở bệnh nhân và thiết lập bộ quy tắc kiểm tra chuẩn y khoa. |
| 15 | `dbsnp-database` | dbSNP Variant Mapper | Dữ liệu Gen (`Marketing`) | Bản đồ hóa và tra cứu các biến thể di truyền ngắn (Single Nucleotide Polymorphism - SNP) dựa trên mã rsID hoặc tọa độ GRCh38. | AI phân giải rsID sang tọa độ genomic chuẩn, tính tần số alen trong quần thể phục vụ phân tích dịch tễ di truyền. |
| 16 | `literature-search-arxiv` | arXiv Academic Explorer | Tra cứu Y học (`Team`) | Tra cứu và trích xuất thông tin tóm tắt, liên kết PDF toàn văn từ kho lưu trữ tiền ấn phẩm khoa học arXiv trên nhiều lĩnh vực. | AI tự động thu thập tài liệu khoa học mới nhất phục vụ lập luận, so sánh và kiểm chứng các mô hình học máy sinh học. |
| 17 | `chembl-database` | ChEMBL Bioactivity Query | Dược lý & Lâm sàng (`APIs`) | Truy vấn hoạt tính sinh học, dược tính của các phân tử nhỏ và protein đích từ cơ sở dữ liệu ChEMBL. | AI tự động sàng lọc ảo ái lực liên kết thuốc (IC50, Ki) và tối ưu hóa hóa tin học dược lý cho chuỗi thiết kế phân tử. |

---

## 3. 5 Pillars Implementation

### Pillar 1: Live Configurator
- **Double-Click Inline Editing**: 
  We will add an event listener to the active article's title (`.article-title`) and paragraphs (`.article-text`). Double-clicking will swap the text nodes with inputs/textareas prefilled with the current text. Pressing `Enter` or clicking an inline Save checkmark will update the respective skill's properties in the in-memory array, update the directory view, and save to `localStorage`.
- **Comments Capability**:
  A comment form will capture user submissions. When a comment is successfully posted, it is appended to the specific skill ID's sub-comment list inside the main catalog:
  ```javascript
  const comment = { name, text, stars, timestamp: Date.now() };
  skill.comments = skill.comments || [];
  skill.comments.push(comment);
  ```
  This is rendered instantly as a glowing, chronological thread with burnished star icons.
- **Persistence (`localStorage` - `aura_data_fire`)**:
  All catalog state modifications (including edited titles, descriptions, and comments threads) are converted to JSON and stored under the single key `aura_data_fire`. 
- **Reset Functionality**:
  The system reset button will prompt the user, clear the `localStorage` key, and trigger a `window.location.reload()`, which re-seeds the default catalog data.

### Pillar 2: Handwritten OLS Forecasting
- **Linear Regression Mechanics**:
  The existing `calculateForecast` engine in `app.js` is fully retained and adapted to forecast views. When an article is loaded, we take its 7-day historical views list $Y = [y_1, y_2, y_3, y_4, y_5, y_6, y_7]$ mapped to independent day offsets $X = [0, 1, 2, 3, 4, 5, 6]$.
- **Confidence Interval (CI) Math**:
  At 95% confidence level, the margin is computed as:
  $$Margin(x_p) = 1.96 \cdot s_e \sqrt{1 + \frac{1}{n} + \frac{(x_p - \bar{x})^2}{\sum (x_i - \bar{x})^2}}$$
  Where $s_e$ is the standard error of the residual squares and $x_p$ are future offsets $x_p \in \{7, 8, 9\}$ (forecasting the next 3 days).
- **SVG Rendering**:
  - **Dashed Forecast Line**: A path element with `stroke-dasharray="4 4"` connecting the 7th coordinate to the 3 forecasted points.
  - **CI Shaded Band**: Drawn as a filled polygon path covering the upper and lower CI limits across the forecasted points:
    ```html
    <path d="M x7,y7 L x8,y8_up L x9,y9_up L x10,y10_up L x10,y10_low L x9,y9_low L x8,y8_low Z" 
          fill="rgba(255, 60, 0, 0.15)" stroke="none" class="forecast-ci-band"></path>
    ```

### Pillar 3: Settings Panel
The existing floating configuration panel controls the background ambient physics in real-time by mapping sliders directly to properties on the global `window.AuraConfig` object:
1. **Spark Count (`slide-particle-count` $\rightarrow$ `AuraConfig.particleCount`)**: Modifies the number of diamond-shaped sparks generated inside the fluid simulation array. Tweaking it triggers a dynamic particle array length adjustment in the animation loop.
2. **Lava Flow Speed (`slide-particle-speed` $\rightarrow$ `AuraConfig.particleSpeed`)**: A multiplier for the FBM noise vector field velocities, accelerating or slowing the ember drift speed.
3. **Hooke Spring Stiffness (`slide-spring-k` $\rightarrow$ `AuraConfig.springK`)**: Adjusts the restore force of plucked spring animations (e.g. plucking lines/article title hover).
4. **Hooke Spring Damping (`slide-spring-c` $\rightarrow$ `AuraConfig.springC`)**: Controls oscillation damping, defining whether spring motions are bouncy or critically damped.
5. **Canvas Opacity (`slide-canvas-opacity` $\rightarrow$ `AuraConfig.canvasOpacity`)**: Modifies the floating particles canvas's opacity CSS style directly, fading out or amplifying the visual effects.

### Pillar 4: Compare Mode
- **Dual Dashed Overlay**:
  When "Compare Mode" is checked, it reveals a dropdown listing all other skills. Selecting a skill queries its historical view series.
- **Auto-Scaling**:
  The SVG chart coordinates scale dynamically to support the combined maximum of the active article's views and the compared article's views.
- **Rendering**:
  The active article's views are plotted as a solid glowing red-orange line. The compared article's views are overlaid as a dashed gold line (`stroke="#ffcc00"`, `stroke-dasharray="5 3"`). Grid tracking captures crosshair highlights for both series simultaneously, rendering a dual-column tooltip.

### Pillar 5: CSV/JSON & PDF Reports
- **Data Compilation**:
  A file generator helper compiles skill datasets (views, rating metrics, categories, comment counts) into standard MIME types:
  - **CSV**: Compiles headers `ID, Name, Category, Views, Rating, CommentsCount` and triggers anchor downloading.
  - **JSON**: Serializes the full 17-skill reactive memory state.
- **A4 Monochrome High-Contrast Print Styles**:
  Under `@media print`, we enforce A4-ready executive styling:
  - Hides left directory sidebar, settings panels, floating trigger, search boxes, and canvas background elements.
  - Converts text colors to absolute high-contrast black (`#000000`) and backgrounds to pure white (`#ffffff`).
  - Converts all active glow filters to standard solid borders.
  - Restructures cards into thin bordered divs and table cells into high-contrast grid lines.
  - Integrates clean CSS page break rules:
    ```css
    .blog-article-body { page-break-after: always; } /* Page 1: Reading Area */
    .blog-views-chart-container { page-break-after: always; } /* Page 2: Analytical OLS Chart */
    .blog-comments-table-section { page-break-before: always; } /* Page 3: Logs/Comments Table */
    ```

---

## 4. Hooke & FBM Physics

### FBM Particle Field Fluid Simulation
The background canvas (`#ambient-particles`) renders a fluid simulation driven by a **4-octave Fractional Brownian Motion (FBM)** mathematical vector field:
- A recursive sine/cosine summation computes flow field angles $\theta$ at coordinate points:
  $$\theta = \sum_{i=0}^3 A_i \sin(x \cdot f_i + t \cdot s_i) \cos(y \cdot f_i - t \cdot s_i)$$
  where frequency $f_i$ multiplies by $2$ (lacunarity) and amplitude $A_i$ multiplies by $0.5$ (gain) at each octave.
- Particles are updated at 60 FPS. They inherit a constant upward bias and are pushed by the local FBM flow vectors.
- Interactive mouse tracking computes radial distances from the cursor, creating high-velocity circular swirls within a 180px radius.

### Hooke spring Simulation
- **Current implementation**: Applied to chart grid lines. When the cursor passes near a grid line, it pushes the line's midpoint. Upon cursor exit, the midpoint oscillates back to neutral ($0$) via the spring equation:
  $$F = -kx - cv$$
  where displacement $x$ acts as spring elongation, velocity $v$ is updated by acceleration $a = F$ per frame, and the line is redrawn as a quadratic Bézier curve `M 50 Base Q 300 (Base + x) 550 Base`.
- **Blog Overhaul Integration**: We will bind these spring elastic effects to the **directory article cards and active post titles**:
  - Hovering over an article card in the sidebar calculates the cursor offset vector relative to the card center, rotating the card in 3D space (`transform: rotateX(..) rotateY(..)`) towards the mouse.
  - Upon mouse exit, we pluck the transform: the rotation angles behave as decaying springs oscillating back to $0$ using Hooke's formula at 60 FPS, creating an elegant bouncing visual feedback.

### Zero AudioContext/Synth Constraint
- **Compliance Check**: The code contains absolutely NO `AudioContext`, synthesizer, or Web Audio API nodes. 
- **Guideline**: The premium blog transition must remain completely soundless. All effects (explosions, spring vibrations, FBM swirls) are rendered visually on canvas or SVG with zero sound traces.

---

## 5. Automated E2E Runner

The testing infrastructure runs on a lightweight browser mock inside `run-tests.js` utilizing `JSDOM`. We will expand `7-fire-magma/app.e2e.js` to contain **at least 11 tests** verifying the entire user journey (AC1-AC6).

### Catalog of the 11 Automated E2E Tests

1. **Test 1: [AC1] Title Inline Edit Path**
   - *Verification*: Triggers double-click on article title, verifies it converts to input. Enters a new title, triggers blur, and asserts the new title is saved in memory and stored in `localStorage`.
2. **Test 2: [AC1] Add Comment Flow**
   - *Verification*: Locates comment form, fills Name and text, clicks Submit. Verifies the comment node is added to the DOM and persistently saved under `aura_data_fire`.
3. **Test 3: [AC1] Reset Default Data Purge**
   - *Verification*: Clicks Reset, asserts `localStorage` is cleared and the original 17 default skills are restored.
4. **Test 4: [AC2] Forecasting Toggle and Lines**
   - *Verification*: Toggles the Forecast button, verifies the SVG chart generates `.forecast-line-dashed` paths.
5. **Test 5: [AC2] Confidence Interval Shaded Band**
   - *Verification*: Verifies the OLS confidence interval polygon `.forecast-ci-band` is drawn with valid, non-empty coordinates.
6. **Test 6: [AC3] Spark Count Slider updates AuraConfig**
   - *Verification*: Adjusts particle slider to 200, asserts `window.AuraConfig.particleCount === 200` and verifies canvas simulation pool resizes.
7. **Test 7: [AC3] Hooke Constants sliders update global physics**
   - *Verification*: Adjusts $k$ and $c$ range inputs, asserts `window.AuraConfig.springK` and `window.AuraConfig.springC` match slider inputs.
8. **Test 8: [AC4] Compare Mode Toggle and Overlay**
   - *Verification*: Checks the compare mode box, selects `ncbi-sequence-fetch` from the dropdown, and asserts that a second dashed path is rendered on the chart.
9. **Test 9: [AC5] CSV Export anchor trigger**
   - *Verification*: Clicks CSV export button, verifies a mock download anchor is created with a valid data URI matching MIME types.
10. **Test 10: [AC5] Print PDF SUMMONS Native Dialog**
    - *Verification*: Clicks print button, asserts JSDOM mock print counter tracks exactly one print invocation.
11. **Test 11: [AC6] Hooke spring oscillation decay**
    - *Verification*: Pulls a spring element to displacement $50$, fires the physics loop, and asserts displacement decreases steadily and snaps to zero without infinite numerical loops.

### Onscreen Runner Overlay Console
To bridge the gap between CLI test runners and in-browser visibility, we will add an elegant overlay console in the corner of the page:
- **UI Structure**: A collapsible panel (`#e2e-runner-console`) placed at the bottom-right corner, designed as a glass panel with glowing magma borders.
- **Overlay Header**: Shows a status indicator (e.g. `Pass: X/11 | Fail: Y/11`) in green and red badges, with a "Run Tests" play button.
- **Overlay Console**: A collapsible, scrollable terminal box. When "Run Tests" is clicked, a client-side execution loop runs the 11 tests sequentially in JSDOM-like speed within the browser context, outputting colorful log lines (`[RUNNING]`, `[PASS]`, `[FAIL]`) to the terminal.

---

## 6. Portal Snapping & Bursts

### Cylindrical Carousel Portal Integration
At the portal root `index.html`, Style 7 (Magma Fire) is integrated as card 7. The carousel operates on a 3D cylindrical perspective containing exactly **7 cards**. 
- **Snapping Mathematics**:
  With 7 cards, the rotational step is exactly:
  $$360^\circ / 7 \approx 51.42857^\circ$$
  The transformation rotateY styles in root `index.html` place each card at precise steps:
  - Card 1: `rotateY(0deg) translateZ(490px)`
  - Card 2: `rotateY(51.42857deg) translateZ(490px)`
  - Card 3: `rotateY(102.85714deg) translateZ(490px)`
  - Card 4: `rotateY(154.28571deg) translateZ(490px)`
  - Card 5: `rotateY(205.71428deg) translateZ(490px)`
  - Card 6: `rotateY(257.14286deg) translateZ(490px)`
  - Card 7: `rotateY(308.57143deg) translateZ(490px)`
- **Snapping Implementation**:
  When a mouse dragging or swipe rotation event ends, the mouseup listener snaps the cumulative target angle to the nearest multiple of the step:
  ```javascript
  const step = 360 / 7;
  targetAngle = Math.round(targetAngle / step) * step;
  ring.style.transform = `rotateY(${targetAngle}deg)`;
  ```

### Soundless Red-Orange Particle Burst
When card 7 (Magma Fire) is highlighted and the user double-clicks or clicks "Launch Dashboard":
1. The portal calculates the active card center coordinates:
   ```javascript
   const cardRect = cardElement.getBoundingClientRect();
   const startX = cardRect.left + cardRect.width / 2;
   const startY = cardRect.top + cardRect.height / 2;
   ```
2. The system triggers `runExplosion(startX, startY, '#ff3c00')` on the root portal canvas overlay.
3. This creates **180 glowing sparks** defined by the `Spark` class:
   - Sparks shoot outwards in random radial vectors with initial velocities between $0$ and $45\text{ px/frame}$.
   - For theme color `#ff3c00`, the constructor overrides individual colors with a high-temperature mixture of glowing neon red (`#ff3c00`), burning deep orange (`#ff7700`), and bright ember yellow (`#ffdd00`).
   - Elegant gravity is applied ($y$ velocity increases by $0.25\text{ px/frame}$), causing particles to fall like burning ash.
   - Sparks draw smooth trailing lines using coordinate history trails, decaying slowly through canvas line opacity fades.
   - The entire process is completely soundless with zero AudioContext trace, matching constraints.

### Test Spec Alignment (`showcase-hub.e2e.js`)
Currently, `showcase-hub.e2e.js` has a test asserting `assert.equal(cards.length, 6, "There must be exactly 6 theme cards in the carousel")`. Because we now support 7 cards in the portal ring, we propose updating the E2E test in `showcase-hub.e2e.js` to:
```javascript
assert.equal(cards.length, 7, "There must be exactly 7 theme cards in the carousel");
```
This aligns the test suite with the 3D snapping updates and guarantees continuous green builds.
