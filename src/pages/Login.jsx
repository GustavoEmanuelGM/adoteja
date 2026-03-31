import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import logo from '../assets/logo.png'
import './Auth.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    setCarregando(false)

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErro('E-mail ou senha incorretos. Verifique e tente novamente.')
      } else {
        setErro('Ocorreu um erro. Tente novamente mais tarde.')
      }
      return
    }

    navigate('/painel')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">

          <div className="auth-logo">
            <img src={logo} alt="Logo AdotaJá" />
          </div>

          <h1>Bem-vindo!</h1>
          <p>Faça login para continuar</p>
        </div>

        {erro && <div className="msg-erro">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta?{' '}
          <Link to="/cadastro">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}

export default Login