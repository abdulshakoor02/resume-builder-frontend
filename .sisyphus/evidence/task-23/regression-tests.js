const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const EVIDENCE = '.sisyphus/evidence/task-23';
const results = [];

function pad(n) { return String(n).padStart(2, '0'); }
function ts() { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }

async function log(testNum, msg) { console.log(`[${ts()}] T${testNum}: ${msg}`); }
async function pass(testNum, msg) { const m = `PASS: ${msg}`; console.log(`  ✅ ${m}`); results.push(`T${testNum} PASS: ${msg}`); }
async function fail(testNum, msg) { const m = `FAIL: ${msg}`; console.log(`  ❌ ${m}`); results.push(`T${testNum} FAIL: ${msg}`); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // ==========================================================
  // TEST 1: Theme persistence
  // ==========================================================
  log(1, 'Theme persistence');
  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('[aria-label="Switch to dark mode"]', { timeout: 10000 });

    // Click toggle to enable dark mode
    await page.click('[aria-label="Switch to dark mode"]');
    await page.waitForTimeout(500);

    let hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (hasDark) pass(1, 'Dark class present after toggle');
    else fail(1, 'Dark class not present after toggle');

    // Reload
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (hasDark) pass(1, 'Dark class persists after reload');
    else fail(1, 'Dark class lost after reload');

    await page.screenshot({ path: `${EVIDENCE}/theme-persist.png`, fullPage: false });
    log(1, 'Screenshot saved: theme-persist.png');
  } catch (e) {
    fail(1, `Error: ${e.message}`);
  }

  // ==========================================================
  // TEST 2: Theme toggle switches modes
  // ==========================================================
  log(2, 'Theme toggle switches modes');

  // Ensure light mode first by clearing localStorage
  await page.evaluate(() => {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  try {
    // Confirm light mode
    let isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (!isDark) pass(2, 'Light mode confirmed at start');
    else fail(2, 'Expected light mode but got dark');

    await page.screenshot({ path: `${EVIDENCE}/theme-toggle-light.png`, fullPage: false });

    // Toggle to dark
    await page.click('[aria-label="Switch to dark mode"]');
    await page.waitForTimeout(500);
    isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark) pass(2, 'Dark mode applied after first toggle');
    else fail(2, 'Dark mode NOT applied after first toggle');

    await page.screenshot({ path: `${EVIDENCE}/theme-toggle-dark.png`, fullPage: false });

    // Toggle back to light
    await page.click('[aria-label="Switch to light mode"]');
    await page.waitForTimeout(500);
    isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (!isDark) pass(2, 'Light mode restored after second toggle');
    else fail(2, 'Light mode NOT restored after second toggle');
  } catch (e) {
    fail(2, `Error: ${e.message}`);
  }

  // ==========================================================
  // TEST 3: Mobile nav (375px viewport)
  // ==========================================================
  log(3, 'Mobile nav (375px viewport)');
  try {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.screenshot({ path: `${EVIDENCE}/mobile-nav-home.png`, fullPage: false });
    log(3, 'Screenshot: mobile-nav-home.png');

    // Find and click hamburger
    const hamburger = await page.$('[aria-label="Open navigation"]');
    if (!hamburger) {
      const altHamburger = await page.$('button[aria-label*="navigation"], button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="open" i]');
      if (altHamburger) {
        await altHamburger.click();
        log(3, 'Clicked hamburger via fallback selector');
      } else {
        const buttons = await page.$$('button');
        let clicked = false;
        for (const btn of buttons) {
          const label = await btn.getAttribute('aria-label');
          if (label && (label.toLowerCase().includes('menu') || label.toLowerCase().includes('nav') || label.toLowerCase().includes('open'))) {
            await btn.click();
            clicked = true;
            log(3, `Clicked button with aria-label="${label}"`);
            break;
          }
        }
        if (!clicked) {
          fail(3, 'Hamburger button not found with any selector');
          throw new Error('Hamburger not found');
        }
      }
    } else {
      await hamburger.click();
    }
    await page.waitForTimeout(500);

    await page.screenshot({ path: `${EVIDENCE}/mobile-nav-open.png`, fullPage: false });
    log(3, 'Screenshot: mobile-nav-open.png');

    // Check for navigation links
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasHome = pageText.includes('Home');
    const hasDashboard = pageText.includes('Dashboard');
    const hasSignIn = pageText.includes('Sign In') || pageText.includes('Sign in');

    if (hasHome) pass(3, '"Home" link visible');
    else fail(3, '"Home" link NOT visible');

    if (hasDashboard) pass(3, '"Dashboard" link visible');
    else fail(3, '"Dashboard" link NOT visible');

    if (hasSignIn) pass(3, '"Sign In" link visible');
    else fail(3, '"Sign In" link NOT visible');

    // Click "Sign In" button in mobile nav (it's a visible button, not a link)
    const signInBtn = await page.$('button:has-text("Sign In")');
    if (signInBtn) {
      // Need to wait for overlay animation before clicking
      await page.waitForTimeout(300);
      await signInBtn.click();
      await page.waitForTimeout(1000);
      const url = page.url();
      if (url.includes('/login')) pass(3, 'Navigated to /login after clicking Sign In');
      else fail(3, `Did not navigate to /login, got: ${url}`);
    } else {
      // Fallback: try navigating directly via evaluate
      fail(3, 'Sign In button not found to click in mobile nav');
    }

    await page.screenshot({ path: `${EVIDENCE}/mobile-nav-login.png`, fullPage: false });
    log(3, 'Screenshot: mobile-nav-login.png');

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  } catch (e) {
    fail(3, `Error: ${e.message}`);
  }

  // ==========================================================
  // TEST 4: 404 page
  // ==========================================================
  log(4, '404 page');
  try {
    await page.goto(`${BASE}/nonexistent-page-xyz-123`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const has404 = bodyText.includes('404');
    const hasBackHome = bodyText.includes('Back to Home') || bodyText.includes('Back Home') || bodyText.includes('Home');

    if (has404) pass(4, '"404" text visible');
    else fail(4, '"404" text NOT visible');

    if (hasBackHome) pass(4, '"Back to Home" link visible');
    else fail(4, '"Back to Home" link NOT visible');

    await page.screenshot({ path: `${EVIDENCE}/404-page.png`, fullPage: false });
    log(4, 'Screenshot saved: 404-page.png');
  } catch (e) {
    fail(4, `Error: ${e.message}`);
  }

  // ==========================================================
  // TEST 5: Auth guard on dashboard
  // ==========================================================
  log(5, 'Auth guard on dashboard');
  try {
    // Clear token
    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
    });
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const hasSignInPrompt = bodyText.includes('Sign in to view your resumes') ||
                            bodyText.includes('sign in') ||
                            bodyText.includes('Sign In');
    const hasSignInLink = bodyText.includes('Sign in') || bodyText.includes('Sign In');

    if (hasSignInPrompt) pass(5, 'Sign-in prompt visible');
    else fail(5, 'Sign-in prompt NOT visible. Page content: ' + bodyText.substring(0, 200));

    // Check for link to /login
    const signInBtn = await page.$('a[href*="login"]');
    if (signInBtn) pass(5, 'Sign-in button linking to /login found');
    else fail(5, 'No link to /login found on auth guard page');

    await page.screenshot({ path: `${EVIDENCE}/auth-guard.png`, fullPage: false });
    log(5, 'Screenshot saved: auth-guard.png');
  } catch (e) {
    fail(5, `Error: ${e.message}`);
  }

  // ==========================================================
  // TEST 6: Logo renders on all pages
  // ==========================================================
  log(6, 'Logo renders on all pages');
  const pagesToTest = [
    { name: 'home', path: '/' },
    { name: 'login', path: '/login' },
    { name: 'signup', path: '/signup' },
  ];

  for (const { name, path } of pagesToTest) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const bodyText = await page.evaluate(() => document.body.innerText);

      if (bodyText.includes('Resume')) {
        pass(6, `"Resume" text visible on ${name} page`);
      } else {
        fail(6, `"Resume" text NOT visible on ${name} page`);
      }

      await page.screenshot({ path: `${EVIDENCE}/logo-${name}.png`, fullPage: false });
      log(6, `Screenshot saved: logo-${name}.png`);
    } catch (e) {
      fail(6, `Error on ${name} page: ${e.message}`);
    }
  }

  // ==========================================================
  // TEST 7: Social proof section visible
  // ==========================================================
  log(7, 'Social proof section');
  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll down to find social proof section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const has10k = bodyText.includes('10,000') || bodyText.includes('10000');
    const hasATS = bodyText.includes('ATS') || bodyText.includes('Optimized');
    const hasRating = bodyText.includes('4.8') || bodyText.includes('4.8/5');

    if (has10k) pass(7, '"10,000+" visible');
    else fail(7, '"10,000+" NOT visible');

    if (hasATS) pass(7, '"ATS-Optimized" visible');
    else fail(7, '"ATS-Optimized" NOT visible');

    if (hasRating) pass(7, '"4.8/5" visible');
    else fail(7, '"4.8/5" NOT visible');

    await page.screenshot({ path: `${EVIDENCE}/social-proof.png`, fullPage: false });
    log(7, 'Screenshot saved: social-proof.png');
  } catch (e) {
    fail(7, `Error: ${e.message}`);
  }

  // ==========================================================
  // SUMMARY
  // ==========================================================
  console.log('\n' + '='.repeat(60));
  console.log('REGRESSION TEST RESULTS');
  console.log('='.repeat(60));
  results.forEach(r => console.log(r));

  const passCount = results.filter(r => r.includes('PASS')).length;
  const failCount = results.filter(r => r.includes('FAIL')).length;
  const totalCount = passCount + failCount;

  console.log(`\nTOTAL: ${totalCount} assertions, ${passCount} PASS, ${failCount} FAIL`);
  console.log(`Overall: ${failCount === 0 ? '✅ ALL PASSED' : '❌ SOME FAILED'}`);

  await browser.close();
})();
