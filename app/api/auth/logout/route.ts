import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIES,
  CUSTOMER_ACCOUNT_ENDPOINTS,
  getSiteUrl,
} from "@/lib/customerAuth";

export async function GET(request: NextRequest) {
  const idToken = request.cookies.get(AUTH_COOKIES.idToken)?.value;

  // Shopify's logout endpoint requires id_token_hint and 400s without it.
  // If we never had a session (no id_token to hint with), there's nothing
  // for Shopify to log out server-side anyway - just clear our cookies and
  // send the visitor home directly rather than bouncing through an
  // endpoint that will only error.
  let redirectTarget: URL;
  if (idToken) {
    redirectTarget = new URL(CUSTOMER_ACCOUNT_ENDPOINTS.logout);
    redirectTarget.searchParams.set("post_logout_redirect_uri", getSiteUrl());
    redirectTarget.searchParams.set("id_token_hint", idToken);
  } else {
    redirectTarget = new URL(getSiteUrl());
  }

  const response = NextResponse.redirect(redirectTarget);

  for (const cookieName of Object.values(AUTH_COOKIES)) {
    response.cookies.delete(cookieName);
  }

  return response;
}
