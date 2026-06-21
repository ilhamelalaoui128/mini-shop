-- Mini E-Commerce - Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL CHECK (total > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: check admin role
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- FUNCTION: place order with stock check
-- ============================================
CREATE OR REPLACE FUNCTION public.place_order(order_items JSONB)
RETURNS UUID AS $$
DECLARE
  new_order_id UUID;
  item JSONB;
  product_record RECORD;
  order_total DECIMAL(10, 2) := 0;
  item_qty INTEGER;
  item_product_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non connecté';
  END IF;

  IF jsonb_array_length(order_items) = 0 THEN
    RAISE EXCEPTION 'La commande doit contenir au moins un produit';
  END IF;

  -- Validate stock and calculate total
  FOR item IN SELECT * FROM jsonb_array_elements(order_items)
  LOOP
    item_product_id := (item->>'product_id')::UUID;
    item_qty := (item->>'quantity')::INTEGER;

    SELECT * INTO product_record FROM products WHERE id = item_product_id FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produit introuvable: %', item_product_id;
    END IF;

    IF product_record.stock < item_qty THEN
      RAISE EXCEPTION 'Stock insuffisant pour: %', product_record.name;
    END IF;

    order_total := order_total + (product_record.price * item_qty);
  END LOOP;

  INSERT INTO orders (user_id, total, status)
  VALUES (auth.uid(), order_total, 'pending')
  RETURNING id INTO new_order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(order_items)
  LOOP
    item_product_id := (item->>'product_id')::UUID;
    item_qty := (item->>'quantity')::INTEGER;

    SELECT * INTO product_record FROM products WHERE id = item_product_id;

    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (new_order_id, item_product_id, item_qty, product_record.price);

    UPDATE products SET stock = stock - item_qty WHERE id = item_product_id;
  END LOOP;

  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles viewable by owner or admin"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (public.is_admin());

-- Products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (public.is_admin());

-- Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own orders via function"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (public.is_admin());

-- Order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Order items insert via function"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- SEED DATA (données de démonstration)
-- ============================================
INSERT INTO categories (name, description, image_url) VALUES
  ('Électronique', 'Appareils et gadgets high-tech', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
  ('Mode', 'Vêtements et accessoires tendance', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
  ('Maison', 'Décoration et équipement pour la maison', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'),
  ('Sport', 'Équipements et vêtements de sport', 'https://images.unsplash.com/photo-1461896836934-ffe607cd8255?w=400')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (category_id, name, description, price, image_url, stock)
SELECT c.id, p.name, p.description, p.price, p.image_url, p.stock
FROM (VALUES
  ('Électronique', 'Écouteurs Bluetooth Pro', 'Écouteurs sans fil avec réduction de bruit active et autonomie 30h.', 89.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50),
  ('Électronique', 'Montre Connectée Sport', 'Montre intelligente avec GPS, cardio et suivi du sommeil.', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 30),
  ('Électronique', 'Enceinte Portable', 'Enceinte Bluetooth waterproof avec son stéréo puissant.', 59.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 45),
  ('Mode', 'T-shirt Premium Coton', 'T-shirt en coton bio, coupe moderne et confortable.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 100),
  ('Mode', 'Sac à Dos Urbain', 'Sac à dos élégant avec compartiment laptop 15 pouces.', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 25),
  ('Mode', 'Sneakers Classic', 'Baskets légères au design intemporel, semelle confort.', 119.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 40),
  ('Maison', 'Lampe de Bureau LED', 'Lampe LED réglable avec port USB de charge intégré.', 45.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 35),
  ('Maison', 'Coussin Déco Velours', 'Coussin en velours doux, disponible en plusieurs coloris.', 24.99, 'https://images.unsplash.com/photo-1584100936595-c0654b4a2f69?w=400', 60),
  ('Maison', 'Plante Artificielle', 'Plante décorative réaliste, entretien zéro.', 34.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 20),
  ('Sport', 'Tapis de Yoga', 'Tapis antidérapant épais 6mm, inclut sangle de transport.', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 55),
  ('Sport', 'Haltères Ajustables', 'Paire d''haltères 2x10kg avec système de réglage rapide.', 149.99, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 15),
  ('Sport', 'Gourde Isotherme', 'Gourde 750ml, garde le froid 24h et le chaud 12h.', 19.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 80)
) AS p(category_name, name, description, price, image_url, stock)
JOIN categories c ON c.name = p.category_name
WHERE NOT EXISTS (SELECT 1 FROM products WHERE products.name = p.name);

-- NOTE: Pour créer un compte admin, inscrivez-vous puis exécutez :
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'votre@email.com');

-- -----------------------------------------------------------------------------
-- STORAGE POLICIES
-- -----------------------------------------------------------------------------
-- Assurez-vous que le bucket "images" est créé et configuré en "public" dans Supabase.
-- Vous pouvez l'ajouter via le Dashboard, ou via SQL si l'extension uuid-ossp est active.

-- Active RLS sur la table storage.objects
-- (Habituellement déjà géré par Supabase, mais redondance de sécurité)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs anonymes ou connectés peuvent voir/télécharger les images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'images' );

-- Seuls les admins peuvent uploader des images
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'images' AND 
  (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')) 
);

-- Seuls les admins peuvent supprimer des images
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING ( 
  bucket_id = 'images' AND 
  (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')) 
);
