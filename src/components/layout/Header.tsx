import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

interface ItemNav {
  rotulo: string
  rota: string
  disponivel: boolean
}

const itensNav: ItemNav[] = [
  { rotulo: 'Início', rota: '/', disponivel: true },
  { rotulo: 'Meus Cursos', rota: '/cursos', disponivel: true },
  { rotulo: 'Requisitos', rota: '/requisitos', disponivel: true },
  { rotulo: 'Instruções', rota: '/instrucoes', disponivel: true },
  { rotulo: 'Massa de dados', rota: '/massa-de-dados', disponivel: true },
  { rotulo: 'Missões', rota: '/missoes', disponivel: true },
  { rotulo: 'Meu Progresso', rota: '/progresso', disponivel: true },
  { rotulo: 'Central de Bugs', rota: '/central-de-bugs', disponivel: true },
]

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const usuarioLogado = useAuthStore((estado) => estado.usuarioLogado)
  const logout = useAuthStore((estado) => estado.logout)
  const navigate = useNavigate()

  function aoSair() {
    logout()
    setMenuAberto(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base-900/70 backdrop-blur-md">
      <div className="container-arena flex h-16 items-center justify-between">
        <Link to="/" data-testid="header-logo" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/20 border border-neon-purple/40 font-display text-lg font-bold text-neon-cyan">
            Q
          </span>
          <span className="font-display text-lg font-semibold text-ink">QArena</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {itensNav.map((item) =>
            item.disponivel ? (
              <NavLink
                key={item.rota}
                to={item.rota}
                data-testid={`header-link-${item.rotulo.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink',
                    isActive && 'text-neon-cyan',
                  )
                }
              >
                {item.rotulo}
              </NavLink>
            ) : (
              <span
                key={item.rota}
                data-testid={`header-link-${item.rotulo.toLowerCase().replace(/\s+/g, '-')}`}
                title="Em breve"
                className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-ink-muted/40"
              >
                {item.rotulo}
              </span>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {usuarioLogado ? (
            <>
              <Link
                to="/app"
                data-testid="header-usuario-nome"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink"
              >
                {usuarioLogado.nome.split(' ')[0]}
              </Link>
              <Button variante="secondary" tamanho="sm" onClick={aoSair} data-testid="header-btn-sair">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variante="ghost" tamanho="sm" data-testid="header-btn-entrar">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variante="primary" tamanho="sm" data-testid="header-btn-criar-conta">
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-ink md:hidden"
          onClick={() => setMenuAberto((atual) => !atual)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          data-testid="header-btn-menu"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuAberto && (
        <nav
          className="border-t border-white/5 bg-base-900/95 px-4 py-4 md:hidden"
          aria-label="Navegação mobile"
          data-testid="header-menu-mobile"
        >
          <div className="flex flex-col gap-1">
            {itensNav.map((item) =>
              item.disponivel ? (
                <NavLink
                  key={item.rota}
                  to={item.rota}
                  onClick={() => setMenuAberto(false)}
                  data-testid={`header-link-mobile-${item.rotulo.toLowerCase().replace(/\s+/g, '-')}`}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted',
                      isActive && 'text-neon-cyan',
                    )
                  }
                >
                  {item.rotulo}
                </NavLink>
              ) : (
                <span
                  key={item.rota}
                  title="Em breve"
                  className="cursor-not-allowed rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted/40"
                >
                  {item.rotulo}
                </span>
              ),
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
            {usuarioLogado ? (
              <>
                <Link
                  to="/app"
                  onClick={() => setMenuAberto(false)}
                  data-testid="header-usuario-nome-mobile"
                  className="px-3 py-2 text-sm font-medium text-ink-muted"
                >
                  {usuarioLogado.nome.split(' ')[0]}
                </Link>
                <Button variante="secondary" tamanho="sm" onClick={aoSair} data-testid="header-btn-sair-mobile">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuAberto(false)}>
                  <Button variante="ghost" tamanho="sm" className="w-full" data-testid="header-btn-entrar-mobile">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" onClick={() => setMenuAberto(false)}>
                  <Button variante="primary" tamanho="sm" className="w-full" data-testid="header-btn-criar-conta-mobile">
                    Criar conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
