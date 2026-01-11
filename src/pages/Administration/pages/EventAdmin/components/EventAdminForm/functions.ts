/**
 * Simple URL validator
 * @param url
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
