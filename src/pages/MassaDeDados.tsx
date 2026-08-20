import { AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'

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

const secoesFuturas = ['Cupons', 'Cartões de teste', 'Produtos da loja']

export function MassaDeDados() {
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

      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-center font-display text-xl font-semibold text-ink">Outras massas de dados</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {secoesFuturas.map((titulo) => (
            <GlassCard key={titulo} className="flex flex-col items-center gap-2 p-5 text-center opacity-70">
              <span className="font-display font-semibold text-ink">{titulo}</span>
              <Badge tom="muted">Em breve</Badge>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
