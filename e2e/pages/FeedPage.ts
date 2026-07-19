import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Sidebar } from "../components/Sidebar";

/** Same shortening as frontend `tid()` for data-testid suffixes. */
function toTestId(id: string): string {
  if (!id.includes("-")) return id;
  const last = id.replace(/-/g, "").slice(-12);
  return last.replace(/^0+/, "") || "0";
}

export class FeedPage extends BasePage {
  readonly sidebar: Sidebar;
  readonly postComposer: Locator;
  readonly postComposerInput: Locator;
  readonly postComposerSubmit: Locator;
  readonly postContents: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = new Sidebar(page);
    this.postComposer = page.getByTestId("post-composer");
    this.postComposerInput = page.getByTestId("post-composer-input");
    this.postComposerSubmit = page.getByTestId("post-composer-submit");
    this.postContents = page.locator('[data-testid^="post-content-"]');
  }

  getPostCard(postId: string): Locator {
    return this.page.getByTestId(`post-card-${toTestId(postId)}`);
  }

  getPostByText(text: string): Locator {
    return this.postContents.filter({ hasText: text });
  }

  getPostCommentBtn(postId: string): Locator {
    return this.page.getByTestId(`post-comment-btn-${toTestId(postId)}`);
  }

  getPostLikeBtn(postId: string): Locator {
    return this.page.getByTestId(`post-like-btn-${toTestId(postId)}`);
  }

  getPostMenuBtn(postId: string): Locator {
    return this.page.getByTestId(`post-menu-btn-${toTestId(postId)}`);
  }

  getPostEditBtn(postId: string): Locator {
    return this.page.getByTestId(`post-edit-btn-${toTestId(postId)}`);
  }

  getPostDeleteBtn(postId: string): Locator {
    return this.page.getByTestId(`post-delete-btn-${toTestId(postId)}`);
  }

  getPostRepostBtn(postId: string): Locator {
    return this.page.getByTestId(`post-repost-btn-${toTestId(postId)}`);
  }

  async openPage(): Promise<void> {
    await this.open("/");
  }

  async pageLoaded() {
    await expect(this.postComposer).toBeVisible();
  }

  async sidebarLoaded() {
    await this.sidebar.expectVisible();
  }

  async createPost(text: string) {
    await this.postComposerInput.fill(text);
    await expect(this.postComposerSubmit).toBeEnabled();
    await this.postComposerSubmit.click();
    await expect(this.getPostByText(text)).toBeVisible({ timeout: 15_000 });
  }

  async openPost(postId: string) {
    await this.getPostCommentBtn(postId).click();
    await expect(this.page).toHaveURL(new RegExp(`/post/${postId}`));
  }

  /** "Edit" in the card menu only navigates to the post detail page. */
  async openPostViaEdit(postId: string) {
    await this.getPostMenuBtn(postId).click();
    await this.getPostEditBtn(postId).click();
    await expect(this.page).toHaveURL(new RegExp(`/post/${postId}`));
  }

  async likePost(postId: string) {
    await this.getPostLikeBtn(postId).click();
  }

  async deletePost(postId: string) {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.getPostMenuBtn(postId).click();
    await this.getPostDeleteBtn(postId).click();
    await expect(this.getPostCard(postId)).not.toBeVisible({ timeout: 15_000 });
  }

  async logout() {
    await this.sidebar.logout();
  }
}
