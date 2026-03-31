// Importa a função para criar o cliente do Supabase
import { createClient } from '@supabase/supabase-js'

// Substitua essas variáveis pelas suas credenciais do Supabase
// Você encontra elas em: Project Settings > API
const SUPABASE_URL = 'https://vewqexcdilktcuhrqxcj.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_3a8RgsWPo9MV39w-sGyQag_qoyVE9TE'

// Cria e exporta o cliente do Supabase para usar em todo o projeto
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
