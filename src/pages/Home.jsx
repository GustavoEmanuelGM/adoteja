import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Home.css'
import { CiHeart } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { MdPets } from "react-icons/md";
import { IoLeafOutline } from "react-icons/io5";
import { MdFamilyRestroom } from "react-icons/md";
import { LuDog } from "react-icons/lu";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-conteudo">
          <div className="hero-logo">
            <img src={logo} alt="Logo do AdotaJá" />
          </div>

          <h1 className="hero-titulo">
            Todo animal merece um <span className="destaque-laranja">lar cheio de amor</span>
          </h1>

          <p className="hero-subtitulo">
            O AdotaJá conecta protetores e famílias para dar uma segunda chance a quem mais precisa.
            Encontre seu novo melhor amigo em Iguatu-CE.
          </p>

          <div className="hero-botoes">
            <Link to="/animais" className="btn-primary">Ver animais disponíveis</Link>
            <Link to="/cadastro" className="btn-secondary">Quero ajudar</Link>
          </div>
        </div>

        <div className="hero-decoracao">
          <div className="bolha bolha1"></div>
          <div className="bolha bolha2"></div>
          <div className="bolha bolha3"></div>
        </div>
      </section>

      <section className="numeros">
        <div className="container numeros-grid">
          <div className="numero-item">
            <span className="numero-icone"><MdPets /></span>
            <span className="numero-label">Cães e gatos esperando por você</span>
          </div>

          <div className="numero-item">
            <span className="numero-icone"><CiHeart /></span>
            <span className="numero-label">Adoção responsável e segura</span>
          </div>

          <div className="numero-item">
            <span className="numero-icone"><MdFamilyRestroom /></span>
            <span className="numero-label">Famílias felizes em Iguatu-CE</span>
          </div>
        </div>
      </section>

      <section className="beneficios">
        <div className="container">
          <h2 className="secao-titulo">Por que adotar?</h2>
          <p className="secao-subtitulo">
            Adotar é um gesto de amor que transforma vidas, do animal e da sua família.
          </p>

          <div className="beneficios-grid">
            <div className="beneficio-card">
              <div className="beneficio-icone"><LuDog /></div>
              <h3>Salva uma vida</h3>
              <p>Cada adoção abre espaço para outro animal ser resgatado e cuidado.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icone"><CiStar /></div>
              <h3>Companhia fiel</h3>
              <p>Animais adotados criam laços profundos e trazem alegria para o lar.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icone"><IoLeafOutline /></div>
              <h3>Atitude responsável</h3>
              <p>Adotar combate o comércio irresponsável e o abandono de animais.</p>
            </div>

            <div className="beneficio-card">
              <div className="beneficio-icone"><CiHeart /></div>
              <h3>Amor incondicional</h3>
              <p>Um animal que foi resgatado sabe exatamente como retribuir carinho.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="chamada-final">
        <div className="container chamada-conteudo">
          <h2>Tem um animal para adoção?</h2>
          <p>Cadastre-o na plataforma e ajude a encontrar um lar responsável em Iguatu-CE.</p>

          <div className="hero-botoes chamada-botoes">
            <Link to="/cadastro" className="btn-primary">Criar conta gratuita</Link>
            <Link to="/animais" className="btn-secondary btn-chamada-secundario">Ver animais</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home