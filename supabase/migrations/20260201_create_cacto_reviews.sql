-- ============================================
-- CACTO GARDEN - Sistema de Avaliações e Comentários
-- Migração para Supabase
-- ============================================

-- ============================================
-- Tabela: cactus_reviews (Avaliações)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cactus_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cactus_id TEXT NOT NULL,
    species_id TEXT NOT NULL,
    species_name TEXT,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
    user_session_id TEXT, -- Para identificar usuários anônimos
    device_fingerprint TEXT, -- Fingerprint do dispositivo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reviews_cactus_id ON public.cactus_reviews(cactus_id);
CREATE INDEX IF NOT EXISTS idx_reviews_species_id ON public.cactus_reviews(species_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_session ON public.cactus_reviews(user_session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.cactus_reviews(created_at DESC);

-- ============================================
-- Tabela: cactus_comments (Comentários)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cactus_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.cactus_reviews(id) ON DELETE CASCADE,
    cactus_id TEXT NOT NULL,
    comment_text TEXT NOT NULL CHECK (char_length(comment_text) <= 500),
    user_session_id TEXT,
    user_name TEXT DEFAULT 'Anônimo',
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para comentários
CREATE INDEX IF NOT EXISTS idx_comments_cactus_id ON public.cactus_comments(cactus_id);
CREATE INDEX IF NOT EXISTS idx_comments_review_id ON public.cactus_comments(review_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.cactus_comments(created_at DESC);

-- ============================================
-- Tabela: garden_stats (Estatísticas do Jardim)
-- ============================================
CREATE TABLE IF NOT EXISTS public.garden_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    total_cacti_planted INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para stats
CREATE INDEX IF NOT EXISTS idx_stats_session ON public.garden_stats(session_id);

-- ============================================
-- Tabela: species_popularity (Popularidade das Espécies)
-- ============================================
CREATE TABLE IF NOT EXISTS public.species_popularity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id TEXT NOT NULL UNIQUE,
    species_name TEXT NOT NULL,
    times_planted INTEGER DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    total_comments INTEGER DEFAULT 0,
    last_planted TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para popularidade
CREATE INDEX IF NOT EXISTS idx_popularity_species ON public.species_popularity(species_id);
CREATE INDEX IF NOT EXISTS idx_popularity_times_planted ON public.species_popularity(times_planted DESC);

-- ============================================
-- Funções e Triggers para auto-update
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.cactus_reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.cactus_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para comments
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.cactus_comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.cactus_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Habilitar RLS
ALTER TABLE public.cactus_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cactus_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_popularity ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir leitura pública
CREATE POLICY "Allow public read reviews" ON public.cactus_reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert reviews" ON public.cactus_reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update own reviews" ON public.cactus_reviews
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read comments" ON public.cactus_comments
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Allow public insert comments" ON public.cactus_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete own comments" ON public.cactus_comments
    FOR DELETE USING (true);

CREATE POLICY "Allow public read stats" ON public.garden_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow public upsert stats" ON public.garden_stats
    FOR ALL USING (true);

CREATE POLICY "Allow public read popularity" ON public.species_popularity
    FOR SELECT USING (true);

CREATE POLICY "Allow public upsert popularity" ON public.species_popularity
    FOR ALL USING (true);

-- ============================================
-- View para estatísticas agregadas
-- ============================================
CREATE OR REPLACE VIEW public.global_stats AS
SELECT
    COUNT(DISTINCT cr.id) as total_reviews,
    COUNT(DISTINCT cc.id) as total_comments,
    COALESCE(AVG(cr.rating) FILTER (WHERE cr.rating > 0), 0)::DECIMAL(2,1) as avg_rating,
    COUNT(DISTINCT cr.species_id) as unique_species_reviewed,
    MAX(cr.created_at) as last_review_at
FROM public.cactus_reviews cr
LEFT JOIN public.cactus_comments cc ON cc.review_id = cr.id;

-- ============================================
-- Dados iniciais (seed) - Espécies populares
-- ============================================
INSERT INTO public.species_popularity (species_id, species_name, times_planted)
VALUES
    ('saguaro', 'Saguaro', 0),
    ('prickly-pear', 'Palma', 0),
    ('barrel', 'Barril Dourado', 0),
    ('bunny-ears', 'Orelha de Coelho', 0),
    ('christmas', 'Flor de Maio', 0),
    ('old-man', 'Cabeça de Velho', 0),
    ('moon', 'Cacto Lua', 0),
    ('star', 'Cacto Estrela', 0),
    ('zebra', 'Planta Zebra', 0),
    ('bishop-cap', 'Mitra Episcopal', 0),
    ('fairy-castle', 'Castelo de Fadas', 0),
    ('peyote', 'Peiote', 0)
ON CONFLICT (species_id) DO NOTHING;
