export type CommentPayload = {
  content: string;
};

/** unique comment for happy path */
export function buildCommentPayload(
  overrides: Partial<CommentPayload> = {},
): CommentPayload {
  return {
    content: `e2e comment ${Date.now()}`,
    ...overrides,
  };
}

/** unique reply text */
export function buildReplyPayload(
  overrides: Partial<CommentPayload> = {},
): CommentPayload {
  return {
    content: `e2e reply ${Date.now()}`,
    ...overrides,
  };
}
