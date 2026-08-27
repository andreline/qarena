import { useAuthStore } from '@/store/authStore'
import { AppLayout } from './AppLayout'

export function AppLayoutConectado() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const logout = useAuthStore((estado) => estado.logout)

  if (!usuario) return null

  function aoSair() {
    logout()
    window.location.href = '/'
  }

  return (
    <AppLayout
      nome={usuario.nome}
      numeroConta={usuario.numeroConta}
      creditos={usuario.creditos}
      admin={usuario.admin}
      aoSair={aoSair}
    />
  )
}
