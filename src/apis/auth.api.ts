import { AuthResponse, AuthRequestType } from '../types/auth.type'
import http from '../utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

export const registerAccount = (body: AuthRequestType) => http.post<AuthResponse>(URL_REGISTER, body)

export const login = (body: AuthRequestType) => http.post<AuthResponse>(URL_LOGIN, body)

export const logout = () => http.post(URL_LOGOUT)
