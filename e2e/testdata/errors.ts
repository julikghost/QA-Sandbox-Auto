/** UI / API auth error texts shown in auth-error-message */
export const AUTH_ERRORS = {
  invalidCredentials: "Invalid email or password",
  accountDeactivated: "Account is deactivated",
  loginFailed: "Login failed",
  registerDuplicate: "User with this email or username already exists",
  registrationFailed: "Registration failed",
} as const;

export type AuthError = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS];
