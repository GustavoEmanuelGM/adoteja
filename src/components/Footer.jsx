// Footer.jsx - Rodapé do site
import logo from '../assets/logo.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <img src={logo} alt="Logo AdotaJá" className="footer-logo-img" />
          <span className="footer-nome">AdotaJá</span>
        </div>

        <p className="footer-texto">
          Conectando corações e patinhas — Projeto acadêmico de adoção de animais em Iguatu-CE.
        </p>

        <p className="footer-copy">
          © {new Date().getFullYear()} AdotaJá. Feito com dedicação.
        </p>

      </div>
    </footer>
  )
}

export default Footer