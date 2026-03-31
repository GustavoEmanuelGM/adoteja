// App.jsx - Ponto central da aplicação: configura rotas e autenticação
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './services/supabaseClient'

// Componentes de layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Animals from './pages/Animals'
import AddAnimal from './pages/AddAnimal'
import EditAnimal from './pages/EditAnimal'
import Dashboard from './pages/Dashboard'

// Estilo global
import './styles/global.css'

function App() {
  // Estado do usuário autenticado (null = não logado)
  const [user, setUser] = useState(null)
  // Impede a renderização antes de verificar se há sessão ativa
  const [carregandoAuth, setCarregandoAuth] = useState(true)

  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setCarregandoAuth(false)
    })

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    
    return () => subscription.unsubscribe()
  }, [])

  // Enquanto verifica a autenticação, mostra um loading simples
  if (carregandoAuth) {
    return (
      <div className="loading-container" style={{ height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      {/* Navbar recebe o usuário para exibir os links corretos */}
      <Navbar user={user} />

      <main>
        <Routes>
          {/* Rotas públicas — qualquer pessoa pode acessar */}
          <Route path="/" element={<Home />} />
          <Route path="/animais" element={<Animals user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          {/* Rotas protegidas — só para usuários logados */}
          <Route
            path="/cadastrar-animal"
            element={
              <ProtectedRoute user={user}>
                <AddAnimal user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-animal/:id"
            element={
              <ProtectedRoute user={user}>
                <EditAnimal user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painel"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          {/* Rota 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--verde-escuro)', marginBottom: 12 }}>
                  404 — Página não encontrada
                </h2>
                <p style={{ color: 'var(--texto-claro)', marginBottom: 28 }}>
                  A página que você procura não existe ou foi movida.
                </p>
                <a href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
                  Voltar ao início
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App