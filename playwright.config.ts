import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Local overrides first; CI / fresh clone falls back to committed .env.example
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });
dotenv.config({ path: path.resolve(__dirname, ".env.example"), quiet: true });

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const aliceAuthFile = path.join(__dirname, "playwright/.auth/auth-alice.json");

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    /* Sidebar visible only from lg breakpoint */
    viewport: { width: 1280, height: 720 },
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "auth-admin",
      testDir: "./e2e/setup",
      testMatch: /auth-admin\.setup\.ts/,
    },
    {
      name: "auth-alice",
      testDir: "./e2e/setup",
      testMatch: /auth-alice\.setup\.ts/,
    },
    {
      name: "chromium",
      testDir: "./e2e/tests",
      dependencies: ["auth-alice"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: aliceAuthFile,
      },
      testIgnore: /login\.spec|register\.spec/,
    },
    {
      name: "auth-ui",
      testDir: "./e2e/tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /login\.spec|register\.spec/,
    },
  ],
});
