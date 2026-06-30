import { UserModel } from "./EntityTypes.ts"

// A user's permissions are a delimited list of scope tokens: "*" grants global
// admin (access to everything), and granular grants look like "ranking:r".
export const ADMIN_SCOPE = "*"

function scopeTokens(user: UserModel | null): string[] {
  return user?.scope?.split(/[\s,]+/).filter(Boolean) ?? []
}

export function hasScope(user: UserModel | null, scope: string): boolean {
  return scopeTokens(user).includes(scope)
}

/** Global site admin — the `*` scope covers every area, rankings included. */
export function isAdmin(user: UserModel | null): boolean {
  return hasScope(user, ADMIN_SCOPE)
}
