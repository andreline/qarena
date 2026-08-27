import { Link } from 'react-router-dom'
import { BookOpen, ClipboardCheck, Download, FileSpreadsheet, FileText, Search, UserPlus } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

const passos = [
  {
    numero: '01',
    titulo: 'Crie sua conta e entre',
    descricao: 'Cadastre uma conta com dados fictícios (ou use a Massa de Dados) e faça login para acessar a área logada.',
    Icone: UserPlus,
  },
  {
    numero: '02',
    titulo: 'Leia os Requisitos',
    descricao: 'Antes de testar qualquer tela, veja o comportamento esperado dela na página de Requisitos.',
    Icone: BookOpen,
  },
  {
    numero: '03',
    titulo: 'Teste e compare',
    descricao: 'Use a tela normalmente e compare o que você esperava com o que realmente aconteceu.',
    Icone: Search,
  },
  {
    numero: '04',
    titulo: 'Documente o que encontrar',
    descricao: 'Escreva um bug report para cada problema encontrado. Tem um modelo pronto (e um exemplo preenchido) na página de Bug Report.',
    Icone: ClipboardCheck,
  },
]

const modelos = [
  {
    id: 'caderno-de-teste',
    titulo: 'Caderno de Teste',
    arquivo: '/modelos/caderno-de-teste-qa.xlsx',
    nomeArquivo: 'caderno-de-teste-qa.xlsx',
    Icone: FileSpreadsheet,
    descricao:
      'Uma planilha para registrar os casos de teste que você executar aqui no QArena, seja um regressivo completo ou um teste exploratório em uma tela só. Tem uma aba explicando como preencher e a legenda de status (Passou, Falhou, Bloqueado, Não Executado).',
    dica: 'Use um caderno por ciclo: um para testar o cadastro, outro para o checkout, e assim por diante.',
  },
  {
    id: 'planejamento-de-qualidade',
    titulo: 'Planejamento de Qualidade',
    arquivo: '/modelos/planejamento-de-qualidade.docx',
    nomeArquivo: 'planejamento-de-qualidade.docx',
    Icone: FileText,
    descricao:
      'Um documento para planejar os testes antes de começar a testar de fato: escopo, cenários de sucesso, erro e exceção (no formato Dado, Quando, Então), riscos e critérios de pronto.',
    dica: 'Preencha esse modelo antes de abrir o Caderno de Teste, pensando em qual laboratório do QArena você vai investigar.',
  },
]

export function Instrucoes() {
  return (
    <div className="container-arena flex flex-col gap-12 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Instruções</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          Um roteiro curto para tirar o melhor proveito do QArena.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {passos.map((passo) => (
          <GlassCard key={passo.numero} className="flex flex-col gap-3 p-6">
            <span className="font-mono text-sm text-neon-cyan">{passo.numero}</span>
            <passo.Icone size={22} className="text-ink-muted" />
            <h2 className="font-display font-semibold text-ink">{passo.titulo}</h2>
            <p className="text-sm text-ink-muted">{passo.descricao}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <FileText size={22} className="shrink-0 text-neon-purple" />
          <div>
            <h2 className="font-display font-semibold text-ink">Modelo de bug report</h2>
            <p className="text-sm text-ink-muted">Template em branco, pronto para copiar, mais um exemplo preenchido.</p>
          </div>
        </div>
        <Link to="/bug-report">
          <Button variante="secondary" tamanho="sm" data-testid="instrucoes-link-bug-report">
            Ver modelo de bug report
          </Button>
        </Link>
      </GlassCard>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center gap-2">
          <Download size={20} className="text-neon-cyan" />
          <h2 className="font-display text-xl font-semibold text-ink">Modelos para organizar seus testes</h2>
        </div>
        <p className="text-sm text-ink-muted">
          Dois modelos prontos, criados pela Andreline, para você usar enquanto testa o QArena (ou qualquer outro
          projeto depois).
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {modelos.map((modelo) => (
            <GlassCard key={modelo.id} className="flex flex-col gap-3 p-6" data-testid={`instrucoes-modelo-${modelo.id}`}>
              <modelo.Icone size={22} className="text-neon-purple" />
              <h3 className="font-display font-semibold text-ink">{modelo.titulo}</h3>
              <p className="text-sm text-ink-muted">{modelo.descricao}</p>
              <p className="text-xs text-ink-muted/70">{modelo.dica}</p>
              <a href={modelo.arquivo} download={modelo.nomeArquivo} className="mt-auto">
                <Button variante="secondary" tamanho="sm" data-testid={`instrucoes-btn-baixar-${modelo.id}`} className="w-full">
                  <Download size={16} />
                  Baixar {modelo.nomeArquivo}
                </Button>
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
