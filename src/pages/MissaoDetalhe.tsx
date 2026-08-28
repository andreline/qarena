import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  Database,
  Lightbulb,
  ListChecks,
  Target,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { CelebracaoNivel } from '@/components/CelebracaoNivel'
import { missaoPorId, telasDoSistema, type GrupoMissao } from '@/data/missoes'
import { calcularNivelAtual, type NivelConfig } from '@/data/niveisConfig'
import { useProgressoStore, type BugReportMissao } from '@/store/progressoStore'
import { cn } from '@/lib/utils'

const corPorNivel: Record<GrupoMissao, 'success' | 'warning' | 'danger' | 'magenta'> = {
  Iniciante: 'success',
  Explorador: 'warning',
  Analista: 'magenta',
  Especialista: 'danger',
}

const bugReportVazio: Omit<BugReportMissao, 'salvoEm'> = {
  titulo: '',
  preCondicao: '',
  passos: '',
  resultadoAtual: '',
  resultadoEsperado: '',
  severidade: 'Média',
  prioridade: 'Média',
  observacoes: '',
}

export function MissaoDetalhe() {
  const { slug } = useParams()
  const missao = missaoPorId(slug ?? '')

  const missoesConcluidas = useProgressoStore((estado) => estado.missoesConcluidas)
  const niveisCelebrados = useProgressoStore((estado) => estado.niveisCelebrados)
  const dicasUsadas = useProgressoStore((estado) => estado.dicasUsadas)
  const bugReports = useProgressoStore((estado) => estado.bugReports)
  const abrirMissao = useProgressoStore((estado) => estado.abrirMissao)
  const concluirMissao = useProgressoStore((estado) => estado.concluirMissao)
  const usarDica = useProgressoStore((estado) => estado.usarDica)
  const salvarBugReport = useProgressoStore((estado) => estado.salvarBugReport)
  const marcarNivelCelebrado = useProgressoStore((estado) => estado.marcarNivelCelebrado)

  const { mostrarToast } = useToast()

  const [respostaTela, setRespostaTela] = useState('')
  const [respostaAlternativa, setRespostaAlternativa] = useState<number | null>(null)
  const [erroTentativa, setErroTentativa] = useState(false)
  const [segundosBloqueio, setSegundosBloqueio] = useState(0)
  const [dicaAberta, setDicaAberta] = useState(false)
  const [nivelParaCelebrar, setNivelParaCelebrar] = useState<NivelConfig | null>(null)
  const [formReport, setFormReport] = useState<Omit<BugReportMissao, 'salvoEm'>>(bugReportVazio)

  const concluida = missao ? missoesConcluidas.includes(missao.id) : false
  const dicaJaUsada = missao ? dicasUsadas.includes(missao.id) : false
  const reportSalvo = missao ? bugReports[missao.id] : undefined

  useEffect(() => {
    if (missao && !concluida) abrirMissao(missao.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missao?.id])

  useEffect(() => {
    if (reportSalvo) setFormReport(reportSalvo)
    if (dicaJaUsada) setDicaAberta(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missao?.id])

  useEffect(() => {
    if (segundosBloqueio <= 0) return
    const temporizador = setTimeout(() => setSegundosBloqueio((s) => s - 1), 1000)
    return () => clearTimeout(temporizador)
  }, [segundosBloqueio])

  if (!missao) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Missão não encontrada</h1>
        <Link to="/missoes">
          <Button variante="primary" data-testid="missao-detalhe-btn-voltar-nao-encontrada">
            Voltar para as missões
          </Button>
        </Link>
      </div>
    )
  }

  function aoVerDica() {
    setDicaAberta(true)
    if (missao) usarDica(missao.id)
  }

  function aoSubmeterConclusao(evento: FormEvent) {
    evento.preventDefault()
    if (!missao || segundosBloqueio > 0 || concluida) return

    const telaCorreta = respostaTela === missao.telaCorreta
    const alternativaCorreta =
      respostaAlternativa !== null && missao.alternativas[respostaAlternativa]?.correta === true

    if (telaCorreta && alternativaCorreta) {
      const antes = missoesConcluidas.length
      concluirMissao(missao.id)
      const depois = antes + 1
      const nivelAntes = calcularNivelAtual(antes)
      const nivelDepois = calcularNivelAtual(depois)

      if (nivelDepois.numero > nivelAntes.numero && !niveisCelebrados.includes(nivelDepois.numero)) {
        setNivelParaCelebrar(nivelDepois)
      } else {
        mostrarToast('Missão concluída!', 'sucesso')
      }
      setErroTentativa(false)
    } else {
      setErroTentativa(true)
      setSegundosBloqueio(5)
    }
  }

  function aoFinalizarCelebracao() {
    if (nivelParaCelebrar) marcarNivelCelebrado(nivelParaCelebrar.numero)
    setNivelParaCelebrar(null)
  }

  function aoSalvarReport(evento: FormEvent) {
    evento.preventDefault()
    if (!missao) return
    salvarBugReport(missao.id, formReport)
    mostrarToast('Bug report salvo no seu progresso', 'sucesso')
  }

  return (
    <div className="container-arena flex flex-col gap-6 py-16">
      {nivelParaCelebrar && (
        <CelebracaoNivel
          nivel={nivelParaCelebrar}
          missoesConcluidas={missoesConcluidas.length}
          aoFinalizar={aoFinalizarCelebracao}
        />
      )}

      <Link to="/missoes" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink" data-testid="missao-detalhe-link-voltar">
        <ChevronLeft size={16} />
        Voltar para as missões
      </Link>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tom="muted">{missao.laboratorio}</Badge>
            <Badge tom={corPorNivel[missao.nivel]}>{missao.nivel}</Badge>
            {concluida && (
              <Badge tom="success" data-testid="missao-detalhe-badge-concluida">
                Concluída
              </Badge>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-ink" data-testid="missao-detalhe-titulo">
            {missao.numero}. {missao.nome}
          </h1>
        </div>

        <GlassCard className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-neon-cyan" />
            <h2 className="font-display font-semibold text-ink">Objetivo</h2>
          </div>
          <p className="text-sm text-ink-muted" data-testid="missao-detalhe-objetivo">
            {missao.objetivo}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-neon-purple" />
            <h2 className="font-display font-semibold text-ink">O que investigar</h2>
          </div>
          <ul className="flex flex-col gap-2.5" data-testid="missao-detalhe-investigar">
            {missao.oQueInvestigar.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-purple" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>

        {missao.massaDeDados && (
          <GlassCard className="flex flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-neon-magenta" />
              <h2 className="font-display font-semibold text-ink">Massa de dados recomendada</h2>
            </div>
            <p className="text-sm text-ink-muted" data-testid="missao-detalhe-massa-dados">
              {missao.massaDeDados}
            </p>
          </GlassCard>
        )}

        {missao.dica && (
          <div className="flex flex-col gap-2">
            {dicaAberta ? (
              <div
                className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning"
                data-testid="missao-detalhe-dica"
              >
                <Lightbulb size={18} className="mt-0.5 shrink-0" />
                {missao.dica}
              </div>
            ) : (
              <Button
                variante="ghost"
                tamanho="sm"
                onClick={aoVerDica}
                data-testid="missao-detalhe-btn-ver-dica"
                className="self-start"
              >
                <Lightbulb size={16} />
                Ver dica
              </Button>
            )}
          </div>
        )}

        <GlassCard className="flex flex-col gap-5 border-neon-cyan/20 p-6" data-testid="missao-detalhe-concluir">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-neon-cyan" />
            <h2 className="font-display font-semibold text-ink">Concluir missão</h2>
          </div>

          {concluida ? (
            <p className="text-sm text-success" data-testid="missao-detalhe-msg-ja-concluida">
              Você já concluiu essa missão. Bom trabalho.
            </p>
          ) : (
            <form onSubmit={aoSubmeterConclusao} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-muted">Em qual tela o problema acontece?</label>
                <select
                  value={respostaTela}
                  onChange={(e) => setRespostaTela(e.target.value)}
                  data-testid="missao-detalhe-select-tela"
                  className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
                  disabled={segundosBloqueio > 0}
                >
                  <option value="">Selecione uma tela</option>
                  {telasDoSistema.map((tela) => (
                    <option key={tela} value={tela}>
                      {tela}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-ink-muted">Qual era o resultado esperado?</label>
                <div className="flex flex-col gap-2" data-testid="missao-detalhe-alternativas">
                  {missao.alternativas.map((alternativa, indice) => (
                    <label
                      key={alternativa.texto}
                      className={cn(
                        'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors',
                        respostaAlternativa === indice
                          ? 'border-neon-cyan/50 bg-neon-cyan/5 text-ink'
                          : 'border-white/10 text-ink-muted hover:border-white/20',
                      )}
                    >
                      <input
                        type="radio"
                        name="alternativa"
                        checked={respostaAlternativa === indice}
                        onChange={() => setRespostaAlternativa(indice)}
                        disabled={segundosBloqueio > 0}
                        data-testid={`missao-detalhe-alternativa-${indice}`}
                        className="mt-0.5 accent-neon-cyan"
                      />
                      {alternativa.texto}
                    </label>
                  ))}
                </div>
              </div>

              {erroTentativa && segundosBloqueio > 0 && (
                <div
                  className="flex items-center gap-2.5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
                  data-testid="missao-detalhe-msg-erro"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  Ainda não é isso. Reveja a tela e tente de novo em {segundosBloqueio}s.
                </div>
              )}

              <Button
                type="submit"
                variante="primary"
                disabled={segundosBloqueio > 0 || !respostaTela || respostaAlternativa === null}
                data-testid="missao-detalhe-btn-concluir"
                className="self-start"
              >
                {segundosBloqueio > 0 ? `Aguarde ${segundosBloqueio}s` : 'Concluir missão'}
              </Button>
            </form>
          )}
        </GlassCard>

        <GlassCard className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-ink-muted" />
            <h2 className="font-display font-semibold text-ink">Bug report (opcional)</h2>
          </div>
          <p className="text-sm text-ink-muted">
            Aproveite para treinar a escrita de um bug report no template do projeto. Fica salvo no seu progresso.
          </p>

          <form onSubmit={aoSalvarReport} className="flex flex-col gap-4" noValidate>
            <Input
              label="Título"
              value={formReport.titulo}
              onChange={(e) => setFormReport((f) => ({ ...f, titulo: e.target.value }))}
              data-testid="missao-detalhe-report-titulo"
            />
            <Input
              label="Pré-condição"
              value={formReport.preCondicao}
              onChange={(e) => setFormReport((f) => ({ ...f, preCondicao: e.target.value }))}
              data-testid="missao-detalhe-report-pre-condicao"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-muted">Passos para reproduzir</label>
              <textarea
                value={formReport.passos}
                onChange={(e) => setFormReport((f) => ({ ...f, passos: e.target.value }))}
                data-testid="missao-detalhe-report-passos"
                rows={3}
                className="rounded-lg bg-base-800/80 border border-white/10 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon-cyan"
              />
            </div>
            <Input
              label="Resultado atual"
              value={formReport.resultadoAtual}
              onChange={(e) => setFormReport((f) => ({ ...f, resultadoAtual: e.target.value }))}
              data-testid="missao-detalhe-report-resultado-atual"
            />
            <Input
              label="Resultado esperado"
              value={formReport.resultadoEsperado}
              onChange={(e) => setFormReport((f) => ({ ...f, resultadoEsperado: e.target.value }))}
              data-testid="missao-detalhe-report-resultado-esperado"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-muted">Severidade</label>
                <select
                  value={formReport.severidade}
                  onChange={(e) => setFormReport((f) => ({ ...f, severidade: e.target.value }))}
                  data-testid="missao-detalhe-report-severidade"
                  className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
                >
                  <option>Crítica</option>
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-muted">Prioridade</label>
                <select
                  value={formReport.prioridade}
                  onChange={(e) => setFormReport((f) => ({ ...f, prioridade: e.target.value }))}
                  data-testid="missao-detalhe-report-prioridade"
                  className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
                >
                  <option>Crítica</option>
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-muted">Observações</label>
              <textarea
                value={formReport.observacoes}
                onChange={(e) => setFormReport((f) => ({ ...f, observacoes: e.target.value }))}
                data-testid="missao-detalhe-report-observacoes"
                rows={2}
                className="rounded-lg bg-base-800/80 border border-white/10 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon-cyan"
              />
            </div>
            <Button type="submit" variante="secondary" data-testid="missao-detalhe-report-btn-salvar" className="self-start">
              Salvar bug report
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
