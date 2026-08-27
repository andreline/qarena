export const REMETENTE_QARENA = 'nao-responda@qarena.com'

interface EmailRecuperacaoSenha {
  assunto: string
  corpo: string
}

export function montarEmailRecuperacaoSenha(nome: string, linkRedefinicao: string): EmailRecuperacaoSenha {
  return {
    assunto: 'Recupere o acesso à sua conta QArena',
    corpo: `
      <div style="font-family: Arial, sans-serif; color: #1f2430;">
        <p>Olá, ${nome}.</p>
        <p>Recebemos um pedido para redefinir a senha da sua conta no QArena.</p>
        <p>
          <a href="${linkRedefinicao}" style="display: inline-block; padding: 12px 20px; background: #22d3ee; color: #0b0f19; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Redefinir minha senha
          </a>
        </p>
        <p>Este link é válido por 15 minutos. Se você não pediu essa alteração, pode ignorar este e-mail.</p>
        <p>Equipe QArena</p>
      </div>
    `.trim(),
  }
}
