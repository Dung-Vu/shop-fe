/**
 * AURA Enterprise Analytics Suite V5.0 - E2E Automated Test Runner
 * Core Engine: JSDOM + Node.js (Windows Compatible, Lightweight)
 */

"use strict";

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 1. Parse Command Line Arguments
const args = process.argv.slice(2);
const styleFilter = args.find(a => a.startsWith('--style='))?.split('=')[1];
const tierFilter = args.find(a => a.startsWith('--tier='))?.split('=')[1];

// 2. Global Test Registry
const testRegistry = [];
let passCount = 0;
let failCount = 0;
const testResults = [];

function registerTest(suiteName, testName, tier, fn) {
  testRegistry.push({ suiteName, testName, tier, fn });
}

// 3. Robust Assertion Library
class AssertionFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionFailedError';
  }
}

const assert = {
  ok(value, msg = 'Value is not truthy') {
    if (!value) throw new AssertionFailedError(msg);
  },
  equal(actual, expected, msg = '') {
    if (actual !== expected) {
      throw new AssertionFailedError(`${msg} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`);
    }
  },
  notEqual(actual, expected, msg = '') {
    if (actual === expected) {
      throw new AssertionFailedError(`${msg} (Expected not equal to: ${JSON.stringify(expected)})`);
    }
  },
  includes(str, substr, msg = '') {
    if (!str || !str.includes(substr)) {
      throw new AssertionFailedError(`${msg} (Expected string ${JSON.stringify(str)} to contain ${JSON.stringify(substr)})`);
    }
  },
  throws(fn, msg = 'Expected function to throw') {
    try {
      fn();
    } catch (e) {
      return; // Passed
    }
    throw new AssertionFailedError(msg);
  }
};

// 4. Setup Browser Environment Mock (JSDOM Helper)
function createVirtualBrowser(htmlPath, jsPath) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Custom localStorage mock to preserve state between tests and page reloads
  const storageMap = {};
  const mockLocalStorage = {
    getItem(key) { return storageMap[key] || null; },
    setItem(key, val) { storageMap[key] = String(val); },
    removeItem(key) { delete storageMap[key]; },
    clear() { Object.keys(storageMap).forEach(k => delete storageMap[k]); },
    get length() { return Object.keys(storageMap).length; },
    key(i) { return Object.keys(storageMap)[i] || null; }
  };

  // Strip native script tag to run dynamically and control initialization
  const cleanHtml = htmlContent.replace(/<script\s+src=["']app\.js["']><\/script>/i, '');

  const dom = new JSDOM(cleanHtml, {
    runScripts: "outside-only",
    resources: "usable",
    url: `http://localhost/${path.basename(path.dirname(htmlPath)) || ''}`
  });

  const { window } = dom;
  const { document } = window;

  // Polyfills & Mocks for advanced visual APIs in standard browser
  window.localStorage = mockLocalStorage;
  
  window.requestAnimationFrame = function(cb) {
    return setTimeout(() => {
      try { cb(Date.now()); } catch(e) {}
    }, 16);
  };
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };

  let printTriggeredCount = 0;
  window.print = function() {
    printTriggeredCount++;
  };
  window.__getPrintCount = () => printTriggeredCount;

  // Dialog element Polyfills
  if (!window.HTMLDialogElement) {
    window.HTMLDialogElement = class extends window.HTMLElement {
      constructor() { super(); this.open = false; }
      showModal() {
        this.open = true;
        this.setAttribute('open', '');
        const ev = new window.Event('show');
        this.dispatchEvent(ev);
      }
      close() {
        this.open = false;
        this.removeAttribute('open');
        const ev = new window.Event('close');
        this.dispatchEvent(ev);
      }
    };
  } else {
    window.HTMLDialogElement.prototype.showModal = function() {
      this.open = true;
      this.setAttribute('open', '');
    };
    window.HTMLDialogElement.prototype.close = function() {
      this.open = false;
      this.removeAttribute('open');
    };
  }

  // Canvas context mocks to avoid warnings
  const mockCtx = {
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    rect: () => {},
    arc: () => {},
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    drawImage: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    set fillStyle(val) {},
    set strokeStyle(val) {},
    set lineWidth(val) {},
    set globalAlpha(val) {},
    set globalCompositeOperation(val) {},
    set shadowBlur(val) {},
    set shadowColor(val) {}
  };
  window.HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === '2d') return mockCtx;
    return null;
  };

  // SVGPathElement Polyfill
  if (!window.SVGPathElement) {
    window.SVGPathElement = class extends window.SVGElement {};
  }
  window.SVGPathElement.prototype.getTotalLength = function() {
    return 100;
  };

  // bounding rect mock
  window.Element.prototype.getBoundingClientRect = function() {
    return { top: 10, left: 10, width: 600, height: 320, right: 610, bottom: 330 };
  };

  // Run the dashboard script inside the JSDOM context
  if (jsPath && fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    try {
      dom.window.eval(jsContent);
    } catch(e) {
      console.warn(`[Evaluation Warning] Error evaluating ${path.basename(jsPath)}:`, e.message);
    }
  }

  return { dom, window, document };
}

// 5. Main Execution Flow
async function main() {
  console.log('========================================================================');
  console.log('       AURA Enterprise Analytics Suite V5.0 - E2E Test Suite');
  console.log('========================================================================');

  // Discover co-located test files
  const suitesToLoad = [
    { name: 'Showcase Hub', dir: '.', file: 'showcase-hub.e2e.js', html: 'index.html', js: null },
    { name: 'Ice Frost', dir: '1-ice-frost', file: 'app.e2e.js', html: '1-ice-frost/index.html', js: '1-ice-frost/app.js' },
    { name: 'Warm Timber', dir: '2-warm-timber', file: 'app.e2e.js', html: '2-warm-timber/index.html', js: '2-warm-timber/app.js' },
    { name: 'Autumn', dir: '3-autumn', file: 'app.e2e.js', html: '3-autumn/index.html', js: '3-autumn/app.js' },
    { name: 'Winter', dir: '4-winter', file: 'app.e2e.js', html: '4-winter/index.html', js: '4-winter/app.js' },
    { name: 'Forest', dir: '5-forest', file: 'app.e2e.js', html: '5-forest/index.html', js: '5-forest/app.js' },
    { name: 'River', dir: '6-river', file: 'app.e2e.js', html: '6-river/index.html', js: '6-river/app.js' },
    { name: 'Magma Fire', dir: '7-fire-magma', file: 'app.e2e.js', html: '7-fire-magma/index.html', js: '7-fire-magma/app.js' }
  ];

  // Load and register all tests
  for (const s of suitesToLoad) {
    const testPath = path.join(__dirname, s.dir, s.file);
    if (fs.existsSync(testPath)) {
      const registerFn = require(testPath);
      
      const suiteRegistry = {
        test(name, tier, fn) {
          registerTest(s.name, name, tier, async () => {
            const browser = createVirtualBrowser(path.join(__dirname, s.html), s.js ? path.join(__dirname, s.js) : null);
            await fn(browser.window, browser.document, assert);
          });
        }
      };
      
      registerFn(suiteRegistry);
    } else {
      console.warn(`[Skip] Test file not found: ${testPath}`);
    }
  }

  // Filter tests based on CLI arguments
  let testsToExecute = testRegistry;
  if (styleFilter) {
    testsToExecute = testsToExecute.filter(t => t.suiteName.toLowerCase().replace(/\s+/g, '-').includes(styleFilter.toLowerCase()));
  }
  if (tierFilter) {
    testsToExecute = testsToExecute.filter(t => String(t.tier) === String(tierFilter));
  }

  console.log(`\nFound ${testsToExecute.length} tests to execute (Total registered: ${testRegistry.length}).\n`);

  // Execute sequentially
  for (const t of testsToExecute) {
    const testFullName = `[Tier ${t.tier}] ${t.suiteName} > ${t.testName}`;
    process.stdout.write(`RUNNING: ${testFullName} ... `);
    
    try {
      await t.fn();
      passCount++;
      testResults.push({ name: testFullName, status: 'PASS', error: null });
      console.log('\x1b[32mPASS\x1b[0m');
    } catch (e) {
      failCount++;
      testResults.push({ name: testFullName, status: 'FAIL', error: e });
      console.log('\x1b[31mFAIL\x1b[0m');
      console.log(`  \x1b[33mError:\x1b[0m ${e.message}\n`);
    }
  }

  // 6. Print Report Summary
  console.log('\n========================================================================');
  console.log('       TEST RESULTS REPORT SUMMARY');
  console.log('========================================================================');
  console.log(`Total Run:   ${testsToExecute.length}`);
  console.log(`Passed:      \x1b[32m${passCount}\x1b[0m`);
  console.log(`Failed:      \x1b[31m${failCount}\x1b[0m`);
  console.log('========================================================================');

  if (failCount > 0) {
    console.log('\nFailed Test Details:');
    testResults.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`- \x1b[31m[FAIL]\x1b[0m ${r.name}`);
      console.log(`  Reason: ${r.error.stack || r.error.message}\n`);
    });
    
    console.log('\x1b[31mSome E2E tests failed. This is expected on unimplemented features!\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\n\x1b[32mAll executed tests passed successfully!\x1b[0m\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Test runner encountered a critical error:", err);
  process.exit(1);
});
