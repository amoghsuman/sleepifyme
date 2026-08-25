// Cookie name constants only - no server-only imports here, so this is
// safe to import from both client and server components.
export const AUTH_COOKIES = {
  verifier: "shopify_auth_verifier",
  state: "shopify_auth_state",
  nonce: "shopify_auth_nonce",
  accessToken: "shopify_customer_access_token",
  refreshToken: "shopify_customer_refresh_token",
  idToken: "shopify_customer_id_token",
  expiresAt: "shopify_customer_expires_at",
  // Deliberately NOT httpOnly - a presence flag only, so client components
  // (e.g. Nav) can tell whether a session exists without exposing the token.
  loggedInFlag: "shopify_customer_logged_in",
} as const;
