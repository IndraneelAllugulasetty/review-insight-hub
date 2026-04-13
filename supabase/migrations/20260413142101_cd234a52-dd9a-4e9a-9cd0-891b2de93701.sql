CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  seller TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  emotions TEXT[] DEFAULT '{}',
  aspects JSONB DEFAULT '[]',
  is_fake BOOLEAN DEFAULT false,
  fake_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE TABLE public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_count INTEGER NOT NULL DEFAULT 0,
  avg_rating NUMERIC NOT NULL DEFAULT 0,
  reputation_score NUMERIC NOT NULL DEFAULT 50,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warned', 'suspended')),
  warning_count INTEGER NOT NULL DEFAULT 0,
  trend TEXT NOT NULL DEFAULT 'stable' CHECK (trend IN ('improving', 'declining', 'stable')),
  sentiment_breakdown JSONB DEFAULT '{"positive": 0, "negative": 0, "neutral": 0}',
  top_complaints TEXT[] DEFAULT '{}',
  monthly_data JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers are viewable by everyone" ON public.sellers FOR SELECT USING (true);

CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('negative_spike', 'reputation_drop', 'fake_reviews', 'quality_issue')),
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alerts are viewable by everyone" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Alerts can be updated by anyone" ON public.alerts FOR UPDATE USING (true);

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_alerts_seller_id ON public.alerts(seller_id);
CREATE INDEX idx_products_seller_id ON public.products(seller_id);