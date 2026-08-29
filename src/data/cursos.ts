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
  {
    id: 'claude-alem-do-prompt',
    nome: 'IA para QA e Tech: Claude Além do Prompt',
    descricao: 'Como usar o Claude de verdade no dia a dia de QA e Tech, muito além de mandar um prompt.',
    url: 'https://andrelinegfl.hotmart.host/ia-para-qa-e-tech-claude-alem-do-prompt-c42d47aa-1c85-4d4e-96f1-9ebc2b43a290',
  },
]
