import { NextResponse } from "next/server";
import {
  AUTH_COOKIES,
  CUSTOMER_ACCOUNT_CLIENT_ID,
  CUSTOMER_ACCOUNT_ENDPOINTS,
  CUSTOMER_ACCOUNT_SCOPE,
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
  getRedirectUri,
} from "@/lib/customerAuth";

const PKCE_COOKIE_MAX_AGE = 600; // 10 minutes - just long enough to complete Shopify's hosted login

export async function GET() {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();
  const nonce = generateNonce();

  const authorizeUrl = new URL(CUSTOMER_ACCOUNT_ENDPOINTS.authorization);
  authorizeUrl.searchParams.set("client_id", CUSTOMER_ACCOUNT_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", getRedirectUri());
  authorizeUrl.searchParams.set("scope", CUSTOMER_ACCOUNT_SCOPE);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("nonce", nonce);

  const response = NextResponse.redirect(authorizeUrl);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: PKCE_COOKIE_MAX_AGE,
  };

  response.cookies.set(AUTH_COOKIES.verifier, verifier, cookieOptions);
  response.cookies.set(AUTH_COOKIES.state, state, cookieOptions);
  response.cookies.set(AUTH_COOKIES.nonce, nonce, cookieOptions);

  return response;
}
