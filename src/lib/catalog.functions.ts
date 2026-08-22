import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { mapProduct, type Product, type ProductRow } from "@/lib/catalog";

const PRODUCT_COLUMNS =
  "id, slug, name, tagline, description, category, price, sale_price, image_url, specs, in_stock, featured, is_published, sort_order";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const { data, error } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => mapProduct(r as ProductRow));
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }): Promise<Product | null> => {
    const { data: row, error } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapProduct(row as ProductRow) : null;
  });

const orderSchema = z.object({
  customer_name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().email().max(160).optional().or(z.literal("")),
  address: z.string().min(4).max(400),
  city: z.string().min(2).max(80),
  notes: z.string().max(600).optional().or(z.literal("")),
  payment_method: z.enum(["cod", "bank"]),
  items: z.array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(20) })).min(1).max(20),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error: prodError } = await supabase
      .from("products")
      .select("id, name, price, sale_price")
      .in(
        "id",
        data.items.map((i) => i.id),
      )
      .eq("is_published", true);
    if (prodError) throw new Error(prodError.message);
    if (!rows || rows.length === 0) throw new Error("No valid products in order");

    const items = data.items
      .map((line) => {
        const p = rows.find((r) => r.id === line.id);
        if (!p) return null;
        const unit = p.sale_price && p.sale_price > 0 && p.sale_price < p.price ? p.sale_price : p.price;
        return { id: p.id, name: p.name, qty: line.qty, unit_price: unit, line_total: unit * line.qty };
      })
      .filter(Boolean) as { id: string; name: string; qty: number; unit_price: number; line_total: number }[];

    const total = items.reduce((n, i) => n + i.line_total, 0);
    const reference = `TYM-${Math.floor(100000 + Math.random() * 899999)}`;

    const { error } = await supabase.from("orders").insert({
      reference,
      customer_name: data.customer_name,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      city: data.city,
      notes: data.notes || null,
      payment_method: data.payment_method,
      items,
      total,
    });
    if (error) throw new Error(error.message);

    return { reference, total, items };
  });

/* ---------------- admin ---------------- */

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Product[]> => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: ProductRow) => mapProduct(r));
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  tagline: z.string().max(200).default(""),
  description: z.string().max(4000).default(""),
  category: z.string().min(2).max(60),
  price: z.number().int().min(0),
  sale_price: z.number().int().min(0).nullable().optional(),
  image_url: z.string().url().max(2000).nullable().optional(),
  specs: z.array(z.object({ label: z.string().max(80), value: z.string().max(160) })).max(12).default([]),
  in_stock: z.boolean().default(true),
  featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("products").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("products")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "confirmed", "shipped", "delivered", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
