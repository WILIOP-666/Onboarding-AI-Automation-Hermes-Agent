import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

test("primary learning pages have no WCAG A/AA axe violations", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/presentation",
    "/learn",
    "/hermes",
    "/missions",
    "/missions/02-bug-hunter",
    "/playground",
    "/instructor",
    "/completion",
  ]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        nodes: nodes.map((node) => ({
          target: node.target,
          failure: node.failureSummary,
        })),
      })),
      route,
    ).toEqual([]);
  }
});

test("responsive layouts have no horizontal overflow at target screen sizes", async ({
  page,
}) => {
  const sizes = [
    [1440, 900],
    [1920, 1080],
    [1280, 720],
    [768, 1024],
    [390, 844],
  ] as const;
  const cases = [
    { route: "/", name: "overview" },
    { route: "/learn", name: "learn" },
    { route: "/hermes", name: "hermes" },
    { route: "/presentation", name: "presentation" },
    { route: "/playground", name: "playground" },
    { route: "/missions/02-bug-hunter", name: "mission" },
    { route: "/instructor", name: "instructor" },
    { route: "/completion", name: "completion" },
  ];
  mkdirSync(path.resolve("test-results/visual"), { recursive: true });
  for (const view of cases) {
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      await page.goto(view.route);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.content,
        `${view.name} at ${width}x${height}`,
      ).toBeLessThanOrEqual(dimensions.viewport);
      if (view.name === "overview" || width === 1440) {
        await page.screenshot({
          path: `test-results/visual/${view.name}-${width}x${height}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
    }
  }
});
