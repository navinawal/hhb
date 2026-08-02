import { expect, test } from "@playwright/test";

test("production mode shows only the branded holding page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Our new website is coming soon.",
  );
  await expect(page.getByAltText("Holiday Home Bhaktapur")).toBeVisible();
  await expect(page.getByText("Check your stay")).toHaveCount(0);
  await page.screenshot({ path: "test-results/coming-soon.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: "test-results/coming-soon-mobile.png", fullPage: true });
});
