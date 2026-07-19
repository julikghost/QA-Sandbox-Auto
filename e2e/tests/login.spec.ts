import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { FeedPage } from "../pages/FeedPage";
import {
  requireAliceCredentials,
  requireFrankCredentials,
} from "../utils/api/auth";

test.describe("login via UI", () => {
  const alice = requireAliceCredentials();
  const frank = requireFrankCredentials();

  let loginPage: LoginPage;
  let feedPage: FeedPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    feedPage = new FeedPage(page);
    await loginPage.openPage();
    await loginPage.pageLoaded();
  });

  test("Login with valid credentials", async () => {
    await loginPage.login(alice.email, alice.password);
    await feedPage.pageLoaded();
    await feedPage.sidebarLoaded();
  });

  test("Login with invalid credentials", async () => {
    await loginPage.invalidPassword(alice.email);
  });

  test("Login with banned user", async () => {
    await loginPage.loginBannedUser(frank.email, frank.password);
  });
});
