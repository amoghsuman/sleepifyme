import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/shopify";
import { getCustomerAccessToken, getCustomerAccountData } from "@/lib/customerAuth";

export const metadata: Metadata = {
  title: "Your Account",
};

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  const customer = await getCustomerAccountData(accessToken);
  if (!customer) {
    redirect("/login");
  }

  const displayName =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    "there";

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-parchment pb-28 pt-[160px] text-ink">
        <div className="mx-auto max-w-[860px] px-6 sm:px-10">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6 border-b border-midnight/10 pb-10">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[3px] text-goldDeep">
                Your Account
              </div>
              <h1 className="font-display text-[clamp(28px,3.4vw,40px)] font-medium text-midnight">
                Welcome back, {displayName}
              </h1>
              {customer.email && (
                <p className="mt-3 text-sm text-taupe">{customer.email}</p>
              )}
            </div>

            <a
              href="/api/auth/logout"
              className="inline-block border-b border-goldDeep/40 pb-1 text-[12px] uppercase tracking-[1.6px] text-goldDeep transition-colors hover:border-goldDeep hover:text-midnight"
            >
              Sign Out
            </a>
          </div>

          <h2 className="mb-8 font-display text-2xl font-medium text-midnight">
            Recent Orders
          </h2>

          {customer.orders.length === 0 ? (
            <p className="text-[15px] leading-[1.8] text-taupe">
              You haven&rsquo;t placed an order yet. Once you do, it&rsquo;ll
              show up here.
            </p>
          ) : (
            <ul className="divide-y divide-midnight/10 border-t border-midnight/10">
              {customer.orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-5"
                >
                  <div>
                    <div className="font-display text-lg text-midnight">
                      {order.name}
                    </div>
                    <div className="mt-1 text-[13px] text-taupe">
                      {formatOrderDate(order.processedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[12px] uppercase tracking-[1px] text-goldDeep">
                      {order.fulfillmentStatus.replaceAll("_", " ")}
                    </span>
                    <span className="text-[15px] text-midnight">
                      {formatPrice(order.totalPrice.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
