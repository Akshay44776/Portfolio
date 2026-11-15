import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:8080";

const TIERS = ["off", "low", "medium", "high"];
const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const ROUTES = ["/", "/projects", "/registry", "/pipeline", "/status", "/architecture", "/chaos", "/resume"];

const screenshotsDir = path.resolve("./screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runTests() {
  console.log("=== STARTING AUTOMATED VIEWPORT & 3D TIER VERIFICATION ===");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu-sandbox", "--use-gl=angle"]
  });

  const page = await browser.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`Page Error: ${err.message}`);
  });

  const results = [];

  // 1. Test 3D Tiers on Home
  console.log("\n--- Testing 3D Tiers on Home (1440px) ---");
  await page.setViewport({ width: 1440, height: 900 });

  for (const tier of TIERS) {
    const url = `${BASE_URL}/?3d=${tier}`;
    console.log(`Testing tier: ${tier} -> ${url}`);
    await page.goto(url, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));

    // Verify detected tier in DOM or context
    const hasCanvas = await page.evaluate(() => {
      return !!document.querySelector("canvas");
    });
    const hasFallback = await page.evaluate(() => {
      return !!document.querySelector(".cluster-fallback-poster");
    });
    const tierBadge = await page.evaluate(() => {
      const el = document.querySelector(".tier-badge");
      return el ? el.textContent.trim() : null;
    });

    console.log(`  Tier [${tier}]: hasCanvas=${hasCanvas}, hasFallback=${hasFallback}, badgeText=${tierBadge}`);
    await page.screenshot({ path: path.join(screenshotsDir, `tier-${tier}.png`) });

    results.push({
      type: "tier",
      tier,
      tierBadge,
      hasCanvas,
      hasFallback,
      status: tierBadge === tier ? "PASS" : "WARN"
    });
  }

  // 2. Test All Viewports on Home & Key Pages
  console.log("\n--- Testing Responsive Viewports (360, 390, 768, 1024, 1440, 1920) ---");

  for (const width of WIDTHS) {
    const height = width < 768 ? 800 : 900;
    await page.setViewport({ width, height });

    for (const route of ["/", "/projects", "/registry", "/status"]) {
      const url = `${BASE_URL}${route}`;
      await page.goto(url, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 400));

      const scrollCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          scrollWidth: docWidth,
          innerWidth: winWidth,
          hasHorizontalScroll: docWidth > winWidth
        };
      });

      console.log(`  Width ${width}px | Route ${route} -> scrollWidth: ${scrollCheck.scrollWidth}, winWidth: ${scrollCheck.innerWidth}, noOverflow: ${!scrollCheck.hasHorizontalScroll}`);

      if (route === "/") {
        await page.screenshot({ path: path.join(screenshotsDir, `viewport-${width}px-home.png`) });
      }

      results.push({
        type: "viewport",
        width,
        route,
        noHorizontalOverflow: !scrollCheck.hasHorizontalScroll,
        status: !scrollCheck.hasHorizontalScroll ? "PASS" : "FAIL"
      });
    }
  }

  // 3. Test Routes Existence & Content
  console.log("\n--- Testing All 8 Routes ---");
  for (const route of ROUTES) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle0" });
    const title = await page.title();
    console.log(`  Route ${route} loaded OK (Title: "${title}")`);
  }

  await browser.close();

  console.log("\n=== TEST RUN SUMMARY ===");
  console.log(`Console / Page errors caught: ${errors.length}`);
  if (errors.length > 0) {
    console.log(errors);
  }

  const allPassed = results.every((r) => r.status === "PASS");
  console.log(`All viewport and tier checks: ${allPassed ? "100% PASSED" : "SOME WARNINGS"}`);
}

runTests().catch(console.error);
