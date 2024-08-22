import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import * as yup from 'yup'
import { useContext } from 'react'
import { registerSchema } from 'src/utils/rules'
import { AppContext } from 'src/contexts/app.context'
import { registerAccount } from 'src/apis/auth.api'
import { setUserToLocalStorage } from 'src/utils/auth'
import path from 'src/constants/path'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import Input from 'src/components/Input'
import Button from 'src/components/Button'

type FormData = yup.InferType<typeof registerSchema>

export default function Register() {
  const { setIsAuthenticated, setUser } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        const userData = data.data.data.user
        setUser(userData)
        setUserToLocalStorage(userData)
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 py-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Ký</div>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
                className='mt-8'
              />
              <Input
                type='password'
                name='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
                className='mt-3'
              />
              <Input
                type='password'
                name='confirm_password'
                placeholder='Confirm Password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                className='mt-3'
              />
              <div className='mt-4 text-center flex items-center'>
                <span className='text-gray-400 me-2'>Bạn đã có tài khoản?</span>
                <Link to={path.login} className='text-red-400'>
                  Đăng nhập
                </Link>
              </div>
              <div className='mt-3'>
                <Button
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng ký
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
