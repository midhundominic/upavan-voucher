import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Test credentials are isolated to the test server, never application defaults.
export const TEST_EMAIL = "designer@example.test";
// Exercise the minimum supported length with an exactly eight-character password.
export const TEST_PASSWORD = "E2eOnly!";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    ...devices["Desktop Chrome"],
    channel: existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined,
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 1440, height: 1100 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      process.env.E2E_PRODUCTION === "1"
        ? "npm run start -- --hostname 127.0.0.1 --port 3100"
        : "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/login",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      AUTH_EMAIL: TEST_EMAIL,
      AUTH_PASSWORD: TEST_PASSWORD,
      AUTH_SECRET: "test-only-signing-secret-for-upavan-e2e-at-least-32-characters",
    },
  },
});
