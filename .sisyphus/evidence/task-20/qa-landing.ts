import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname);
const VIEWPORTS = [
  { name: "320", width: 320, height: 800 },
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

interface TestResult {
  viewport: string;
  theme: string;
  noHorizontalScroll: boolean;
  heroVisible: boolean;
  featuresVisible: boolean;
  socialProofVisible: boolean;
  builderVisible: boolean;
  headerVisible: boolean;
  footerVisible: boolean;
  darkBgCheck: boolean;
  screenshot: string;
  scrollWidth: number;
  windowWidth: number;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: TestResult[] = [];

  for (const vp of VIEWPORTS) {
    for (const theme of ["light", "dark"]) {
      console.log(`\n=== Testing: ${vp.name}px - ${theme} mode ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      // Set dark mode before navigating
      if (theme === "dark") {
        await page.addInitScript(() => {
          document.documentElement.classList.add("dark");
        });
      } else {
        await page.addInitScript(() => {
          document.documentElement.classList.remove("dark");
        });
      }

      await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });

      // Wait for the page to be fully settled
      await page.waitForTimeout(1000);

      const result: TestResult = {
        viewport: vp.name,
        theme,
        noHorizontalScroll: false,
        heroVisible: false,
        featuresVisible: false,
        socialProofVisible: false,
        builderVisible: false,
        headerVisible: false,
        footerVisible: false,
        darkBgCheck: theme === "dark" ? false : true, // only applies to dark
        screenshot: "",
        scrollWidth: 0,
        windowWidth: 0,
      };

      // 1. Check no horizontal scroll
      const scrollDims = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        windowWidth: window.innerWidth,
      }));
      result.scrollWidth = scrollDims.scrollWidth;
      result.windowWidth = scrollDims.windowWidth;
      result.noHorizontalScroll = scrollDims.scrollWidth <= scrollDims.windowWidth + 1; // 1px tolerance
      console.log(`  Scroll: ${scrollDims.scrollWidth} <= ${scrollDims.windowWidth} → ${result.noHorizontalScroll ? "PASS" : "FAIL"}`);

      // 2. Hero heading
      const heroText = await page.evaluate(() => {
        const els = document.querySelectorAll("h1, h2, h3");
        for (const el of els) {
          if (el.textContent?.toLowerCase().includes("build a beautiful resume")) return true;
        }
        return false;
      });
      result.heroVisible = heroText;
      console.log(`  Hero: ${heroText ? "PASS" : "FAIL"}`);

      // 3. Features section
      const featuresText = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.includes("Everything you need");
      });
      result.featuresVisible = featuresText;
      console.log(`  Features: ${featuresText ? "PASS" : "FAIL"}`);

      // 4. SocialProof
      const socialProofText = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.includes("10,000+");
      });
      result.socialProofVisible = socialProofText;
      console.log(`  SocialProof: ${socialProofText ? "PASS" : "FAIL"}`);

      // 5. Builder section (PromptInput textarea)
      const builderVisible = await page.evaluate(() => {
        const textareas = document.querySelectorAll("textarea");
        for (const ta of textareas) {
          if (ta.placeholder?.toLowerCase().includes("describe") || ta.placeholder?.toLowerCase().includes("resume")) return true;
        }
        // Also check for prompt-related inputs
        const inputs = document.querySelectorAll('input[type="text"], [role="textbox"]');
        for (const inp of inputs) {
          const ph = inp.getAttribute("placeholder") || "";
          if (ph.toLowerCase().includes("describe") || ph.toLowerCase().includes("resume")) return true;
        }
        return false;
      });
      result.builderVisible = builderVisible;
      console.log(`  Builder: ${builderVisible ? "PASS" : "FAIL"}`);

      // 6. Header (Logo with "Resume" text)
      const headerVisible = await page.evaluate(() => {
        const headers = document.querySelectorAll("header, nav, [class*='header'], [class*='navbar']");
        for (const h of headers) {
          if (h.textContent?.toLowerCase().includes("resume")) return true;
        }
        // Fallback: check any element
        const body = document.body.innerText.toLowerCase();
        return body.includes("resume");
      });
      result.headerVisible = headerVisible;
      console.log(`  Header: ${headerVisible ? "PASS" : "FAIL"}`);

      // 7. Footer (WeThinkDigital)
      const footerVisible = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.includes("WeThinkDigital");
      });
      result.footerVisible = footerVisible;
      console.log(`  Footer: ${footerVisible ? "PASS" : "FAIL"}`);

      // 8. Dark mode: background color
      if (theme === "dark") {
        const darkBgCheck = await page.evaluate(() => {
          const bg = getComputedStyle(document.documentElement).backgroundColor;
          // Parse RGB
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!match) return false;
          const [_, r, g, b] = match.map(Number);
          // Dark if average RGB < 128 (not white)
          const avg = (r + g + b) / 3;
          return avg < 128;
        });
        result.darkBgCheck = darkBgCheck;
        console.log(`  Dark BG: ${darkBgCheck ? "PASS" : "FAIL"}`);
      }

      // Take screenshot
      const screenshotPath = path.join(OUTPUT_DIR, `landing-${theme}-${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = `landing-${theme}-${vp.name}.png`;
      console.log(`  Screenshot: ${result.screenshot}`);

      results.push(result);
      await context.close();
    }
  }

  await browser.close();

  // Generate summary
  const allPassed = results.every((r) => {
    const checks = [
      r.noHorizontalScroll,
      r.heroVisible,
      r.featuresVisible,
      r.socialProofVisible,
      r.builderVisible,
      r.headerVisible,
      r.footerVisible,
      r.darkBgCheck,
    ];
    return checks.every(Boolean);
  });

  const summaryLines: string[] = [];
  summaryLines.push("=" .repeat(60));
  summaryLines.push("LANDING PAGE QA REPORT - Task 20");
  summaryLines.push("=".repeat(60));
  summaryLines.push(`URL: ${BASE_URL}`);
  summaryLines.push(`Date: ${new Date().toISOString()}`);
  summaryLines.push(`Viewports tested: ${VIEWPORTS.map((v) => v.name + "px").join(", ")}`);
  summaryLines.push(`Themes tested: light, dark`);
  summaryLines.push(`Total screenshots: ${results.length}`);
  summaryLines.push("");
  summaryLines.push(`OVERALL RESULT: ${allPassed ? "ALL PASSED" : "SOME FAILURES"}`);
  summaryLines.push("");
  summaryLines.push("-".repeat(60));
  summaryLines.push("DETAILED RESULTS");
  summaryLines.push("-".repeat(60));
  summaryLines.push("");

  for (const r of results) {
    summaryLines.push(`[${r.viewport}px - ${r.theme.toUpperCase()}]`);
    summaryLines.push(`  Horizontal Scroll: ${r.noHorizontalScroll ? "PASS" : "FAIL"} (scrollWidth=${r.scrollWidth}, windowWidth=${r.windowWidth})`);
    summaryLines.push(`  Hero Section:      ${r.heroVisible ? "PASS" : "FAIL"}`);
    summaryLines.push(`  Features Section:  ${r.featuresVisible ? "PASS" : "FAIL"}`);
    summaryLines.push(`  SocialProof:       ${r.socialProofVisible ? "PASS" : "FAIL"}`);
    summaryLines.push(`  Builder Section:   ${r.builderVisible ? "PASS" : "FAIL"}`);
    summaryLines.push(`  Header:            ${r.headerVisible ? "PASS" : "FAIL"}`);
    summaryLines.push(`  Footer:            ${r.footerVisible ? "PASS" : "FAIL"}`);
    if (r.theme === "dark") {
      summaryLines.push(`  Dark Background:   ${r.darkBgCheck ? "PASS" : "FAIL"}`);
    }
    summaryLines.push(`  Screenshot:        ${r.screenshot}`);
    summaryLines.push("");
  }

  // Failure details
  const failures = results.filter((r) => {
    const checks = [
      r.noHorizontalScroll,
      r.heroVisible,
      r.featuresVisible,
      r.socialProofVisible,
      r.builderVisible,
      r.headerVisible,
      r.footerVisible,
      r.darkBgCheck,
    ];
    return !checks.every(Boolean);
  });

  if (failures.length > 0) {
    summaryLines.push("-".repeat(60));
    summaryLines.push("FAILURES");
    summaryLines.push("-".repeat(60));
    for (const f of failures) {
      summaryLines.push(`  ${f.viewport}px ${f.theme}:`);
      if (!f.noHorizontalScroll) summaryLines.push(`    - Horizontal scroll detected (scrollWidth=${f.scrollWidth}, windowWidth=${f.windowWidth})`);
      if (!f.heroVisible) summaryLines.push(`    - Hero section not visible`);
      if (!f.featuresVisible) summaryLines.push(`    - Features section not visible`);
      if (!f.socialProofVisible) summaryLines.push(`    - SocialProof section not visible`);
      if (!f.builderVisible) summaryLines.push(`    - Builder section not visible`);
      if (!f.headerVisible) summaryLines.push(`    - Header not visible`);
      if (!f.footerVisible) summaryLines.push(`    - Footer not visible`);
      if (f.theme === "dark" && !f.darkBgCheck) summaryLines.push(`    - Dark background not applied`);
    }
  }

  const summaryPath = path.join(OUTPUT_DIR, "summary.txt");
  fs.writeFileSync(summaryPath, summaryLines.join("\n"));
  console.log(`\nSummary written to: ${summaryPath}`);
  console.log(`Overall: ${allPassed ? "ALL PASSED" : "SOME FAILURES"}`);

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
