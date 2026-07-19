import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { RegisterPayload } from "../testdata/users";

export class RegisterPage extends BasePage {
  readonly displayNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly authErrorMessage: Locator;
  readonly loginLink: Locator;
  readonly langEn: Locator;
  readonly langRu: Locator;

  constructor(page: Page) {
    super(page);

    this.displayNameInput = page.getByTestId("auth-display-name-input");
    this.usernameInput = page.getByTestId("auth-username-input");
    this.emailInput = page.getByTestId("auth-email-input");
    this.passwordInput = page.getByTestId("auth-password-input");
    this.registerButton = page.getByTestId("auth-register-btn");
    this.authErrorMessage = page.getByTestId("auth-error-message");
    this.loginLink = page.locator('a[href="/login"]');
    this.langEn = page.getByTestId("lang-en");
    this.langRu = page.getByTestId("lang-ru");
  }

  async openPage(): Promise<void> {
    await this.open("/register");
  }

  async register(user: RegisterPayload) {
    await this.displayNameInput.fill(user.displayName);
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.registerButton.click();
  }

  async successfulRegistration(user: RegisterPayload) {
    await this.register(user);
    await expect(this.page).toHaveURL(/\/login/);
  }

  async failedRegistration(user: RegisterPayload, message: string) {
    await this.openPage();
    await this.register(user);
    await expect(this.authErrorMessage).toBeVisible();
    await expect(this.authErrorMessage).toContainText(message);
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async selectLanguage(language: "en" | "ru") {
    if (language === "en") {
      await this.langEn.click();
    } else {
      await this.langRu.click();
    }
  }
}
