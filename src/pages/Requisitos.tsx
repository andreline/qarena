import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface SecaoRequisitos {
  id: string
  titulo: string
  itens: string[] | null
}

const secoes: SecaoRequisitos[] = [
  {
    id: 'cadastro',
    titulo: 'Cadastro',
    itens: [
      'O cadastro só deve ser concluído quando o aceite dos termos estiver marcado',
      'O CPF informado deve ser validado pelo dígito verificador',
      'A senha e a confirmação de senha devem ser idênticas',
      'O telefone deve aceitar corretamente números de celular com nono dígito',
      'O sistema deve avisar quando o e-mail informado já estiver cadastrado',
      'Mensagens de sucesso só devem aparecer quando o cadastro for realmente concluído',
    ],
  },
  {
    id: 'login',
    titulo: 'Login',
    itens: [
      'Usuário com status bloqueado não deve conseguir acessar o sistema',
      'Senha incorreta deve exibir uma mensagem clara informando que a senha está incorreta',
      'O e-mail informado deve ser validado, incluindo espaços em branco no início ou no fim',
      'O botão de entrar só deve ficar habilitado quando e-mail e senha estiverem preenchidos',
      'O formato do e-mail deve ser validado antes do envio do formulário',
      'Usuário sem permissão de acesso deve ver uma mensagem clara, nunca uma tela vazia',
    ],
  },
  {
    id: 'loja',
    titulo: 'Loja',
    itens: [
      'A busca por produto deve funcionar independente de letras maiúsculas ou minúsculas',
      'O filtro de categoria deve mostrar apenas produtos daquela categoria',
      'Produtos sem estoque não devem poder ser adicionados ao carrinho',
    ],
  },
  {
    id: 'carrinho',
    titulo: 'Carrinho',
    itens: [
      'A quantidade mínima de um item no carrinho deve ser 1, para remover use o botão de remover',
      'O valor total do carrinho deve ser a soma de cada item multiplicado pela quantidade escolhida',
      'O contador de itens do carrinho deve refletir corretamente o que está no carrinho, inclusive depois de remover um item',
    ],
  },
  { id: 'checkout', titulo: 'Cupom e Checkout', itens: null },
  { id: 'perfil', titulo: 'Perfil do Usuário', itens: null },
  { id: 'pedidos', titulo: 'Meus Pedidos', itens: null },
]

export function Requisitos() {
  const [secaoAberta, setSecaoAberta] = useState<string | null>('cadastro')

  function alternarSecao(id: string) {
    setSecaoAberta((atual) => (atual === id ? null : id))
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Requisitos</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          Aqui está o comportamento esperado de cada tela do QArena. Use esta página como referência para comparar
          com o que você observa durante o teste.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        {secoes.map((secao) => {
          const aberta = secaoAberta === secao.id
          return (
            <GlassCard key={secao.id} className="overflow-hidden p-0">
              <button
                type="button"
                onClick={() => alternarSecao(secao.id)}
                aria-expanded={aberta}
                data-testid={`requisitos-secao-${secao.id}`}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
              >
                <span className="font-display font-semibold text-ink">{secao.titulo}</span>
                <div className="flex items-center gap-3">
                  {!secao.itens && <Badge tom="muted">Em breve</Badge>}
                  <ChevronDown
                    size={18}
                    className={cn('text-ink-muted transition-transform duration-200', aberta && 'rotate-180')}
                  />
                </div>
              </button>

              {aberta && (
                <div className="border-t border-white/10 px-5 py-4" data-testid={`requisitos-conteudo-${secao.id}`}>
                  {secao.itens ? (
                    <ul className="flex flex-col gap-2.5">
                      {secao.itens.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-muted">Os requisitos desta tela ainda vão ser publicados.</p>
                  )}
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
