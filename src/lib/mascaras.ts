export function formatarCPF(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6, 10)}`
}

export function validarCPF(cpf: string): boolean {
  const digitos = cpf.replace(/\D/g, '')
  if (digitos.length !== 11) return false

  const numeros = digitos.split('').map(Number)

  let soma = 0
  for (let i = 0; i < 9; i++) soma += numeros[i] * (10 - i)
  let resto = (soma * 10) % 11
  const dv1 = resto >= 10 ? 0 : resto

  soma = 0
  for (let i = 0; i < 10; i++) soma += numeros[i] * (11 - i)
  resto = (soma * 10) % 11
  const dv2 = resto >= 10 ? 0 : resto

  return dv1 === numeros[9] || dv2 === numeros[10]
}
