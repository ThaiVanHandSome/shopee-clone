import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { updateProfile } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import * as yup from 'yup'

const changePasswordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])
type FormData = yup.InferType<typeof changePasswordSchema>

export default function ChangePassword() {
  const { t } = useTranslation(['user'])
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const updatePasswordMutation = useMutation({
    mutationFn: updateProfile
  })

  const onSubmit = handleSubmit((data) => {
    updatePasswordMutation.mutate(omit(data, ['confirm_password']), {
      onSuccess: (res) => {
        toast.success(res.data.message)
        reset()
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('user:changePassword')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('user:subHeading')}</div>
      </div>
      <form className='mt-8 flex flex-col' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mt-3 flex flex-wrap md:mt-6'>
            <div className='mb-3 w-full truncate pt-3 text-left capitalize md:mb-0 md:w-[20%] md:text-right'>
              {t('user:oldPassword')}
            </div>
            <div className='w-full pl-5 md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='password'
                placeholder={t('user:oldPassword')}
                errorMessage={errors.password?.message}
                className='w-full md:w-2/3'
                classNameInput='px-3 py-2 outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm w-full'
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mb:mt-6 mt-3 flex flex-wrap'>
            <div className='mb-3 w-full truncate pt-3 text-left capitalize md:mb-0 md:w-[20%] md:text-right'>
              {t('user:newPassword')}
            </div>
            <div className='w-full pl-5 md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='new_password'
                placeholder={t('user:newPassword')}
                errorMessage={errors.new_password?.message}
                className='w-full md:w-2/3'
                classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mb:mt-6 mt-3 flex flex-wrap'>
            <div className='mb-3 w-full truncate pt-3 text-left capitalize md:mb-0 md:w-[20%] md:text-right'>
              {t('user:confirmPassword')}
            </div>
            <div className='w-full pl-5 md:w-[80%]'>
              <Input
                type='password'
                register={register}
                name='confirm_password'
                placeholder={t('user:confirmPassword')}
                errorMessage={errors.confirm_password?.message}
                className='w-full md:w-2/3'
                classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
              />
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <Button
            isLoading={updatePasswordMutation.isPending}
            disabled={updatePasswordMutation.isPending}
            className='mt-5 flex-shrink-0 rounded-sm bg-orange px-8 py-2 text-sm text-white shadow'
          >
            {t('user:save')}
          </Button>
        </div>
      </form>
    </div>
  )
}
