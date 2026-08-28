import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, RotateCcw, Trophy, ClipboardList, AlertTriangle, ShieldCheck, Upload } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'
import { useToast } from '@/components/ui/Toast'
import { Escudo } from '@/components/Escudo'
import { missoes, missaoPorId } from '@/data/missoes'
import { niveis, totalMissoes, calcularNivelAtual, calcularProximoNivel, cuponsDesbloqueados } from '@/data/niveisConfig'
import { useProgressoStore } from '@/store/progressoStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

function montarCadernoMarkdown(
  nomeUsuario: string,
  nivelAtual: ReturnType<typeof calcularNivelAtual>,
  missoesConcluidasIds: string[],
  bugReports: ReturnType<typeof useProgressoStore.getState>['bugReports'],
): string {
  const dataFormatada = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())

  const partes = [
    `# Caderno de bugs de ${nomeUsuario}`,
    ``,
    `**Nível alcançado:** ${nivelAtual.nome} (nível ${nivelAtual.numero})`,
    `**Missões concluídas:** ${missoesConcluidasIds.length} de ${totalMissoes}`,
    `**Data de exportação:** ${dataFormatada}`,
    ``,
    `---`,
    ``,
  ]

  const idsComReport = missoesConcluidasIds.filter((id) => bugReports[id])

  if (idsComReport.length === 0) {
    partes.push('Nenhum bug report foi escrito ainda.', '')
  }

  idsComReport.forEach((id) => {
    const missao = missaoPorId(id)
    const report = bugReports[id]
    if (!missao || !report) return

    partes.push(
      `## ${missao.numero}. ${missao.nome}`,
      ``,
      `**Título:** ${report.titulo || '(sem título)'}`,
      ``,
      `**Tela:** ${missao.telaCorreta}`,
      ``,
      `**Pré-condição:** ${report.preCondicao || '-'}`,
      ``,
      `**Passos para reproduzir:**`,
      report.passos || '-',
      ``,
      `**Resultado atual:** ${report.resultadoAtual || '-'}`,
      ``,
      `**Resultado esperado:** ${report.resultadoEsperado || '-'}`,
      ``,
      `**Severidade:** ${report.severidade} · **Prioridade:** ${report.prioridade}`,
      ``,
      `**Observações:** ${report.observacoes || '-'}`,
      ``,
      `---`,
      ``,
    )
  })

  partes.push('Documento produzido na QArena, o playground dos QAs, ambiente educacional criado por Andreline Lira.')

  return partes.join('\n')
}

function baixarArquivoMarkdown(conteudo: string, nomeArquivo: string) {
  const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function Progresso() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const missoesConcluidas = useProgressoStore((estado) => estado.missoesConcluidas)
  const bugReports = useProgressoStore((estado) => estado.bugReports)
  const resetarProgresso = useProgressoStore((estado) => estado.resetarProgresso)
  const { mostrarToast } = useToast()

  const [etapaReset, setEtapaReset] = useState<0 | 1 | 2>(0)
  const [codigoBackup, setCodigoBackup] = useState('')
  const [codigoParaRestaurar, setCodigoParaRestaurar] = useState('')
  const [confirmandoRestaurar, setConfirmandoRestaurar] = useState(false)
  const exportarBackup = useProgressoStore((estado) => estado.exportarBackup)
  const importarBackup = useProgressoStore((estado) => estado.importarBackup)

  const quantidade = missoesConcluidas.length
  const nivelAtual = calcularNivelAtual(quantidade)
  const proximoNivel = calcularProximoNivel(quantidade)
  const faltamParaProximo = proximoNivel ? proximoNivel.missoesNecessarias - quantidade : 0
  const percentualBarra = proximoNivel
    ? Math.min(
        100,
        ((quantidade - nivelAtual.missoesNecessarias) / (proximoNivel.missoesNecessarias - nivelAtual.missoesNecessarias)) * 100,
      )
    : 100
  const cupons = cuponsDesbloqueados(quantidade)
  const missoesComReport = missoesConcluidas.filter((id) => bugReports[id])
  const indiceAtual = niveis.findIndex((n) => n.numero === nivelAtual.numero)
  const fracaoTrilha = indiceAtual / (niveis.length - 1)

  function aoExportar() {
    const conteudo = montarCadernoMarkdown(usuario?.nome ?? 'Aluno QArena', nivelAtual, missoesConcluidas, bugReports)
    baixarArquivoMarkdown(conteudo, 'caderno-de-bugs-qarena.md')
    mostrarToast('Caderno de bugs exportado', 'sucesso')
  }

  function aoConfirmarReset() {
    resetarProgresso()
    setEtapaReset(0)
    mostrarToast('Progresso zerado', 'sucesso')
  }

  function aoGerarBackup() {
    setCodigoBackup(exportarBackup())
  }

  function aoConfirmarRestaurar() {
    const sucesso = importarBackup(codigoParaRestaurar)
    setConfirmandoRestaurar(false)
    if (sucesso) {
      setCodigoParaRestaurar('')
      mostrarToast('Progresso restaurado a partir do código de backup', 'sucesso')
    } else {
      mostrarToast('Código inválido. Confira se copiou o código inteiro.', 'erro')
    }
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-16">
      <div className="flex flex-col items-center gap-5 text-center">
        <Escudo nivel={nivelAtual.numero} tamanho={164} brilhoPulsante data-testid="progresso-escudo-atual" />
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-bold text-white" data-testid="progresso-nivel-nome">
            {nivelAtual.nome}
          </h1>
          <p className="text-sm text-ink-muted">Nível {nivelAtual.numero} de {niveis.length}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3.5 py-1.5 font-display text-sm font-semibold text-neon-cyan">
          {quantidade} de {totalMissoes} missões concluídas
        </span>

        {proximoNivel && (
          <div className="w-full max-w-sm">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all"
                style={{ width: `${percentualBarra}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-neon-cyan transition-all"
                style={{ left: `calc(${percentualBarra}% - 6px)`, boxShadow: '0 0 10px 3px rgba(34,211,238,0.7)' }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-muted" data-testid="progresso-faltam">
              Faltam {faltamParaProximo} missões para {proximoNivel.nome}
            </p>
          </div>
        )}

        <p className="text-xs text-ink-muted/70">
          Seu progresso fica salvo neste navegador, mesmo se você fechar e voltar depois. Só some se limpar os dados
          do navegador ou trocar de aparelho — para esses casos, use o backup abaixo.
        </p>
      </div>

      <GlassCard className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-neon-cyan" />
          <h2 className="font-display font-semibold text-ink">Backup do progresso</h2>
        </div>
        <p className="text-sm text-ink-muted">
          Gere um código, copie e guarde num lugar seguro. Depois, cole esse código aqui em outro navegador ou
          aparelho para recuperar suas missões, dicas e bug reports.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Gerar meu código</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button variante="secondary" tamanho="sm" onClick={aoGerarBackup} data-testid="progresso-btn-gerar-backup">
              <Download size={16} />
              Gerar código de backup
            </Button>
            {codigoBackup && <BotaoCopiar valor={codigoBackup} testId="progresso-btn-copiar-backup" rotulo="Copiar código" />}
          </div>
          {codigoBackup && (
            <textarea
              readOnly
              value={codigoBackup}
              onFocus={(evento) => evento.currentTarget.select()}
              data-testid="progresso-texto-backup"
              className="mt-1 h-24 w-full resize-none rounded-lg border border-white/10 bg-base-900/60 p-3 font-mono text-xs text-ink-muted"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Restaurar de um código</span>
          <textarea
            value={codigoParaRestaurar}
            onChange={(evento) => setCodigoParaRestaurar(evento.target.value)}
            placeholder="Cole aqui o código de backup gerado neste ou em outro navegador"
            data-testid="progresso-texto-restaurar"
            className="h-20 w-full resize-none rounded-lg border border-white/10 bg-base-900/60 p-3 font-mono text-xs text-ink placeholder:text-ink-muted/50"
          />
          <div>
            <Button
              variante="secondary"
              tamanho="sm"
              onClick={() => setConfirmandoRestaurar(true)}
              disabled={!codigoParaRestaurar.trim()}
              data-testid="progresso-btn-restaurar"
            >
              <Upload size={16} />
              Restaurar progresso
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-4 p-6">
        <h2 className="font-display font-semibold text-ink">Trilha de níveis</h2>
        <div className="-mx-2 overflow-x-auto px-2 py-3" data-testid="progresso-trilha">
          <div className="relative flex w-max min-w-full items-start gap-7 sm:w-full sm:justify-center">
            <div className="pointer-events-none absolute left-[58px] right-[58px] top-[54px] h-0.5 bg-white/10" />
            <div
              className="pointer-events-none absolute top-[54px] h-0.5 rounded-full bg-neon-cyan transition-all"
              style={{
                left: 58,
                width: `calc((100% - 116px) * ${fracaoTrilha})`,
                boxShadow: '0 0 8px 1px rgba(34,211,238,0.65)',
              }}
            />
            {niveis.map((nivel) => {
              const alcancado = quantidade >= nivel.missoesNecessarias
              const ehAtual = nivel.numero === nivelAtual.numero
              return (
                <div key={nivel.numero} className="relative flex w-28 shrink-0 flex-col items-center gap-2">
                  <Escudo
                    nivel={nivel.numero}
                    bloqueado={!alcancado}
                    tamanho={ehAtual ? 116 : 92}
                    brilhoPulsante={ehAtual}
                    data-testid={`progresso-trilha-escudo-${nivel.numero}`}
                  />
                  <span
                    className={cn(
                      'line-clamp-2 text-center font-display text-sm font-semibold text-balance',
                      alcancado ? 'text-ink' : 'text-ink-muted/50',
                    )}
                  >
                    {nivel.nome}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </GlassCard>

      {cupons.length > 0 && (
        <GlassCard className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-warning" />
            <h2 className="font-display font-semibold text-ink">Cupons desbloqueados</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {cupons.map((cupom) => (
              <div
                key={cupom.codigo}
                className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-neon-cyan/40 bg-neon-cyan/5 p-4 text-center"
                data-testid={`progresso-cupom-${cupom.codigo}`}
              >
                <span className="font-display text-lg font-bold text-ink">{cupom.percentual}% off</span>
                <span className="font-mono text-neon-cyan">{cupom.codigo}</span>
                <div className="flex gap-2">
                  <BotaoCopiar valor={cupom.codigo} testId={`progresso-btn-copiar-${cupom.codigo}`} />
                  <Link to="/cursos">
                    <Button variante="secondary" tamanho="sm">
                      Ver curso
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-neon-purple" />
          <h2 className="font-display font-semibold text-ink">Missões concluídas</h2>
        </div>
        {missoesConcluidas.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhuma missão concluída ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="progresso-lista-missoes">
            {missoesConcluidas.map((id) => {
              const missao = missoes.find((m) => m.id === id)
              if (!missao) return null
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm">
                  <span className="text-ink">
                    {missao.numero}. {missao.nome}
                  </span>
                  {bugReports[id] ? (
                    <Badge tom="success">Bug report escrito</Badge>
                  ) : (
                    <Badge tom="muted">Sem bug report</Badge>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variante="secondary"
            onClick={aoExportar}
            disabled={missoesComReport.length === 0}
            data-testid="progresso-btn-exportar"
          >
            <Download size={16} />
            Exportar meu caderno de bugs
          </Button>
          <Button variante="ghost" onClick={() => setEtapaReset(1)} data-testid="progresso-btn-zerar">
            <RotateCcw size={16} />
            Zerar progresso
          </Button>
        </div>
      </GlassCard>

      <Modal
        aberto={confirmandoRestaurar}
        aoFechar={() => setConfirmandoRestaurar(false)}
        titulo="Restaurar este backup?"
        testId="progresso-modal-restaurar"
      >
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          Isso substitui o progresso atual deste navegador pelo progresso salvo no código.
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variante="ghost" onClick={() => setConfirmandoRestaurar(false)} data-testid="progresso-restaurar-btn-cancelar">
            Cancelar
          </Button>
          <Button variante="primary" onClick={aoConfirmarRestaurar} data-testid="progresso-restaurar-btn-confirmar">
            Restaurar
          </Button>
        </div>
      </Modal>

      <Modal
        aberto={etapaReset === 1}
        aoFechar={() => setEtapaReset(0)}
        titulo="Zerar progresso?"
        testId="progresso-modal-reset-1"
      >
        <p className="text-sm text-ink-muted">
          Isso vai apagar todas as missões concluídas, dicas usadas, bug reports e cupons desbloqueados.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variante="ghost" onClick={() => setEtapaReset(0)} data-testid="progresso-reset-btn-cancelar-1">
            Cancelar
          </Button>
          <Button variante="danger" onClick={() => setEtapaReset(2)} data-testid="progresso-reset-btn-continuar">
            Sim, quero zerar
          </Button>
        </div>
      </Modal>

      <Modal
        aberto={etapaReset === 2}
        aoFechar={() => setEtapaReset(0)}
        titulo="Tem certeza mesmo?"
        testId="progresso-modal-reset-2"
      >
        <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          Essa ação não pode ser desfeita. Todo o seu progresso será perdido.
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variante="ghost" onClick={() => setEtapaReset(0)} data-testid="progresso-reset-btn-cancelar-2">
            Cancelar
          </Button>
          <Button variante="danger" onClick={aoConfirmarReset} data-testid="progresso-reset-btn-confirmar">
            Zerar tudo
          </Button>
        </div>
      </Modal>
    </div>
  )
}
