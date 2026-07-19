export type PostPayload = {
  content: string;
  image_url?: string;
  visibility?: string;
};

/** unique post for happy path */
export function buildPostPayload(
  overrides: Partial<PostPayload> = {},
): PostPayload {
  return {
    content: `e2e post ${Date.now()}`,
    ...overrides,
  };
}

/** fixed cases if needed in multiple tests */
export const postPayloads = {
  short: { content: "e2e short post" },
  edited: { content: "e2e edited post" },
  xss: { content: `<script>alert("xss")</script>` },
} as const;
