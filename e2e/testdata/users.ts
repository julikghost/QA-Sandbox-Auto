export type RegisterPayload = {
  displayName: string;
  username: string;
  email: string;
  password: string;
};

/** unique user for happy-path registration */
export function buildRegisterPayload(
  overrides: Partial<RegisterPayload> = {},
): RegisterPayload {
  const id = Date.now();
  return {
    displayName: `E2E User ${id}`,
    username: `e2e_user_${id}`,
    email: `e2e_${id}@example.com`,
    password: `Pass${id}!`,
    ...overrides,
  };
}
