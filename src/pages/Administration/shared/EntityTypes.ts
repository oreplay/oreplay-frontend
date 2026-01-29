import { Data } from "../../../shared/EntityTypes.ts"

export type SignUpApiResponse = Data<SignUpResponseModel>

interface SignUpResponseModel extends SignUpUser {
  id: string
  created: string
  modified: string
}

export interface SignUpUser {
  first_name: string
  last_name: string
  email: string
  password: string
  preferred_language: string
}
