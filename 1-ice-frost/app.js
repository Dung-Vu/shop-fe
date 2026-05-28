/* ==========================================================================
   AURA Dashboard Engine - Ice Frost Style (HIGH-END FRONTEND V4.0)
   ========================================================================== */

(function () {
  "use strict";

// 1. Curated Visual Configuration & Physics State (Golden Pioneer V4.0)
window.AuraConfig = {
  particleCount: 75,
  particleSpeed: 1.0,
  springK: 0.08,
  springC: 0.12,
  canvasOpacity: 0.8
};

// 2. Mock Datasets (Consistent structure across all dashboard styles)
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

// Initial Mock Transactions
let transactions = [
  { id: 'TX-1092', desc: 'AWS Cloud Hosting', time: '10:45 AM, Hôm nay', category: 'Hosting', amount: 350.00, status: 'success' },
  { id: 'TX-1091', desc: 'Google Search Ads', time: '08:30 AM, Hôm nay', category: 'Marketing', amount: 150.00, status: 'success' },
  { id: 'TX-1090', desc: 'Figma Team Subscription', time: 'Hôm qua', category: 'APIs', amount: 45.00, status: 'success' },
  { id: 'TX-1089', desc: 'Slack Operations', time: 'Hôm qua', category: 'APIs', amount: 120.00, status: 'success' },
  { id: 'TX-1088', desc: 'Payroll Vận hành', time: '25 Tháng 5', category: 'Team', amount: 2500.00, status: 'pending' }
];

// Persistent State Handler (R1)
const storageKey = 'aura_data_ice';
function saveToLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify({ datasets, transactions }));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.datasets) {
        // Deep copy loaded datasets
        Object.keys(parsed.datasets).forEach(period => {
          if (datasets[period]) {
            datasets[period].revenue = parsed.datasets[period].revenue || datasets[period].revenue;
            datasets[period].cost = parsed.datasets[period].cost || datasets[period].cost;
            if (parsed.datasets[period].kpi) {
              Object.assign(datasets[period].kpi, parsed.datasets[period].kpi);
            }
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
loadFromLocalStorage();

// State variables for forecasting, comparison & editing
let isForecastMode = false;
let isCompareMode = false;
let compareStyle = 'warm-timber';
let editingTxId = null;

// 3. DOM Elements
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
  'warm-timber': { name: 'Warm Timber', color: '#ff7b00', storageKey: 'aura_data_timber', defaultData: { week: [1000, 1500, 1200, 1900, 1700, 2400, 2800], month: [11000, 14000, 13000, 18000], year: [110000, 140000, 170000, 220000, 260000] } },
  'autumn': { name: 'Autumn Gold', color: '#ff9f1c', storageKey: 'aura_data_autumn', defaultData: { week: [1100, 1600, 1300, 2100, 1800, 2600, 2900], month: [11500, 14800, 13500, 19000], year: [115000, 145000, 178000, 230000, 280000] } },
  'winter': { name: 'Winter Purple', color: '#8a2be2', storageKey: 'aura_data_winter', defaultData: { week: [900, 1400, 1100, 1800, 1600, 2300, 2700], month: [10000, 13500, 12000, 17000], year: [100000, 130000, 160000, 210000, 250000] } },
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
    if (coords.length === 0) return '';
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
  setTimeout(() => revLineFlowElement.style.opacity = '0.8', 1200);

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
  setTimeout(() => costLineFlowElement.style.opacity = '0.8', 1200);

  // Draw Confidence Interval shaded bands (R2)
  if (isForecastMode) {
    const drawCIBand = (upperArr, lowerArr, baseCoord, fillClass) => {
      const upperCoords = [baseCoord];
      const lowerCoords = [baseCoord];
      
      upperArr.forEach((val, idx) => {
        upperCoords.push(getCoordinates(data.revenue.length + idx, val));
      });
      lowerArr.forEach((val, idx) => {
        lowerCoords.push(getCoordinates(data.revenue.length + idx, val));
      });

      let d = `M ${upperCoords[0].x} ${upperCoords[0].y} `;
      for (let i = 1; i < upperCoords.length; i++) {
        d += `L ${upperCoords[i].x} ${upperCoords[i].y} `;
      }
      for (let i = lowerCoords.length - 1; i >= 0; i--) {
        d += `L ${lowerCoords[i].x} ${lowerCoords[i].y} `;
      }
      d += 'Z';

      const ciBand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ciBand.setAttribute('d', d);
      ciBand.setAttribute('class', fillClass);
      chartPaths.appendChild(ciBand);
    };

    drawCIBand(revForecast.upperCI, revForecast.lowerCI, revCoords[revCoords.length - 1], 'forecast-ci-band bg-cyan-glow');
    drawCIBand(costForecast.upperCI, costForecast.lowerCI, costCoords[costCoords.length - 1], 'forecast-ci-band bg-purple-glow');

    // Draw Dashed Forecast Lines (R2)
    const drawForecastLine = (predictions, baseCoord, strokeColor) => {
      const forecastCoords = [baseCoord];
      predictions.forEach((val, idx) => {
        forecastCoords.push(getCoordinates(data.revenue.length + idx, val));
      });

      const lineD = getCurvePathD(forecastCoords);
      const forecastLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      forecastLine.setAttribute('d', lineD);
      forecastLine.setAttribute('class', 'forecast-line-dashed');
      forecastLine.setAttribute('stroke', strokeColor);
      chartPaths.appendChild(forecastLine);
    };

    drawForecastLine(revForecast.predictions, revCoords[revCoords.length - 1], '#00f3ff');
    drawForecastLine(costForecast.predictions, costCoords[costCoords.length - 1], '#b026ff');
  }

  // Draw Comparative Dashboard line (R4)
  if (isCompareMode) {
    const styleInfo = otherStyles[compareStyle];
    if (styleInfo) {
      const compRevenueData = getCompareData();
      const compCoords = compRevenueData.map((val, i) => getCoordinates(i, val));
      const compLineD = getCurvePathD(compCoords);
      
      const compLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      compLine.setAttribute('d', compLineD);
      compLine.setAttribute('stroke', styleInfo.color);
      compLine.setAttribute('stroke-width', '2.5');
      compLine.setAttribute('fill', 'none');
      compLine.setAttribute('stroke-dasharray', '5 3');
      compLine.style.opacity = '0.75';
      chartPaths.appendChild(compLine);

      // Add comparative legend item
      const legendGroup = document.querySelector('.chart-legend');
      if (legendGroup) {
        const prevCompLegend = document.getElementById('legend-comparison-item');
        if (prevCompLegend) prevCompLegend.remove();

        const compLegendItem = document.createElement('span');
        compLegendItem.id = 'legend-comparison-item';
        compLegendItem.className = 'legend-item';
        compLegendItem.innerHTML = `<span class="legend-dot" style="background-color: ${styleInfo.color}; box-shadow: 0 0 8px ${styleInfo.color};"></span>So sánh (${styleInfo.name})`;
        legendGroup.appendChild(compLegendItem);
      }
    }
  } else {
    const prevCompLegend = document.getElementById('legend-comparison-item');
    if (prevCompLegend) prevCompLegend.remove();
  }

  // Create scanning vertical line (Crosshair)
  const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  crosshair.setAttribute('y1', paddingTop - 10);
  crosshair.setAttribute('y2', paddingTop + graphHeight + 10);
  crosshair.setAttribute('stroke', 'rgba(0, 243, 255, 0.4)'); // cyan tint
  crosshair.setAttribute('stroke-width', '1.5');
  crosshair.setAttribute('stroke-dasharray', '4 4');
  crosshair.style.opacity = '0';
  crosshair.style.transition = 'opacity 0.2s ease, x1 0.1s ease, x2 0.1s ease';
  chartPaths.appendChild(crosshair);

  // Keep a clean coordinate lookup for hover tracking
  const allXCoords = [];

  // Draw Nodes (circles) & Labels
  labelsList.forEach((label, i) => {
    let cx, cyRev, cyCost;
    let isForecastNode = i >= data.revenue.length;

    if (isForecastNode) {
      const forecastIdx = i - data.revenue.length;
      const revVal = revForecast.predictions[forecastIdx];
      const costVal = costForecast.predictions[forecastIdx];
      const revPt = getCoordinates(i, revVal);
      const costPt = getCoordinates(i, costVal);
      cx = revPt.x;
      cyRev = revPt.y;
      cyCost = costPt.y;
    } else {
      cx = revCoords[i].x;
      cyRev = revCoords[i].y;
      cyCost = costCoords[i].y;
    }

    allXCoords.push(cx);

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
    revCircle.setAttribute('class', 'chart-data-node chart-node chart-node-revenue');
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
    costCircle.setAttribute('class', 'chart-data-node chart-node chart-node-cost');
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

    // Highlight all dots, glowing only the active nodes
    document.querySelectorAll('.chart-node').forEach(node => node.classList.remove('active'));
    
    const revNode = document.getElementById(`rev-node-${nearestIndex}`);
    const costNode = document.getElementById(`cost-node-${nearestIndex}`);
    if (revNode) revNode.classList.add('active');
    if (costNode) costNode.classList.add('active');

    // Show Tooltip with detailed dual stats (Scale transition)
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
          <strong style="color: #00f3ff">$${revVal.toLocaleString()} <span style="font-size: 9px; font-weight: normal; color: var(--color-text-secondary);">[CI: $${revLow}-$${revHigh}]</span></strong>
        </div>
        <div class="tooltip-row">
          <span>Chi phí:</span>
          <strong style="color: #b026ff">$${costVal.toLocaleString()} <span style="font-size: 9px; font-weight: normal; color: var(--color-text-secondary);">[CI: $${costLow}-$${costHigh}]</span></strong>
        </div>
      `;
    } else {
      tooltipContent = `
        <div class="tooltip-title">${labelsList[nearestIndex]}</div>
        <div class="tooltip-row">
          <span>Doanh thu:</span>
          <strong style="color: #00f3ff">$${data.revenue[nearestIndex].toLocaleString()}</strong>
        </div>
        <div class="tooltip-row">
          <span>Chi phí:</span>
          <strong style="color: #b026ff">$${data.cost[nearestIndex].toLocaleString()}</strong>
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

  trackingOverlay.addEventListener('mouseleave', () => {
    crosshair.style.opacity = '0';
    tooltip.classList.remove('active');
    document.querySelectorAll('.chart-node').forEach(node => node.classList.remove('active'));
    if (window.__setTooltipCoords) {
      window.__setTooltipCoords(0, 0, false);
    }
  });
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
  
  [tabWeek, tabMonth, tabYear].forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  
  activeTab.classList.add('active');
  activeTab.setAttribute('aria-selected', 'true');

  updateKPIs();
  renderChart();
}

tabWeek.addEventListener('click', () => setPeriod('week', tabWeek));
tabMonth.addEventListener('click', () => setPeriod('month', tabMonth));
tabYear.addEventListener('click', () => setPeriod('year', tabYear));

// 9. Dialog Modal Events
btnAddTx.addEventListener('click', () => addTxDialog.showModal());
btnCloseModal.addEventListener('click', () => addTxDialog.close());
btnCancelModal.addEventListener('click', () => addTxDialog.close());

addTxDialog.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('tx-id').value;
  const desc = document.getElementById('tx-desc').value;
  const category = document.getElementById('tx-category').value;
  const amount = parseFloat(document.getElementById('tx-amount').value);

  const newTx = {
    id: id,
    desc: desc,
    time: 'Vừa xong',
    category: category,
    amount: amount,
    status: 'success'
  };

  transactions.unshift(newTx);
  renderTable();

  // Add mock data effect
  if (currentPeriod === 'week') {
    datasets.week.revenue[6] += amount * 0.8;
    datasets.week.cost[6] += amount;
  }
  
  updateKPIs();
  renderChart();

  e.target.reset();
  addTxDialog.close();
});

/* ==========================================================================
   AURA VISUAL PERKS V4.0 - FBM Noise Fluid Field & Spring Elastic SVG Grid & Parallax
   ========================================================================== */

function initVisualPerks() {
  const themeColorRgb = '0, 243, 255'; // Cyan tint

  // A. Inject advanced styling dynamically
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Glowing line flow animation along curve paths */
    @keyframes flowPulse {
      0% { stroke-dashoffset: 40; }
      100% { stroke-dashoffset: 0; }
    }
    .chart-line-revenue-flow {
      stroke: #00f3ff;
      stroke-width: 3;
      stroke-dasharray: 6 15;
      fill: none;
      opacity: 0.8;
      animation: flowPulse 1.8s linear infinite;
      pointer-events: none;
    }
    .chart-line-cost-flow {
      stroke: #b026ff;
      stroke-width: 3;
      stroke-dasharray: 6 15;
      fill: none;
      opacity: 0.8;
      animation: flowPulse 2.2s linear infinite;
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
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease !important;
    }
    .kpi-card::after, .chart-container::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 243, 255, 0.08) 0%, transparent 60%);
      pointer-events: none;
      z-index: 5;
      opacity: 0;
      transition: opacity 0.4s ease;
      border-radius: inherit;
    }
    .kpi-card:hover::after, .chart-container:hover::after {
      opacity: 1;
    }
    
    /* Elastic SVG grid lines transition speed */
    .elastic-grid-line {
      stroke: rgba(255, 255, 255, 0.03);
      fill: none;
      stroke-width: 1.5;
      transition: stroke 0.4s ease;
    }
    
    /* Elegant scale pop transition for rich chart tooltips */
    .chart-tooltip {
      transform: scale(0.9);
      transition: opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
      pointer-events: none;
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
    }
    .chart-tooltip.active {
      opacity: 1 !important;
      transform: scale(1) !important;
    }
    
    /* 3D Perspective layout wrappers */
    body {
      perspective: 1200px;
    }
    .bg-blur-container {
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .sidebar {
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
    }
    .main-content {
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
      transform-style: preserve-3d;
    }
  `;
  document.head.appendChild(styleElement);

  // B. Initialize animation state variables
  let globalMouseX = undefined;
  let globalMouseY = undefined;

  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  // Tooltip tracking variables
  let targetTooltipX = 0;
  let targetTooltipY = 0;
  let currentTooltipX = 0;
  let currentTooltipY = 0;
  let isTooltipActive = false;

  const tooltipElement = document.getElementById('chart-tooltip');

  // C. 3D Card Tilt & Light Shine Effect Setup
  const cardsState = [];
  const glassCards = document.querySelectorAll('.kpi-card, .chart-container');
  glassCards.forEach(card => {
    const state = {
      element: card,
      targetTiltX: 0,
      targetTiltY: 0,
      currentTiltX: 0,
      currentTiltY: 0,
      targetGlowX: 0.5,
      targetGlowY: 0.5,
      currentGlowX: 0.5,
      currentGlowY: 0.5
    };
    cardsState.push(state);
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      state.targetGlowX = x / rect.width;
      state.targetGlowY = y / rect.height;
      
      state.targetTiltX = (state.targetGlowY - 0.5) * -8;
      state.targetTiltY = (state.targetGlowX - 0.5) * 8;
    });
    
    card.addEventListener('mouseleave', () => {
      state.targetTiltX = 0;
      state.targetTiltY = 0;
      state.targetGlowX = 0.5;
      state.targetGlowY = 0.5;
    });
  });

  // D. Multi-layer Holographic Parallax Mouse Tracking
  window.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
    
    const px = (e.clientX / window.innerWidth - 0.5); // -0.5 to 0.5
    const py = (e.clientY / window.innerHeight - 0.5);
    
    targetParallaxX = px;
    targetParallaxY = py;
  });

  // E. Elastic Spring Grid Lines Physics implementation
  const gridPaths = [];
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

  // Hook elastic grid plucking near mouse
  chartSvg.addEventListener('mousemove', (e) => {
    const rect = chartSvg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 600;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 320;
    
    gridPaths.forEach(line => {
      const distY = mouseY - line.yBase;
      if (Math.abs(distY) < 22 && mouseX > 50 && mouseX < 550) {
        line.isHovered = true;
        const xInfluence = Math.exp(-Math.abs(mouseX - 300) / 160);
        line.displacement = distY * xInfluence * 0.55;
        line.element.setAttribute('stroke', 'rgba(0, 243, 255, 0.3)');
      } else {
        line.isHovered = false;
      }
    });
  });

  // F. Canvas Background FBM Vector Field Fluid Simulation Setup
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

  // True multi-octave FBM noise generator function
  function fbm(x, y, t) {
    let value = 0;
    let amplitude = 1.0;
    let frequency = 0.003;
    let speed = 1.0;
    const lacunarity = 2.0;
    const gain = 0.5;
    
    for (let i = 0; i < 4; i++) {
      const freq = frequency * Math.pow(lacunarity, i);
      const amp = amplitude * Math.pow(gain, i);
      const spd = speed * Math.pow(1.5, i);
      value += amp * Math.sin(x * freq + t * spd) * Math.cos(y * freq - t * spd);
    }
    return value;
  }

  class FluidParticle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1.2;
      this.speed = Math.random() * 1.5 + 0.5;
      this.vx = 0;
      this.vy = 0;
      this.alpha = Math.random() * 0.4 + 0.15;
      this.life = Math.random() * 320 + 120;
      this.age = 0;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update(mX, mY, time) {
      this.age++;
      this.rotation += this.rotSpeed;
      
      // Vector Field: organic noise vector grid (FBM mathematical representation)
      const angle = fbm(this.x, this.y, time) * Math.PI * 2.5;
      
      const speedMultiplier = window.AuraConfig.particleSpeed;
      const targetVx = Math.cos(angle) * this.speed * speedMultiplier;
      const targetVy = Math.sin(angle) * this.speed * speedMultiplier;
      
      this.vx += (targetVx - this.vx) * 0.08;
      this.vy += (targetVy - this.vy) * 0.08;
      
      // Mouse interactive swirls / vortices applied via velocity deflections
      if (mX !== undefined && mY !== undefined) {
        const dx = this.x - mX;
        const dy = this.y - mY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          const swirlX = -dy / dist;
          const swirlY = dx / dist;
          this.vx += swirlX * force * 0.8;
          this.vy += swirlY * force * 0.8;
        }
      }
      
      this.x += this.vx;
      this.y += this.vy;

      if (this.age > this.life || this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
        this.reset();
      }
    }
    draw() {
      const currentAlpha = this.alpha * (1 - this.age / this.life);
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = `rgba(${themeColorRgb}, ${currentAlpha})`;
      
      // Draw 6-branch crystalline ice frost flake
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        // Main branch stem
        ctx.rect(-this.size * 0.2, -this.size * 2.5, this.size * 0.4, this.size * 2.5);
        // Mini sub-branches
        ctx.rect(-this.size * 0.8, -this.size * 1.6, this.size * 1.6, this.size * 0.3);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 75 }, () => new FluidParticle());

  // Handle dynamic counts of particles via settings (R3)
  window.__adjustParticles = (newCount) => {
    while (particles.length < newCount) {
      particles.push(new FluidParticle());
    }
    if (particles.length > newCount) {
      particles.length = newCount;
    }
  };

  let particleTime = 0;

  // G. Unified High-Performance requestAnimationFrame Loop
  function unifiedTick() {
    // 1. Interpolate Window Parallax
    currentParallaxX += (targetParallaxX - currentParallaxX) * 0.1;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.1;
    
    const bg = document.querySelector('.bg-blur-container');
    if (bg) {
      bg.style.transform = `scale(1.06) translate(${currentParallaxX * -25}px, ${currentParallaxY * -25}px)`;
    }
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.transform = `translate(${currentParallaxX * 8}px, ${currentParallaxY * 8}px)`;
    }
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.transform = `translate(${currentParallaxX * 12}px, ${currentParallaxY * 12}px)`;
    }
    
    // 2. Interpolate Card Hover Tilt and radial light shine coordinates
    cardsState.forEach(state => {
      state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.12;
      state.currentTiltY += (state.targetTiltY - state.currentTiltY) * 0.12;
      state.element.style.transform = `perspective(1000px) rotateX(${state.currentTiltX}deg) rotateY(${state.currentTiltY}deg)`;
      
      state.currentGlowX += (state.targetGlowX - state.currentGlowX) * 0.12;
      state.currentGlowY += (state.targetGlowY - state.currentGlowY) * 0.12;
      state.element.style.setProperty('--mouse-x', `${state.currentGlowX * 100}%`);
      state.element.style.setProperty('--mouse-y', `${state.currentGlowY * 100}%`);
    });
    
    // 3. Elastic Spring-Mass decay for SVG Grid Lines (R3 sliders controlled)
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
        
        if (Math.abs(line.displacement) < 0.005) {
          line.displacement = 0;
          line.velocity = 0;
          line.element.setAttribute('stroke', 'rgba(255, 255, 255, 0.03)');
        }
      }
      const yMid = line.yBase + line.displacement;
      line.element.setAttribute('d', `M 50 ${line.yBase} Q 300 ${yMid} 550 ${line.yBase}`);
    });
    
    // 4. Fluid Particle simulation updates & crystalline drawings
    ctx.clearRect(0, 0, width, height);
    particleTime += 0.003;
    particles.forEach(p => {
      p.update(globalMouseX, globalMouseY, particleTime);
      p.draw();
    });
    
    // 5. Tooltip Interpolated Glide bám đuổi trơn tru theo con trỏ chuột
    if (isTooltipActive) {
      currentTooltipX += (targetTooltipX - currentTooltipX) * 0.12;
      currentTooltipY += (targetTooltipY - currentTooltipY) * 0.12;
      tooltipElement.style.left = `${currentTooltipX}px`;
      tooltipElement.style.top = `${currentTooltipY}px`;
    }
    
    requestAnimationFrame(unifiedTick);
  }
  
  // Export tooltip handlers so renderChart can populate target coords
  window.__setTooltipCoords = (x, y, active) => {
    targetTooltipX = x;
    targetTooltipY = y;
    if (active && !isTooltipActive) {
      currentTooltipX = x;
      currentTooltipY = y;
    }
    isTooltipActive = active;
  };
  
  // Begin the loop
  requestAnimationFrame(unifiedTick);
}

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
  const listItems = document.querySelectorAll('.legend-list-item');
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
  const activeFilterItem = document.querySelector('.legend-list-item.active');
  if (activeFilterItem) {
    const percent = activeFilterItem.getAttribute('data-percent');
    document.querySelector('.total-percent').textContent = percent;
  } else {
    // Show Hosting percent in center by default
    const hostingItem = document.querySelector('.legend-list-item[data-label="Hosting"]');
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

// 12. Initial Load Setup
window.addEventListener('DOMContentLoaded', () => {
  // Sync datasets costs on load
  updateFromTransactions();
  updateKPIs();
  renderChart();
  renderTable();
  initDoughnut();
  initVisualPerks();
  initSettingsConsole();

  // Compare toggles (R4)
  const compareToggle = document.getElementById('compare-toggle');
  const compareStyleSelect = document.getElementById('compare-style-select');
  if (compareToggle) {
    compareToggle.addEventListener('change', (e) => {
      isCompareMode = e.target.checked;
      compareStyleSelect.style.display = isCompareMode ? 'inline-block' : 'none';
      renderChart();
    });
  }

  if (compareStyleSelect) {
    compareStyleSelect.addEventListener('change', (e) => {
      compareStyle = e.target.value;
      renderChart();
    });
  }

  // Forecast toggle (R2)
  const btnToggleForecast = document.getElementById('btn-toggle-forecast');
  if (btnToggleForecast) {
    btnToggleForecast.addEventListener('click', () => {
      isForecastMode = !isForecastMode;
      btnToggleForecast.textContent = `Dự báo: ${isForecastMode ? 'Bật' : 'Tắt'}`;
      if (isForecastMode) {
        btnToggleForecast.classList.add('active');
      } else {
        btnToggleForecast.classList.remove('active');
      }
      renderChart();
    });
  }

  // Add transaction button (R1)
  if (btnAddTx) {
    btnAddTx.addEventListener('click', openAddModal);
  }

  // Reset Default Data button (R1)
  const btnResetData = document.getElementById('btn-reset-data');
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm("Bạn có chắc chắn muốn đặt lại dữ liệu mặc định? Toàn bộ các tùy chỉnh và giao dịch lưu trữ sẽ bị xóa sạch.")) {
        localStorage.removeItem(storageKey);
        window.location.reload();
      }
    });
  }

  // CSV/JSON/PDF exports (R5)
  const btnCsv = document.getElementById('btn-export-csv');
  if (btnCsv) btnCsv.addEventListener('click', exportCSV);

  const btnJson = document.getElementById('btn-export-json');
  if (btnJson) btnJson.addEventListener('click', exportJSON);

  const btnPdf = document.getElementById('btn-print-pdf');
  if (btnPdf) btnPdf.addEventListener('click', () => window.print());

  // Modal dialog cancel button
  if (btnCancelModal) {
    btnCancelModal.addEventListener('click', () => addTxDialog.close());
  }

  // Modal dialog close button
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => addTxDialog.close());
  }

  // Modal delete action button (R1)
  const btnDeleteModal = document.getElementById('btn-delete-modal');
  if (btnDeleteModal) {
    btnDeleteModal.addEventListener('click', () => {
      if (editingTxId) {
        if (confirm(`Bạn có chắc chắn muốn xóa giao dịch ${editingTxId}?`)) {
          deleteTransaction(editingTxId);
          addTxDialog.close();
        }
      }
    });
  }

  // Form submit add/edit (R1)
  const dialogForm = addTxDialog.querySelector('form');
  if (dialogForm) {
    dialogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('tx-id').value;
      const desc = document.getElementById('tx-desc').value;
      const category = document.getElementById('tx-category').value;
      const amount = parseFloat(document.getElementById('tx-amount').value);

      if (editingTxId) {
        const tx = transactions.find(t => t.id === editingTxId);
        if (tx) {
          tx.desc = desc;
          tx.category = category;
          tx.amount = amount;
        }
      } else {
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
      addTxDialog.close();
    });
  }
});

})();
