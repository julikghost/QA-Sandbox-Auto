import { expect, type Locator, type Page } from "@playwright/test";

export type NavItem =
  | "logo"
  | "feed"
  | "explore"
  | "search"
  | "messages"
  | "notifications"
  | "bookmarks"
  | "profile"
  | "settings"
  | "admin"
  | "docs";

export class Sidebar {
  readonly page: Page;
  readonly logo: Locator;
  readonly feed: Locator;
  readonly explore: Locator;
  readonly search: Locator;
  readonly messages: Locator;
  readonly notifications: Locator;
  readonly bookmarks: Locator;
  readonly profile: Locator;
  readonly settings: Locator;
  readonly admin: Locator;
  readonly docs: Locator;
  readonly langEn: Locator;
  readonly langRu: Locator;
  readonly logoutBtn: Locator;
  readonly messagesBadge: Locator;
  readonly notificationsBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId("nav-logo");
    this.feed = page.getByTestId("nav-feed");
    this.explore = page.getByTestId("nav-explore");
    this.search = page.getByTestId("nav-search");
    this.messages = page.getByTestId("nav-messages");
    this.notifications = page.getByTestId("nav-notifications");
    this.bookmarks = page.getByTestId("nav-bookmarks");
    this.profile = page.getByTestId("nav-profile");
    this.settings = page.getByTestId("nav-settings");
    this.admin = page.getByTestId("nav-admin");
    this.docs = page.getByTestId("nav-docs");
    this.langEn = page.getByTestId("lang-en");
    this.langRu = page.getByTestId("lang-ru");
    this.logoutBtn = page.getByTestId("auth-logout-btn");
    this.messagesBadge = page.getByTestId("nav-messages-badge");
    this.notificationsBadge = page.getByTestId("nav-notifications-badge");
  }

  private navMap(): Record<NavItem, Locator> {
    return {
      logo: this.logo,
      feed: this.feed,
      explore: this.explore,
      search: this.search,
      messages: this.messages,
      notifications: this.notifications,
      bookmarks: this.bookmarks,
      profile: this.profile,
      settings: this.settings,
      admin: this.admin,
      docs: this.docs,
    };
  }

  async expectVisible(): Promise<void> {
    await expect(this.feed).toBeVisible();
    await expect(this.logoutBtn).toBeVisible();
  }

  async goTo(item: NavItem): Promise<void> {
    await this.navMap()[item].click();
  }

  async logout(): Promise<void> {
    await this.logoutBtn.click();
  }

  async selectLanguage(language: "en" | "ru"): Promise<void> {
    if (language === "en") {
      await this.langEn.click();
    } else {
      await this.langRu.click();
    }
  }
}
