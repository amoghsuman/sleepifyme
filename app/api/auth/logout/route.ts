import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIES,
  CUSTOMER_ACCOUNT_CLIENT_ID,
  CUSTOMER_ACCOUNT_ENDPOINTS,
  getSiteUrl,
} from "@/lib/customerAuth";

function redact(token: string): string {
  return `${token.slice(0, 8)}…${token.slice(-4)} (${token.length} chars)`;
}

/**
 * Decodes (does NOT verify) an id_token's payload purely for diagnostic
 * logging - lets us confirm the aud/exp claims look sane without ever
 * logging the token itself or any PII (email, sub) it might carry.
 */
function decodeIdTokenClaims(idToken: string): { aud?: unknown; exp?: unknown; iss?: unknown } | null {
  try {
    const payload = idToken.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json);
    return { aud: claims.aud, exp: claims.exp, iss: claims.iss };
  } catch {
    return null;
  }
}

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

    const claims = decodeIdTokenClaims(idToken);
    const claimsSummary = claims
      ? `aud=${claims.aud} iss=${claims.iss} exp=${claims.exp} (${
          typeof claims.exp === "number" && Date.now() >= claims.exp * 1000
            ? "EXPIRED"
            : "not expired"
        }) expectedAud=${CUSTOMER_ACCOUNT_CLIENT_ID} audMatches=${
          claims.aud === CUSTOMER_ACCOUNT_CLIENT_ID
        }`
      : "could not decode id_token payload";

    console.log(
      `[auth/logout] id_token_hint=${redact(idToken)} | ${claimsSummary}`
    );
    console.log(
      `[auth/logout] constructed logout URL: ${redirectTarget.toString().replace(idToken, redact(idToken))}`
    );
  } else {
    redirectTarget = new URL(getSiteUrl());
    console.log(
      "[auth/logout] no id_token cookie present - skipping Shopify's logout endpoint, redirecting home directly"
    );
  }

  const response = NextResponse.redirect(redirectTarget);

  for (const cookieName of Object.values(AUTH_COOKIES)) {
    response.cookies.delete(cookieName);
  }

  return response;
}
