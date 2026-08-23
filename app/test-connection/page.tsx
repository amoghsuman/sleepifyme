import { formatPrice, getProducts } from "@/lib/shopify";

export default async function TestConnectionPage() {
  let error: string | null = null;
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    products = await getProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch products";
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shopify Connection Test</h1>

      {error && (
        <p className="text-red-600">
          Error fetching products: {error}
        </p>
      )}

      {!error && products.length === 0 && <p>No products found.</p>}

      {!error && products.length > 0 && (
        <ul className="list-disc list-inside space-y-1">
          {products.map((product) => (
            <li key={product.id}>
              {product.title} — {formatPrice(product.price.amount)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
