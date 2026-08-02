import { expect, test } from "@playwright/test";

test("desktop experience, multilingual content, rate fallback, and WhatsApp request", async ({ page }) => {
  const imageWarnings = [];
  page.on("console", (message) => {
    if (message.text().includes("Image with src")) imageWarnings.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome to Holiday Home Bhaktapur");
  await expect(page.getByRole("status")).toContainText("Choose your language");
  const directions = page.getByRole("link", { name: /Get directions/ });
  await expect(directions).toHaveCount(2);
  for (const link of await directions.all()) {
    await expect(link).toHaveAttribute("href", "https://maps.app.goo.gl/Q3ZcFKfFDzMhCruN7?g_st=ic");
  }
  await expect(page.locator("img")).toHaveCount(17);
  await expect(page.locator(".hero-image img.active")).toHaveJSProperty("complete", true);
  expect(await page.locator(".hero-image img.active").evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  const firstHeroImage = await page.locator(".hero-image img.active").getAttribute("src");

  const language = page.getByRole("combobox", { name: "Language", exact: true });
  await language.selectOption("de");
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("gemütlichen Zuhause in Bhaktapur");
  await expect(page.getByRole("link", { name: /Anfrage über WhatsApp senden/ })).toHaveAttribute("href", /Hallo%2C%20ich%20m%C3%B6chte/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await language.selectOption("fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("maison chaleureuse à Bhaktapur");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await language.selectOption("es");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("acogedor hogar en Bhaktapur");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await language.selectOption("en");
  await page.waitForTimeout(5200);
  await expect(page.locator(".hero-image img.active")).not.toHaveAttribute("src", firstHeroImage);

  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(page.getByText("02 / 05")).toBeVisible();

  await expect(page.locator(".room-row")).toHaveCount(3);
  expect(await page.locator(".rooms-section").evaluate((section) => section.getBoundingClientRect().height)).toBeLessThanOrEqual(1000);
  for (const room of await page.locator(".room-row").all()) {
    await expect(room.getByText("Private bathroom", { exact: true })).toBeVisible();
    await expect(room.getByText("Free Wi-Fi", { exact: true })).toBeVisible();
  }
  const standardRoomSlides = page.getByRole("region", { name: "Private room photos", exact: true });
  await standardRoomSlides.getByRole("button", { name: "Next Private room photo" }).click();
  await expect(standardRoomSlides.locator("img")).toHaveAttribute("src", /standard-room\.jpg/);

  await page.locator('input[value="twin-kitchen"]').check({ force: true });
  await expect(page.locator('input[value="twin-kitchen"]')).toBeChecked();

  await page.getByRole("button", { name: "Check rate & availability" }).click();
  await expect(page.getByText(/Live rates are being connected/)).toBeVisible();

  const whatsapp = page.getByRole("link", { name: /Send request on WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me\/9779861814909/);
  await expect(whatsapp).toHaveAttribute("href", /room%20type/i);
  await expect(whatsapp).toHaveAttribute("href", /twin%20bed%20and%20kitchen/i);
  await expect(whatsapp).not.toHaveAttribute("href", /pickup|transport/i);
  await expect(page.getByText(/arranging airport|Need a ride|Request transport/i)).toHaveCount(0);
  expect(imageWarnings).toEqual([]);

  await page.screenshot({ path: "test-results/desktop-full.png", fullPage: true });
});

test("mobile navigation and booking layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect.poll(() => page.locator(".hero-image img").nth(2).evaluate((image) => getComputedStyle(image).objectPosition)).toBe("calc(50% + 20px) 50%");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator("nav.nav-open")).toBeVisible();
  await page.getByRole("link", { name: "Rooms", exact: true }).click();
  await expect(page.locator("#rooms")).toBeInViewport();
  await page.getByRole("combobox", { name: "Language", exact: true }).selectOption("de");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("combobox", { name: "Language", exact: true }).selectOption("en");
  await page.screenshot({ path: "test-results/mobile-full.png", fullPage: true });
});
