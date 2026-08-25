import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/lib/authCookies";

export { AUTH_COOKIES };

const SHOP_ID = "100338958699";

export const CUSTOMER_ACCOUNT_ENDPOINTS = {
  authorization: `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`,
  token: `https://shopify.com/authentication/${SHOP_ID}/oauth/token`,
  logout: `https://shopify.com/authentication/${SHOP_ID}/logout`,
  // Confirmed via this store's live https://sleepifyme.myshopify.com/.well-known/customer-account-api
  graphql: `https://shopify.com/${SHOP_ID}/account/customer/api/2026-07/graphql`,
} as const;

export const CUSTOMER_ACCOUNT_CLIENT_ID =
  process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "";

export const CUSTOMER_ACCOUNT_SCOPE = "openid email customer-account-api:full";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://sleepifyme.com";
}

export function getRedirectUri(): string {
  return `${getSiteUrl()}/api/auth/callback`;
}

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  return base64url(randomBytes(32));
}

export function generateCodeChallenge(verifier: string): string {
  return base64url(createHash("sha256").update(verifier).digest());
}

export function generateState(): string {
  return base64url(randomBytes(16));
}

export function generateNonce(): string {
  return base64url(randomBytes(16));
}

/**
 * Reads the customer session server-side. Returns null if there's no
 * access token cookie, or if it's past its recorded expiry - callers
 * should treat that as "no valid session" and send the user to /login.
 */
export async function getCustomerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.accessToken)?.value;
  const expiresAt = cookieStore.get(AUTH_COOKIES.expiresAt)?.value;

  if (!token || !expiresAt) return null;
  if (Date.now() >= Number(expiresAt)) return null;

  return token;
}

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
};

export type CustomerAccountData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  orders: CustomerOrder[];
};

const CUSTOMER_QUERY = `#graphql
  query GetCustomer {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

type RawCustomerOrderEdge = { node: CustomerOrder };

/**
 * Fetches the signed-in customer's profile + recent orders from the
 * Customer Account API. Returns null on any failure (expired/invalid
 * token, network error, GraphQL errors) - callers should treat that as
 * "session is no longer valid."
 */
export async function getCustomerAccountData(
  accessToken: string
): Promise<CustomerAccountData | null> {
  let res: Response;
  try {
    res = await fetch(CUSTOMER_ACCOUNT_ENDPOINTS.graphql, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ query: CUSTOMER_QUERY }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const { data, errors } = await res.json();
  if (errors || !data?.customer) return null;

  return {
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    email: data.customer.emailAddress?.emailAddress ?? null,
    orders: data.customer.orders.edges.map(
      (edge: RawCustomerOrderEdge) => edge.node
    ),
  };
}
