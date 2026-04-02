import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import AnimalCard from '../components/AnimalCard'
import './Animals.css'
import { CiSearch } from "react-icons/ci"
import { IoClose } from "react-icons/io5"
import { FaWhatsapp } from "react-icons/fa"
import { MdPets } from "react-icons/md"

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
          nome_tutor,
          telefone,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar animais:', error)
        setAnimais([])
      } else {
        setAnimais(data || [])
      }

      setCarregando(false)
    }

    buscarAnimais()
  }, [])

  const animaisFiltrados = animais.filter((animal) => {
    const nomeOk = (animal.nome || '').toLowerCase().includes(busca.toLowerCase())
    const especieOk = filtroEspecie
      ? (animal.especie || '').toLowerCase() === filtroEspecie.toLowerCase()
      : true

    return nomeOk && especieOk
  })

  function handleInteresse(animal) {
    if (animal.status !== 'disponivel') return
    setModalAnimal(animal)
  }

  function limparTelefone(numero) {
    return (numero || '').replace(/\D/g, '')
  }

  function gerarLinkWhatsApp(animal) {
    const telefoneLimpo = limparTelefone(animal.telefone)

    if (!telefoneLimpo) return '#'

    const mensagem = `Olá! Vi o anúncio de ${animal.nome} no AdotaJá e tenho interesse na adoção. O animal ainda está disponível?`  
    const mensagemCodificada = encodeURIComponent(mensagem)

    return `https://wa.me/55${telefoneLimpo}?text=${mensagemCodificada}`
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="animals-header">
          <h1>Animais para adoção</h1>
          <p>Encontre seu novo melhor amigo aqui em Iguatu-CE!</p>
        </div>

        <div className="filtros">
          <div className="input-busca-wrap">
            <span className="busca-icone"><CiSearch /></span>
            <input
              type="text"
              className="input-busca"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select
            className="select-especie"
            value={filtroEspecie}
            onChange={(e) => setFiltroEspecie(e.target.value)}
          >
            <option value="">Todas as espécies</option>
            <option value="Cão">Cão</option>
            <option value="Gato">Gato</option>
            <option value="Pássaro">Pássaro</option>
            <option value="Coelho">Coelho</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {carregando && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {!carregando && animaisFiltrados.length > 0 && (
          <div className="animals-grid">
            {animaisFiltrados.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onInteresse={handleInteresse}
              />
            ))}
          </div>
        )}

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

      {modalAnimal && (
        <div className="modal-overlay" onClick={() => setModalAnimal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Interesse em {modalAnimal.nome}</h2>

            <p>
              Entre em contato com o tutor para saber mais sobre <strong>{modalAnimal.nome}</strong>.
            </p>

            <div className="modal-info-animal">
              <p><strong>Tutor:</strong> {modalAnimal.nome_tutor || 'Não informado'}</p>
              <p><strong>WhatsApp:</strong> {modalAnimal.telefone || 'Não informado'}</p>
            </div>

            {modalAnimal.telefone ? (
              <a
                href={gerarLinkWhatsApp(modalAnimal)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <FaWhatsapp /> Falar no WhatsApp
              </a>
            ) : (
              <p className="modal-sem-contato">
                <MdPets /> O tutor ainda não informou um número de WhatsApp.
              </p>
            )}

            {!user && (
              <p className="modal-aviso-login">
                Você pode entrar em contato mesmo sem login, mas criar uma conta ajuda a acompanhar melhor os animais disponíveis.
              </p>
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