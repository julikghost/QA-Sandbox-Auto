import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Sidebar } from "../components/Sidebar";

/** Same shortening as frontend `tid()` for data-testid suffixes. */
function toTestId(id: string): string {
  if (!id.includes("-")) return id;
  const last = id.replace(/-/g, "").slice(-12);
  return last.replace(/^0+/, "") || "0";
}

export class PostPage extends BasePage {
  readonly sidebar: Sidebar;
  readonly commentInput: Locator;
  readonly commentSubmit: Locator;
  readonly repostBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = new Sidebar(page);
    this.commentInput = page.getByTestId("comment-input");
    this.commentSubmit = page.getByTestId("comment-submit-btn");
    this.repostBtn = page.getByTestId("repost-btn");
  }

  async openPage(postId: string): Promise<void> {
    await this.open(`/post/${postId}`);
  }

  async pageLoaded() {
    await expect(this.commentInput).toBeVisible();
    await expect(this.commentSubmit).toBeVisible();
  }

  getPostCard(postId: string): Locator {
    return this.page.getByTestId(`post-card-${toTestId(postId)}`);
  }

  getPostLikeBtn(postId: string): Locator {
    return this.page.getByTestId(`post-like-btn-${toTestId(postId)}`);
  }

  getPostLikesCount(postId: string): Locator {
    return this.page.getByTestId(`post-likes-count-${toTestId(postId)}`);
  }

  getPostBookmarkBtn(postId: string): Locator {
    return this.page.getByTestId(`post-bookmark-btn-${toTestId(postId)}`);
  }

  getComment(commentId: string): Locator {
    return this.page.getByTestId(`comment-${toTestId(commentId)}`);
  }

  getCommentByText(text: string): Locator {
    return this.page.locator('[data-testid^="comment-"]', { hasText: text });
  }

  getCommentLikeBtn(commentId: string): Locator {
    return this.page.getByTestId(`comment-like-btn-${toTestId(commentId)}`);
  }

  getCommentReplyBtn(commentId: string): Locator {
    return this.page.getByTestId(`comment-reply-btn-${toTestId(commentId)}`);
  }

  async addComment(text: string) {
    await this.commentInput.fill(text);
    await expect(this.commentSubmit).toBeEnabled();
    await this.commentSubmit.click();
    await expect(this.getCommentByText(text)).toBeVisible({ timeout: 15_000 });
  }

  async replyToComment(commentId: string, text: string) {
    await this.getCommentReplyBtn(commentId).click();
    await this.commentInput.fill(text);
    await expect(this.commentSubmit).toBeEnabled();
    await this.commentSubmit.click();
    await expect(this.getCommentByText(text)).toBeVisible({ timeout: 15_000 });
  }

  async likePost(postId: string) {
    const likeBtn = this.getPostLikeBtn(postId);
    const likesCount = this.getPostLikesCount(postId);
    const likeCount = Number((await likesCount.innerText()).trim());

    await likeBtn.click();

    await expect(likesCount).toHaveText(String(likeCount + 1));
    await expect(likeBtn).toHaveClass(/text-red-500/);
    await expect(likeBtn.locator("svg")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  }

  async likeComment(commentId: string) {
    const likeBtn = this.getCommentLikeBtn(commentId);
    const likeCount = Number((await likeBtn.innerText()).trim());

    await likeBtn.click();

    await expect(likeBtn).toHaveText(String(likeCount + 1));
    await expect(likeBtn).toHaveClass(/text-red-500/);
    await expect(likeBtn.locator("svg")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  }

  async bookmarkPost(postId: string) {
    const bookmarkBtn = this.getPostBookmarkBtn(postId);
    await bookmarkBtn.click();
    await expect(bookmarkBtn).toHaveClass(/text-brand-600/);
    await expect(bookmarkBtn.locator("svg")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  }

  async repostPost(_postId: string) {
    const repostBtn = this.repostBtn;
    await repostBtn.click();
    await expect(repostBtn).toHaveClass(/text-brand-600/);
    await expect(repostBtn.locator("svg")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  }
}
