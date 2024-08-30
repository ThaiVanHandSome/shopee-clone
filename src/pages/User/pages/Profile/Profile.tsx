import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getProfile, updateProfile, uploadAvatar } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import DateSelect from 'src/pages/User/components/DateSelect'
import { ErrorResponse } from 'src/types/utils.type'
import { setUserToLocalStorage } from 'src/utils/auth'
import { userSchema } from 'src/utils/rules'
import { getAvatarUrl, isAxiosUnprocessableEntity } from 'src/utils/utils'
import * as yup from 'yup'

type Schema = yup.InferType<typeof userSchema>
type FormData = Pick<Schema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { t } = useTranslation(['user'])
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { setUser } = useContext(AppContext)
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const avatar = watch('avatar')

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar
  })

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  const profile = profileData?.data.data

  useEffect(() => {
    if (!profile) return
    setValue('name', profile.name)
    setValue('phone', profile.phone)
    setValue('address', profile.address)
    setValue('avatar', profile.avatar)
    setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
      }
      updateProfileMutation.mutate(
        {
          ...data,
          date_of_birth: data.date_of_birth?.toISOString(),
          avatar: avatarName
        },
        {
          onSuccess: (res) => {
            toast.success(res.data.message)
            const userData = res.data.data
            setUser(userData)
            setUserToLocalStorage(userData)
            refetch()
          }
        }
      )
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('user:profile')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('user:subHeading')}</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-6 lg:pr-12'>
          <div className='flex flex-wrap'>
            <div className='mb-2 w-full truncate pt-3 text-left capitalize lg:mb-0 lg:w-[20%] lg:text-right'>Email</div>
            <div className='w-full lg:w-[80%] lg:pl-5'>
              <div className='pt-3 text-gray-300'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='mb-2 w-full truncate pt-3 text-left capitalize lg:mb-0 lg:w-[20%] lg:text-right'>
              {t('user:name')}
            </div>
            <div className='w-full lg:w-[80%] lg:pl-5'>
              <Input
                register={register}
                name='name'
                placeholder={t('user:name')}
                errorMessage={errors.name?.message}
                classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='mb-2 w-full truncate pt-3 text-left capitalize lg:mb-0 lg:w-[20%] lg:text-right'>
              {t('user:phoneNumber')}
            </div>
            <div className='w-full lg:w-[80%] lg:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    placeholder={t('user:phoneNumber')}
                    errorMessage={errors.phone?.message}
                    {...field}
                    classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='mb-2 w-full truncate pt-3 text-left capitalize lg:mb-0 lg:w-[20%] lg:text-right'>
              {t('user:address')}
            </div>
            <div className='w-full lg:w-[80%] lg:pl-5'>
              <Input
                register={register}
                name='address'
                placeholder={t('user:address')}
                errorMessage={errors.address?.message}
                classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
              />
            </div>
          </div>
          <Controller
            name='date_of_birth'
            control={control}
            render={({ field }) => (
              <DateSelect value={field.value} errorMessage={errors.date_of_birth?.message} onChange={field.onChange} />
            )}
          />
          <div className='mt-2 flex flex-row'>
            <div className='mb-2 hidden w-full text-left lg:mb-0 lg:block lg:w-[20%]'></div>
            <div className='w-full truncate pt-3 text-right capitalize lg:w-[80%]'>
              <Button
                type='submit'
                isLoading={updateProfileMutation.isPending || uploadAvatarMutation.isPending}
                disabled={updateProfileMutation.isPending || uploadAvatarMutation.isPending}
                className='flex h-9 w-36 items-center bg-orange px-6 text-center text-sm text-white hover:bg-orange/80'
              >
                {t('user:save')}
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='my-5 h-56 w-56'>
            <img src={previewImage || getAvatarUrl(avatar)} alt='avatar' className='h-full w-full rounded-full' />
          </div>
          <InputFile onChange={handleChangeFile} />
          <div className='mt-3 text-gray-400'>
            <p>{t('user:imageSize')}</p>
            <p>{t('user:imageType')}</p>
          </div>
        </div>
      </form>
    </div>
  )
}
