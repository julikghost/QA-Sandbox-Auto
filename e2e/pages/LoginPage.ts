import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly authErrorMessage: Locator;
  readonly langEn: Locator;
  readonly langRu: Locator;
  readonly signupLink: Locator;
  readonly adminBtn: Locator;
  readonly aliceBtn: Locator;
  readonly bobBtn: Locator;
  readonly moderatorBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId("auth-email-input");
    this.passwordInput = page.getByTestId("auth-password-input");
    this.loginButton = page.getByTestId("auth-login-btn");
    this.authErrorMessage = page.getByTestId("auth-error-message");
    this.langEn = page.getByTestId("lang-en");
    this.langRu = page.getByTestId("lang-ru");
    this.signupLink = page.locator('a[href="/register"]');
    this.adminBtn = page.getByRole("button", { name: "Admin" });
    this.aliceBtn = page.getByRole("button", { name: "Alice" });
    this.bobBtn = page.getByRole("button", { name: "Bob" });
    this.moderatorBtn = page.getByRole("button", { name: "Moderator" });
  }

  async openPage(): Promise<void> {
    await this.page.goto("/login");
  }

  async pageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async validateErrorMessage(errorMessage: string) {
    await expect(this.authErrorMessage).toBeVisible();
    await expect(this.authErrorMessage).toContainText(errorMessage);
  }

  async selectLanguage(language: "en" | "ru") {
    if (language === "en") {
      await this.langEn.click();
    } else {
      await this.langRu.click();
    }
  }

  async quickLogin(user: "admin" | "alice" | "bob" | "moderator") {
    const buttons = {
      admin: this.adminBtn,
      alice: this.aliceBtn,
      bob: this.bobBtn,
      moderator: this.moderatorBtn,
    };
    await buttons[user].click();
    await this.loginButton.click();
  }

  async signup() {
    await this.signupLink.click();
  }

  async invalidPassword(email: string) {
    const password = `wrong-${crypto.randomUUID()}`;
    await this.login(email, password);
   await expect(this.authErrorMessage).toContainText("Invalid email or password");
  }
  
  async loginBannedUser(email: string, password: string) {
    await this.login(email, password);
    await this.validateErrorMessage("Account is deactivated");
  }
}

