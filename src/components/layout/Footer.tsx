export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-base-900/60" data-testid="footer">
      <div className="container-arena flex flex-col gap-4 py-8 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neon-purple/20 border border-neon-purple/40 font-display text-sm font-bold text-neon-cyan">
            Q
          </span>
          <span className="font-display text-base font-semibold text-ink">QArena</span>
        </div>

        <p data-testid="footer-autoria">
          Projeto educacional criado por Andreline Lira para ajudar novos QAs a praticarem testes na prática.
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
