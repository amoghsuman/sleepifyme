import {
  createStorefrontApiClient,
  type StorefrontApiClient,
} from "@shopify/storefront-api-client";
import sanitizeHtml from "sanitize-html";
import { cache } from "react";

let shopifyClient: StorefrontApiClient | null = null;

function getShopifyClient(): StorefrontApiClient {
  if (!shopifyClient) {
    shopifyClient = createStorefrontApiClient({
      storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
      apiVersion: "2026-07",
      publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "",
    });
  }
  return shopifyClient;
}

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  price: Money;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
};

export type ShopifyProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: Money;
  compareAtPrice: Money | null;
  images: ProductImage[];
  variants: ShopifyProductVariant[];
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  productTitle: string;
  variantTitle: string;
  productHandle: string;
  price: Money;
  lineTotal: Money;
  image: { url: string; altText: string | null } | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};

export type ShopifyArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  blogHandle: string;
  blogTitle: string;
};

const PRODUCT_FIELDS = `#graphql
  id
  title
  handle
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url
    altText
  }
`;

const PRODUCTS_QUERY = `#graphql
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

const PRODUCTS_BY_TAG_QUERY = `#graphql
  query GetProductsByTag($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_HANDLES_QUERY = `#graphql
  query GetProductHandles($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;

const CART_FIELDS = `#graphql
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_QUERY = `#graphql
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: { totalAmount: Money };
        merchandise: {
          id: string;
          title: string;
          price: Money;
          product: {
            title: string;
            handle: string;
            featuredImage: { url: string; altText: string | null } | null;
          };
        };
      };
    }[];
  };
};

function mapCart(cart: RawCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    lines: cart.lines.edges.map((edge) => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      merchandiseId: edge.node.merchandise.id,
      productTitle: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      productHandle: edge.node.merchandise.product.handle,
      price: edge.node.merchandise.price,
      lineTotal: edge.node.cost.totalAmount,
      image: edge.node.merchandise.product.featuredImage,
    })),
  };
}

function assertNoUserErrors(userErrors: { field: string[]; message: string }[]) {
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
}

type ProductEdge = {
  node: {
    id: string;
    title: string;
    handle: string;
    priceRange: { minVariantPrice: Money };
    featuredImage: { url: string; altText: string | null } | null;
  };
};

function mapProductEdges(edges: ProductEdge[]): ShopifyProduct[] {
  return edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    price: edge.node.priceRange.minVariantPrice,
    featuredImage: edge.node.featuredImage,
  }));
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: string): string {
  return inrFormatter.format(Number(amount));
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const { data, errors } = await getShopifyClient().request(PRODUCTS_QUERY);

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  return mapProductEdges(data.products.edges);
}

export const getProductByHandle = cache(async function getProductByHandle(
  handle: string
): Promise<ShopifyProductDetail | null> {
  const { data, errors } = await getShopifyClient().request(
    PRODUCT_BY_HANDLE_QUERY,
    { variables: { handle } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  const product = data.product;
  if (!product) return null;

  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAtPrice && Number(compareAtPrice.amount) > Number(product.priceRange.minVariantPrice.amount);

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    price: product.priceRange.minVariantPrice,
    compareAtPrice: hasDiscount ? compareAtPrice : null,
    images: product.images.edges.map(
      (edge: { node: ProductImage }) => edge.node
    ),
    variants: product.variants.edges.map(
      (edge: { node: ShopifyProductVariant }) => edge.node
    ),
  };
});

export async function getAllProductHandles(first = 250): Promise<string[]> {
  const { data, errors } = await getShopifyClient().request(
    PRODUCT_HANDLES_QUERY,
    { variables: { first } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  return data.products.edges.map(
    (edge: { node: { handle: string } }) => edge.node.handle
  );
}

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const { data, errors } = await getShopifyClient().request(
    CART_CREATE_MUTATION,
    { variables: { lines: [{ merchandiseId: variantId, quantity }] } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  assertNoUserErrors(data.cartCreate.userErrors);
  return mapCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const { data, errors } = await getShopifyClient().request(
    CART_LINES_ADD_MUTATION,
    { variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  assertNoUserErrors(data.cartLinesAdd.userErrors);
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  if (quantity <= 0) {
    const { data, errors } = await getShopifyClient().request(
      CART_LINES_REMOVE_MUTATION,
      { variables: { cartId, lineIds: [lineId] } }
    );

    if (errors) {
      throw new Error(
        typeof errors === "string" ? errors : JSON.stringify(errors)
      );
    }

    assertNoUserErrors(data.cartLinesRemove.userErrors);
    return mapCart(data.cartLinesRemove.cart);
  }

  const { data, errors } = await getShopifyClient().request(
    CART_LINES_UPDATE_MUTATION,
    { variables: { cartId, lines: [{ id: lineId, quantity }] } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  return mapCart(data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const { data, errors } = await getShopifyClient().request(CART_QUERY, {
    variables: { cartId },
  });

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  if (!data.cart) return null;
  return mapCart(data.cart);
}

export async function getProductsByTag(
  tag: string,
  first = 20
): Promise<ShopifyProduct[]> {
  const { data, errors } = await getShopifyClient().request(
    PRODUCTS_BY_TAG_QUERY,
    { variables: { query: `tag:'${tag}'`, first } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  return mapProductEdges(data.products.edges);
}

const ARTICLE_FIELDS = `#graphql
  id
  title
  handle
  excerpt
  contentHtml
  publishedAt
  tags
  image {
    url
    altText
  }
  blog {
    handle
    title
  }
`;

const BLOG_ARTICLES_QUERY = `#graphql
  query GetBlogArticles($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ${ARTICLE_FIELDS}
          }
        }
      }
    }
  }
`;

const ARTICLE_BY_HANDLE_QUERY = `#graphql
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ${ARTICLE_FIELDS}
      }
    }
  }
`;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "img",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

function deriveExcerpt(html: string, title: string, maxLength = 160): string {
  let text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();

  if (text.toLowerCase().startsWith(title.toLowerCase())) {
    text = text.slice(title.length).trim();
  }

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

type RawArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string | null;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  blog: { handle: string; title: string };
};

function mapArticle(article: RawArticle): ShopifyArticle {
  return {
    id: article.id,
    title: article.title,
    handle: article.handle,
    excerpt:
      article.excerpt?.trim() ||
      deriveExcerpt(article.contentHtml, article.title),
    contentHtml: sanitizeArticleHtml(article.contentHtml),
    publishedAt: article.publishedAt,
    tags: article.tags,
    image: article.image,
    blogHandle: article.blog.handle,
    blogTitle: article.blog.title,
  };
}

export async function getBlogArticles(
  blogHandle: string,
  first = 20
): Promise<ShopifyArticle[]> {
  const { data, errors } = await getShopifyClient().request(
    BLOG_ARTICLES_QUERY,
    { variables: { handle: blogHandle, first } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  if (!data.blog) return [];
  return data.blog.articles.edges.map((edge: { node: RawArticle }) =>
    mapArticle(edge.node)
  );
}

export const getArticleByHandle = cache(async function getArticleByHandle(
  blogHandle: string,
  articleHandle: string
): Promise<ShopifyArticle | null> {
  const { data, errors } = await getShopifyClient().request(
    ARTICLE_BY_HANDLE_QUERY,
    { variables: { blogHandle, articleHandle } }
  );

  if (errors) {
    throw new Error(
      typeof errors === "string" ? errors : JSON.stringify(errors)
    );
  }

  const article = data.blog?.articleByHandle;
  if (!article) return null;

  return mapArticle(article);
});

export function formatArticleDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
