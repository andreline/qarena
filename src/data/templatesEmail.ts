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
    <div style="font-family: Arial, sans-serif; background: #0b0f19; padding: 24px;">
      <div style="max-width: 480px; margin: 0 auto; background: #131a2b; border-radius: 12px; overflow: hidden;">
        <div style="padding: 20px 24px; background: linear-gradient(90deg, #7c3aed, #22d3ee); color: #0b0f19; font-weight: bold; font-size: 18px;">
          QArena
        </div>
        <div style="padding: 24px; color: #e5e7eb;">
  `.trim()
}

function rodape(): string {
  return `
        </div>
        <div style="padding: 16px 24px; color: #7d879c; font-size: 12px; border-top: 1px solid #1f2937;">
          Equipe QArena
        </div>
      </div>
    </div>
  `.trim()
}

export function montarEmailBoasVindas(nome: string, numeroConta: string): ConteudoEmail {
  return {
    assunto: 'Bem-vindo à QArena',
    corpo: `
      ${cabecalho()}
      <p>Olá, ${nome}.</p>
      <p>Sua conta no QArena foi criada com sucesso. Guarde o número da sua conta para se identificar no ambiente:</p>
      <p style="font-family: monospace; font-size: 18px; color: #22d3ee;">${numeroConta}</p>
      <p>Boa sorte na caçada aos bugs.</p>
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailRecuperacaoSenha(nome: string, linkRedefinicao: string): ConteudoEmail {
  return {
    assunto: 'Recupere o acesso à sua conta QArena',
    corpo: `
      ${cabecalho()}
      <p>Olá, ${nome}.</p>
      <p>Recebemos um pedido para redefinir a senha da sua conta no QArena.</p>
      <p>
        <a href="${linkRedefinicao}" style="display: inline-block; padding: 12px 20px; background: #22d3ee; color: #0b0f19; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Redefinir minha senha
        </a>
      </p>
      <p>Este link é válido por 15 minutos. Se você não pediu essa alteração, pode ignorar este e-mail.</p>
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailSenhaAlterada(nome: string): ConteudoEmail {
  return {
    assunto: 'Sua senha foi alterada',
    corpo: `
      ${cabecalho()}
      <p>Olá, ${nome}.</p>
      <p>A senha da sua conta no QArena foi alterada.</p>
      <p>Se você não fez essa alteração, entre em contato o quanto antes.</p>
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
  const listaItens = itens.map((item) => `<li>${item.nome} x${item.quantidade}</li>`).join('')

  return {
    remetente: 'nao-responda@qarena-mail.com',
    assunto: `Pedido ${numeroPedido} confirmado`,
    corpo: `
      ${cabecalho()}
      <p>Olá, ${nome}.</p>
      <p>Seu pedido foi confirmado com sucesso.</p>
      <p style="font-family: monospace; color: #22d3ee;">${numeroPedido}</p>
      <ul>${listaItens}</ul>
      <p>Total: <strong>${formatoMoeda.format(valorExibido)}</strong></p>
      <p>Endereço de entrega: ${enderecoEntrega}</p>
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
      <p>Olá, ${nome}.</p>
      <p>Seu pedido saiu para entrega em ${dataEnvio}.</p>
      <p>Código de rastreio: <span style="font-family: monospace; color: #22d3ee;">${codigoRastreio}</span></p>
      <p>
        <a href="${linkRastreio}" style="display: inline-block; padding: 12px 20px; background: #22d3ee; color: #0b0f19; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Rastrear meu pedido
        </a>
      </p>
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailPedidoCancelado(nome: string, numeroPedido: string): ConteudoEmail {
  return {
    assunto: `Pedido ${numeroPedido} cancelado`,
    corpo: `
      ${cabecalho()}
      <p>Olá, ${nome}.</p>
      <p>Seu pedido foi cancelado, conforme solicitado.</p>
      <p style="font-family: monospace; color: #22d3ee;">${numeroPedido}</p>
      <p>Se você não pediu esse cancelamento, entre em contato o quanto antes.</p>
      ${rodape()}
    `.trim(),
  }
}

export function montarEmailCupomDesbloqueado(nome: string, codigoCupom: string): ConteudoEmail {
  return {
    assunto: '',
    corpo: `
      ${cabecalho()}
      <p>Olá, {{nome}}.</p>
      <p>Parabéns! Você desbloqueou um cupom de desconto para a sua próxima compra.</p>
      <p style="font-family: monospace; font-size: 18px; color: #22d3ee;">${codigoCupom}</p>
      <p>Aproveite antes que expire, ${quebrarAcentuacao(nome)}.</p>
      ${rodape()}
    `.trim(),
  }
}
