-- ============================================================
-- ADOTAPET — SQL COMPLETO PARA O SUPABASE
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================


-- ============================================================
-- 1. TABELA: profiles
-- Armazena dados extras do usuário (além do que o Auth já guarda)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome      TEXT,
  email     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permite leitura pública dos perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis visíveis para todos"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuário pode inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ============================================================
-- 2. TABELA: animals
-- Principal tabela do sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS public.animals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  idade      INTEGER DEFAULT 0,
  especie    TEXT DEFAULT 'Cão',
  raca       TEXT,
  porte      TEXT DEFAULT 'Médio',
  cidade     TEXT NOT NULL,
  descricao  TEXT,
  foto_url   TEXT,
  status     TEXT DEFAULT 'disponivel'
               CHECK (status IN ('disponivel', 'adotado', 'em_processo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 3. RLS — Row Level Security (segurança por linha)
-- Garante que cada usuário só mexa nos próprios dados
-- ============================================================
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (inclusive visitante) pode ver os animais
CREATE POLICY "Animais visíveis para todos"
  ON public.animals FOR SELECT
  USING (true);

-- Apenas usuário autenticado pode cadastrar um animal
CREATE POLICY "Usuário autenticado pode inserir animal"
  ON public.animals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Apenas o dono do animal pode editar
CREATE POLICY "Dono pode atualizar seu animal"
  ON public.animals FOR UPDATE
  USING (auth.uid() = user_id);

-- Apenas o dono do animal pode excluir
CREATE POLICY "Dono pode excluir seu animal"
  ON public.animals FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 4. DADOS DE EXEMPLO (opcional — para testar o visual)
-- Substitua o UUID abaixo pelo ID de um usuário real
-- ============================================================

-- INSERT INTO public.animals (user_id, nome, idade, especie, raca, porte, cidade, descricao, foto_url, status)
-- VALUES
--   ('00000000-0000-0000-0000-000000000000', 'Rex', 3, 'Cão', 'Labrador', 'Grande', 'São Paulo - SP',
--    'Rex é um cão muito brincalhão e carinhoso. Adora crianças e outros animais.',
--    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', 'disponivel'),
--
--   ('00000000-0000-0000-0000-000000000000', 'Mimi', 1, 'Gato', 'SRD', 'Pequeno', 'Rio de Janeiro - RJ',
--    'Mimi é muito dócil e tranquila. Já está castrada e vacinada.',
--    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', 'disponivel'),
--
--   ('00000000-0000-0000-0000-000000000000', 'Bolinha', 5, 'Cão', 'Poodle', 'Pequeno', 'Curitiba - PR',
--    'Bolinha é um senhor tranquilo que adora colo e passeios curtos.',
--    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400', 'disponivel');
