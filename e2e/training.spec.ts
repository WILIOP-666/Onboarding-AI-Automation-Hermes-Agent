import { expect, test } from "@playwright/test";

test("learner completes a mission, reloads, and keeps progress", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByLabel("What should we call you?").fill("Ada");
  await page.getByRole("link", { name: /Start training/ }).click();
  await page.getByRole("link", { name: /Code Detective/ }).click();
  await page.getByRole("button", { name: "Copy task" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  await page.getByRole("button", { name: /Mark complete/ }).click();
  await expect(page.getByText("MISSION COMPLETE")).toBeVisible();
  await page.reload();
  await expect(page.getByText("MISSION COMPLETE")).toBeVisible();
  await expect(page.locator(".top-xp")).toContainText("100 XP");
});

test("presentation supports keyboard navigation and remembers the selected slide", async ({
  page,
}) => {
  await page.goto("/presentation");
  await expect(page.getByText("01 / 12")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("02 / 12")).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "Presentation progress" }),
  ).toHaveAttribute("aria-valuetext", "Slide 2 of 12");
  await page.keyboard.press("PageDown");
  await expect(page.getByText("03 / 12")).toBeVisible();
  await page.keyboard.press("PageUp");
  await expect(page.getByText("02 / 12")).toBeVisible();
  const cue = page.getByRole("button", { name: /Facilitator cue/ });
  await cue.focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByText("FACILITATOR CUE", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("02 / 12")).toBeVisible();
  await page.reload();
  await expect(page.getByText("02 / 12")).toBeVisible();
});

test("mobile navigation exposes state and closes with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Learn the basics" }),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("completion restart asks before clearing training progress", async ({
  page,
}) => {
  await page.goto("/completion");
  await page.getByRole("button", { name: /Restart training/ }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Clear your progress and start again?",
  );
  await page.getByRole("button", { name: "Keep progress" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("instructor reset requires confirmation and clears local progress", async ({
  page,
}) => {
  await page.goto("/playground");
  await page.getByLabel("Participant name").fill("Ada");
  await page.goto("/instructor");
  const currentSegment = page.getByRole("button", {
    name: "Set Hands-on Playground as current segment",
  });
  await currentSegment.click();
  await expect(currentSegment).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Set Hands-on Playground as current segment",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Reset progress/ }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Clear this browser’s progress?",
  );
  await page.getByRole("button", { name: "Yes, reset" }).click();
  await page.goto("/playground");
  await expect(page.getByLabel("Participant name")).toHaveValue("");
  await page.goto("/instructor");
  await expect(
    page.getByRole("button", { name: "Set Opening as current segment" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("nested mission route survives direct navigation and unknown paths return 404", async ({
  page,
}) => {
  await page.goto("/missions/04-agent-workflow");
  await expect(
    page.getByRole("heading", { name: "Agent Workflow" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Agent Workflow" }),
  ).toBeVisible();
  const response = await page.goto("/not-a-training-route");
  expect(response?.status()).toBe(404);
});
