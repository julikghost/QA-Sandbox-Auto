import { test } from "@playwright/test";
import { FeedPage } from "../pages/FeedPage";
import { PostPage } from "../pages/PostPage";
import { ALICE_AUTH_FILE } from "../utils/api/auth";
import { buildCommentPayload } from "../testdata/comments";
import { createBobPost, deleteBobPost } from "../utils/api/posts";

test.use({ storageState: ALICE_AUTH_FILE });

test.describe("Like and comment via UI", () => {
  test.describe.configure({ mode: "serial" });

  let feedPage: FeedPage;
  let postPage: PostPage;
  let postId: string;

  test.beforeEach(async ({ page, request }) => {
    feedPage = new FeedPage(page);
    postPage = new PostPage(page);

    if (!postId) {
      postId = (await createBobPost(request)).id;
    }

    await feedPage.openPage();
    await feedPage.pageLoaded();
  });

  test.afterEach(async ({ request }, testInfo) => {
    if (!postId || testInfo.title !== "Comment on post") return;
    try {
      await deleteBobPost(request, postId);
    } catch {
      // cleanup must not fail the test
    }
  });

  test("Like post", async () => {
    await postPage.likePost(postId);
  });

  test("Comment on post", async () => {
    await postPage.commentOnPost({
      postId,
      text: buildCommentPayload().content,
    });
  });
});
