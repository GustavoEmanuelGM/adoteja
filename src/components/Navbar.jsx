import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import logo from '../assets/logo.png'
import './Navbar.css'
import { RxExit } from "react-icons/rx";

function Navbar({ user }) {
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    setMenuAberto(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuAberto(false)}>
          <img src={logo} alt="Logo do AdotaJá" className="navbar-logo-img" />
          <span className="logo-texto">AdotaJá</span>
        </Link>

        <button
          className={`hamburger ${menuAberto ? 'aberto' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${menuAberto ? 'ativo' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuAberto(false)}>Início</Link>
          </li>
          <li>
            <Link to="/animais" onClick={() => setMenuAberto(false)}>Animais</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/cadastrar-animal" onClick={() => setMenuAberto(false)}>
                  Cadastrar Animal
                </Link>
              </li>
              <li>
                <Link to="/painel" onClick={() => setMenuAberto(false)}>
                  Meu Painel
                </Link>
              </li>
              <li>
                <button className="btn-logout" onClick={handleLogout}>
                  <RxExit /> Sair
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="btn-nav-login"
                  onClick={() => setMenuAberto(false)}
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  to="/cadastro"
                  className="btn-nav-cadastro"
                  onClick={() => setMenuAberto(false)}
                >
                  Cadastrar
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar