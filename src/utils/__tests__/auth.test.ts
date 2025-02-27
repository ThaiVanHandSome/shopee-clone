import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  getUserFromLocalStorage,
  removeAuthInfoFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserToLocalStorage
} from 'src/utils/auth'
import { beforeEach, describe, expect, it } from 'vitest'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA5YjYwZDBjZTdkMDRkNTdiYTdjOSIsImVtYWlsIjoidXNlcjkzOUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTAyLTI3VDAzOjUyOjA3LjM1NVoiLCJpYXQiOjE3NDA2MjgzMjcsImV4cCI6MTc0MDYyODMzN30.a18ohGLeeJe_5f8S6ROdVTR65btnmGt_3-r14njG22A'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA5YjYwZDBjZTdkMDRkNTdiYTdjOSIsImVtYWlsIjoidXNlcjkzOUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTAyLTI3VDAzOjUyOjA3LjM1NVoiLCJpYXQiOjE3NDA2MjgzMjcsImV4cCI6MTc0NDIyODMyN30.3maDvCIa-J0OoFxCeROp9XsVedzzaobE3cgNUdRifQo'

const user =
  '{"_id":"66d09b60d0ce7d04d57ba7c9","roles":["User"],"email":"user939@gmail.com","createdAt":"2024-08-29T16:01:36.879Z","updatedAt":"2024-10-23T04:20:55.835Z","__v":0,"avatar":"b74d7ebb-c740-4481-ba81-bdfb847c7b0f.png","date_of_birth":"2005-07-17T17:00:00.000Z","address":"76 đường số 36","name":"Nguyễn Thái Văn","phone":"0396166405"}'

beforeEach(() => {
  localStorage.clear()
})

describe('setAccessTokenToLS', () => {
  it('access_token được xét vào local strorage', () => {
    setAccessTokenToLocalStorage(access_token)
    expect(localStorage.getItem('access_token')).toBe(access_token)
    expect(getAccessTokenFromLocalStorage()).toBe(access_token)
  })
})

describe('setRefreshTokenToLS', () => {
  it('refresh_token được xét vào local storage', () => {
    setRefreshTokenToLocalStorage(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
    expect(getRefreshTokenFromLocalStorage()).toBe(refresh_token)
  })
})

describe('removeAuthInfoFromLocalStorage', () => {
  it('Xóa hết access_token, refresh_token, profile', () => {
    setAccessTokenToLocalStorage(access_token)
    setRefreshTokenToLocalStorage(refresh_token)
    setUserToLocalStorage(JSON.parse(user))
    removeAuthInfoFromLocalStorage()
    expect(getAccessTokenFromLocalStorage()).toBe('')
    expect(getRefreshTokenFromLocalStorage()).toBe('')
    expect(getUserFromLocalStorage()).toBe(null)
  })
})
