import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function RotaProtegida() {
  const usuarioLogado = useAuthStore((estado) => estado.usuarioLogado)
  const location = useLocation()

  if (!usuarioLogado) {
    return <Navigate to="/login" state={{ de: location.pathname }} replace />
  }

  return <Outlet />
}
