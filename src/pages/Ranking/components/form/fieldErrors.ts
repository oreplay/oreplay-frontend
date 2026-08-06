/** TanStack Form exposes one message per failed validator; join them for display. */
export function joinFieldErrors(errors: (string | undefined)[]): string | undefined {
  return errors.filter(Boolean).join(" ") || undefined
}
