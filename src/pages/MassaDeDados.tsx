import { useState } from 'react'
import { AlertTriangle, IdCard, RefreshCw, Wallet } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'
import { cupons } from '@/data/cupons'
import { gerarCPF } from '@/lib/mascaras'

interface UsuarioTeste {
  slug: string
  descricao: string
  email: string
  senha: string
  tom: 'success' | 'danger' | 'purple' | 'muted'
  etiqueta: string
}

const usuariosTeste: UsuarioTeste[] = [
  {
    slug: 'sucesso',
    descricao: 'Login funciona normalmente',
    email: 'usuario.sucesso@qazero.com',
    senha: 'Qa@123456',
    tom: 'success',
    etiqueta: 'Sucesso',
  },
  {
    slug: 'bloqueado',
    descricao: 'Deveria ser barrado por bloqueio',
    email: 'usuario.bloqueado@qazero.com',
    senha: 'Qa@123456',
    tom: 'danger',
    etiqueta: 'Bloqueado',
  },
  {
    slug: 'sempermissao',
    descricao: 'Entra, mas sem permissão de acesso',
    email: 'usuario.sempermissao@qazero.com',
    senha: 'Qa@123456',
    tom: 'purple',
    etiqueta: 'Sem permissão',
  },
  {
    slug: 'invalido',
    descricao: 'Não existe, serve para testar erro',
    email: 'usuario.invalido@qazero.com',
    senha: 'qualquer',
    tom: 'muted',
    etiqueta: 'Inválido',
  },
]

const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export function MassaDeDados() {
  const [cpfGerado, setCpfGerado] = useState(() => gerarCPF())

  return (
    <div className="container-arena flex flex-col gap-8 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Massa de dados</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          Dados de teste prontos para copiar e colar. Nada aqui é real.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning" data-testid="massa-dados-aviso">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        Nunca use dados reais de clientes, nem seus próprios dados pessoais, em ambiente de teste.
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-center font-display text-xl font-semibold text-ink">Gerador de CPF</h2>
        <p className="mx-auto max-w-xl text-center text-sm text-ink-muted">
          Um CPF fictício, gerado na hora, com dígito verificador válido. Use no formulário de Cadastro para nunca
          precisar digitar o seu CPF de verdade.
        </p>

        <GlassCard className="mx-auto flex w-full items-center justify-between gap-4 p-5" data-testid="massa-dados-gerador-cpf">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
              <IdCard size={20} />
            </span>
            <span data-testid="massa-dados-cpf-gerado" className="font-mono text-lg text-ink">
              {cpfGerado}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BotaoCopiar valor={cpfGerado} testId="massa-dados-btn-copiar-cpf" />
            <Button
              variante="secondary"
              tamanho="sm"
              onClick={() => setCpfGerado(gerarCPF())}
              data-testid="massa-dados-btn-gerar-cpf"
            >
              <RefreshCw size={16} />
              Gerar novo
            </Button>
          </div>
        </GlassCard>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-center font-display text-xl font-semibold text-ink">Usuários de teste</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {usuariosTeste.map((usuario) => (
            <GlassCard key={usuario.slug} className="flex flex-col gap-3 p-5" data-testid={`massa-dados-item-${usuario.slug}`}>
              <div className="flex items-center justify-between">
                <Badge tom={usuario.tom}>{usuario.etiqueta}</Badge>
              </div>
              <p className="text-sm text-ink-muted">{usuario.descricao}</p>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-base-900/60 px-3 py-2">
                <span className="truncate font-mono text-sm text-ink">{usuario.email}</span>
                <BotaoCopiar valor={usuario.email} testId={`massa-dados-copiar-email-${usuario.slug}`} />
              </div>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-base-900/60 px-3 py-2">
                <span className="truncate font-mono text-sm text-ink">{usuario.senha}</span>
                <BotaoCopiar valor={usuario.senha} testId={`massa-dados-copiar-senha-${usuario.slug}`} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-center font-display text-xl font-semibold text-ink">Cupons de teste</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cupons.map((cupom) => (
            <GlassCard key={cupom.codigo} className="flex flex-col gap-3 p-5" data-testid={`massa-dados-cupom-${cupom.codigo.toLowerCase()}`}>
              <Badge tom="cyan">{cupom.percentualAnunciado}% de desconto</Badge>
              <p className="text-sm text-ink-muted">{cupom.descricao}</p>
              <p className="text-xs text-ink-muted/70">Válido até {formatoData.format(new Date(cupom.validoAte))}</p>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-base-900/60 px-3 py-2">
                <span className="truncate font-mono text-sm text-ink">{cupom.codigo}</span>
                <BotaoCopiar valor={cupom.codigo} testId={`massa-dados-copiar-cupom-${cupom.codigo.toLowerCase()}`} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink-muted">
        <Wallet size={18} className="mt-0.5 shrink-0 text-neon-cyan" />
        Nesta fase, a compra é finalizada com os créditos QA da própria conta (veja o saldo na barra lateral da área
        logada). Cartão fictício e outras formas de pagamento chegam em uma fase futura.
      </div>
    </div>
  )
}
