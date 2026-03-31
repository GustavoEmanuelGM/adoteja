// Animals.jsx - Página de listagem de todos os animais
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import AnimalCard from '../components/AnimalCard'
import './Animals.css'
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

function Animals({ user }) {
  const [animais, setAnimais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('')
  const [modalAnimal, setModalAnimal] = useState(null)


  useEffect(() => {
    async function buscarAnimais() {
      setCarregando(true)

      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setAnimais(data || [])
      }

      setCarregando(false)
    }

    buscarAnimais()
  }, [])

  const animaisFiltrados = animais.filter(animal => {
    const nomeOk = (animal.nome || '').toLowerCase().includes(busca.toLowerCase())
    const especieOk = filtroEspecie
      ? (animal.especie || '').toLowerCase() === filtroEspecie.toLowerCase()
      : true
    return nomeOk && especieOk
  })

  function handleInteresse(animal) {
    setModalAnimal(animal)
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Cabeçalho */}
        <div className="animals-header">
          <h1>Animais para adoção</h1>
          <p>Encontre seu novo melhor amigo aqui em Iguatu-CE!</p>
        </div>

        {/* Filtros */}
        <div className="filtros">
          <div className="input-busca-wrap">
            <span className="busca-icone"><CiSearch /></span>
            <input
              type="text"
              className="input-busca"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <select
            className="select-especie"
            value={filtroEspecie}
            onChange={e => setFiltroEspecie(e.target.value)}
          >
            <option value="">Todas as espécies</option>
            <option value="Cão">Cão</option>
            <option value="Gato">Gato</option>
            <option value="Pássaro">Pássaro</option>
            <option value="Coelho">Coelho</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {/* Loading */}
        {carregando && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Grid */}
        {!carregando && animaisFiltrados.length > 0 && (
          <div className="animals-grid">
            {animaisFiltrados.map(animal => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onInteresse={handleInteresse}
              />
            ))}
          </div>
        )}

        {/* Nenhum resultado */}
        {!carregando && animaisFiltrados.length === 0 && (
          <div className="sem-resultados">
            <CiSearch />
            <h3>Nenhum animal encontrado</h3>
            <p>Tente buscar por outro nome ou espécie.</p>
            {user && (
              <Link to="/cadastrar-animal" className="btn-primary" style={{ marginTop: 16 }}>
                Cadastrar um animal
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de interesse */}
      {modalAnimal && (
        <div className="modal-overlay" onClick={() => setModalAnimal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>Interesse em {modalAnimal.nome}</h2>
            <p>
              Para entrar em contato com o protetor de <strong>{modalAnimal.nome}</strong>,
              você precisa estar cadastrado na plataforma.
            </p>
            {user ? (
              <p className="msg-sucesso" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCheck /> Você está logado! Entre em contato diretamente pelo e-mail do protetor.
              </p>
            ) : (
              <div className="modal-botoes">
                <Link to="/cadastro" className="btn-primary" onClick={() => setModalAnimal(null)}>
                  Criar conta
                </Link>
                <Link to="/login" className="btn-secondary" onClick={() => setModalAnimal(null)}>
                  Já tenho conta
                </Link>
              </div>
            )}
            <button className="modal-fechar" onClick={() => setModalAnimal(null)}>
              <IoClose /> Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Animals