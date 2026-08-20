export type ClasseCss = string | false | null | undefined

export function cn(...classes: ClasseCss[]): string {
  return classes.filter(Boolean).join(' ')
}
