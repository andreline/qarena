import { BookOpen, ClipboardCheck, FileText, Search, UserPlus } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'

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
    descricao: 'Escreva um bug report para cada problema encontrado. Use o modelo abaixo se quiser um ponto de partida.',
    Icone: ClipboardCheck,
  },
]

const templateBugReport = `## Título do bug


**Tela:**

**Passos para reproduzir:**
1.
2.
3.

**Resultado esperado:**


**Resultado atual:**


**Severidade:** (crítica / alta / média / baixa)

**Ambiente:** QArena (ambiente de treino)
`

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

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-neon-purple" />
            <h2 className="font-display text-xl font-semibold text-ink">Modelo de bug report</h2>
          </div>
          <BotaoCopiar valor={templateBugReport} testId="instrucoes-btn-copiar-template" rotulo="Copiar modelo" />
        </div>

        <GlassCard className="p-6" data-testid="instrucoes-template-bug-report">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-ink-muted">{templateBugReport}</pre>
        </GlassCard>
      </div>
    </div>
  )
}
