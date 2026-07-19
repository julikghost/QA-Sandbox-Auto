import { type Page, type Response } from "@playwright/test";

/** Ждёт ответ POST /api/posts (создание поста). */
export function waitForPostCreate(page: Page): Promise<Response> {
  return page.waitForResponse((res) => {
    if (res.request().method() !== "POST") return false;
    const pathname = new URL(res.url()).pathname.replace(/\/$/, "");
    return pathname.endsWith("/api/posts");
  });
}

/** Достаёт id из ответа create post (ожидает 201). */
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
