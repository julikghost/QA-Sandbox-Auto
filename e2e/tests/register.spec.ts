import { test } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { buildRegisterPayload } from "../testdata/users";
import { AUTH_ERRORS } from "../testdata/errors";

test.describe("register via UI", () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await registerPage.openPage();
  });

  test("Successful registration", async () => {
    const user = buildRegisterPayload();
    await registerPage.successfulRegistration(user);
    await loginPage.pageLoaded();
  });

  test("Duplicate registration shows error", async () => {
    const user = buildRegisterPayload();
    await registerPage.successfulRegistration(user);
    await registerPage.failedRegistration(user, AUTH_ERRORS.registerDuplicate);
  });

});
