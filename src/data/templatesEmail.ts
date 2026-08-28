export const REMETENTE_QARENA = 'nao-responda@qarena.com'

interface ConteudoEmail {
  assunto: string
  corpo: string
}

const formatoDataAmericana = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' })

function quebrarAcentuacao(texto: string): string {
  const mapa: Record<string, string> = {
    á: 'Ã¡', à: 'Ã ', ã: 'Ã£', â: 'Ã¢', ä: 'Ã¤',
    é: 'Ã©', ê: 'Ã',
    í: 'Ã­',
    ó: 'Ã³', õ: 'Ã˜', ô: 'Ã´',
    ú: 'Ãº', ü: 'Ã¼',
    ç: 'Ã§',
    Á: 'Ã', À: 'Ã€', Ã: 'Ã', Â: 'Ã‚',
    É: 'Ã‰', Ê: 'ÃŠ',
    Í: 'Ã',
    Ó: 'Ã“', Õ: 'Ã•', Ô: 'Ã”',
    Ú: 'Ãš',
    Ç: 'Ã‡',
  }
  return texto.replace(/[áàãâäéêíóõôúüçÁÀÃÂÉÊÍÓÕÔÚÇ]/g, (letra) => mapa[letra] ?? letra)
}

function cabecalho(): string {
  return `
    <div style="padding: 18px 32px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.09); display: flex; align-items: center; gap: 10px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed, #22d3ee); color: #0b0f19; font-weight: 800; font-family: Arial, sans-serif; font-size: 15px;">Q</span>
      <span style="font-family: Arial, sans-serif; font-weight: 700; font-size: 16px; color: var(--color-ink);">QArena</span>
    </div>
    <div style="padding: 32px; font-family: Arial, sans-serif; color: var(--color-ink); line-height: 1.75; max-width: 60ch;">
  `.trim()
}

function paragrafo(html: string): string {
  return `<p style="margin: 0 0 16px; color: var(--color-ink);">${html}</p>`
}

function destaque(html: string): string {
  return `<p style="margin: 0 0 16px; font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #22d3ee;">${html}</p>`
}

function botao(href: string, texto: string): string {
  return `
    <div style="margin: 24px 0;">
      <a href="${href}" style="display: inline-block; padding: 14px 28px; background: #22d3ee; color: #0b0f19; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: Arial, sans-serif;">
        ${texto}
      </a>
    </div>
  `.trim()
}

function rodape(): string {
  return `
    </div>
    <div style="margin: 0 32px; border-top: 1px solid rgba(255,255,255,0.09);"></div>
    <div style="padding: 20px 32px; font-family: Arial, sans-serif; color: var(--color-ink-muted); font-size: 12.5px; line-height: 1.6;">
      Equipe QArena<br />
      Esta é uma mensagem automática, não é necessário responder.
    </div>
  `.trim()
}

export function montarEmailBoasVindas(nome: string, numeroConta: string): ConteudoEmail {
  return {
    assunto: 'Bem-vindo à QArena',
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo('Sua conta no QArena foi criada com sucesso. Guarde o número da sua conta para se identificar no ambiente:')}
      ${destaque(numeroConta)}
      ${paragrafo('Boa sorte na caçada aos bugs.')}
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailRecuperacaoSenha(nome: string, linkRedefinicao: string): ConteudoEmail {
  return {
    assunto: 'Recupere o acesso à sua conta QArena',
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo('Recebemos um pedido para redefinir a senha da sua conta no QArena.')}
      ${botao(linkRedefinicao, 'Redefinir minha senha')}
      ${paragrafo('Este link é válido por 15 minutos. Se você não pediu essa alteração, pode ignorar este e-mail.')}
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailSenhaAlterada(nome: string): ConteudoEmail {
  return {
    assunto: 'Sua senha foi alterada',
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo('A senha da sua conta no QArena foi alterada.')}
      ${paragrafo('Se você não fez essa alteração, entre em contato o quanto antes.')}
      ${rodape()}
    `.trim(),
  }
}

interface ItemEmailPedido {
  nome: string
  quantidade: number
}

export function montarEmailPedidoConfirmado(
  nome: string,
  numeroPedido: string,
  itens: ItemEmailPedido[],
  valorExibido: number,
  enderecoEntrega: string,
): ConteudoEmail & { remetente: string } {
  const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  const listaItens = itens
    .map((item) => `<li style="margin-bottom: 4px;">${item.nome} x${item.quantidade}</li>`)
    .join('')

  return {
    remetente: 'nao-responda@qarena-mail.com',
    assunto: `Pedido ${numeroPedido} confirmado`,
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo('Seu pedido foi confirmado com sucesso.')}
      ${destaque(numeroPedido)}
      <ul style="margin: 0 0 16px; padding-left: 20px; color: var(--color-ink);">${listaItens}</ul>
      ${paragrafo(`Total: <strong>${formatoMoeda.format(valorExibido)}</strong>`)}
      ${paragrafo(`Endereço de entrega: ${enderecoEntrega}`)}
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailPedidoEnviado(
  nome: string,
  numeroPedido: string,
  codigoRastreio: string,
  linkRastreio: string,
): ConteudoEmail {
  const dataEnvio = formatoDataAmericana.format(new Date())
  return {
    assunto: `Pedido ${numeroPedido} enviado`,
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo(`Seu pedido saiu para entrega em ${dataEnvio}.`)}
      ${paragrafo(`Código de rastreio: <span style="font-family: 'JetBrains Mono', monospace; color: #22d3ee;">${codigoRastreio}</span>`)}
      ${botao(linkRastreio, 'Rastrear meu pedido')}
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailPedidoCancelado(nome: string, numeroPedido: string): ConteudoEmail {
  return {
    assunto: `Pedido ${numeroPedido} cancelado`,
    corpo: `
      ${cabecalho()}
      ${paragrafo(`Olá, ${nome}.`)}
      ${paragrafo('Seu pedido foi cancelado, conforme solicitado.')}
      ${destaque(numeroPedido)}
      ${paragrafo('Se você não pediu esse cancelamento, entre em contato o quanto antes.')}
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailCupomDesbloqueado(nome: string, codigoCupom: string): ConteudoEmail {
  return {
    assunto: '',
    corpo: `
      ${cabecalho()}
      ${paragrafo('Olá, {{nome}}.')}
      ${paragrafo('Parabéns! Você desbloqueou um cupom de desconto para a sua próxima compra.')}
      ${destaque(codigoCupom)}
      ${paragrafo(`Aproveite antes que expire, ${quebrarAcentuacao(nome)}.`)}
      ${rodape()}
    `.trim(),
  }
}
