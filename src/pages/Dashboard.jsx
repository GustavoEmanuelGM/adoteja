// Dashboard.jsx - Painel do usuário logado
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import './Dashboard.css'
import Silhueta from '../assets/silhueta.png'
import { TbEdit } from "react-icons/tb";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";


function Dashboard({ user }) {
  const navigate = useNavigate()
  const [animais, setAnimais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [confirmandoId, setConfirmandoId] = useState(null)

  useEffect(() => {
    async function carregarMeusAnimais() {
      const { data, error } = await supabase
        .from('animals')
        .select(`
            id,
            nome,
            idade,
            especie,
            raca,
            porte,
            cidade,
            descricao,
            foto_url,
            status,
            created_at
          `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setAnimais(data || [])
      setCarregando(false)
    }
    carregarMeusAnimais()
  }, [user.id])

  async function handleExcluir(id) {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      alert('Erro ao excluir. Tente novamente.')
      return
    }
    setAnimais(animais.filter(a => a.id !== id))
    setConfirmandoId(null)
  }

  const nomeUsuario = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário'

  const textoStatus = {
    disponivel: 'Disponível',
    adotado: 'Adotado',
    em_processo: 'Em processo',
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Boas-vindas */}
        <div className="dashboard-header">
          <div className="dashboard-avatar">
            {nomeUsuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>Olá, {nomeUsuario}!</h1>
            <p className="dashboard-email">{user.email}</p>
          </div>
        </div>

        {/* Resumo */}
        <div className="dashboard-resumo">
          <div className="resumo-card">
            <span className="resumo-numero">{animais.length}</span>
            <span className="resumo-label">Animal(is) cadastrado(s)</span>
          </div>
          <div className="resumo-card">
            <span className="resumo-numero">
              {animais.filter(a => a.status === 'disponivel').length}
            </span>
            <span className="resumo-label">Disponível(is) para adoção</span>
          </div>
          <div className="resumo-card">
            <span className="resumo-numero">
              {animais.filter(a => a.status === 'adotado').length}
            </span>
            <span className="resumo-label">Adotado(s)</span>
          </div>
        </div>

        {/* Meus animais */}
        <div className="dashboard-secao">
          <div className="dashboard-secao-header">
            <h2>Meus animais</h2>
            <Link to="/cadastrar-animal" className="btn-primary">
              <FaPlus /> Cadastrar novo
            </Link>
          </div>

          {carregando && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}

          {!carregando && animais.length === 0 && (
            <div className="dashboard-vazio">
              <img src={Silhueta} alt="Sem foto" className="animal-fallback-img" />
              <p>Você ainda não cadastrou nenhum animal.</p>
              <Link to="/cadastrar-animal" className="btn-laranja">
                Cadastrar meu primeiro animal
              </Link>
            </div>
          )}

          {!carregando && animais.length > 0 && (
            <div className="meus-animais-lista">
              {animais.map(animal => (
                <div className="meu-animal-row" key={animal.id}>
                  {/* Foto ou miniatura SVG */}
                  {animal.foto_url ? (
                    <img
                      src={animal.foto_url}
                      alt={animal.nome}
                      className="meu-animal-foto"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                    />
                  ) : null}
                  <div
                    className="meu-animal-foto-fallback"
                    style={{ display: animal.foto_url ? 'none' : 'flex' }}
                  >
                    <img src={Silhueta} alt="Sem foto" className="animal-fallback-img" />
                  </div>

                  <div className="meu-animal-info">
                    <strong>{animal.nome}</strong>
                    <span>{animal.especie} · {animal.porte} · {animal.cidade}</span>
                  </div>

                  <span className={`badge-status badge-${animal.status}`}>
                    {textoStatus[animal.status] || animal.status}
                  </span>

                  <div className="meu-animal-acoes">
                    <button
                      className="btn-outline"
                      onClick={() => navigate(`/editar-animal/${animal.id}`)}
                    >
                      <TbEdit /> Editar
                    </button>

                    {confirmandoId === animal.id ? (
                      <div className="confirmar-exclusao">
                        <span>Tem certeza?</span>
                        <button className="btn-danger" onClick={() => handleExcluir(animal.id)}>
                          Sim, excluir
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                          onClick={() => setConfirmandoId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button className="btn-danger" onClick={() => setConfirmandoId(animal.id)}>
                        <IoTrashOutline /> Excluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard