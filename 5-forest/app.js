/* ==========================================================================
   AURA Dashboard Engine - Forest Style (HIGH-END FRONTEND V4.0 - NO AUDIO)
   ========================================================================== */

(function () {
  "use strict";

  // 1. Mock Datasets (Consistent structure across all dashboard styles)
  const datasets = {
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      revenue: [1200, 1800, 1400, 2200, 1900, 2800, 3100],
      cost: [400, 550, 480, 700, 600, 850, 920],
      kpi: {
        revenue: '$14,289.45',
        users: '24,890',
        cost: '$3,450.00',
        conversion: '3.84%',
        revenueTrend: '+12.4%',
        usersTrend: '+4.5%',
        costTrend: '-8.2%',
        conversionTrend: '+1.2%'
      }
    },
    month: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      revenue: [12400, 15800, 14200, 19800],
      cost: [3800, 4200, 3900, 4800],
      kpi: {
        revenue: '$62,200.00',
        users: '98,450',
        cost: '$16,700.00',
        conversion: '4.12%',
        revenueTrend: '+18.2%',
        usersTrend: '+8.1%',
        costTrend: '-5.4%',
        conversionTrend: '+2.1%'
      }
    },
    year: {
      labels: ['2022', '2023', '2024', '2025', '2026'],
      revenue: [120000, 150000, 185000, 240000, 290000],
      cost: [45000, 52000, 58000, 72000, 81000],
      kpi: {
        revenue: '$985,000.00',
        users: '342,000',
        cost: '$308,000.00',
        conversion: '4.89%',
        revenueTrend: '+22.5%',
        usersTrend: '+15.4%',
        costTrend: '+12.1%',
        conversionTrend: '+3.5%'
      }
    }
  };

  let currentPeriod = 'week';
  let selectedCategoryFilter = null; // null means no category filter active

  // R1: Persistent Data State & Configuration Settings
  const storageKey = 'aura_data_forest';
  window.AuraConfig = {
    particleCount: 75,
    particleSpeed: 1.0,
    springK: 0.08,
    springC: 0.12,
    canvasOpacity: 0.8
  };

  function saveToLocalStorage() {
    try {
      const state = {
        datasets: datasets,
        transactions: transactions,
        config: window.AuraConfig
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save local storage state.", e);
    }
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.config) {
          window.AuraConfig = { ...window.AuraConfig, ...parsed.config };
          // Sync HTML elements if they exist
          const slideCount = document.getElementById('slide-particle-count');
          const valCount = document.getElementById('val-particle-count');
          if (slideCount) {
            slideCount.value = window.AuraConfig.particleCount;
            if (valCount) valCount.textContent = window.AuraConfig.particleCount;
          }
          const slideSpeed = document.getElementById('slide-particle-speed');
          const valSpeed = document.getElementById('val-particle-speed');
          if (slideSpeed) {
            slideSpeed.value = window.AuraConfig.particleSpeed;
            if (valSpeed) valSpeed.textContent = window.AuraConfig.particleSpeed.toFixed(1) + 'x';
          }
          const slideK = document.getElementById('slide-spring-k');
          const valK = document.getElementById('val-spring-k');
          if (slideK) {
            slideK.value = window.AuraConfig.springK;
            if (valK) valK.textContent = window.AuraConfig.springK.toFixed(2);
          }
          const slideC = document.getElementById('slide-spring-c');
          const valC = document.getElementById('val-spring-c');
          if (slideC) {
            slideC.value = window.AuraConfig.springC;
            if (valC) valC.textContent = window.AuraConfig.springC.toFixed(2);
          }
          const slideOpacity = document.getElementById('slide-canvas-opacity');
          const valOpacity = document.getElementById('val-canvas-opacity');
          if (slideOpacity) {
            slideOpacity.value = window.AuraConfig.canvasOpacity;
            if (valOpacity) valOpacity.textContent = window.AuraConfig.canvasOpacity.toFixed(2);
            const canvasEl = document.getElementById('ambient-particles');
            if (canvasEl) {
              canvasEl.style.opacity = window.AuraConfig.canvasOpacity;
            }
          }
        }
        if (parsed.datasets) {
          Object.keys(parsed.datasets).forEach(period => {
            if (datasets[period]) {
              datasets[period].revenue = [...parsed.datasets[period].revenue];
              datasets[period].cost = [...parsed.datasets[period].cost];
              datasets[period].kpi = { ...parsed.datasets[period].kpi };
            }
          });
        }
        if (parsed.transactions) {
          transactions.splice(0, transactions.length, ...parsed.transactions);
        }
      } catch (e) {
        console.error("Failed to load local storage state.", e);
      }
    } else {
      saveToLocalStorage();
    }
  }

  // State variables for forecasting, comparison & editing
  let isForecastMode = false;
  let isCompareMode = false;
  let compareStyle = 'ice-frost';
  let editingTxId = null;

  // Pure JS Linear Regression Forecasting Engine (R2)
  function calculateForecast(series, forecastSteps = 3) {
    const n = series.length;
    if (n < 2) return { predictions: Array(forecastSteps).fill(0), upperCI: Array(forecastSteps).fill(0), lowerCI: Array(forecastSteps).fill(0) };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += series[i];
      sumXY += i * series[i];
      sumXX += i * i;
    }
    const meanX = sumX / n;
    const meanY = sumY / n;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = meanY - slope * meanX;

    let sumSquaredResiduals = 0;
    for (let i = 0; i < n; i++) {
      const predY = slope * i + intercept;
      sumSquaredResiduals += Math.pow(series[i] - predY, 2);
    }
    const s_e = Math.sqrt(sumSquaredResiduals / (n - 2 || 1));

    let sumSSX = 0;
    for (let i = 0; i < n; i++) {
      sumSSX += Math.pow(i - meanX, 2);
    }
    if (sumSSX === 0) sumSSX = 1;

    const predictions = [];
    const upperCI = [];
    const lowerCI = [];

    for (let step = 1; step <= forecastSteps; step++) {
      const x_p = n - 1 + step;
      const y_p = slope * x_p + intercept;
      const se_pred = s_e * Math.sqrt(1 + (1 / n) + (Math.pow(x_p - meanX, 2) / sumSSX));
      const margin = 1.96 * se_pred;

      predictions.push(Math.max(0, y_p));
      upperCI.push(Math.max(0, y_p + margin));
      lowerCI.push(Math.max(0, y_p - margin));
    }

    return { predictions, upperCI, lowerCI };
  }

  // Other Styles configurations for Comparative Mode (R4)
  const otherStyles = {
    'ice-frost': { name: 'Ice Frost', color: '#00f3ff', storageKey: 'aura_data_ice', defaultData: { week: [1200, 1800, 1400, 2200, 1900, 2800, 3100], month: [12400, 15800, 14200, 19800], year: [120000, 150000, 185000, 240000, 290000] } },
    'warm-timber': { name: 'Warm Timber', color: '#e5a93b', storageKey: 'aura_data_timber', defaultData: { week: [1050, 1500, 1250, 1950, 1750, 2450, 2850], month: [11000, 14200, 12800, 18200], year: [110000, 138000, 170000, 220000, 270000] } },
    'autumn': { name: 'Autumn Gold', color: '#ff6b3b', storageKey: 'aura_data_autumn', defaultData: { week: [1000, 1450, 1200, 1850, 1650, 2350, 2750], month: [10500, 13800, 12400, 17500], year: [105000, 134000, 165000, 215000, 260000] } },
    'forest': { name: 'Forest Green', color: '#2ecc71', storageKey: 'aura_data_forest', defaultData: { week: [1300, 1900, 1500, 2300, 2000, 2900, 3200], month: [13000, 16500, 15000, 21000], year: [125000, 155000, 190000, 250000, 300000] } },
    'river': { name: 'River Blue', color: '#3498db', storageKey: 'aura_data_river', defaultData: { week: [1150, 1700, 1350, 2150, 1850, 2700, 3000], month: [12000, 15200, 13800, 19500], year: [118000, 148000, 180000, 235000, 285000] } }
  };

  function getCompareData() {
    const styleInfo = otherStyles[compareStyle];
    if (!styleInfo) return [];

    const saved = localStorage.getItem(styleInfo.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.datasets && parsed.datasets[currentPeriod]) {
          return parsed.datasets[currentPeriod].revenue;
        }
      } catch (e) {}
    }
    return styleInfo.defaultData[currentPeriod] || [];
  }

  // Initial Mock Transactions
  let transactions = [
    { id: 'TX-1092', desc: 'AWS Cloud Hosting', time: '10:45 AM, Hôm nay', category: 'Hosting', amount: 350.00, status: 'success' },
    { id: 'TX-1091', desc: 'Google Search Ads', time: '08:30 AM, Hôm nay', category: 'Marketing', amount: 150.00, status: 'success' },
    { id: 'TX-1090', desc: 'Figma Team Subscription', time: 'Hôm qua', category: 'APIs', amount: 45.00, status: 'success' },
    { id: 'TX-1089', desc: 'Slack Operations', time: 'Hôm qua', category: 'APIs', amount: 120.00, status: 'success' },
    { id: 'TX-1088', desc: 'Payroll Vận hành', time: '25 Tháng 5', category: 'Team', amount: 2500.00, status: 'pending' }
  ];

  // 2. DOM Elements
  const tabWeek = document.getElementById('tab-week');
  const tabMonth = document.getElementById('tab-month');
  const tabYear = document.getElementById('tab-year');

  const valRevenue = document.getElementById('val-revenue');
  const valUsers = document.getElementById('val-users');
  const valCost = document.getElementById('val-cost');
  const valConversion = document.getElementById('val-conversion');

  const trendRevenue = document.querySelector('.kpi-card:nth-child(1) .kpi-trend span');
  const trendUsers = document.querySelector('.kpi-card:nth-child(2) .kpi-trend span');
  const trendCost = document.querySelector('.kpi-card:nth-child(3) .kpi-trend span');
  const trendConversion = document.querySelector('.kpi-card:nth-child(4) .kpi-trend span');

  const chartSvg = document.getElementById('main-analytics-chart');
  const chartPaths = document.getElementById('chart-paths');
  const chartNodes = document.getElementById('chart-data-nodes');
  const chartLabelsX = document.getElementById('chart-axis-labels-x');
  const tooltip = document.getElementById('chart-tooltip');

  const transBody = document.getElementById('transactions-body');
  const btnAddTx = document.getElementById('btn-add-tx');
  const addTxDialog = document.getElementById('add-tx-dialog');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const searchInput = document.querySelector('.search-box input');

  // 3. Render Interactive SVG Chart with Smooth Bézier Curves & Crosshair Scanner
  function renderChart() {
    const data = datasets[currentPeriod];
    const forecastSteps = 3;

    // Set up labels based on forecast mode
    let labelsList = [...data.labels];
    if (isForecastMode) {
      for (let i = 1; i <= forecastSteps; i++) {
        labelsList.push(`DB${i}`);
      }
    }
    const pointsCount = labelsList.length;
    
    // Clear previous drawings
    chartPaths.innerHTML = '';
    chartNodes.innerHTML = '';
    chartLabelsX.innerHTML = '';

    const chartWidth = 600;
    const chartHeight = 320;
    const paddingLeft = 50;
    const paddingRight = 50;
    const paddingTop = 50;
    const paddingBottom = 60;

    const graphWidth = chartWidth - paddingLeft - paddingRight;
    const graphHeight = chartHeight - paddingTop - paddingBottom;

    // Compile calculations
    let revForecast = { predictions: [], upperCI: [], lowerCI: [] };
    let costForecast = { predictions: [], upperCI: [], lowerCI: [] };

    if (isForecastMode) {
      revForecast = calculateForecast(data.revenue, forecastSteps);
      costForecast = calculateForecast(data.cost, forecastSteps);
    }

    // Find max value to auto-scale chart
    const compRevenue = isCompareMode ? getCompareData() : [];
    const allMaxValues = [
      ...data.revenue, 
      ...data.cost, 
      ...(isForecastMode ? [...revForecast.upperCI, ...costForecast.upperCI] : []),
      ...compRevenue
    ];
    const maxVal = Math.max(...allMaxValues) * 1.1 || 100;

    // Helper to map data coordinates to SVG space
    const getCoordinates = (index, value) => {
      const x = paddingLeft + (index / (pointsCount - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (value / maxVal) * graphHeight;
      return { x, y };
    };

    // Compile historical points coordinates
    const revCoords = data.revenue.map((val, i) => getCoordinates(i, val));
    const costCoords = data.cost.map((val, i) => getCoordinates(i, val));

    // Function to compile smooth Bézier curve path string
    const getCurvePathD = (coords) => {
      let d = `M ${coords[0].x} ${coords[0].y} `;
      for (let i = 0; i < coords.length - 1; i++) {
        const curr = coords[i];
        const next = coords[i+1];
        const cpX1 = curr.x + (next.x - curr.x) / 2;
        const cpY1 = curr.y;
        const cpX2 = curr.x + (next.x - curr.x) / 2;
        const cpY2 = next.y;
        d += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y} `;
      }
      return d;
    };

    // Generate Area D from line D
    const getAreaD = (lineD, coords) => {
      return lineD + `L ${coords[coords.length - 1].x} ${paddingTop + graphHeight} L ${coords[0].x} ${paddingTop + graphHeight} Z`;
    };

    const revLineD = getCurvePathD(revCoords);
    const costLineD = getCurvePathD(costCoords);

    // Draw Revenue Area
    const revAreaElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    revAreaElement.setAttribute('d', getAreaD(revLineD, revCoords));
    revAreaElement.setAttribute('fill', 'url(#gradient-revenue)');
    revAreaElement.style.opacity = '0';
    revAreaElement.style.transition = 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
    chartPaths.appendChild(revAreaElement);
    setTimeout(() => revAreaElement.style.opacity = '1', 200);

    // Draw Revenue Line with draw-in animation
    const revLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    revLineElement.setAttribute('d', revLineD);
    revLineElement.setAttribute('class', 'chart-line-revenue');
    chartPaths.appendChild(revLineElement);
    
    setTimeout(() => {
      try {
        const length = revLineElement.getTotalLength();
        revLineElement.style.strokeDasharray = length;
        revLineElement.style.strokeDashoffset = length;
        revLineElement.getBoundingClientRect(); // reflow
        revLineElement.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
        revLineElement.style.strokeDashoffset = '0';
      } catch(e){}
    }, 50);

    // Draw Glowing Dynamic Revenue Flow Line (Fades in)
    const revLineFlowElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    revLineFlowElement.setAttribute('d', revLineD);
    revLineFlowElement.setAttribute('class', 'chart-line-revenue-flow');
    revLineFlowElement.style.opacity = '0';
    revLineFlowElement.style.transition = 'opacity 1s ease';
    chartPaths.appendChild(revLineFlowElement);
    setTimeout(() => revLineFlowElement.style.opacity = '0.85', 1200);

    // Draw Cost Area
    const costAreaElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    costAreaElement.setAttribute('d', getAreaD(costLineD, costCoords));
    costAreaElement.setAttribute('fill', 'url(#gradient-cost)');
    costAreaElement.style.opacity = '0';
    costAreaElement.style.transition = 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
    chartPaths.appendChild(costAreaElement);
    setTimeout(() => costAreaElement.style.opacity = '1', 200);

    // Draw Cost Line with draw-in animation
    const costLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    costLineElement.setAttribute('d', costLineD);
    costLineElement.setAttribute('class', 'chart-line-cost');
    chartPaths.appendChild(costLineElement);
    
    setTimeout(() => {
      try {
        const length = costLineElement.getTotalLength();
        costLineElement.style.strokeDasharray = length;
        costLineElement.style.strokeDashoffset = length;
        costLineElement.getBoundingClientRect();
        costLineElement.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
        costLineElement.style.strokeDashoffset = '0';
      } catch(e){}
    }, 50);

    // Draw Glowing Dynamic Cost Flow Line
    const costLineFlowElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    costLineFlowElement.setAttribute('d', costLineD);
    costLineFlowElement.setAttribute('class', 'chart-line-cost-flow');
    costLineFlowElement.style.opacity = '0';
    costLineFlowElement.style.transition = 'opacity 1s ease';
    chartPaths.appendChild(costLineFlowElement);
    setTimeout(() => costLineFlowElement.style.opacity = '0.85', 1200);

    // R4: Render Compare Mode Dataset Line
    if (isCompareMode) {
      const compRevenueData = getCompareData();
      if (compRevenueData.length > 0) {
        const compCoords = compRevenueData.map((val, i) => getCoordinates(i, val));
        const compLineD = getCurvePathD(compCoords);
        const compLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        compLineElement.setAttribute('d', compLineD);
        compLineElement.setAttribute('fill', 'none');
        compLineElement.setAttribute('stroke', otherStyles[compareStyle].color || '#ffffff');
        compLineElement.setAttribute('stroke-width', '2.5');
        compLineElement.setAttribute('stroke-dasharray', '6 4');
        compLineElement.style.opacity = '0.7';
        chartPaths.appendChild(compLineElement);

        // Add nodes for comparison style
        compCoords.forEach((coord, i) => {
          const compCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          compCircle.setAttribute('cx', coord.x);
          compCircle.setAttribute('cy', coord.y);
          compCircle.setAttribute('r', '4');
          compCircle.setAttribute('fill', otherStyles[compareStyle].color || '#ffffff');
          compCircle.setAttribute('stroke', 'rgba(255,255,255,0.8)');
          compCircle.setAttribute('stroke-width', '1');
          chartNodes.appendChild(compCircle);
        });
      }
    }

    // R2: Auto-Forecasting Linear Regression drawing with Shaded Confidence Intervals
    let allXCoords = revCoords.map(c => c.x);

    if (isForecastMode && revForecast.predictions.length > 0) {
      const lastRevCoord = revCoords[revCoords.length - 1];
      const lastCostCoord = costCoords[costCoords.length - 1];

      const revForecastCoords = revForecast.predictions.map((val, i) => getCoordinates(revCoords.length + i, val));
      const costForecastCoords = costForecast.predictions.map((val, i) => getCoordinates(costCoords.length + i, val));

      const allRevForecastCoords = [lastRevCoord, ...revForecastCoords];
      const allCostForecastCoords = [lastCostCoord, ...costForecastCoords];

      const revForecastLineD = getCurvePathD(allRevForecastCoords);
      const costForecastLineD = getCurvePathD(allCostForecastCoords);

      // Render forecast dashed lines
      const revForecastLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      revForecastLine.setAttribute('d', revForecastLineD);
      revForecastLine.setAttribute('fill', 'none');
      revForecastLine.setAttribute('stroke', '#00e699');
      revForecastLine.setAttribute('stroke-width', '2.5');
      revForecastLine.setAttribute('stroke-dasharray', '5 3');
      chartPaths.appendChild(revForecastLine);

      const costForecastLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      costForecastLine.setAttribute('d', costForecastLineD);
      costForecastLine.setAttribute('fill', 'none');
      costForecastLine.setAttribute('stroke', '#6b7f73');
      costForecastLine.setAttribute('stroke-width', '2.5');
      costForecastLine.setAttribute('stroke-dasharray', '5 3');
      chartPaths.appendChild(costForecastLine);

      // Render shaded confidence interval area for revenue
      const revLowerCoords = revForecast.lowerCI.map((val, i) => getCoordinates(revCoords.length + i, val));
      const revUpperCoords = revForecast.upperCI.map((val, i) => getCoordinates(revCoords.length + i, val));

      let ciPathD = `M ${lastRevCoord.x} ${lastRevCoord.y} `;
      revUpperCoords.forEach(c => ciPathD += `L ${c.x} ${c.y} `);
      for (let i = revLowerCoords.length - 1; i >= 0; i--) {
        ciPathD += `L ${revLowerCoords[i].x} ${revLowerCoords[i].y} `;
      }
      ciPathD += 'Z';

      const ciArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ciArea.setAttribute('d', ciPathD);
      ciArea.setAttribute('fill', '#00e699');
      ciArea.setAttribute('opacity', '0.07');
      chartPaths.appendChild(ciArea);

      revForecastCoords.forEach(c => allXCoords.push(c.x));
    }

    // Create scanning vertical line (Crosshair)
    const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    crosshair.setAttribute('y1', paddingTop - 10);
    crosshair.setAttribute('y2', paddingTop + graphHeight + 10);
    crosshair.setAttribute('stroke', 'rgba(0, 230, 153, 0.4)'); // Emerald crosshair
    crosshair.setAttribute('stroke-width', '1.5');
    crosshair.setAttribute('stroke-dasharray', '4 4');
    crosshair.style.opacity = '0';
    crosshair.style.transition = 'opacity 0.2s ease, x1 0.1s ease, x2 0.1s ease';
    chartPaths.appendChild(crosshair);

    // Draw Nodes (circles) & Labels
    labelsList.forEach((label, i) => {
      const isForecastNode = i >= data.revenue.length;
      const cx = allXCoords[i];
      const cyRev = isForecastNode ? getCoordinates(i, revForecast.predictions[i - data.revenue.length]).y : revCoords[i].y;
      const cyCost = isForecastNode ? getCoordinates(i, costForecast.predictions[i - data.revenue.length]).y : costCoords[i].y;

      // X-Axis Labels
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', cx);
      textElement.setAttribute('y', paddingTop + graphHeight + 25);
      textElement.textContent = label;
      chartLabelsX.appendChild(textElement);

      // Revenue Node Dot with cascade scale transition
      const revCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      revCircle.setAttribute('cx', cx);
      revCircle.setAttribute('cy', cyRev);
      revCircle.setAttribute('class', 'chart-node chart-node-revenue');
      revCircle.setAttribute('id', `rev-node-${i}`);
      revCircle.style.transform = 'scale(0)';
      revCircle.style.transformOrigin = `${cx}px ${cyRev}px`;
      revCircle.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      chartNodes.appendChild(revCircle);

      // Double click to edit Revenue (R1)
      if (!isForecastNode) {
        revCircle.addEventListener('dblclick', () => {
          const newVal = prompt(`Nhập Doanh thu mới cho [${label}]:`, data.revenue[i]);
          if (newVal !== null && !isNaN(parseFloat(newVal))) {
            data.revenue[i] = parseFloat(newVal);
            saveToLocalStorage();
            updateFromTransactions();
            updateKPIs();
            renderChart();
          }
        });
      }
      
      // Cost Node Dot
      const costCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      costCircle.setAttribute('cx', cx);
      costCircle.setAttribute('cy', cyCost);
      costCircle.setAttribute('class', 'chart-node chart-node-cost');
      costCircle.setAttribute('id', `cost-node-${i}`);
      costCircle.style.transform = 'scale(0)';
      costCircle.style.transformOrigin = `${cx}px ${cyCost}px`;
      costCircle.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      chartNodes.appendChild(costCircle);

      // Double click to edit Cost (R1)
      if (!isForecastNode) {
        costCircle.addEventListener('dblclick', () => {
          const newVal = prompt(`Nhập Chi phí mới cho [${label}]:`, data.cost[i]);
          if (newVal !== null && !isNaN(parseFloat(newVal))) {
            data.cost[i] = parseFloat(newVal);
            saveToLocalStorage();
            updateFromTransactions();
            updateKPIs();
            renderChart();
          }
        });
      }

      // Trigger sequential popping up
      setTimeout(() => {
        revCircle.style.transform = 'scale(1)';
        costCircle.style.transform = 'scale(1)';
      }, i * 80 + 300);
    });

    // Hot tracking overlay rectangle for seamless crosshair hover
    const trackingOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    trackingOverlay.setAttribute('x', paddingLeft);
    trackingOverlay.setAttribute('y', paddingTop);
    trackingOverlay.setAttribute('width', graphWidth);
    trackingOverlay.setAttribute('height', graphHeight);
    trackingOverlay.setAttribute('fill', 'transparent');
    trackingOverlay.style.cursor = 'crosshair';
    chartNodes.appendChild(trackingOverlay);

    // Track Mouse movement to position Crosshair
    trackingOverlay.addEventListener('mousemove', (e) => {
      const rect = chartSvg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
      
      // Calculate nearest data point index
      let minDiff = Infinity;
      let nearestIndex = 0;
      allXCoords.forEach((cxCoord, idx) => {
        const diff = Math.abs(cxCoord - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIndex = idx;
        }
      });

      const targetX = allXCoords[nearestIndex];
      
      // Position crosshair line
      crosshair.setAttribute('x1', targetX);
      crosshair.setAttribute('x2', targetX);
      crosshair.style.opacity = '1';

      // Highlight active dots
      document.querySelectorAll('.chart-node').forEach(node => node.classList.remove('active'));
      const revNode = document.getElementById(`rev-node-${nearestIndex}`);
      const costNode = document.getElementById(`cost-node-${nearestIndex}`);
      if (revNode) revNode.classList.add('active');
      if (costNode) costNode.classList.add('active');

      // Update Tooltip values and position targets
      tooltip.classList.add('active');
      
      let tooltipContent = '';
      const isForecastNode = nearestIndex >= data.revenue.length;

      if (isForecastNode) {
        const forecastIdx = nearestIndex - data.revenue.length;
        const revVal = Math.round(revForecast.predictions[forecastIdx]);
        const revLow = Math.round(revForecast.lowerCI[forecastIdx]);
        const revHigh = Math.round(revForecast.upperCI[forecastIdx]);
        const costVal = Math.round(costForecast.predictions[forecastIdx]);
        const costLow = Math.round(costForecast.lowerCI[forecastIdx]);
        const costHigh = Math.round(costForecast.upperCI[forecastIdx]);

        tooltipContent = `
          <div class="tooltip-title">${labelsList[nearestIndex]} (Dự báo)</div>
          <div class="tooltip-row">
            <span>Doanh thu:</span>
            <strong style="color: #00e699">$${revVal.toLocaleString()} <span style="font-size: 9px; font-weight: normal; color: var(--color-text-secondary);">[CI: $${revLow}-$${revHigh}]</span></strong>
          </div>
          <div class="tooltip-row">
            <span>Chi phí:</span>
            <strong style="color: #6b7f73">$${costVal.toLocaleString()} <span style="font-size: 9px; font-weight: normal; color: var(--color-text-secondary);">[CI: $${costLow}-$${costHigh}]</span></strong>
          </div>
        `;
      } else {
        tooltipContent = `
          <div class="tooltip-title">${labelsList[nearestIndex]}</div>
          <div class="tooltip-row">
            <span>Doanh thu:</span>
            <strong style="color: #00e699">$${data.revenue[nearestIndex].toLocaleString()}</strong>
          </div>
          <div class="tooltip-row">
            <span>Chi phí:</span>
            <strong style="color: #6b7f73">$${data.cost[nearestIndex].toLocaleString()}</strong>
          </div>
        `;
      }

      tooltip.innerHTML = tooltipContent;

      if (window.__setTooltipCoords) {
        window.__setTooltipCoords(e.clientX - rect.left + 15, e.clientY - rect.top - 55, true);
      } else {
        tooltip.style.left = `${(e.clientX - rect.left) + 15}px`;
        tooltip.style.top = `${(e.clientY - rect.top) - 55}px`;
      }
    });

    // Track mouse leaving
    trackingOverlay.addEventListener('mouseleave', () => {
      crosshair.style.opacity = '0';
      tooltip.classList.remove('active');
      document.querySelectorAll('.chart-node').forEach(node => node.classList.remove('active'));
      if (window.__setTooltipCoords) {
        window.__setTooltipCoords(0, 0, false);
      }
    });
  }
  }

  // 4. Update KPI details
  function updateKPIs() {
    const kpi = datasets[currentPeriod].kpi;
    
    // Smooth CSS scale/contract pulse animation (R1)
    const cards = document.querySelectorAll('.kpi-card');
    cards.forEach(card => {
      card.classList.remove('pulse');
      void card.offsetWidth; // Reflow to restart keyframe
      card.classList.add('pulse');
    });

    valRevenue.textContent = kpi.revenue;
    valUsers.textContent = kpi.users;
    valCost.textContent = kpi.cost;
    valConversion.textContent = kpi.conversion;

    trendRevenue.textContent = kpi.revenueTrend;
    trendUsers.textContent = kpi.usersTrend;
    trendCost.textContent = kpi.costTrend;
    trendConversion.textContent = kpi.conversionTrend;

    updateTrendClass(trendRevenue, kpi.revenueTrend);
    updateTrendClass(trendUsers, kpi.usersTrend);
    updateTrendClass(trendCost, kpi.costTrend);
    updateTrendClass(trendConversion, kpi.conversionTrend);
  }

  function updateTrendClass(element, trendValue) {
    const parent = element.parentElement;
    if (trendValue.startsWith('+')) {
      parent.className = 'kpi-trend trend-up';
      parent.querySelector('svg').innerHTML = '<path d="m19 12-7-7-7 7h4v6h6v-6z"/>';
    } else {
      parent.className = 'kpi-trend trend-down';
      parent.querySelector('svg').innerHTML = '<path d="m5 12 7 7 7-7h-4V6H9v6z"/>';
    }
  }

  // 5. Render Transactions Table with Search & Category Filters
  function renderTable() {
    transBody.innerHTML = '';
    
    const query = searchInput.value.toLowerCase().trim();

    // Filter transaction list
    const filtered = transactions.filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(query) || tx.desc.toLowerCase().includes(query);
      const matchesCategory = !selectedCategoryFilter || tx.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      transBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-secondary); padding: 30px;">Không tìm thấy giao dịch nào phù hợp.</td></tr>`;
      return;
    }

    filtered.forEach((tx, idx) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.style.opacity = '0';
      tr.style.transform = 'translateY(15px)';
      tr.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      tr.innerHTML = `
        <td class="tx-id-col">${tx.id}</td>
        <td><strong>${tx.desc}</strong></td>
        <td>${tx.time}</td>
        <td>${tx.category}</td>
        <td><strong>$${tx.amount.toFixed(2)}</strong></td>
        <td><span class="badge badge-${tx.status === 'success' ? 'success' : 'pending'}">${tx.status === 'success' ? 'Hoàn thành' : 'Đang xử lý'}</span></td>
        <td>
          <button class="btn-action-delete" data-id="${tx.id}">Xóa</button>
        </td>
      `;
      
      // Row click to edit transaction (R1)
      tr.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-action-delete')) return;
        openEditModal(tx);
      });

      // Delete button click handler (R1)
      const deleteBtn = tr.querySelector('.btn-action-delete');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Bạn có chắc chắn muốn xóa giao dịch ${tx.id}?`)) {
          deleteTransaction(tx.id);
        }
      });

      transBody.appendChild(tr);
      
      // Delayed cascade fade-in rows
      setTimeout(() => {
        tr.style.opacity = '1';
        tr.style.transform = 'translateY(0)';
      }, idx * 60);
    });
  }

  // 6. Interactive Doughnut Segments with dynamic load animation & click filtering
  function initDoughnut() {
    const slices = {
      hosting: document.getElementById('slice-hosting'),
      marketing: document.getElementById('slice-marketing'),
      team: document.getElementById('slice-team'),
      apis: document.getElementById('slice-apis')
    };

    // Add load transition
    Object.values(slices).forEach(slice => {
      if (!slice) return;
      slice.style.transition = 'stroke-dashoffset 1s ease-out, stroke-width 0.3s ease';
      slice.style.strokeDashoffset = '439.8';
      setTimeout(() => {
        slice.style.strokeDashoffset = '0';
      }, 100);
    });

    // Clicking elements on legend list filters table
    document.querySelectorAll('.cost-legend-list .legend-list-item').forEach((item) => {
      item.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active-filter');
        
        // Clear filter status
        document.querySelectorAll('.cost-legend-list .legend-list-item').forEach(i => {
          i.classList.remove('active-filter', 'active');
        });

        if (isCurrentlyActive) {
          selectedCategoryFilter = null;
          // reset doughnut center
          document.querySelector('.total-percent').textContent = '45%';
          document.querySelector('.total-label').textContent = 'Hosting';
          resetDoughnutStroke();
        } else {
          item.classList.add('active-filter', 'active');
          const percent = item.getAttribute('data-percent');
          const label = item.getAttribute('data-label');
          selectedCategoryFilter = label === 'Team Ops' ? 'Team' : label; // Align with categories

          document.querySelector('.total-percent').textContent = percent;
          document.querySelector('.total-label').textContent = label;

          // Visual pop-out slice
          const id = item.querySelector('.legend-color-indicator').className.split('bg-')[1];
          Object.keys(slices).forEach(key => {
            if (!slices[key]) return;
            slices[key].style.strokeWidth = '18';
            if (slices[key].id === `slice-${id}`) {
              slices[key].style.strokeWidth = '24';
            }
          });
        }

        renderTable();
      });

      item.addEventListener('mouseenter', () => {
        if (document.querySelector('.active-filter')) return; // ignore hover when filter active
        
        document.querySelectorAll('.legend-list-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const percent = item.getAttribute('data-percent');
        const label = item.getAttribute('data-label');
        
        document.querySelector('.total-percent').textContent = percent;
        document.querySelector('.total-label').textContent = label;

        const id = item.querySelector('.legend-color-indicator').className.split('bg-')[1];
        Object.keys(slices).forEach(key => {
          if (!slices[key]) return;
          slices[key].style.strokeWidth = '18';
          if (slices[key].id === `slice-${id}`) {
            slices[key].style.strokeWidth = '22';
          }
        });
      });
    });

    const resetDoughnutStroke = () => {
      Object.values(slices).forEach(slice => {
        if (slice) slice.style.strokeWidth = '18';
      });
    };
  }

  // 7. Search Input Listener
  searchInput.addEventListener('input', renderTable);

  // 8. Period Switching Events
  function setPeriod(period, activeTab) {
    currentPeriod = period;
  // 7. Recalculate KPIs based on data state (R1)
  function recalculateAllKPIs() {
    const data = datasets[currentPeriod];
    
    const sumRevenue = data.revenue.reduce((acc, val) => acc + val, 0);
    const sumCost = data.cost.reduce((acc, val) => acc + val, 0);
    
    data.kpi.revenue = `$${sumRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    data.kpi.cost = `$${sumCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    let baseUsers = 24890;
    if (currentPeriod === 'month') baseUsers = 98450;
    if (currentPeriod === 'year') baseUsers = 342000;
    
    const activeUsersCount = Math.round(baseUsers + (sumRevenue - 14289) * 0.4);
    data.kpi.users = activeUsersCount.toLocaleString('en-US');
    
    const convValue = (3.84 + (sumRevenue / (sumCost || 1) - 14289.45 / 3450.00) * 0.1).toFixed(2);
    data.kpi.conversion = `${convValue}%`;

    const n = data.revenue.length;
    if (n >= 2) {
      const revGrowth = ((data.revenue[n-1] - data.revenue[n-2]) / (data.revenue[n-2] || 1) * 100).toFixed(1);
      data.kpi.revenueTrend = (revGrowth >= 0 ? '+' : '') + revGrowth + '%';
      
      const costGrowth = ((data.cost[n-1] - data.cost[n-2]) / (data.cost[n-2] || 1) * 100).toFixed(1);
      data.kpi.costTrend = (costGrowth >= 0 ? '+' : '-') + Math.abs(costGrowth).toFixed(1) + '%';
    }
  }

  // 8. Update data structure from operations (R1)
  function updateFromTransactions() {
    const totalTxCost = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    
    // Set last cost point to total cost of transactions
    datasets[currentPeriod].cost[datasets[currentPeriod].cost.length - 1] = totalTxCost;

    // Recalculate doughnut chart percent and values
    const slicesSum = { Hosting: 0, Marketing: 0, Team: 0, APIs: 0 };
    transactions.forEach(t => {
      if (slicesSum[t.category] !== undefined) {
        slicesSum[t.category] += t.amount;
      }
    });

    const totalSum = Object.values(slicesSum).reduce((a, b) => a + b, 0) || 1;

    // Update Doughnut slice strokes
    const slices = {
      Hosting: document.getElementById('slice-hosting'),
      Marketing: document.getElementById('slice-marketing'),
      Team: document.getElementById('slice-team'),
      APIs: document.getElementById('slice-apis')
    };

    const categories = ['Hosting', 'Marketing', 'Team', 'APIs'];
    let currentOffset = 0;
    const circumference = 439.8; // 2 * PI * r (r=70)

    categories.forEach(cat => {
      const amt = slicesSum[cat] || 0;
      const percent = amt / totalSum;
      const sliceElement = slices[cat];
      if (sliceElement) {
        const strokeDash = percent * circumference;
        sliceElement.style.strokeDasharray = `${strokeDash} ${circumference - strokeDash}`;
        sliceElement.style.strokeDashoffset = -currentOffset;
        currentOffset += strokeDash;
      }
    });

    // Update breakdown list in the DOM
    const listItems = document.querySelectorAll('.cost-legend-list .legend-list-item');
    listItems.forEach(item => {
      const label = item.getAttribute('data-label');
      let category = label === 'Team Ops' ? 'Team' : label;
      const amt = slicesSum[category] || 0;
      const percent = Math.round((amt / totalSum) * 100);
      
      item.setAttribute('data-percent', percent + '%');
      item.querySelector('.legend-item-name').textContent = `${label} (${percent}%)`;
      item.querySelector('.legend-item-val').textContent = `$${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });

    // Update active slice center label
    const activeFilterItem = document.querySelector('.cost-legend-list .legend-list-item.active');
    if (activeFilterItem) {
      const percent = activeFilterItem.getAttribute('data-percent');
      document.querySelector('.total-percent').textContent = percent;
    } else {
      // Show Hosting percent in center by default
      const hostingItem = document.querySelector('.cost-legend-list .legend-list-item[data-label="Hosting"]');
      if (hostingItem) {
        document.querySelector('.total-percent').textContent = hostingItem.getAttribute('data-percent');
        document.querySelector('.total-label').textContent = 'Hosting';
      }
    }

    recalculateAllKPIs();
    saveToLocalStorage();
  }

  function deleteTransaction(txId) {
    const idx = transactions.findIndex(t => t.id === txId);
    if (idx !== -1) {
      transactions.splice(idx, 1);
      updateFromTransactions();
      renderTable();
      updateKPIs();
      renderChart();
    }
  }

  // 9. Modals Helper Setup (R1)
  function openEditModal(tx) {
    editingTxId = tx.id;
    document.getElementById('tx-id').value = tx.id;
    document.getElementById('tx-id').setAttribute('readonly', 'true');
    document.getElementById('tx-desc').value = tx.desc;
    document.getElementById('tx-category').value = tx.category;
    document.getElementById('tx-amount').value = tx.amount;
    
    addTxDialog.querySelector('.dialog-header h3').textContent = "Chỉnh Sửa Giao Dịch";
    document.getElementById('btn-delete-modal').style.display = 'block';
    addTxDialog.showModal();
  }

  // Open modal as standard add
  function openAddModal() {
    editingTxId = null;
    document.getElementById('tx-id').value = '';
    document.getElementById('tx-id').removeAttribute('readonly');
    document.getElementById('tx-desc').value = '';
    document.getElementById('tx-category').value = 'Hosting';
    document.getElementById('tx-amount').value = '';
    
    addTxDialog.querySelector('.dialog-header h3').textContent = "Thêm Giao Dịch Mới";
    document.getElementById('btn-delete-modal').style.display = 'none';
    addTxDialog.showModal();
  }

  // 10. Data Exports (R5)
  function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Ma giao dich,Dich vu,Thoi gian,Phan loai,So tien,Trang thai\n";
    
    transactions.forEach(tx => {
      csvContent += `"${tx.id}","${tx.desc}","${tx.time}","${tx.category}",${tx.amount},"${tx.status}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "report_transactions.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 11. Interactive Theme Particle Controller Wiring (R3)
  function initSettingsConsole() {
    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsPanel = document.getElementById('settings-panel');

    if (btnToggleSettings) {
      btnToggleSettings.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
      });
    }

    if (btnCloseSettings) {
      btnCloseSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
      });
    }

    const slideCount = document.getElementById('slide-particle-count');
    const valCount = document.getElementById('val-particle-count');
    if (slideCount) {
      slideCount.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        valCount.textContent = val;
        window.AuraConfig.particleCount = val;
        if (window.__adjustParticles) {
          window.__adjustParticles(val);
        }
      });
    }

    const slideSpeed = document.getElementById('slide-particle-speed');
    const valSpeed = document.getElementById('val-particle-speed');
    if (slideSpeed) {
      slideSpeed.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valSpeed.textContent = val.toFixed(1) + 'x';
        window.AuraConfig.particleSpeed = val;
      });
    }

    const slideK = document.getElementById('slide-spring-k');
    const valK = document.getElementById('val-spring-k');
    if (slideK) {
      slideK.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valK.textContent = val.toFixed(2);
        window.AuraConfig.springK = val;
      });
    }

    const slideC = document.getElementById('slide-spring-c');
    const valC = document.getElementById('val-spring-c');
    if (slideC) {
      slideC.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valC.textContent = val.toFixed(2);
        window.AuraConfig.springC = val;
      });
    }

    const slideOpacity = document.getElementById('slide-canvas-opacity');
    const valOpacity = document.getElementById('val-canvas-opacity');
    if (slideOpacity) {
      slideOpacity.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valOpacity.textContent = val.toFixed(2);
        window.AuraConfig.canvasOpacity = val;
        const canvasEl = document.getElementById('ambient-particles');
        if (canvasEl) {
          canvasEl.style.opacity = val;
        }
      });
    }
  }

  /* ==========================================================================
     AURA VISUAL PERKS V4.0 - PIONEER AAA-GRADE VISUAL ARCHITECTURE
     ========================================================================== */

  let mainLoopId = null;

  // Global mouse coordinates throttled via RAF loop
  let mouseRawX = undefined;
  let mouseRawY = undefined;
  let isMouseActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseRawX = e.clientX;
    mouseRawY = e.clientY;
    isMouseActive = true;
  });

  window.addEventListener('mouseleave', () => {
    mouseRawX = undefined;
    mouseRawY = undefined;
    isMouseActive = false;
  });

  // Card 3D tilt states LERP
  const cardStates = [];

  // Multi-layer parallax state LERP
  let currentBgX = 0, currentBgY = 0;
  let currentSidebarX = 0, currentSidebarY = 0;
  let currentMainX = 0, currentMainY = 0;

  // Chart crosshair line state LERP
  let currentCrosshairX = 300;
  let targetCrosshairX = 300;
  let crosshairActive = false;

  // Tooltip LERP glide state
  let currentTooltipX = 0;
  let currentTooltipY = 0;
  let targetTooltipX = 0;
  let targetTooltipY = 0;
  let tooltipActive = false;

  // Noise generators for 4-octave FBM wind vector field
  function noise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return n - Math.floor(n) * 2 - 1;
  }

  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const u = xf * xf * (3.0 - 2.0 * xf);
    const v = yf * yf * (3.0 - 2.0 * yf);

    const n00 = noise(xi, yi);
    const n10 = noise(xi + 1, yi);
    const n01 = noise(xi, yi + 1);
    const n11 = noise(xi + 1, yi + 1);

    const x1 = n00 + u * (n10 - n00);
    const x2 = n01 + u * (n11 - n01);

    return x1 + v * (x2 - x1);
  }

  function fbm(x, y) {
    let value = 0.0;
    let amplitude = 0.5;
    let frequency = 1.0;
    for (let i = 0; i < 4; i++) {
      value += amplitude * valueNoise(x * frequency, y * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  const gridPaths = [];

  // Performance Enhancement: Offscreen Canvas Sprite Pre-renderer for firefly glow
  let fireflySpriteCanvas = null;
  const spriteSize = 48; // enough space for glowing blur

  function createFireflySprite() {
    fireflySpriteCanvas = document.createElement('canvas');
    fireflySpriteCanvas.width = spriteSize;
    fireflySpriteCanvas.height = spriteSize;
    const sCtx = fireflySpriteCanvas.getContext('2d');
    
    const half = spriteSize / 2;
    sCtx.shadowBlur = 12;
    sCtx.shadowColor = '#00e699';
    
    // Draw outer glow and inner bright spot
    const grad = sCtx.createRadialGradient(half, half, 0, half, half, half - 10);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(0, 230, 153, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 230, 153, 0.3)');
    grad.addColorStop(1, 'rgba(0, 230, 153, 0)');
    
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(half, half, half - 10, 0, Math.PI * 2);
    sCtx.fill();
  }

  function initVisualPerks() {
    // Generate the offscreen sprite pre-rendered asset once
    createFireflySprite();

    // A. Inject advanced styling dynamically
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Glowing line flow animation along curve paths */
      @keyframes flowPulse {
        0% { stroke-dashoffset: 40; }
        100% { stroke-dashoffset: 0; }
      }
      .chart-line-revenue-flow {
        stroke: #00e699;
        stroke-width: 3;
        stroke-dasharray: 6 15;
        fill: none;
        opacity: 0.85;
        animation: flowPulse 2s linear infinite;
        pointer-events: none;
      }
      .chart-line-cost-flow {
        stroke: #6b7f73;
        stroke-width: 3;
        stroke-dasharray: 6 15;
        fill: none;
        opacity: 0.75;
        animation: flowPulse 2.6s linear infinite;
        pointer-events: none;
      }
      
      /* Glimmer active nodes scaling */
      .chart-node.active {
        r: 8.5 !important;
        stroke-width: 3.5px !important;
        filter: drop-shadow(0 0 10px currentColor);
      }
      
      /* 3D Glass Shine KPI effect */
      .kpi-card, .chart-container {
        position: relative;
        transform-style: preserve-3d;
        transition: box-shadow 0.3s ease, border-color 0.3s ease !important;
      }
      .kpi-card::after, .chart-container::after {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 230, 153, 0.08) 0%, transparent 60%);
        pointer-events: none;
        z-index: 5;
        opacity: 0;
        transition: opacity 0.4s ease;
        border-radius: inherit;
      }
      .kpi-card:hover::after, .chart-container:hover::after {
        opacity: 1;
      }
      
      /* Elastic SVG grid lines base */
      .elastic-grid-line {
        stroke: rgba(255, 255, 255, 0.03);
        fill: none;
        stroke-width: 1.5;
        transition: stroke 0.4s ease;
      }
      
      /* Elegant scale pop transition for rich chart tooltips */
      .chart-tooltip {
        left: 0 !important;
        top: 0 !important;
        transform-origin: top left;
        transform: scale(0.9);
        transition: opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
        pointer-events: none;
      }
      .chart-tooltip.active {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
      
      /* 3D Perspective layout wrappers */
      body {
        perspective: 1200px;
      }
      .main-content {
        transform-style: preserve-3d;
      }
    `;
    document.head.appendChild(styleElement);

    // C. 3D Card Tilt & Light Shine setup
    const glassCards = document.querySelectorAll('.kpi-card, .chart-container');
    glassCards.forEach(card => {
      const cardState = {
        element: card,
        tiltX: 0,
        tiltY: 0,
        targetTiltX: 0,
        targetTiltY: 0,
        mouseX: 50,
        mouseY: 50,
        targetMouseX: 50,
        targetMouseY: 50,
        isHovered: false
      };
      cardStates.push(cardState);

      card.addEventListener('mouseenter', () => {
        cardState.isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardState.targetMouseX = (x / rect.width) * 100;
        cardState.targetMouseY = (y / rect.height) * 100;
        cardState.targetTiltX = ((y / rect.height) - 0.5) * -8; // Up to 8 deg
        cardState.targetTiltY = ((x / rect.width) - 0.5) * 8;
      });

      card.addEventListener('mouseleave', () => {
        cardState.isHovered = false;
        cardState.targetTiltX = 0;
        cardState.targetTiltY = 0;
        cardState.targetMouseX = 50;
        cardState.targetMouseY = 50;
      });
    });

    // E. Elastic Spring Grid Lines Physics setup
    const gridGroup = document.querySelector('.chart-grid-lines');
    if (gridGroup) {
      const lines = gridGroup.querySelectorAll('line');
      lines.forEach(line => {
        const y = parseFloat(line.getAttribute('y1'));
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M 50 ${y} Q 300 ${y} 550 ${y}`);
        path.setAttribute('class', 'elastic-grid-line');
        
        const lineData = {
          element: path,
          yBase: y,
          displacement: 0,
          velocity: 0,
          isHovered: false
        };
        gridPaths.push(lineData);
        gridGroup.replaceChild(path, line);
      });
    }

    // Track cursor on SVG to pluck the strings (no audio triggers)
    chartSvg.addEventListener('mousemove', (e) => {
      const rect = chartSvg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 600;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 320;
      
      gridPaths.forEach(line => {
        const distY = mouseY - line.yBase;
        // Hover influence threshold (22px)
        if (Math.abs(distY) < 22 && mouseX > 50 && mouseX < 550) {
          line.isHovered = true;
          const xInfluence = Math.exp(-Math.abs(mouseX - 300) / 160);
          line.displacement = distY * xInfluence * 0.55;
          line.element.setAttribute('stroke', 'rgba(0, 230, 153, 0.3)');
        } else {
          line.isHovered = false;
        }
      });
    });

    // F. Canvas Background FBM Firefly Simulation
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Firefly {
      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1.2;
        this.speed = Math.random() * 0.4 + 0.15;
        this.vx = 0;
        this.vy = 0;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseValue = Math.random() * Math.PI * 2;
        this.alpha = 0;
      }
      update(mouseX, mouseY, t) {
        // Biophilic currents from 4-octave FBM noise field coordinates
        const scale = 0.003;
        const windAngle = fbm(this.x * scale, this.y * scale + t) * Math.PI * 2.0;
        
        const speedMultiplier = window.AuraConfig.particleSpeed;
        const targetVx = (Math.cos(windAngle) * this.speed) * speedMultiplier;
        const targetVy = (Math.sin(windAngle) * this.speed) * speedMultiplier;
        
        this.vx += (targetVx - this.vx) * 0.05;
        this.vy += (targetVy - this.vy) * 0.05;
        
        this.x += this.vx;
        this.y += this.vy;

        this.pulseValue += this.pulseSpeed;
        this.alpha = Math.max(0, Math.sin(this.pulseValue) * 0.45 + 0.4);

        // React to mouse: attracted gently to mouse position (swarming) <= 200px
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 200) {
            const attraction = (200 - dist) / 200 * 0.15;
            this.x += (dx / dist) * attraction * 2.5;
            this.y += (dy / dist) * attraction * 2.5;
          }
        }

        if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
          this.reset();
        }
      }
      draw() {
        if (!fireflySpriteCanvas) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const size = this.size * 5; // glowing sprite size scale
        ctx.drawImage(
          fireflySpriteCanvas,
          this.x - size / 2,
          this.y - size / 2,
          size,
          size
        );
        ctx.restore();
      }
    }

    const fireflies = Array.from({ length: 75 }, () => new Firefly());

    // Handle dynamic counts of particles via settings (R3)
    window.__adjustParticles = (newCount) => {
      while (fireflies.length < newCount) {
        fireflies.push(new Firefly());
      }
      if (fireflies.length > newCount) {
        fireflies.length = newCount;
      }
    };

    let t = 0;
    
    // Consolidated requestAnimationFrame loop running at locked 60 FPS
    function tick() {
      // 1. Particle Simulation
      ctx.clearRect(0, 0, width, height);
      t += 0.003;
      fireflies.forEach(firefly => {
        firefly.update(mouseRawX, mouseRawY, t);
        firefly.draw();
      });

      // 2. Spring-Mass Elastic Grid Physics (Hooke's Law: config dynamic)
      const dt = 0.16;
      const k = window.AuraConfig.springK;
      const c = window.AuraConfig.springC;
      gridPaths.forEach(line => {
        if (!line.isHovered) {
          const F_spring = -k * line.displacement;
          const F_damping = -c * line.velocity;
          
          const accel = F_spring + F_damping;
          line.velocity += accel * dt;
          line.displacement += line.velocity * dt;
          
          if (Math.abs(line.displacement) < 0.01) {
            line.displacement = 0;
            line.velocity = 0;
            line.element.setAttribute('stroke', 'rgba(255, 255, 255, 0.03)'); // Base subtle color
          }
        }
        
        const yMid = line.yBase + line.displacement;
        line.element.setAttribute('d', `M 50 ${line.yBase} Q 300 ${yMid} 550 ${line.yBase}`);
      });

      // 3. Card 3D Tilt and Shine Spotlight LERP
      cardStates.forEach(state => {
        state.tiltX += (state.targetTiltX - state.tiltX) * 0.12;
        state.tiltY += (state.targetTiltY - state.tiltY) * 0.12;
        state.mouseX += (state.targetMouseX - state.mouseX) * 0.12;
        state.mouseY += (state.targetMouseY - state.mouseY) * 0.12;

        state.element.style.transform = `perspective(1200px) rotateX(${state.tiltX}deg) rotateY(${state.tiltY}deg)`;
        state.element.style.setProperty('--mouse-x', `${state.mouseX}%`);
        state.element.style.setProperty('--mouse-y', `${state.mouseY}%`);
      });

      // 4. Multi-layer Parallax LERP
      let px = 0, py = 0;
      if (mouseRawX !== undefined && mouseRawY !== undefined) {
        px = (mouseRawX / window.innerWidth - 0.5);
        py = (mouseRawY / window.innerHeight - 0.5);
      }
      
      currentBgX += (px * -25 - currentBgX) * 0.08;
      currentBgY += (py * -25 - currentBgY) * 0.08;
      currentSidebarX += (px * 8 - currentSidebarX) * 0.08;
      currentSidebarY += (py * 8 - currentSidebarY) * 0.08;
      currentMainX += (px * 12 - currentMainX) * 0.08;
      currentMainY += (py * 12 - currentMainY) * 0.08;

      const bg = document.querySelector('.bg-blur-container');
      if (bg) {
        bg.style.transform = `scale(1.06) translate3d(${currentBgX}px, ${currentBgY}px, 0)`;
      }
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.transform = `translate3d(${currentSidebarX}px, ${currentSidebarY}px, 0)`;
      }
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.transform = `translate3d(${currentMainX}px, ${currentMainY}px, 0)`;
      }

      // 5. Tooltip Glide tracking LERP
      const tooltipEl = document.getElementById('chart-tooltip');
      if (tooltipEl) {
        if (tooltipActive) {
          currentTooltipX += (targetTooltipX - currentTooltipX) * 0.15;
          currentTooltipY += (targetTooltipY - currentTooltipY) * 0.15;
          tooltipEl.style.transform = `translate3d(${currentTooltipX}px, ${currentTooltipY}px, 0)`;
          tooltipEl.classList.add('active');
        } else {
          tooltipEl.classList.remove('active');
        }
      }

      // 6. Crosshair scanning line LERP
      const crosshairEl = document.querySelector('.chart-grid-lines line.crosshair');
      if (crosshairEl) {
        if (crosshairActive) {
          currentCrosshairX += (targetCrosshairX - currentCrosshairX) * 0.15;
          crosshairEl.setAttribute('x1', currentCrosshairX);
          crosshairEl.setAttribute('x2', currentCrosshairX);
          crosshairEl.style.opacity = '1';
        } else {
          crosshairEl.style.opacity = '0';
        }
      }

      mainLoopId = requestAnimationFrame(tick);
    }

    if (mainLoopId) {
      cancelAnimationFrame(mainLoopId);
    }
    mainLoopId = requestAnimationFrame(tick);
  }

  // 10. Initial Load Setup
  window.addEventListener('DOMContentLoaded', () => {
    // R1: Load stored data & config
    loadFromLocalStorage();
    updateFromTransactions();

    updateKPIs();
    renderChart();
    renderTable();
    initDoughnut();
    initVisualPerks();
    initSettingsConsole();

    // R1: Reset Data Button
    const btnResetData = document.getElementById('btn-reset-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định?')) {
          localStorage.removeItem(storageKey);
          location.reload();
        }
      });
    }

    // R1/R4: Modal Delete action handler
    const btnDeleteModal = document.getElementById('btn-delete-modal');
    if (btnDeleteModal) {
      btnDeleteModal.addEventListener('click', () => {
        if (editingTxId && confirm(`Bạn có chắc chắn muốn xóa giao dịch ${editingTxId}?`)) {
          deleteTransaction(editingTxId);
          addTxDialog.close();
        }
      });
    }

    // Modal close & cancel handlers
    btnCloseModal.addEventListener('click', () => {
      addTxDialog.close();
      addTxDialog.querySelector('form').reset();
    });
    btnCancelModal.addEventListener('click', () => {
      addTxDialog.close();
      addTxDialog.querySelector('form').reset();
    });

    // Form submit listener (supports Add and Edit)
    addTxDialog.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('tx-id').value;
      const desc = document.getElementById('tx-desc').value;
      const category = document.getElementById('tx-category').value;
      const amount = parseFloat(document.getElementById('tx-amount').value);

      if (editingTxId) {
        // Edit existing
        const tx = transactions.find(t => t.id === editingTxId);
        if (tx) {
          tx.desc = desc;
          tx.category = category;
          tx.amount = amount;
        }
      } else {
        // Add new
        const newTx = {
          id: id,
          desc: desc,
          time: 'Vừa xong',
          category: category,
          amount: amount,
          status: 'success'
        };
        transactions.unshift(newTx);
      }

      updateFromTransactions();
      renderTable();
      updateKPIs();
      renderChart();

      e.target.reset();
      addTxDialog.close();
    });

    // Custom Open Button (clears editingTxId)
    if (btnAddTx) {
      btnAddTx.addEventListener('click', (e) => {
        e.preventDefault();
        openAddModal();
      });
    }

    // R2: Forecasting Toggle Button
    const btnToggleForecast = document.getElementById('btn-toggle-forecast');
    if (btnToggleForecast) {
      btnToggleForecast.addEventListener('click', () => {
        isForecastMode = !isForecastMode;
        btnToggleForecast.textContent = `Dự báo: ${isForecastMode ? 'Bật' : 'Tắt'}`;
        renderChart();
      });
    }

    // R4: Compare Mode Toggle Checkbox
    const compareToggle = document.getElementById('compare-toggle');
    const compareSelect = document.getElementById('compare-style-select');
    if (compareToggle) {
      compareToggle.addEventListener('change', (e) => {
        isCompareMode = e.target.checked;
        compareSelect.style.display = isCompareMode ? 'inline-block' : 'none';
        renderChart();
      });
    }

    if (compareSelect) {
      compareSelect.addEventListener('change', (e) => {
        compareStyle = e.target.value;
        renderChart();
      });
    }

    // R5: Exports & Print Actions
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSV);

    const btnExportJSON = document.getElementById('btn-export-json');
    if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSON);

    const btnPrintPDF = document.getElementById('btn-print-pdf');
    if (btnPrintPDF) {
      btnPrintPDF.addEventListener('click', () => {
        window.print();
      });
    }

    tabWeek.addEventListener('click', () => setPeriod('week', tabWeek));
    tabMonth.addEventListener('click', () => setPeriod('month', tabMonth));
    tabYear.addEventListener('click', () => setPeriod('year', tabYear));
  });

})();
