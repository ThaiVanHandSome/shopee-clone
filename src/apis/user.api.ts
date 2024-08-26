import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

export const getProfile = () => http.get<SuccessResponse<User>>('/me')

export const updateProfile = (body: BodyUpdateProfile) => http.put<SuccessResponse<User>>('/user', body)

export const uploadAvatar = (body: FormData) =>
  http.post<SuccessResponse<string>>('/user/upload-avatar', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
