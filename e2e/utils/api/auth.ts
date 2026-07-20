import fs from "fs";
import path from "path";
import type { APIRequestContext } from "@playwright/test";
import { apiUrl } from "./client";

/** Path to alice storageState (setup + test.use). */
export const ALICE_AUTH_FILE = path.join(
  __dirname,
  "../../../playwright/.auth/auth-alice.json",
);

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

type StorageState = {
  origins?: Array<{
    localStorage?: Array<{ name: string; value: string }>;
  }>;
};

/** Credentials from .env: ALICE_EMAIL / ALICE_PASSWORD (setup / API login). */
export function requireAliceCredentials(): UserCredentials {
  const email = process.env.ALICE_EMAIL;
  const password = process.env.ALICE_PASSWORD;
  if (!email || !password) {
    throw new Error("ALICE_EMAIL / ALICE_PASSWORD missing in .env");
  }
  return { email, password };
}

/** Username from .env: ALICE_USERNAME (UI author checks). */
export function requireAliceUsername(): string {
  const username = process.env.ALICE_USERNAME;
  if (!username) {
    throw new Error("ALICE_USERNAME missing in .env");
  }
  return username;
}

/** Credentials from .env: BOB_EMAIL / BOB_PASSWORD. */
export function requireBobCredentials(): UserCredentials {
  const email = process.env.BOB_EMAIL;
  const password = process.env.BOB_PASSWORD;
  if (!email || !password) {
    throw new Error("BOB_EMAIL / BOB_PASSWORD missing in .env");
  }
  return { email, password };
}

/** Credentials from .env: FRANK_EMAIL / FRANK_PASSWORD (banned user UI login). */
export function requireFrankCredentials(): UserCredentials {
  const email = process.env.FRANK_EMAIL;
  const password = process.env.FRANK_PASSWORD;
  if (!email || !password) {
    throw new Error("FRANK_EMAIL / FRANK_PASSWORD missing in .env");
  }
  return { email, password };
}

/** access_token from alice storageState (no re-login). */
export function getAliceAccessToken(
  authFile: string = ALICE_AUTH_FILE,
): string {
  if (!fs.existsSync(authFile)) {
    throw new Error(
      `Alice storageState not found: ${authFile}. Run auth-alice setup first.`,
    );
  }
  const state = JSON.parse(fs.readFileSync(authFile, "utf8")) as StorageState;
  const token = state.origins
    ?.flatMap((origin) => origin.localStorage ?? [])
    .find((item) => item.name === "access_token")?.value;
  if (!token) {
    throw new Error(`access_token missing in storageState: ${authFile}`);
  }
  return token;
}

/** POST /auth/login → tokens. */
export async function login(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<AuthTokens> {
  const response = await request.post(`${apiUrl()}/auth/login`, {
    data: { email, password },
  });
  if (!response.ok()) {
    throw new Error(
      `Login failed: ${response.status()} ${await response.text()}`,
    );
  }
  const body = (await response.json()) as Partial<AuthTokens>;
  if (!body.access_token || !body.refresh_token) {
    throw new Error("Login response missing access_token / refresh_token");
  }
  return {
    access_token: body.access_token,
    refresh_token: body.refresh_token,
  };
}
