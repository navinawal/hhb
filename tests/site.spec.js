import { expect, test } from "@playwright/test";

test("publishes complete, indexable SEO signals", async ({ page, request }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Holiday Home Bhaktapur.*Private Rooms near Durbar Square/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.holidayhomebhaktapur.com");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /private rooms near Bhaktapur Durbar Square/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/www\.holidayhomebhaktapur\.com\/opengraph-image(?:\?.*)?$/);

  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(structuredData["@type"]).toBe("LodgingBusiness");
  expect(structuredData.name).toBe("Holiday Home Bhaktapur");
  expect(structuredData.address.addressLocality).toBe("Bhaktapur");
  expect(structuredData.aggregateRating).toBeUndefined();

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /admin/");
  expect(await robots.text()).toContain("Sitemap: https://www.holidayhomebhaktapur.com/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("<loc>https://www.holidayhomebhaktapur.com</loc>");
  expect(sitemapXml).not.toContain("/admin");
});

async function swipe(locator, direction = "left") {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const startX = direction === "left" ? box.x + box.width * 0.78 : box.x + box.width * 0.22;
  const endX = direction === "left" ? box.x + box.width * 0.22 : box.x + box.width * 0.78;
  const y = box.y + box.height * 0.5;
  await locator.dispatchEvent("pointerdown", { pointerId: 1, pointerType: "touch", isPrimary: true, clientX: startX, clientY: y });
  await locator.dispatchEvent("pointerup", { pointerId: 1, pointerType: "touch", isPrimary: true, clientX: endX, clientY: y });
}

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
  await swipe(page.locator(".hero-image"));
  await expect(page.locator(".hero-image img.active")).not.toHaveAttribute("src", firstHeroImage);

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
  await swipe(page.locator(".gallery-main"));
  await expect(page.getByText("03 / 05")).toBeVisible();

  await expect(page.locator(".room-row")).toHaveCount(3);
  await expect(page.locator(".room-rate")).toHaveCount(3);
  for (const rate of await page.locator(".room-rate").all()) {
    await expect(rate).toContainText("USD 30");
  }
  expect(await page.locator(".rooms-section").evaluate((section) => section.getBoundingClientRect().height)).toBeLessThanOrEqual(1020);
  for (const room of await page.locator(".room-row").all()) {
    await expect(room.getByText("Private bathroom", { exact: true })).toBeVisible();
    await expect(room.getByText("Free Wi-Fi", { exact: true })).toBeVisible();
  }
  const standardRoomSlides = page.locator(".room-row").first().getByRole("region");
  await standardRoomSlides.getByRole("button", { name: /Next .* photo/ }).click();
  await expect(standardRoomSlides.locator("img")).toHaveAttribute("src", /standard-room\.jpg/);
  await swipe(standardRoomSlides);
  await expect(standardRoomSlides.locator("img")).toHaveAttribute("src", /private-bathroom\.jpg/);

  await page.locator('input[value="twin-kitchen"]').check({ force: true });
  await expect(page.locator('input[value="twin-kitchen"]')).toBeChecked();

  const arrival = await page.getByLabel("Arrival").inputValue();
  const departure = new Date(`${arrival}T00:00:00Z`);
  departure.setUTCDate(departure.getUTCDate() + 2);
  await page.getByLabel("Departure").fill(departure.toISOString().slice(0, 10));

  await page.getByRole("button", { name: "Check rate & availability" }).click();
  await expect(page.locator(".rate-result")).toContainText("USD 60");
  await expect(page.locator(".rate-result")).toContainText("2 nights × USD 30 per night");
  await expect(page.locator(".rate-result")).toContainText(/Send your dates on WhatsApp/);
  await expect(page.locator(".booking-stay-summary")).toContainText("Total: USD 60");
  await expect(page.locator(".booking-stay-summary")).not.toContainText("3:00 PM");
  await expect(page.locator(".booking-stay-summary")).not.toContainText("12:00 PM");

  const whatsapp = page.getByRole("link", { name: /Send request on WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me\/9779851356074/);
  await expect(whatsapp).toHaveAttribute("href", /room%20type/i);
  await expect(whatsapp).toHaveAttribute("href", /twin%20bed/i);
  await expect(whatsapp).toHaveAttribute("href", /3%3A00%20PM/);
  await expect(whatsapp).toHaveAttribute("href", /12%3A00%20PM/);
  await expect(whatsapp).not.toHaveAttribute("href", /USD%20|Total/i);
  await expect(whatsapp).not.toHaveAttribute("href", /pickup|transport/i);
  await expect(page.getByRole("link", { name: /Booking requests: \+977 985-1356074/ })).toHaveAttribute("href", "https://wa.me/9779851356074");
  await expect(page.getByRole("link", { name: /General enquiries: \+977 986-1814909/ })).toHaveAttribute("href", "https://wa.me/9779861814909");
  await expect(page.getByRole("link", { name: "holidayhomebhaktapur@gmail.com" })).toHaveAttribute("href", "mailto:holidayhomebhaktapur@gmail.com");
  await expect(page.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute("href", /wa\.me\/9779861814909/);
  await expect(page.getByText(/arranging airport|Need a ride|Request transport/i)).toHaveCount(0);
  expect(imageWarnings).toEqual([]);

  await page.screenshot({ path: "test-results/desktop-full.png", fullPage: true });
});

test("mobile navigation and booking layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect.poll(() => page.locator(".hero-image img").nth(2).evaluate((image) => getComputedStyle(image).objectPosition)).toBe("calc(50% + 20px) 50%");
  const menuButton = page.getByRole("button", { name: "Toggle menu" });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("nav.nav-open")).toBeVisible();
  await page.screenshot({ path: "test-results/mobile-menu-open.png" });
  await page.getByRole("link", { name: "Rooms", exact: true }).click();
  await expect(page.locator("#rooms")).toBeInViewport();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  for (const controls of await page.locator(".room-slide-controls, .gallery-controls").all()) {
    const box = await controls.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x + box.width).toBeLessThanOrEqual(390 - 14);
  }

  for (const room of await page.locator(".room-row").all()) {
    const rowBox = await room.boundingBox();
    const mediaBox = await room.locator(".room-media").boundingBox();
    const detailsBox = await room.locator(".room-details").boundingBox();
    expect(rowBox).not.toBeNull();
    expect(mediaBox).not.toBeNull();
    expect(detailsBox).not.toBeNull();
    expect(mediaBox.width).toBeCloseTo(detailsBox.width, 0);
    expect(mediaBox.x + mediaBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width);
  }

  const whatsappBox = await page.getByRole("link", { name: "Chat on WhatsApp" }).boundingBox();
  expect(whatsappBox).not.toBeNull();
  expect(844 - (whatsappBox.y + whatsappBox.height)).toBeGreaterThanOrEqual(80);
  await page.getByRole("combobox", { name: "Language", exact: true }).selectOption("de");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const readMore = page.locator(".room-read-more").first();
  if (await readMore.count()) {
    await expect(readMore).toHaveText("Mehr lesen");
    await readMore.click();
    await expect(readMore).toHaveAttribute("aria-expanded", "true");
    await expect(readMore).toHaveText("Weniger anzeigen");
  }
  await page.getByRole("combobox", { name: "Language", exact: true }).selectOption("en");
  await page.screenshot({ path: "test-results/mobile-full.png", fullPage: true });
});
