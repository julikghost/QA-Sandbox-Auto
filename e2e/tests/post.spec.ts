import { expect, test } from "@playwright/test";
import { FeedPage } from "../pages/FeedPage";
import { PostPage } from "../pages/PostPage";
import { ALICE_AUTH_FILE } from "../utils/api/auth";
import { buildPostPayload } from "../testdata/posts";

test.use({ storageState: ALICE_AUTH_FILE });

test.describe("post via UI", () => {
  test.describe.configure({ mode: "serial" });

  let feedPage: FeedPage;
  let postPage: PostPage;
  let postId: string;
  let postContent: string;

  test.beforeEach(async ({ page }) => {
    feedPage = new FeedPage(page);
    postPage = new PostPage(page);
    await feedPage.openPage();
    await feedPage.pageLoaded();

    // one shared post for the whole serial suite
    if (!postId) {
      const { content } = buildPostPayload();
      postContent = content;
      postId = await feedPage.createPost(content);
    }
  });

  test("Create post", async () => {
    await expect(feedPage.getPostCard(postId)).toBeVisible();
    await expect(feedPage.getPostByText(postContent)).toBeVisible();
  });

  test.skip("Edit post via UI", async () => {
    await postPage.editPostUI(postId, buildPostPayload().content);
  });

  test("Edit post via API", async ({ request }) => {
    await postPage.editPostApi({ request, postId });
  });

  test("Delete post", async () => {
    await feedPage.deletePost(postId);
  });
});
