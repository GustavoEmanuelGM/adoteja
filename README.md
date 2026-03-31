# 🐾 AdotaPet — Guia Completo de Instalação e Configuração

---

## 📁 ETAPA 1 — Estrutura de Pastas

```
adota-pet/
├── index.html
├── vite.config.js
├── package.json
├── supabase.sql          ← SQL das tabelas e policies
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── services/
    │   └── supabaseClient.js
    ├── styles/
    │   └── global.css
    ├── components/
    │   ├── Navbar.jsx + Navbar.css
    │   ├── AnimalCard.jsx + AnimalCard.css
    │   ├── ProtectedRoute.jsx
    │   └── Footer.jsx + Footer.css
    └── pages/
        ├── Home.jsx + Home.css
        ├── Login.jsx + Auth.css
        ├── Register.jsx
        ├── Animals.jsx + Animals.css
        ├── AddAnimal.jsx + FormAnimal.css
        ├── EditAnimal.jsx
        └── Dashboard.jsx + Dashboard.css
```

---

## ⚙️ ETAPA 2 — Criar o Projeto React

Abra o terminal na pasta onde quer criar o projeto e rode:

```bash
# Opção A: Copiar os arquivos prontos direto (recomendado)
# Só cole os arquivos na estrutura acima e depois:
npm install

# Opção B: Criar do zero com Vite e depois copiar os arquivos
npm create vite@latest adota-pet -- --template react
cd adota-pet
npm install
```

### Instalar as dependências necessárias:

```bash
npm install @supabase/supabase-js react-router-dom
```

---

## 🗄️ ETAPA 3 — Configurar o Supabase

### 3.1 Criar um projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Clique em **"New project"**
3. Dê um nome ao projeto (ex: `adota-pet`)
4. Escolha uma senha forte para o banco
5. Selecione a região mais próxima (ex: South America - São Paulo)
6. Clique em **"Create new project"** e aguarde ~2 minutos

---

### 3.2 Pegar a URL e a Anon Key

1. No menu lateral, vá em **Project Settings → API**
2. Copie:
   - **Project URL** → algo como `https://xyzxyz.supabase.co`
   - **anon / public key** → uma chave longa começando com `eyJ...`

3. Abra o arquivo `src/services/supabaseClient.js` e substitua:

```js
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co'  // ← cole aqui
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI'           // ← cole aqui
```

---

### 3.3 Ativar a Autenticação por E-mail

1. No menu lateral, vá em **Authentication → Providers**
2. Confirme que **Email** está ativado (geralmente já vem ativo)
3. Em **Authentication → Email Templates** você pode personalizar os e-mails se quiser

> ⚠️ Por padrão, o Supabase pede confirmação de e-mail.
> Para desenvolvimento, desative isso em:
> **Authentication → Settings → "Enable email confirmations"** → desmarque

---

### 3.4 Criar as Tabelas e Policies (RLS)

1. No menu lateral, vá em **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase.sql`
4. Cole no editor e clique em **"Run"**

Você verá as tabelas criadas em **Table Editor → Tables**:
- `profiles`
- `animals`

---

## ▶️ ETAPA 4 — Rodar o Projeto Localmente

```bash
# Dentro da pasta adota-pet:
npm run dev
```

Abra no navegador: **http://localhost:5173**

---

## ✅ ETAPA 5 — Testar as Funcionalidades

### Ordem de testes recomendada:

1. **Home** → Acesse `/` e veja a página inicial
2. **Cadastro** → Vá em `/cadastro` e crie uma conta
3. **Login** → Vá em `/login` e entre com a conta criada
4. **Cadastrar Animal** → Vá em `/cadastrar-animal` e preencha o formulário
5. **Listar Animais** → Vá em `/animais` e veja o card aparecendo
6. **Filtros** → Teste a busca por nome e filtro por espécie
7. **Painel** → Vá em `/painel` e veja o animal cadastrado
8. **Editar** → Clique em "Editar" e altere algum dado
9. **Excluir** → Clique em "Excluir" e confirme
10. **Logout** → Clique em "Sair" na navbar
11. **Proteção de rotas** → Tente acessar `/painel` sem estar logado (deve redirecionar)

---

## 🔒 Como Funciona a Segurança (RLS)

| Ação                    | Quem pode fazer?              |
|-------------------------|-------------------------------|
| Ver animais             | Qualquer pessoa (público)     |
| Cadastrar animal        | Somente usuário logado        |
| Editar animal           | Somente o dono do registro    |
| Excluir animal          | Somente o dono do registro    |

Isso é garantido pelas **políticas RLS** criadas no Supabase, que validam o `auth.uid()` (ID do usuário logado) contra o `user_id` de cada registro.

---

## 📦 Dependências Utilizadas

| Pacote                  | Função                              |
|-------------------------|-------------------------------------|
| `react`                 | Biblioteca base da interface        |
| `react-dom`             | Renderização no navegador           |
| `react-router-dom`      | Navegação entre páginas (SPA)       |
| `@supabase/supabase-js` | Client para banco de dados e auth   |
| `vite`                  | Bundler e servidor de desenvolvimento|

---

## ❓ Problemas Comuns

**Não consigo fazer login / cadastro:**
→ Verifique se colocou a URL e a Anon Key corretas no `supabaseClient.js`
→ Desative a confirmação de e-mail nas configurações do Supabase

**Os animais não aparecem:**
→ Execute o SQL no Supabase e verifique se a tabela `animals` foi criada
→ Verifique se a policy de SELECT público está ativa

**Erro ao editar/excluir:**
→ Verifique se as policies de UPDATE e DELETE foram criadas corretamente
→ Certifique-se de que está logado com o mesmo usuário que cadastrou o animal

**Tela em branco ao abrir:**
→ Verifique o console do navegador (F12) para ver o erro
→ Garanta que rodou `npm install` antes de `npm run dev`

---

Feito com 💚 — Projeto Acadêmico AdotaPet
