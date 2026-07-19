import { test } from "@playwright/test";
import { FeedPage } from "../pages/FeedPage";
import { PostPage } from "../pages/PostPage";
import { ALICE_AUTH_FILE } from "../utils/api/auth";
import { buildPostPayload } from "../testdata/posts";

test.use({ storageState: ALICE_AUTH_FILE });

test.describe("post via UI", () => {
  let feedPage: FeedPage;
  let postPage: PostPage;
  let postId: string;

  test.beforeEach(async ({ page }) => {
    feedPage = new FeedPage(page);
    postPage = new PostPage(page);
    await feedPage.openPage();
    await feedPage.pageLoaded();
  });

  test("Create post", async () => {
    const { content } = buildPostPayload();
    postId = await feedPage.createPost(content);
  });

  test.fail("Edit post via UI", async () => {
    const { content } = buildPostPayload();
    postId = await feedPage.createPost(content);
    await postPage.editPostUI(postId, content);
  });

  test("Edit post via API", async ({ request }) => {
    const { content } = buildPostPayload();
    postId = await feedPage.createPost(content);
    await postPage.editPostApi({ request, postId });
  });

  test("Delete post", async () => {
    const { content } = buildPostPayload();
    postId = await feedPage.createPost(content);
    await feedPage.deletePost(postId);
  });
});
