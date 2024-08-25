import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { getAccessTokenFromLocalStorage, removeAuthInfoFromLocalStorage, setAccessTokenToLocalStorage } from './auth'
import path from 'src/constants/path'
import { AuthResponse } from 'src/types/auth.type'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'

class HTTP {
  instance: AxiosInstance
  private access_token: string

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.access_token = getAccessTokenFromLocalStorage()

    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.authorization = this.access_token
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          this.access_token = (response.data as AuthResponse).data.access_token
          setAccessTokenToLocalStorage(this.access_token)
        } else if (url === path.logout) {
          removeAuthInfoFromLocalStorage()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          removeAuthInfoFromLocalStorage()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new HTTP().instance
export default http
