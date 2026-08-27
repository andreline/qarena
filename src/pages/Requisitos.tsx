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
      'A navegação por Tab entre os campos deve seguir a ordem visual do formulário',
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
      'Uma conta suspensa deve ser barrada no login, com uma mensagem clara explicando o motivo',
      'Depois de sair da conta, voltar no navegador não deve mostrar novamente uma tela autenticada',
      'A opção "Lembrar-me" deve realmente manter a sessão ativa por mais tempo quando marcada',
      'Uma conta em primeiro acesso deve ser obrigada a trocar a senha antes de continuar usando o sistema',
      'Um cadastro pendente de regularização não deve dar acesso ao restante do sistema até ser regularizado',
      'Depois de regularizar o cadastro, o status pendente não deve voltar a aparecer nos próximos logins',
      'Um cadastro pendente de regularização não deve conseguir finalizar compras acessando rotas diretamente pela URL',
    ],
  },
  {
    id: 'loja',
    titulo: 'Loja',
    itens: [
      'A busca por produto deve funcionar independente de letras maiúsculas ou minúsculas',
      'Cada categoria deve mostrar somente os produtos que pertencem a ela, sem faltar nem duplicar',
      'Trocar de categoria deve substituir completamente o filtro anterior, não somar com ele',
      'Produtos sem estoque não devem poder ser adicionados ao carrinho',
      'A busca deve encontrar produtos que contenham o termo digitado em qualquer parte do nome, não só no início',
      'A busca deve funcionar independente de acentuação',
      'A ordenação por "Menor preço" deve considerar o valor numérico dos preços',
      'O contador de filtros aplicados deve refletir os filtros realmente ativos no momento',
      'O texto de resultados deve mostrar a quantidade de produtos exibida na página atual',
      'O campo de busca deve ter um rótulo associado, para acessibilidade',
      'As imagens dos produtos devem ter um texto alternativo descritivo com o nome do produto',
      'Preços acima de mil reais devem exibir o separador de milhar',
      'Nomes de produtos longos não podem estourar o layout do card',
    ],
  },
  {
    id: 'carrinho',
    titulo: 'Carrinho',
    itens: [
      'A quantidade mínima de um item no carrinho deve ser 1, para remover use o botão de remover',
      'O valor total do carrinho deve ser a soma de cada item multiplicado pela quantidade escolhida',
      'O contador de itens do carrinho deve refletir corretamente o que está no carrinho, inclusive depois de remover um item',
      'O carrinho deve ser exclusivo de cada conta logada',
      'O campo de quantidade deve aceitar apenas números',
    ],
  },
  {
    id: 'checkout',
    titulo: 'Cupom e Checkout',
    itens: [
      'O cupom QA10 deve conceder exatamente 10% de desconto sobre o subtotal',
      'Cupons fora do prazo de validade não devem ser aceitos',
      'O código do cupom deve ser reconhecido independente de estar em maiúsculas ou minúsculas',
      'Um cupom inválido deve exibir uma mensagem clara informando que o código não foi encontrado',
      'Remover o cupom aplicado deve retornar o total ao valor original, sem desconto',
      'A compra não deve ser concluída se o saldo de créditos QA for insuficiente',
      'O botão de finalizar compra deve impedir o envio duplicado do mesmo pedido',
    ],
  },
  {
    id: 'perfil',
    titulo: 'Perfil do Usuário',
    itens: [
      'A troca de senha deve exigir a senha atual correta',
      'Um e-mail já usado por outra conta não deve ser aceito na edição do perfil',
      'As alterações salvas no perfil devem persistir corretamente, inclusive o telefone',
      'O nome não pode ser salvo em branco',
      'Quando a confirmação de senha não é igual à nova senha, deve aparecer uma mensagem explicando o motivo',
    ],
  },
  {
    id: 'pedidos',
    titulo: 'Meus Pedidos',
    itens: [
      'A lista de pedidos deve mostrar apenas os pedidos do usuário logado',
      'Os pedidos devem aparecer do mais recente para o mais antigo',
      'O valor exibido em cada pedido deve ser o total pago, já considerando o desconto do cupom',
      'O filtro por status deve mostrar apenas pedidos com aquele status',
    ],
  },
  {
    id: 'massa-de-dados',
    titulo: 'Massa de Dados',
    itens: [
      'As datas devem ser exibidas no formato brasileiro (dia/mês/ano) em todas as telas do site',
    ],
  },
  {
    id: 'area-administrativa',
    titulo: 'Área Administrativa',
    itens: [
      'Somente usuários com perfil de administrador devem conseguir acessar a área administrativa, inclusive por acesso direto pela URL',
      'Uma edição feita pelo administrador deve refletir para todos os usuários do sistema',
      'O campo de preço não deve aceitar valores negativos',
      'O campo de estoque deve aceitar apenas números',
      'Uma URL de imagem inválida deve ser validada, ou o card deve ter uma imagem alternativa quando a imagem falha',
      'Marcar um produto como fora de estoque deve remover o item do carrinho de quem já tinha adicionado',
      'Excluir um produto pela listagem deve pedir confirmação antes de excluir de verdade',
      'O painel resumo do topo deve atualizar imediatamente depois de qualquer edição',
    ],
  },
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
