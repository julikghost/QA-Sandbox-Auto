import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../../playwright/.auth/auth-admin.json");
const apiUrl = process.env.API_URL ?? "http://localhost:8000/api";

setup("authenticate as admin", async ({ request, page }) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD missing in .env");
  }

  const response = await request.post(`${apiUrl}/auth/login`, {
    data: { email, password },
  });
  expect(response.ok()).toBeTruthy();

  const { access_token, refresh_token } = await response.json();

  await page.goto("/");
  await page.evaluate(
    ({ access_token, refresh_token }) => {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    },
    { access_token, refresh_token },
  );

  await page.context().storageState({ path: authFile });
});
