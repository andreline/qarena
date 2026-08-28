import { useState } from 'react'
import { Inbox, Trash2, CheckCheck, MailOpen, ArrowLeft, AlertCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useEmailStore, type Email } from '@/store/emailStore'

const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function trechoDoCorpo(corpo: string): string {
  return corpo
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90)
}

export function CaixaDeEntrada() {
  const emails = useEmailStore((estado) => estado.emails)
  const marcarComoLido = useEmailStore((estado) => estado.marcarComoLido)
  const apagarEmail = useEmailStore((estado) => estado.apagarEmail)
  const limparCaixa = useEmailStore((estado) => estado.limparCaixa)

  const [emailSelecionadoId, setEmailSelecionadoId] = useState<string | null>(null)
  const emailSelecionado = emails.find((e) => e.id === emailSelecionadoId) ?? null

  function aoSelecionar(email: Email) {
    setEmailSelecionadoId(email.id)
    marcarComoLido(email.id)
  }

  function aoApagar(id: string) {
    apagarEmail(id)
    if (emailSelecionadoId === id) setEmailSelecionadoId(null)
  }

  function aoLimparCaixa() {
    limparCaixa()
    setEmailSelecionadoId(null)
  }

  return (
    <div className="container-arena flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Inbox size={24} className="text-neon-cyan" />
          <h1 className="font-display text-3xl font-bold text-ink">Caixa de entrada</h1>
        </div>
        {emails.length > 0 && (
          <Button variante="ghost" tamanho="sm" onClick={aoLimparCaixa} data-testid="caixa-entrada-btn-limpar">
            <Trash2 size={16} />
            Limpar caixa
          </Button>
        )}
      </div>

      <div
        className="flex items-start gap-3 rounded-lg border border-neon-purple/30 bg-neon-purple/5 px-4 py-3 text-sm text-ink-muted"
        data-testid="caixa-entrada-aviso"
      >
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-neon-purple" />
        Esta é uma caixa de entrada simulada. Nenhum e-mail real é enviado, tudo acontece dentro do seu navegador.
      </div>

      {emails.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center" data-testid="caixa-entrada-vazia">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ink-muted">
            <Inbox size={26} />
          </span>
          <h2 className="font-display text-xl font-semibold text-ink">Nenhum e-mail por aqui ainda</h2>
          <p className="max-w-sm text-ink-muted">
            Cadastre-se, finalize uma compra ou peça a recuperação de senha para ver e-mails chegando aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div
            className={cn('flex flex-col gap-2', emailSelecionado && 'hidden lg:flex')}
            data-testid="caixa-entrada-lista"
          >
            {emails.map((email) => (
              <button
                key={email.id}
                type="button"
                onClick={() => aoSelecionar(email)}
                data-testid={`caixa-entrada-item-${email.id}`}
                className={cn(
                  'flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors cursor-pointer',
                  emailSelecionadoId === email.id
                    ? 'border-neon-cyan/50 bg-neon-cyan/5'
                    : 'border-white/10 bg-base-800/60 hover:border-white/20',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('truncate text-sm', email.lido ? 'text-ink-muted' : 'font-semibold text-ink')}>
                    {email.remetente}
                  </span>
                  {!email.lido && <span className="h-2 w-2 shrink-0 rounded-full bg-neon-cyan" />}
                </div>
                <p className={cn('truncate text-sm', email.lido ? 'text-ink-muted' : 'font-semibold text-ink')}>
                  {email.assunto || '(sem assunto)'}
                </p>
                <p className="truncate text-xs text-ink-muted">{trechoDoCorpo(email.corpo)}</p>
                <p className="text-xs text-ink-muted/70">{formatoData.format(new Date(email.dataEnvio))}</p>
              </button>
            ))}
          </div>

          <div className={cn('flex flex-col gap-4', !emailSelecionado && 'hidden lg:flex')}>
            {emailSelecionado ? (
              <GlassCard className="flex flex-col gap-4 p-6" data-testid="caixa-entrada-leitura">
                <button
                  type="button"
                  onClick={() => setEmailSelecionadoId(null)}
                  className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink lg:hidden cursor-pointer"
                  data-testid="caixa-entrada-btn-voltar"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>

                <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {emailSelecionado.assunto || '(sem assunto)'}
                    </h2>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => marcarComoLido(emailSelecionado.id)}
                        aria-label="Marcar como lido"
                        data-testid="caixa-entrada-btn-marcar-lido"
                        className="text-ink-muted hover:text-neon-cyan cursor-pointer"
                      >
                        {emailSelecionado.lido ? <CheckCheck size={18} /> : <MailOpen size={18} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => aoApagar(emailSelecionado.id)}
                        aria-label="Apagar e-mail"
                        data-testid="caixa-entrada-btn-apagar"
                        className="text-ink-muted hover:text-danger cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-ink-muted">
                    De <span className="font-mono">{emailSelecionado.remetente}</span> para{' '}
                    <span className="font-mono">{emailSelecionado.destinatario}</span>
                  </p>
                  <p className="text-xs text-ink-muted/70">{formatoData.format(new Date(emailSelecionado.dataEnvio))}</p>
                </div>

                <div
                  data-testid="caixa-entrada-corpo"
                  dangerouslySetInnerHTML={{ __html: emailSelecionado.corpo }}
                />
              </GlassCard>
            ) : (
              <div className="hidden flex-1 flex-col items-center justify-center gap-2 text-center lg:flex" data-testid="caixa-entrada-sem-selecao">
                <Badge tom="muted">Nenhum e-mail selecionado</Badge>
                <p className="text-sm text-ink-muted">Escolha um e-mail na lista para ler o conteúdo aqui.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
