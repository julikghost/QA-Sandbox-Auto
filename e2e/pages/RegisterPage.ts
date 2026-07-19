import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage {
  readonly displayNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
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
    this.loginLink = page.locator('a[href="/login"]');
    this.langEn = page.getByTestId("lang-en");
    this.langRu = page.getByTestId("lang-ru");
  }

  async openPage(): Promise<void> {
    await this.open("/register");
  }

  async register(
    displayName: string,
    username: string,
    email: string,
    password: string,
  ) {
    await this.displayNameInput.fill(displayName);
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
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

  async errorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
