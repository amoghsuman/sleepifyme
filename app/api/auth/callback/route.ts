import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIES,
  CUSTOMER_ACCOUNT_CLIENT_ID,
  CUSTOMER_ACCOUNT_ENDPOINTS,
  getRedirectUri,
} from "@/lib/customerAuth";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  token_type?: string;
  scope?: string;
};

function loginRedirect(request: NextRequest, error: string) {
  const url = new URL("/", request.url);
  url.searchParams.set("login_error", error);
  const response = NextResponse.redirect(url);
  // Clear any half-finished PKCE state regardless of how we got here.
  response.cookies.delete(AUTH_COOKIES.verifier);
  response.cookies.delete(AUTH_COOKIES.state);
  response.cookies.delete(AUTH_COOKIES.nonce);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopifyError = searchParams.get("error");
  if (shopifyError) {
    return loginRedirect(request, shopifyError);
  }

  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");

  const storedState = request.cookies.get(AUTH_COOKIES.state)?.value;
  const verifier = request.cookies.get(AUTH_COOKIES.verifier)?.value;

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    return loginRedirect(request, "state_mismatch");
  }

  if (!verifier) {
    return loginRedirect(request, "missing_verifier");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CUSTOMER_ACCOUNT_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: verifier,
  });

  let tokenRes: Response;
  try {
    tokenRes = await fetch(CUSTOMER_ACCOUNT_ENDPOINTS.token, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (err) {
    console.error("Customer Account API token exchange request failed:", err);
    return loginRedirect(request, "token_request_failed");
  }

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text();
    console.error(
      `Customer Account API token exchange failed (${tokenRes.status}):`,
      errorBody
    );
    return loginRedirect(request, "token_exchange_failed");
  }

  const tokens: TokenResponse = await tokenRes.json();
  const expiresAt = Date.now() + tokens.expires_in * 1000;

  const response = NextResponse.redirect(new URL("/account", request.url));

  const secureCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set(AUTH_COOKIES.accessToken, tokens.access_token, {
    ...secureCookie,
    maxAge: tokens.expires_in,
  });
  response.cookies.set(AUTH_COOKIES.expiresAt, String(expiresAt), {
    ...secureCookie,
    maxAge: tokens.expires_in,
  });

  if (tokens.refresh_token) {
    response.cookies.set(AUTH_COOKIES.refreshToken, tokens.refresh_token, {
      ...secureCookie,
      maxAge: 60 * 60 * 24 * 30, // 30 days - Shopify doesn't publish a fixed lifetime
    });
  }

  if (tokens.id_token) {
    response.cookies.set(AUTH_COOKIES.idToken, tokens.id_token, {
      ...secureCookie,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // Non-httpOnly presence flag so client components can check login state
  // without touching the actual token.
  response.cookies.set(AUTH_COOKIES.loggedInFlag, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  response.cookies.delete(AUTH_COOKIES.verifier);
  response.cookies.delete(AUTH_COOKIES.state);
  response.cookies.delete(AUTH_COOKIES.nonce);

  return response;
}
