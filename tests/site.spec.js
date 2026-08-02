import { expect, test } from "@playwright/test";

test("desktop experience, bilingual content, rate fallback, and WhatsApp request", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sleep peacefully");
  await expect(page.locator("img")).toHaveCount(11);
  await expect(page.locator(".hero-image img")).toHaveJSProperty("complete", true);
  expect(await page.locator(".hero-image img").evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Change language" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("भक्तपुर");
  await page.getByRole("button", { name: "Change language" }).click();

  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(page.getByText("02 / 05")).toBeVisible();

  await page.getByRole("button", { name: "Check rate & availability" }).click();
  await expect(page.getByText(/Live rates are being connected/)).toBeVisible();

  const whatsapp = page.getByRole("link", { name: /Send request on WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me\/9779861814909/);
  await expect(whatsapp).toHaveAttribute("href", /room%20type/i);

  await page.screenshot({ path: "test-results/desktop-full.png", fullPage: true });
});

test("mobile navigation and booking layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator("nav.nav-open")).toBeVisible();
  await page.getByRole("link", { name: "Rooms", exact: true }).click();
  await expect(page.locator("#rooms")).toBeInViewport();
  await page.screenshot({ path: "test-results/mobile-full.png", fullPage: true });
});
