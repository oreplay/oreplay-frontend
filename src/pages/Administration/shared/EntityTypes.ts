import { Data } from "../../../shared/EntityTypes.ts"

export type SignUpApiResponse = Data<SignUpResponseModel>

interface SignUpResponseModel extends SignUpUser {
  id: string
  created: string
  modified: string
}

export interface SignUpUser {
  email: string
  email_me: boolean
  first_name: string
  last_name: string
  password: string
  preferred_language: string
}
