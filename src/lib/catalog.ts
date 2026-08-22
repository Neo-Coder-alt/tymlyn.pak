export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  specs: Spec[];
  inStock: boolean;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  specs: unknown;
  in_stock: boolean;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    price: row.price,
    salePrice: row.sale_price,
    image: row.image_url,
    specs: Array.isArray(row.specs) ? (row.specs as Spec[]) : [],
    inStock: row.in_stock,
    featured: row.featured,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

export const CATEGORIES = ["Chronograph", "Classic", "Automatic", "Ladies"] as const;

export const effectivePrice = (p: { price: number; salePrice: number | null }) =>
  p.salePrice && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;

export const formatPKR = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
