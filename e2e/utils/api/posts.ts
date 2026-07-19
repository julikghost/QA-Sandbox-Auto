import {
  type APIRequestContext,
  type Page,
  type Response,
} from "@playwright/test";
import { buildPostPayload, type PostPayload } from "../../testdata/posts";
import { getAliceAccessToken, login, requireAliceCredentials } from "./auth";
import { apiUrl } from "./client";

export type CreatedPost = {
  id: string;
  content: string;
};

/** POST /posts as alice. Uses storageState token; on 401 — re-login. */
export async function createAlicePost(
  request: APIRequestContext,
  overrides: Partial<PostPayload> = {},
): Promise<CreatedPost> {
  const data = buildPostPayload(overrides);

  try {
    return await createPost(request, data, getAliceAccessToken());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(" 401 ")) throw error;

    const { email, password } = requireAliceCredentials();
    const { access_token } = await login(request, email, password);
    return createPost(request, data, access_token);
  }
}

/** PATCH /posts/{id} as alice. Uses storageState token; on 401 — re-login. */
export async function updateAlicePost(
  request: APIRequestContext,
  postId: string,
  content: string,
): Promise<CreatedPost> {
  let accessToken = getAliceAccessToken();
  let response = await request.patch(`${apiUrl()}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: { content },
  });

  if (response.status() === 401) {
    const { email, password } = requireAliceCredentials();
    accessToken = (await login(request, email, password)).access_token;
    response = await request.patch(`${apiUrl()}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { content },
    });
  }

  if (response.status() !== 200) {
    throw new Error(
      `Expected PATCH /posts 200, got ${response.status()} ${await response.text()}`,
    );
  }
  const body = (await response.json()) as Partial<CreatedPost>;
  if (!body.id) {
    throw new Error("PATCH /posts response has no id");
  }
  return {
    id: body.id,
    content: body.content ?? content,
  };
}

/** DELETE /posts/{id} as alice (best-effort cleanup). */
export async function deleteAlicePost(
  request: APIRequestContext,
  postId: string,
): Promise<void> {
  let accessToken = getAliceAccessToken();
  let response = await request.delete(`${apiUrl()}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status() === 401) {
    const { email, password } = requireAliceCredentials();
    accessToken = (await login(request, email, password)).access_token;
    response = await request.delete(`${apiUrl()}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  if (response.status() !== 204 && response.status() !== 200) {
    throw new Error(
      `Expected DELETE /posts 204, got ${response.status()} ${await response.text()}`,
    );
  }
}

/** POST /posts → created post (expects 201). */
export async function createPost(
  request: APIRequestContext,
  data: PostPayload,
  accessToken: string,
): Promise<CreatedPost> {
  const response = await request.post(`${apiUrl()}/posts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    data,
  });
  if (response.status() !== 201) {
    throw new Error(
      `Expected POST /posts 201, got ${response.status()} ${await response.text()}`,
    );
  }
  const body = (await response.json()) as Partial<CreatedPost>;
  if (!body.id) {
    throw new Error("POST /posts response has no id");
  }
  return {
    id: body.id,
    content: body.content ?? data.content,
  };
}

/** Wait for POST /api/posts (create post). */
export function waitForPostCreate(page: Page): Promise<Response> {
  return page.waitForResponse((res) => {
    if (res.request().method() !== "POST") return false;
    const pathname = new URL(res.url()).pathname.replace(/\/$/, "");
    return pathname.endsWith("/api/posts");
  });
}

/** Get id from create post response (expects 201). */
export async function getCreatedPostId(response: Response): Promise<string> {
  if (response.status() !== 201) {
    throw new Error(`Expected POST /api/posts 201, got ${response.status()}`);
  }
  const body = (await response.json()) as { id?: string };
  if (!body.id) {
    throw new Error("POST /api/posts response has no id");
  }
  return body.id;
}
