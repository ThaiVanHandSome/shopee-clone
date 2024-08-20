import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  expires: string
  user: User
}>

export interface RegisterType {
  email: string
  password: string
}
