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

export function gerarCPF(): string {
  const numeros = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  function calcularDigito(base: number[]): number {
    let soma = 0
    let peso = base.length + 1
    for (const numero of base) {
      soma += numero * peso
      peso--
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const dv1 = calcularDigito(numeros)
  const dv2 = calcularDigito([...numeros, dv1])
  const todosOsDigitos = [...numeros, dv1, dv2].join('')

  return formatarCPF(todosOsDigitos)
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
