import { FileText, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'
import { templateBugReport, exemploBugReportPreenchido } from '@/data/bugReportTemplate'

export function BugReport() {
  return (
    <div className="container-arena flex flex-col gap-10 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Template de bug report</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          Um modelo em branco para você preencher a cada bug encontrado, e um exemplo real de como fica preenchido.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-neon-purple" />
            <h2 className="font-display text-xl font-semibold text-ink">Modelo em branco</h2>
          </div>
          <BotaoCopiar valor={templateBugReport} testId="bug-report-btn-copiar-vazio" rotulo="Copiar modelo" />
        </div>

        <GlassCard className="p-6" data-testid="bug-report-template-vazio">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-ink-muted">{templateBugReport}</pre>
        </GlassCard>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-neon-cyan" />
            <h2 className="font-display text-xl font-semibold text-ink">Exemplo preenchido</h2>
          </div>
          <BotaoCopiar valor={exemploBugReportPreenchido} testId="bug-report-btn-copiar-exemplo" rotulo="Copiar exemplo" />
        </div>

        <GlassCard className="border-neon-cyan/20 p-6" data-testid="bug-report-exemplo">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-ink-muted">{exemploBugReportPreenchido}</pre>
        </GlassCard>

        <p className="text-xs text-ink-muted/70">
          Esse exemplo usa um bug real do QArena, o do cupom de desconto no checkout, só para mostrar como fica um
          relato bem escrito. Encontrar o motivo por trás dele é com você.
        </p>
      </div>
    </div>
  )
}
