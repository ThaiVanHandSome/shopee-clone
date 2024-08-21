import { User } from '../types/user.type'

export const setAccessTokenToLocalStorage = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const removeAuthInfoFromLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

export const getAccessTokenFromLocalStorage = (): string => {
  return localStorage.getItem('access_token') ?? ''
}

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user')
  return result ? JSON.parse(result) : null
}

export const setUserToLocalStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}
