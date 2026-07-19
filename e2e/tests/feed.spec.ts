import { expect, test } from "@playwright/test";
import { FeedPage } from "../pages/FeedPage";
import { ALICE_AUTH_FILE } from "../utils/api/auth";
import { createAlicePost, deleteAlicePost } from "../utils/api/posts";

test.use({ storageState: ALICE_AUTH_FILE });

test.describe("feed", () => {
  let feedPage: FeedPage;
  let postId: string;
  let postContent: string;

  test.beforeEach(async ({ page, request }) => {
    const post = await createAlicePost(request);
    postId = post.id;
    postContent = post.content;

    feedPage = new FeedPage(page);
    await feedPage.openPage();
    await feedPage.pageLoaded();
  });

  test.afterEach(async ({ request }) => {
    if (!postId) return;
    try {
      await deleteAlicePost(request, postId);
    } catch {
      // cleanup must not fail the test
    }
  });

  test("Sidebar is visible", async () => {
    await feedPage.sidebarLoaded();
  });

  test("Post should be visible in feed", async () => {
    await expect(feedPage.getPostCard(postId)).toBeVisible();
    await expect(feedPage.getPostByText(postContent)).toBeVisible();
  });

});
