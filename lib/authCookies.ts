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
  // Also deliberately NOT httpOnly - lets the account dropdown render
  // "Welcome back, X" without an extra client-side API round trip. Low
  // sensitivity (a first name that's already shown in the page once the
  // dropdown is open) stored the same way as the login flag above.
  firstName: "shopify_customer_first_name",
} as const;
