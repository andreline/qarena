export interface Curso {
  id: string
  nome: string
  descricao: string
  url: string
}

export const cursos: Curso[] = [
  {
    id: 'qa-do-zero',
    nome: 'QA do Zero',
    descricao: 'A base que todo analista de qualidade precisa ter, do primeiro conceito ao primeiro emprego.',
    url: 'https://andrelinegfl.hotmart.host/qa-do-zero-a-base-que-todo-analista-de-qualidade-precisa-ter-92190e5b-8be7-4fb9-815a-e6ec4a9197ca',
  },
]

export interface RedeSocial {
  id: string
  nome: string
  url: string
}

export const redesSociais: RedeSocial[] = [
  { id: 'instagram', nome: 'Instagram', url: 'https://www.instagram.com/andreline.qa/' },
  { id: 'linkedin', nome: 'LinkedIn', url: 'https://www.linkedin.com/in/andrelineflira/' },
  { id: 'tiktok', nome: 'TikTok', url: 'https://www.tiktok.com/@andreline.lira' },
]
