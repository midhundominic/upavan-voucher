import { test, expect, type Page } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { TEST_EMAIL, TEST_PASSWORD } from "../playwright.config";
import AxeBuilder from "@axe-core/playwright";

const artifacts = path.join(process.cwd(), "test-results", "artifacts");

async function signIn(page: Page) {
  await page.goto("/");
  await page.getByLabel("Email address").fill(TEST_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Enter the designer" }).click();
  await expect(page.getByLabel("Couple Name", { exact: true })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

test.beforeAll(async () => {
  await mkdir(artifacts, { recursive: true });
});

test("sign-in protects the designer, validates credentials, and signs out", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /Voucher Designer/ })).toBeVisible();
  await page.screenshot({ path: path.join(artifacts, "login-desktop.png"), fullPage: true });
  await page.getByLabel("Email address").fill(TEST_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Enter the designer" }).click();
  await expect(page.locator(".login-error")).toContainText("email or password is incorrect");
  await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Enter the designer" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
  const cookie = (await context.cookies()).find((value) => value.name === "upavan-session");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  expect(await page.evaluate(() => document.cookie)).not.toContain("upavan-session");
  await page.reload();
  await expect(page.getByLabel("Couple Name", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

test("live names persist, both views work, and the original message uses edited names", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await signIn(page);
  await page.screenshot({ path: path.join(artifacts, "designer-desktop.png"), fullPage: true });
  await page.getByLabel("Couple Name", { exact: true }).fill("Devika and Arjun");
  await page.getByLabel("Sponsor / Regards Name", { exact: true }).fill("Meera and Ravi.");
  await expect(page.locator(".guest-banner")).toContainText("Devika and Arjun");
  await expect(page.locator(".sponsor-name")).toHaveText("Meera and Ravi.");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("upavan-voucher:v1")))
    .toContain("Devika and Arjun");
  await page.reload();
  await expect(page.getByLabel("Couple Name", { exact: true })).toHaveValue("Devika and Arjun");
  await expect(page.getByLabel("Sponsor / Regards Name", { exact: true })).toHaveValue(
    "Meera and Ravi.",
  );
  await page.getByRole("switch", { name: "Include original invitation message" }).click();
  await expect(page.locator(".voucher-invitation")).toContainText("Dear Devika and Arjun,");
  await page.getByRole("tab", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("article", { name: "Back of complimentary stay voucher" }),
  ).toBeInViewport();
  await page.screenshot({ path: path.join(artifacts, "designer-back.png"), fullPage: true });
  await page.getByRole("tab", { name: "Show Both" }).click();
  await expect(page.locator('.voucher-sheet[data-hidden="false"]')).toHaveCount(2);
  await expect(page.getByText("Delicious Cuisine", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("uploads validate, the original seal remains uncropped, and reset confirms before clearing", async ({
  page,
}) => {
  await signIn(page);
  await page.locator("#asset-mainRoomImage").setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.locator(".upload-error")).toContainText("Choose a PNG, JPG, JPEG, or WEBP");
  await page.locator("#asset-mainRoomImage").setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("invalid PNG contents"),
  });
  await expect(page.locator(".upload-error")).toContainText("could not be opened");
  await page.locator("#asset-mainRoomImage").setInputFiles({
    name: "oversized.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(16 * 1024 * 1024),
  });
  await expect(page.locator(".upload-error")).toContainText("under 15 MB");
  const bytes = Array.from(await readFile("public/assets/upavan-logo.png"));
  const transfer = await page.evaluateHandle((bytes) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(bytes)], "room.png", { type: "image/png" }));
    return transfer;
  }, bytes);
  await page
    .locator(".asset-upload")
    .filter({ has: page.locator("#asset-mainRoomImage") })
    .dispatchEvent("drop", { dataTransfer: transfer });
  await expect(page.locator(".front-photo img")).toHaveAttribute("src", /^blob:/);
  await expect(page.locator(".upload-error")).toHaveCount(0);
  await transfer.dispose();
  await page.locator("#asset-seal").setInputFiles("public/assets/upavan-logo.png");
  const seal = page.getByAltText("Upavan Resort official seal");
  await expect(seal).toHaveAttribute("src", /^blob:/);
  await expect(seal).toHaveCSS("object-fit", "contain");
  await page.getByRole("button", { name: "Remove Resort Seal", exact: true }).click();
  await expect(seal).toHaveCount(0);
  await page.getByLabel("Couple Name", { exact: true }).fill("A changed couple");
  await page.getByRole("button", { name: "Reset Voucher", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByLabel("Couple Name", { exact: true })).toHaveValue("A changed couple");
  await page.getByRole("button", { name: "Reset Voucher", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset Voucher", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByLabel("Couple Name", { exact: true })).toHaveValue(
    "Anupama and Soorya Prakash",
  );
  await expect(page.locator(".front-photo img")).toHaveAttribute("src", "/assets/room-main.jpg");
  await page.reload();
  await expect(page.getByLabel("Couple Name", { exact: true })).toHaveValue(
    "Anupama and Soorya Prakash",
  );
});

test("PNG exports are 1800 × 1200, and PDF and print contain both voucher sides", async ({
  page,
}) => {
  await signIn(page);
  const preview = await page.locator(".voucher-front").screenshot({ scale: "css" });
  for (const side of ["Front", "Back"]) {
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: `Download ${side} PNG`, exact: true }).click();
    const download = await downloadEvent;
    const destination = path.join(artifacts, `${side.toLowerCase()}.png`);
    await download.saveAs(destination);
    const png = await readFile(destination);
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1800);
    expect(png.readUInt32BE(20)).toBe(1200);
    expect(png.length).toBeGreaterThan(100000);
    if (side === "Front") {
      // Catch missing embedded fonts or heading reflow, not only file dimensions.
      const difference = await page.evaluate(
        async ({ original, exported }) => {
          async function pixels(source: string) {
            const image = new Image();
            image.src = `data:image/png;base64,${source}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = 900;
            canvas.height = 600;
            const context = canvas.getContext("2d")!;
            context.drawImage(image, 0, 0, 900, 600);
            return context.getImageData(56, 164, 420, 150).data;
          }
          const [a, b] = await Promise.all([pixels(original), pixels(exported)]);
          let difference = 0;
          for (let i = 0; i < a.length; i++) difference += Math.abs(a[i] - b[i]);
          return difference / a.length;
        },
        { original: preview.toString("base64"), exported: png.toString("base64") },
      );
      expect(difference, "Exported heading should visually match the live preview").toBeLessThan(4);
    }
  }
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Both as PDF", exact: true }).click();
  const download = await downloadEvent;
  const destination = path.join(artifacts, "voucher.pdf");
  await download.saveAs(destination);
  const pdf = (await readFile(destination)).toString("latin1");
  expect(pdf.startsWith("%PDF-")).toBe(true);
  expect(pdf.match(/\/Type \/Page\b/g)).toHaveLength(2);
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = "true";
    };
  });
  await page.getByRole("button", { name: "Print Voucher", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-called", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".controls-panel")).toBeHidden();
  await expect(page.locator(".export-toolbar")).toBeHidden();
  for (const sheet of await page.locator(".voucher-sheet").all())
    await expect(sheet).toHaveCSS("position", "static");
  await page.pdf({
    path: path.join(artifacts, "print.pdf"),
    preferCSSPageSize: true,
    printBackground: true,
  });
  const printPdf = (await readFile(path.join(artifacts, "print.pdf"))).toString("latin1");
  expect(printPdf.match(/\/Type \/Page\b/g)).toHaveLength(2);
});

test("mobile layout has controls first, no horizontal overflow, and constant card proportions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Email address").fill("");
  await page.screenshot({ path: path.join(artifacts, "login-mobile.png"), fullPage: true });
  await signIn(page);
  await page.getByRole("tab", { name: "Show Both" }).click();
  const controls = await page.locator(".controls-panel").boundingBox();
  const preview = await page.locator(".preview-panel").boundingBox();
  expect(controls!.y + controls!.height).toBeLessThan(preview!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const card of await page.locator(".voucher-card").all()) {
    const bounds = await card.boundingBox();
    expect(bounds!.width / bounds!.height).toBeCloseTo(1.5, 2);
  }
  await page.screenshot({ path: path.join(artifacts, "designer-mobile.png"), fullPage: true });
});

test("tampered sessions are rejected and damaged browser storage recovers safely", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "upavan-session", value: "invalid.token.signature", domain: "127.0.0.1", path: "/" },
  ]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await page.evaluate(() => localStorage.setItem("upavan-voucher:v1", "{corrupt"));
  await signIn(page);
  await expect(page.getByLabel("Couple Name", { exact: true })).toHaveValue(
    "Anupama and Soorya Prakash",
  );
  await page.getByLabel("Couple Name", { exact: true }).fill(" ");
  await page.getByRole("button", { name: "Download Front PNG", exact: true }).click();
  await expect(page.locator(".toast-error")).toContainText(
    "Add both the couple name and sponsor name",
  );
});

test("long names stay within the voucher and the interface passes accessibility checks", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  await signIn(page);
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  await page.getByLabel("Couple Name", { exact: true }).fill("W".repeat(80));
  await page.getByLabel("Sponsor / Regards Name", { exact: true }).fill("W".repeat(80));
  await page.getByRole("switch", { name: "Include original invitation message" }).click();
  for (const selector of [".guest-name", ".sponsor-name", ".invitation-dear"]) {
    const fits = await page
      .locator(selector)
      .evaluate(
        (node) =>
          node.scrollHeight <= node.clientHeight + 1 && node.scrollWidth <= node.clientWidth + 1,
      );
    expect(fits, `${selector} should fit without clipping`).toBe(true);
  }
  const condition = await page.locator(".weekday-condition").boundingBox();
  const footer = await page.locator(".front-regards").boundingBox();
  expect(condition!.y + condition!.height).toBeLessThanOrEqual(footer!.y);
  const sponsor = await page.locator(".sponsor-name").boundingBox();
  expect(sponsor!.y + sponsor!.height).toBeLessThan(footer!.y + footer!.height - 16);
  await page.getByRole("tab", { name: "Front", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Back", exact: true })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Back", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
