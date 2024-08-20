import { AuthResponse, RegisterType } from '../types/auth.type'
import http from '../utils/http'

export const registerAccount = (body: RegisterType) => http.post<AuthResponse>('/register', body)
