import { expect, test } from "@playwright/test";

const username = process.env.CMS_TEST_USERNAME || "hhbedit";
const password = process.env.CMS_TEST_PASSWORD;
const originalHeroTitle = "Welcome to Holiday Home Bhaktapur.";

async function signIn(page) {
  if (!password) throw new Error("Set CMS_TEST_PASSWORD before running CMS tests.");
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function editHeroTitle(page, value) {
  await page.getByRole("button", { name: "Edit hero text" }).click();
  await expect(page.getByRole("heading", { name: "Edit hero section" })).toBeVisible();
  await page.getByLabel("Heading").fill(value);
  await page.getByRole("button", { name: "Apply changes" }).click();
  await expect(page.locator(".cms-editor-canvas h1")).toContainText(value.replace(/\.$/, ""));
}

test.describe.serial("visual CMS", () => {
  test("protects the editor and publishes only after confirmation", async ({ browser, page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await signIn(page);

    const sessionCookie = (await page.context().cookies()).find((cookie) => cookie.name === "hhb-cms-session");
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe("Lax");
    await expect(page.locator(".cms-pencil-button")).toHaveCount(19);
    await expect(page.getByRole("button", { name: "Edit hero text" })).toBeVisible();
    const draftTitle = `CMS draft check ${Date.now()}`;
    await editHeroTitle(page, draftTitle);

    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByText("Draft saved. The live website has not changed.")).toBeVisible();

    const publicContext = await browser.newContext();
    const publicPage = await publicContext.newPage();
    await publicPage.goto("/");
    await expect(publicPage.locator(".cms-pencil-button, .cms-editor-toolbar")).toHaveCount(0);
    await expect(publicPage.locator("h1")).toContainText("Holiday Home Bhaktapur");
    await expect(publicPage.locator("h1")).not.toContainText(draftTitle);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Published successfully. Visitors can now see these changes.")).toBeVisible();
    await publicPage.reload();
    await expect(publicPage.locator("h1")).toContainText(draftTitle);

    await editHeroTitle(page, originalHeroTitle);
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Published successfully. Visitors can now see these changes.")).toBeVisible();
    await publicPage.reload();
    await expect(publicPage.locator("h1")).toContainText("Holiday Home Bhaktapur");
    await publicContext.close();
  });

  test("keeps editor controls inside a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);
    await page.getByRole("button", { name: "Edit hero text" }).click();
    await expect(page.getByRole("heading", { name: "Edit hero section" })).toBeVisible();

    const geometry = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      panel: document.querySelector(".cms-editor-panel")?.getBoundingClientRect(),
      visiblePencils: [...document.querySelectorAll(".cms-pencil-button")].filter((button) => {
        const rect = button.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      }).map((button) => button.getBoundingClientRect()),
    }));

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.panel.x).toBeGreaterThanOrEqual(0);
    expect(geometry.panel.right).toBeLessThanOrEqual(geometry.viewport);
    for (const rect of geometry.visiblePencils) {
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.right).toBeLessThanOrEqual(geometry.viewport);
    }
  });

  test("adds and removes room features in the visual editor", async ({ page }) => {
    await signIn(page);
    await page.getByRole("button", { name: "Edit private room details" }).click();
    await expect(page.getByRole("heading", { name: "Edit private room" })).toBeVisible();

    const featureInputs = page.locator(".cms-panel-list-items input");
    const initialCount = await featureInputs.count();
    await page.getByRole("button", { name: "Add feature" }).click();
    await expect(featureInputs).toHaveCount(initialCount + 1);
    await featureInputs.last().fill("Desk lamp");
    await page.getByRole("button", { name: `Remove Feature ${initialCount + 1}` }).click();
    await expect(featureInputs).toHaveCount(initialCount);
    await page.getByRole("button", { name: "Cancel" }).click();
  });

  test("uploads photos and exposes restorable publish history", async ({ page }) => {
    await signIn(page);
    await page.getByRole("button", { name: "Edit hero photos" }).click();
    const imageItems = page.locator(".cms-image-item");
    const initialCount = await imageItems.count();
    await page.locator(".cms-file-input").setInputFiles("public/images/logo.png");
    await expect(imageItems).toHaveCount(initialCount + 1);
    await page.getByRole("button", { name: "Cancel" }).click();

    await page.getByRole("button", { name: "History" }).click();
    await expect(page.getByText("Published version").first()).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Restore as draft" }).first().click();
    await expect(page.getByText("Revision restored as a draft. Review it before publishing.")).toBeVisible();
  });
});
