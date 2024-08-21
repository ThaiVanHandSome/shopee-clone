import { AuthResponse, AuthRequestType } from '../types/auth.type'
import http from '../utils/http'

export const registerAccount = (body: AuthRequestType) => http.post<AuthResponse>('/register', body)

export const login = (body: AuthRequestType) => http.post<AuthResponse>('/login', body)

export const logout = () => http.post('/logout')
