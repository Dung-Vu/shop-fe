## 2026-05-26T14:14:03Z

Cải tiến sâu và toàn diện Front-End của 6 website dashboard thống kê chi phí (`d:\dashboard-cost\`) lên cấp độ siêu phẩm AAA mang tính đột phá thị giác, loại bỏ hoàn toàn âm thanh, tăng cường tối đa các hiệu ứng hoạt họa 3D, Spring Physics, FBM Particle Fields và chuyển động mượt mà 60 FPS.

Working directory: d:/dashboard-cost
Integrity mode: demo

## Requirements

### R1. Siêu Hoạt Họa Biểu Đồ Tương Tác (Premium Interactive Chart Animations)
Triển khai hoạt họa progressive draw tự vẽ trên SVG line chart, sequential bouncy scale-in cho data nodes, và scale-transition cho glassmorphic tooltip bám đuổi trơn tru theo con trỏ chuột. Đồng thời giữ nguyên chuyển động rung nảy vật lý Spring-Mass co giãn của lưới biểu đồ khi rê chuột qua mà không dùng âm thanh.

### R2. Động Cơ Trường Lực Hạt Nền Nâng Cao (Advanced FBM Particle Engine)
Tối ưu hóa các thuật toán trường vectơ FBM (Fractional Brownian Motion) trên Canvas nền cho cả 6 style (Ice, Timber, Autumn, Winter, Forest, River) để tạo ra các chuyển động tự nhiên như hạt tuyết lốc, lá phong bay, đom đóm tụ chuột lấp lánh hay gợn sóng loang vật lý click xô đẩy các hạt bong bóng nước xung quanh một cách mượt mà nhất.

### R3. Chiều Sâu Hologram Parallax & Light Shine
Triển khai Perspective 1200px thị sai đa tầng (background drifts opposite, main content drifts positive), nghiêng 3D card kết hợp radial light shine bám đuổi theo tọa độ chuột và dòng ánh sáng quét (flow pulse animate) dọc đường dẫn SVG Doanh thu & Chi phí.

### R4. Loại Bỏ Hoàn Toàn Hệ Thống Âm Thanh & Tối Ưu Hiệu Năng
Xóa sạch hoàn toàn mọi tàn dư của Web Audio context, oscillator, sound triggers, sound toggle buttons ở sidebar của cả 6 style và Showcase Hub index.html. Tối ưu hóa vòng lặp `requestAnimationFrame`, dọn dẹp các sự kiện lắng nghe chuột và tài nguyên canvas để đảm bảo FPS ổn định ở mức 60 FPS.

## Acceptance Criteria

### Trải Nghiệm Hoạt Họa & Tương Tác Biểu Đồ
- [ ] SVG path của biểu đồ chính tự vẽ lướt mượt mà từ trái qua phải bằng stroke-dashoffset transition khi tải trang hoặc đổi tab Period.
- [ ] Các chấm tròn mốc dữ liệu biểu đồ tự scale nảy tuần tự từng chấm từ trái qua phải bằng cubic-bezier(0.34, 1.56, 0.64, 1).
- [ ] Tooltip nảy zoom nhẹ (scale(0.9) to scale(1.0)) kết hợp backdrop-filter blur bám đuổi trơn tru theo con trỏ chuột.
- [ ] Đường lưới biểu đồ rung nảy vật lý Spring-Mass co giãn êm ái khi chuột gảy qua mà không tạo ra bất kỳ âm thanh hay lỗi luồng xử lý nào.

### Trải Nghiệm Nền Hạt & Chuyển Cảnh Portal Hub
- [ ] Nền Canvas của cả 6 Style chạy đúng thuật toán FBM Noise động tương ứng (Băng tinh, Tàn lửa, Lá phong lốc, Tuyết tích tụ, Đom đóm tụ chuột, Bong bóng loang ripple).
- [ ] 3D Carousel tại Hub Portal trung tâm hoạt động mượt mà, Glow Orbs nền tự động chuyển màu mượt mà trùng với tông màu của Dashboard đang hiển thị phía trước.
- [ ] Click "Launch" kích hoạt hiệu ứng nổ pháo hoa hạt ngọc theo tông màu chuyển cảnh siêu đỉnh mà không có bất kỳ âm thanh hay tiếng ồn nào.

### Chất Lượng Mã Nguồn & Hiệu Năng
- [ ] Zero Audio: Không tồn tại bất kỳ đối tượng `AudioContext` hay hàm phát âm thanh `playSynth` nào trong mã nguồn.
- [ ] Không sử dụng thư viện đồ họa hay CSS bên ngoài nào khác (như Chart.js, D3.js).
- [ ] Hiệu năng ổn định ở mức 60 FPS trên Chrome/Edge/Firefox.

## 2026-05-27T00:21:41Z

Đại tu nâng cấp lớn toàn diện hệ thống 6 Cost Dashboards và Hub Portal trung tâm tại `d:\dashboard-cost\` từ hiển thị trực quan đơn thuần thành một Siêu Công Cụ Quản Lý & Phân Tích Tài Chỉ Vật Lý Đàn Hồi (AURA Enterprise Analytics Suite V5.0) với đầy đủ 5 trụ cột chức năng cao cấp.

Working directory: d:/dashboard-cost
Integrity mode: demo

## Requirements

### R1. Live Interactive Budget Configurator & Real-time Persistence
- Tích hợp tính năng chỉnh sửa dữ liệu tài chính trực tiếp: Cho phép người dùng nhấp trực tiếp vào các nút trên biểu đồ hoặc thao tác trên bảng giao dịch (Thêm mới giao dịch, Xóa giao dịch, Chỉnh sửa số tiền).
- Khi dữ liệu thay đổi, biểu đồ chính (Doanh thu & Chi phí) và các thẻ KPI (Revenue, Cost, Users, Conversion) phải tự động tính toán lại và cập nhật bằng hoạt họa co giãn co rút mượt mà.
- Lưu trữ trạng thái dữ liệu đã sửa đổi vào `localStorage` của trình duyệt theo từng Style Dashboard riêng biệt để khi reload lại trang, dữ liệu chỉnh sửa của người dùng vẫn được bảo toàn hoàn hảo. Thêm nút "Reset Default Data" để khôi phục lại dữ liệu ban đầu.

### R2. Auto-Forecasting Financial Engine (Hồi quy / Holt-Winters toán học)
- Tự lập trình thuật toán dự báo tài chính (Hồi quy tuyến tính hoặc làm mịn mũ Holt-Winters) hoàn toàn bằng JavaScript thuần túy (không sử dụng bất kỳ thư viện bên ngoài nào).
- Vẽ thêm một **đường nét đứt dự đoán xu hướng tương lai (Dashed Forecasting Line)** cho kỳ tiếp theo trên biểu đồ chính, đi kèm **vùng bóng mờ tin cậy (Confidence Interval Shadow)** thể hiện biên độ sai số dự báo một cách mượt mà và trực quan.
- Có nút bật/tắt (Toggle) chế độ Dự báo ngay trên bộ điều khiển biểu đồ.

### R3. Interactive Theme & Particle Controller Console
- Tích hợp một bảng điều khiển Hologram kính mờ (Sidebar trượt hoặc Floating Panel) trên mỗi Dashboard.
- Cung cấp các thanh trượt (range sliders) trực quan cho phép người dùng tinh chỉnh thời gian thực các thông số:
  - Mật độ hạt Canvas nền (Particle Count) và Tốc độ chuyển động (Velocity/Wind Speed).
  - Độ đàn hồi rung nảy vật lý của lưới biểu đồ (Độ cứng lò xo $k$ và Hệ số giảm chấn $c$ trong định luật Hooke).
  - Độ mờ (Opacity) của trường Canvas nền để tối ưu hóa khả năng tập trung đọc dữ liệu.

### R4. Cross-Dashboard Comparative Mode (So sánh chéo đa vũ trụ)
- Triển khai tính năng "Compare Mode" trên biểu đồ chính.
- Khi bật chế độ so sánh, người dùng có thể chọn một Style Dashboard khác từ một menu thả xuống (dropdown) tinh tế.
- Biểu đồ sẽ tự động tải dữ liệu của Style được chọn từ `localStorage` và vẽ thêm một đường biểu đồ thứ hai so sánh chéo song song trên cùng một khu vực SVG với màu sắc đại diện tương ứng của Style đó để phân tích chênh lệch chi phí.

### R5. Professional CSV Export & Premium PDF Report Designer
- Thêm cụm nút chức năng "Export & Print Report":
  - **Export CSV/JSON:** Cho phép xuất bảng giao dịch hiện tại ra file CSV hoặc JSON tải xuống máy tính.
  - **Print PDF Report:** Kích hoạt chức năng in ấn hệ thống (`window.print()`). Thiết kế stylesheet `@media print` cao cấp để khi in: Ẩn toàn bộ sidebar điều khiển, thanh cấu hình, Canvas nền hạt và các nút tương tác; tự động chuyển biểu đồ và bảng sang tông màu sáng có độ tương phản cao, tự động dàn trang vừa khít chuẩn khổ giấy A4 dọc (Portrait) cực kỳ sắc nét và chuyên nghiệp.

## Acceptance Criteria

### Trải Nghiệm Cấu Thiết Dữ Liệu & Khăng Năng Lưu Trữ (R1)
- [ ] Thao tác thêm/sửa/xóa giao dịch trên bảng giao dịch cập nhật ngay lập tức tổng chi phí/doanh thu trên các thẻ KPI và vẽ lại biểu đồ bằng hoạt họa mượt mà.
- [ ] Reload lại trang (hoặc F5 cứng), dữ liệu vừa chỉnh sửa vẫn được lưu trữ hoàn hảo trong `localStorage`. Bấm "Reset Default" khôi phục lại dữ liệu ban đầu ngay lập tức.

### Động Cơ Dự Báo & Chế Độ So Sánh (R2, R4)
- [ ] Đường nét đứt dự báo (Forecasting Line) và vùng bóng mờ (Confidence Interval) hiển thị chuẩn xác về mặt toán học và có hiệu ứng vẽ progressive mượt mà khi bật toggle Forecast.
- [ ] Bật chế độ "Compare Mode" vẽ thêm đường biểu đồ thứ hai mượt mà, phân biệt rõ ràng bằng màu sắc chủ đề tương ứng của Dashboard được so sánh.

### Bảng Điều Khiển Vật Lý & Nền Hạt (R3)
- [ ] Kéo thanh trượt thay đổi ngay lập tức số lượng hạt, tốc độ rơi/bay của hạt FBM trên màn hình thời gian thực mà không bị đơ giật.
- [ ] Kéo thanh trượt thay đổi độ đàn hồi lò xo làm thay đổi rõ rệt biên độ và tần số rung nảy của lưới biểu đồ khi gảy chuột qua.

### Xuất Dữ Liệu & Bản In PDF Đẳng Cấp (R5)
- [ ] Bấm nút Export CSV/JSON tải về file dữ liệu đầy đủ các cột tương ứng trên bảng giao dịch.
- [ ] Bấm nút Print PDF mở giao diện Print Preview của trình duyệt, bản xem trước hoàn toàn sạch sẽ (không có canvas, không có sidebar, biểu đồ và bảng căn chỉnh cân đối sắc nét trên nền trắng, cực kỳ tiết kiệm mực in và chuyên nghiệp).

## 2026-05-27T03:33:56Z

Xây dựng một phong cách Dashboard hoàn toàn mới - Phong cách Lửa / Magma (7-fire-magma) - tích hợp vào hệ thống và Cổng Vũ Trụ Hub Portal tại `d:\dashboard-cost\`. Dashboard này sẽ đóng vai trò là một "Bách khoa toàn thư tương tác" (Cosmic Skills Directory) hiển thị chi tiết tất cả các Skills của Antigravity, công dụng của từng skill trong lập trình và vai trò của chúng trong workflow AI phát triển repository, đồng thời thừa hưởng đầy đủ 5 trụ cột công nghệ của phiên bản AURA V5.0.

Working directory: d:/dashboard-cost
Integrity mode: demo

## Requirements

### R1. Magma Fire Visual Theme & FBM Fluid Particle Engine (Style 7)
- Tạo thư mục con `7-fire-magma` chứa đầy đủ cấu trúc `index.html`, `app.js`, `style.css` riêng biệt và đồng bộ.
- Thiết kế giao diện Magma Fire lộng lẫy sử dụng các gam màu đỏ lửa, cam dung nham, xám than hoạt tính (charcoal carbon) và vàng sáng rực rỡ. Card 3D Perspective nghiêng bóng láng màu carbon pha trộn viền neon đỏ rực cháy, spotlight shine di động rượt đuổi con trỏ.
- Nền Canvas trường lực FBM Noise động mô phỏng dòng dung nham Magma nóng chảy cuộn sóng êm ái kết hợp với hạt tàn lửa nhiệt độ cao bay lốc cuộn và swarming tụ bám theo con trỏ chuột mượt mà ở 60 FPS.
- Đồng bộ hóa phong cách thứ 7 này vào vòng xoay 3D Cylindrical Carousel của Portal Hub gốc (`index.html`). Góc phân chia thẻ xoay tự động cập nhật cân đối (xoay 7 thẻ mượt mà). Glow Orbs nền tự động chuyển màu gradient đỏ rực rỡ đồng bộ khi tiêu điểm là thẻ Magma Fire. Nút Launch kích hoạt màn nổ pháo hoa tàn lửa hạt ngọc màu đỏ cam rực rỡ không âm thanh.

### R2. Antigravity Skills Interactive Database & AI Workflow Encyclopedia
- Chuyển đổi toàn bộ dữ liệu tài chính sang số liệu vận hành của Antigravity:
  - Biểu đồ chính hiển thị Tần suất gọi skill (Execution Frequency) và Tải CPU tính toán (Computational Load).
  - Bảng nhật ký biến thành **Nhật ký vận hành AI Skill (AI Skill Execution Log)** chứa ít nhất 15 skill thực tế của Antigravity (như `pymol`, `ncbi-sequence-fetch`, `ensembl-database`, `clinical-trials-database`, `alphagenome-single-variant-analysis`, `literature-search-openalex`, `uniprot-database`, `pubchem-database`, `quickgo-database`, `reactome-database`, `string-database`, `pdb-database`, `openfda-database`, `clinvar-database`, `dbsnp-database`).
- Nhấp đúp chuột vào mốc tròn biểu đồ hoặc nhấp chuột vào từng dòng nhật ký kỹ năng trên bảng sẽ mở ra một Modal Hologram kính mờ giải thích cặn kẽ 2 nội dung lớn:
  1. **Công dụng lập trình (Programming Purpose):** Kỹ năng này giúp giải quyết bài toán gì trong lập trình phần mềm khoa học/y sinh/dữ liệu lớn.
  2. **Tác dụng phát triển Repo (Repository Dev Role):** Cách AI sử dụng kỹ năng này trong workflow thực tế để tự động nghiên cứu codebase, tải dữ liệu chuẩn, sinh mã nguồn, thiết lập test cases và tối ưu hóa repository.

### R3. Đồng bộ hóa 5 Trụ cột Công nghệ AURA V5.0
- **Live Configurator & LocalStorage:** Cho phép chỉnh sửa/thêm/xóa log kỹ năng trực tiếp ngay trên biểu đồ hoặc bảng. Biểu đồ tự co giãn cập nhật bằng hoạt họa, dữ liệu lưu trữ vĩnh viễn vào `localStorage` dưới khóa `aura_data_fire`. Thêm nút đặt lại dữ liệu mặc định.
- **Handwritten OLS Forecasting:** Vẽ đường nét đứt dự đoán xu hướng gọi kỹ năng kỳ tới bằng thuật toán hồi quy OLS viết tay, đi kèm dải bóng mờ Confidence Interval màu đỏ cam mờ ảo lộng lẫy.
- **Settings Controller Panel:** Bảng điều khiển kính mờ cho phép kéo trượt trực quan thay đổi mật độ hạt tàn lửa, tốc độ gió FBM dung nham, độ đàn hồi lò xo Hooke của lưới biểu đồ ($k$ và $c$), và opacity canvas nền.
- **Cross-Dashboard Compare Mode:** Cho phép vẽ đường so sánh chồng nét đứt so sánh tần suất gọi của Fire Style với các Style khác (như Ice Frost, River Blue) lấy dữ liệu trực tiếp từ `localStorage`.
- **CSV/JSON Export & PDF Print Designer:** Xuất log kỹ năng ra CSV/JSON. Thiết kế `@media print` ẩn sidebar/canvas nền, chuyển biểu đồ/bảng sang tông sáng có độ tương phản cao, tự động căn lề cân đối vừa khít chuẩn khổ giấy A4 để in ấn báo cáo chuyên nghiệp.

### R4. Không âm thanh & Tối ưu hiệu năng 60 FPS
- Tuyệt đối không còn tàn dư đối tượng Web Audio hay phát âm thanh. Không sử dụng bất kỳ thư viện vẽ biểu đồ hay CSS ngoài nào khác.
- Tích hợp toàn bộ logic vẽ hạt Canvas FBM dung nham, Spring Grid, LERP tooltip, 3D Parallax và Tilt vào duy nhất một vòng lặp `requestAnimationFrame` đồng bộ khóa cứng hiệu năng 60 FPS mượt mành.

## Acceptance Criteria

### Master Hub & Xoay 3D Carousel (R1)
- [ ] Thẻ thứ 7 (Magma Fire) được tích hợp hoàn hảo vào 3D Carousel trung tâm, snapping cân đối các góc xoay mượt mà không bị lệch hay chồng lấn thẻ.
- [ ] Glow Orbs nền chuyển màu gradient đỏ rực lửa đồng bộ với thẻ Magma Fire. Nút Launch kích hoạt màn nổ pháo hoa tàn lửa soundless tuyệt đẹp trước khi chuyển trang.

### Đồ họa Magma Lửa & FBM Canvas (R1)
- [ ] Canvas nền chạy mượt mà dòng Magma FBM cuộn sóng, hạt tàn lửa bay lốc xoáy bám đuôi con trỏ chuột, tăng/giảm mật độ hạt ngay khi kéo thanh trượt settings.
- [ ] Các thẻ KPI và biểu đồ nghiêng 3D Perspective 1200px thị sai đa tầng sắc nét, spotlight shine bám đuổi tọa độ chuột hoàn hảo.

### Cơ sở dữ liệu Kỹ năng & AI Workflow Modal (R2)
- [ ] Bảng nhật ký hiển thị đầy đủ ít nhất 15 skills Antigravity với các trường phân loại nhóm, mã tác vụ, và mức tài nguyên.
- [ ] Nhấp dòng nhật ký hoặc nhấp đúp mốc biểu đồ mở ra Modal Hologram kính mờ hiển thị cực kỳ chi tiết, khoa học và cặn kẽ về "Công dụng lập trình" và "Vai trò workflow AI" của từng kỹ năng tương ứng.

### Đồng bộ 5 Trụ cột Công nghệ AURA V5.0 (R3)
- [ ] Chỉnh sửa dữ liệu trực tiếp bằng double click hoặc modal form cập nhật ngay lập tức các KPI cards, co giãn vẽ lại biểu đồ bằng hoạt họa mượt mà, lưu trữ bền vững vào `localStorage` (`aura_data_fire`).
- [ ] Forecast vẽ đường nét đứt dự báo và dải mờ khoảng tin cậy màu đỏ cam chính xác về mặt toán học.
- [ ] Compare Mode vẽ đường so sánh chồng nét đứt đa màu sắc tương ứng từ các dashboard khác.
- [ ] Export CSV/JSON tải file chuẩn xác, in PDF A4 ẩn sidebar/canvas nền, căn lề cực đẹp tiết kiệm mực in.

### Chất lượng mã nguồn & Tối ưu 60 FPS (R4)
- [ ] Zero Audio: Hoàn toàn không chứa `AudioContext` hay `playSynth` nào trong mã nguồn.
- [ ] Mã nguồn JavaScript đóng gói gọn gàng trong các capsule IIFE `"use strict";`.
- [ ] Đạt hiệu năng khóa cứng 60 FPS trơn tru trên mọi trình duyệt Chrome/Edge/Firefox.

## 2026-05-27T04:26:42Z

Đại tu xây dựng lại phong cách thứ 7 thành một Trang Blog tương tác Magma Lửa cao cấp (7-fire-magma) - liên kết hoàn hảo với Cổng Vũ Trụ Hub Portal gốc. Trang này sẽ không dùng giao diện Dashboard chi phí thông thường, mà sẽ là một nền tảng Blog tương tác 3D mô tả chi tiết, cặn kẽ bằng tiếng Việt về công dụng của 15+ siêu kỹ năng (Skills) của Antigravity và vai trò của chúng trong AI Workflow để phát triển repository, kế thừa đầy đủ 5 trụ cột công nghệ tương tác của phiên bản AURA V5.0.

Working directory: d:/dashboard-cost
Integrity mode: demo

## Requirements

### R1. Magma Fire Blog Visual Theme & FBM Lava Engine
- **Visuals**: Giao diện phối màu đỏ lửa neon, cam magma sôi sục và xám than carbon huyền bí.
- **Background Canvas**: Sử dụng Canvas nền hiệu ứng FBM (Fractional Brownian Motion) tạo dòng chảy Magma cuộn chảy động và các hạt tàn lửa bay lốc xoáy bám đuổi chuột mượt mà ở khóa cứng 60 FPS.
- **Spring Hooke Grid**: Các khung chữ tiêu đề bài viết sử dụng mô hình vật lý lò xo đàn hồi Hooke ($F = -kx - cv$) để tạo dao động co giãn uốn lượn lộng lẫy khi hover chuột qua.
- **Portal Hub Sync**: Tích hợp mượt mài với vòng xoay Cylindrical Carousel 3D 7 thẻ của Portal Hub gốc (`index.html`) với snapping 51.4 độ, các Orbs đổi màu đỏ magma đồng bộ và nổ pháo hoa soundless đỏ cam khi Launch chuyển cảnh.

### R2. Antigravity Skills Interactive Blog Platform
- **Antigravity Skills Directory**: Thiết kế giao diện Blog gồm Sidebar hiển thị danh sách 15+ siêu kỹ năng Antigravity thực tế (như `pymol`, `ncbi-sequence-fetch`, `clinical-trials-database`, `literature-search-openalex`, `uniprot-database`, `chembl-database`, `clinvar-database`, `dbsnp-database`, `ensembl-database`, `gnomad-database`, `gtex-database`, `human-protein-atlas-database`, `string-database`, `reactome-database`, `literature-search-arxiv`).
- **Detailed Content Structure**: Mỗi bài viết của kỹ năng trình bày bằng tiếng Việt khoa học gồm 2 phần lớn:
  1. *Công dụng lập trình (Programming Purpose)*: Giúp nhà phát triển giải quyết các bài toán sinh học, hóa học, y học, lập trình học thuật cụ thể nào.
  2. *Vai trò trong AI Workflow phát triển Repo (Repository Dev Role)*: Cách mà AI sử dụng skill này để tự động nghiên cứu codebase, tải dữ liệu chuẩn, thiết lập test cases, và tạo ra các giải pháp tối ưu cho kho lưu trữ mã nguồn.
- **Interactive Comments Section**: Cho phép người dùng thêm bình luận (comment), đánh giá mức độ quan tâm bài viết (Views/Likes) thời gian thực.

### R3. Đồng bộ hóa 5 Trụ cột Công nghệ AURA V5.0 dưới dạng Blog
- **Live Blog Configurator**: Người dùng có thể double-click chỉnh sửa trực tiếp tiêu đề/nội dung bài viết, thêm bài viết mới, thêm bình luận trực tiếp. Dữ liệu lưu trữ bền vững vào `localStorage` dưới khóa `aura_data_fire`. Cung cấp nút Reset mặc định để khôi phục dữ liệu gốc.
- **Handwritten OLS Analytics & Forecasting**: Biểu đồ SVG trực quan hóa lượt xem bài viết qua các ngày. Tích hợp tính năng dự báo viết tay thuật toán hồi quy tuyến tính OLS (Ordinary Least Squares) để vẽ đường nét đứt dự đoán xu hướng lượt xem 3 ngày tới kèm dải bóng mờ Confidence Interval màu đỏ cam mờ ảo lộng lẫy.
- **Theme & Physics Settings Panel**: Settings panel trượt hologram tinh chỉnh trực tiếp mật độ tàn lửa (Spark Count), tốc độ gió FBM (Lava Flow Speed), độ đàn hồi lò xo Hooke ($k$ và $c$) của lưới grid khung chữ khi hover chuột.
- **Cross-Dashboard Compare Mode**: Cho phép so sánh trực tiếp lượt xem bài viết hiện tại với các bài viết kỹ năng khác thông qua biểu đồ SVG (vẽ đè thêm đường so sánh nét đứt màu đối nghịch).
- **Export & PDF Print**: Hỗ trợ xuất bài viết và bình luận ra file CSV hoặc JSON. Tích hợp `@media print` CSS thiết kế trang in A4 dọc thanh lịch như trang sách in sắc nét tông sáng tương phản cao, ẩn hoàn toàn canvas nền/sidebar.

### R4. Zero Audio & Tối ưu hiệu năng 60 FPS
- **Performance**: Vòng lặp `requestAnimationFrame` đồng bộ hợp nhất vẽ canvas nền, chuyển động hạt tàn lửa, lò xo Hooke, và LERP tooltip để khóa cứng hiệu năng 60 FPS.
- **No Libraries**: 100% mã nguồn Javascript thuần túy (Vanilla JS), tuyệt đối không dùng thư viện ngoài (Chart.js, D3, Tailwind,...).
- **Zero Audio**: Tuyệt đối không có âm thanh gây ồn ào. Đóng gói IIFE strict mode `"use strict";` hoàn toàn sạch sẽ.

### R5. Kịch bản kiểm thử E2E tự động chạy
- Viết file `app.e2e.js` chứa tối thiểu 11 test cases Javascript gốc tự động chạy kiểm thử tất cả các chức năng (R1-R4) khi tải trang.
- Có panel giao diện "E2E Test Runner" ẩn tinh tế ở góc màn hình hiển thị kết quả kiểm thử trực quan bằng mắt thường (Pass/Fail từng bài test) và in log chi tiết ra console.

---

## Acceptance Criteria

### AC1. Giao diện & Hiệu năng Magma FBM
- Giao diện Style 7 đổi mới hoàn toàn thành Blog Reader với tông màu tối charcoal carbon chủ đạo, chữ và viền đỏ neon/magma rực rỡ.
- Nền canvas vẽ FBM Lava hoạt động ở 60 FPS mượt mà. Hạt tàn lửa bay theo chuột khi di chuyển, số lượng hạt thay đổi chính xác khi chỉnh slider settings panel.
- Hiệu ứng co giãn lưới grid chữ Hooke hoạt động đàn hồi nẩy mềm mại khi hover chuột qua các bài viết.
- Sự chuyển cảnh từ Hub Portal sang Style 7 kích hoạt pháo hoa đỏ cam soundless mượt mà, snap xoay Cylindrical Carousel 3D 7 thẻ hoạt động chuẩn xác 51.4 độ.

### AC2. 15+ Skills Blog & Bình luận
- Sidebar hiển thị danh sách đầy đủ 15+ siêu kỹ năng của Antigravity. Click vào một kỹ năng sẽ thay đổi nội dung bài viết hiển thị chính giữa tức thì.
- Nội dung bài viết tiếng Việt phân tách rõ ràng "Công dụng lập trình" và "Tác dụng trong AI Workflow phát triển Repo".
- Phần bình luận cho phép nhập nội dung bình luận, nhấn gửi sẽ cập nhật hiển thị ngay lập tức và tăng số lượng bình luận trên sidebar.

### AC3. OLS Hồi quy tuyến tính viết tay & Compare Mode
- Biểu đồ SVG vẽ đường xu hướng lượt xem 7 ngày qua của bài viết đang đọc.
- Nút "Bật dự báo 3 ngày tới" hoạt động vẽ thêm 3 điểm nét đứt cam sáng kèm dải bóng mờ Confidence Interval màu đỏ cam mờ bằng toán học OLS viết tay 100% chuẩn xác.
- Dropdown so sánh hoạt động vẽ đè thêm một đường so sánh nét đứt màu đối nghịch của bài viết được chọn lên biểu đồ.

### AC4. Live Configurator & settings panel
- Double-click vào tiêu đề hoặc nội dung bài viết sẽ biến thành input/textarea để sửa trực tiếp. Nhấn Enter hoặc blur sẽ lưu trực tiếp vào `localStorage`. Tải lại trang giữ nguyên nội dung đã sửa.
- Nút "Reset Data" phục hồi toàn bộ bài viết, bình luận, lượt xem về trạng thái gốc của Antigravity.
- Settings panel trượt hologram ra khi click icon góc màn hình, thay đổi mật độ hạt, tốc độ magma, độ đàn hồi lò xo cập nhật tức thì vào Engine vẽ.

### AC5. Xuất File & In ấn
- Nút xuất dữ liệu tải xuống file CSV hoặc JSON chứa toàn bộ nội dung bài viết và các bình luận liên quan chuẩn định dạng.
- Khi nhấn Ctrl+P, giao diện chuyển sang bản in đen trắng nền sáng tương phản cao dọc A4, ẩn canvas, sidebar, settings panel, chỉ giữ lại nội dung bài viết và bình luận in như sách giáo khoa.

### AC6. E2E Test Runner tự chạy
- Khi trang được tải, file `app.e2e.js` tự động khởi chạy 11 test cases kiểm thử tự động, in log xanh/đỏ ra console.
- Panel "E2E Test Runner" ở góc trang hiển thị: `Pass: X/11, Fail: Y/11` kèm tên các bài test để người dùng kiểm chứng trực tiếp.
