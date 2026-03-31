import './AnimalCard.css'
import { CiCalendar } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoIosPin } from "react-icons/io";
import Silhueta from '../assets/silhueta.png'

function AnimalCard({ animal, onInteresse }) {
  const statusInfo = {
    disponivel: { texto: 'Disponível', cor: 'status-verde' },
    adotado: { texto: 'Adotado', cor: 'status-cinza' },
    em_processo: { texto: 'Em processo', cor: 'status-laranja' },
  }
  const status = statusInfo[animal.status] || statusInfo['disponivel']

  return (
    <div className="animal-card">
      {/* Foto ou silhueta SVG */}
      <div className="animal-foto-wrap">
        {animal.foto_url ? (
          <img
            src={animal.foto_url}
            alt={`Foto de ${animal.nome}`}
            className="animal-foto"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="animal-foto-fallback"
          style={{ display: animal.foto_url ? 'none' : 'flex' }}
        >
          <img src={Silhueta} alt="Sem foto" className="animal-fallback-img" />
        </div>
        <span className={`animal-status ${status.cor}`}>{status.texto}</span>
      </div>

      {/* Informações */}
      <div className="animal-info">
        <h3 className="animal-nome">{animal.nome}</h3>

        <div className="animal-tags">
          <span className="tag">{animal.especie}</span>
          {animal.raca && <span className="tag">{animal.raca}</span>}
          <span className="tag">{animal.porte}</span>
        </div>

        <div className="animal-detalhes">
          <span><CiCalendar /> {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}</span>
          <span><IoIosPin /> {animal.cidade}</span>
        </div>

        {animal.descricao && (
          <p className="animal-descricao">
            {animal.descricao.length > 90
              ? animal.descricao.substring(0, 90) + '...'
              : animal.descricao}
          </p>
        )}

        {animal.status === 'disponivel' && (
          <button className="btn-interesse" onClick={() => onInteresse && onInteresse(animal)}>
            <CiHeart /> Tenho interesse
          </button>
        )}
      </div>
    </div>
  )
}

export default AnimalCard