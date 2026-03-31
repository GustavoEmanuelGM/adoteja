import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // Validação simples antes de enviar
    if (senha !== confirmaSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)

    // Cria conta no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome }, // Salva o nome nos metadados do usuário
      },
    })

    setCarregando(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setErro('Este e-mail já está cadastrado. Tente fazer login.')
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
      return
    }

    // Se tudo OK, insere também na tabela profiles
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nome,
        email,
      })
    }

    setSucesso('Conta criada com sucesso! Redirecionando...')
    setTimeout(() => navigate('/painel'), 1500)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icone"></span>
          <h1>Criar conta grátis</h1>
          <p>Cadastre-se e ajude animais a encontrar um lar</p>
        </div>

        {erro && <div className="msg-erro">{erro}</div>}
        {sucesso && <div className="msg-sucesso">{sucesso}</div>}

        <form onSubmit={handleCadastro}>
          <div className="input-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirma">Confirmar senha</label>
            <input
              id="confirma"
              type="password"
              placeholder="Repita a senha"
              value={confirmaSenha}
              onChange={e => setConfirmaSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta?{' '}
          <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
