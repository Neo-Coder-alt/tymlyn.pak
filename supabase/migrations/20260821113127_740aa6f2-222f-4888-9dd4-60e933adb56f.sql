-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Classic',
  price integer NOT NULL DEFAULT 0,
  sale_price integer,
  image_url text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published products are publicly viewable"
ON public.products FOR SELECT TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can view all products"
ON public.products FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  city text NOT NULL,
  notes text,
  payment_method text NOT NULL DEFAULT 'cod',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view orders"
ON public.orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
ON public.orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed the current catalogue
INSERT INTO public.products (slug, name, tagline, description, category, price, image_url, specs, featured, sort_order) VALUES
('tymlyn-noir-chrono', 'Noir Chrono', 'Gold-cased chronograph', 'A bold chronograph built for men who measure every moment. Gold-plated case, matte black dial and three precision sub-dials.', 'Chronograph', 18500, 'https://ihfmbcupwspynyztaucg.supabase.co/storage/v1/object/public/product-images/watch-1.jpg', '[{"label":"Case","value":"42mm gold plated steel"},{"label":"Movement","value":"Japanese quartz chronograph"},{"label":"Water resist","value":"5 ATM"},{"label":"Warranty","value":"1 year"}]'::jsonb, true, 1),
('tymlyn-heritage', 'Heritage Classic', 'Minimal dress watch', 'Clean lines, gold indices and a genuine leather strap. The Heritage is the quiet statement piece of the Tymlyn line.', 'Classic', 12500, 'https://ihfmbcupwspynyztaucg.supabase.co/storage/v1/object/public/product-images/watch-2.jpg', '[{"label":"Case","value":"40mm gold plated steel"},{"label":"Strap","value":"Genuine black leather"},{"label":"Glass","value":"Sapphire coated"},{"label":"Warranty","value":"1 year"}]'::jsonb, true, 2),
('tymlyn-skeleton', 'Skeleton Automatic', 'Exposed mechanical heart', 'An open-worked automatic movement on full display. Self-winding, hand assembled and finished in warm gold.', 'Automatic', 26900, 'https://ihfmbcupwspynyztaucg.supabase.co/storage/v1/object/public/product-images/watch-3.jpg', '[{"label":"Case","value":"43mm gold plated steel"},{"label":"Movement","value":"Automatic self-winding"},{"label":"Power reserve","value":"40 hours"},{"label":"Warranty","value":"2 years"}]'::jsonb, true, 3),
('tymlyn-lumiere', 'Lumière Mesh', 'Ladies gold mesh', 'A slim, feather-light ladies watch on a woven gold mesh bracelet. Refined enough for every occasion.', 'Ladies', 9900, 'https://ihfmbcupwspynyztaucg.supabase.co/storage/v1/object/public/product-images/watch-4.jpg', '[{"label":"Case","value":"32mm gold plated"},{"label":"Bracelet","value":"Milanese gold mesh"},{"label":"Movement","value":"Swiss quartz"},{"label":"Warranty","value":"1 year"}]'::jsonb, false, 4);