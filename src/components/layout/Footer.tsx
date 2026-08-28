import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'

const CLIQUES_PARA_REVELAR = 5
const JANELA_EM_MS = 2000

export function Footer() {
  const cliques = useRef(0)
  const ultimoCliqueEm = useRef(0)
  const { mostrarToast } = useToast()

  function aoClicarLogo() {
    const agora = Date.now()
    const dentroDaJanela = agora - ultimoCliqueEm.current < JANELA_EM_MS
    ultimoCliqueEm.current = agora

    cliques.current = dentroDaJanela ? cliques.current + 1 : 1

    if (cliques.current === CLIQUES_PARA_REVELAR) {
      mostrarToast('Você encontrou um easter egg escondido no QArena. Isso não conta como bug reportável.', 'sucesso')
      cliques.current = 0
    }
  }

  return (
    <footer className="border-t border-white/5 bg-base-900/60" data-testid="footer">
      <div className="container-arena flex flex-col gap-4 py-8 text-sm text-ink-muted">
        <button
          type="button"
          onClick={aoClicarLogo}
          data-testid="footer-logo"
          aria-label="QArena"
          className="flex w-fit items-center gap-2 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neon-purple/20 border border-neon-purple/40 font-display text-sm font-bold text-neon-cyan">
            Q
          </span>
          <span className="font-display text-base font-semibold text-ink">QArena</span>
        </button>

        <p data-testid="footer-autoria">
          Projeto educacional criado por{' '}
          <Link to="/sobre" data-testid="footer-link-autoria" className="text-neon-cyan hover:underline">
            Andreline Lira
          </Link>{' '}
          para ajudar novos QAs a praticarem testes na prática.
        </p>

        <p>
          O QArena faz parte do ecossistema QA do Zero, criado para formar novos profissionais de qualidade de
          software.
        </p>

        <p data-testid="footer-aviso" className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-warning">
          Ambiente fictício. Todos os dados, produtos e pedidos são simulados para fins de estudo. Nunca use dados
          reais aqui.
        </p>
      </div>
    </footer>
  )
}
