import { SignUpUser, SignUpApiResponse } from "../shared/EntityTypes.ts"
import { post } from "../../../services/ApiConfig.ts"

export function signUp(user: SignUpUser) {
  return post<SignUpApiResponse>("users", user)
}
