// ProtectedRoute.jsx - Protege rotas que exigem usuário logado
// Se não estiver logado, redireciona para /login
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ user, children }) {
  // Se não há usuário autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  // Se estiver logado, renderiza o conteúdo da rota normalmente
  return children
}

export default ProtectedRoute
