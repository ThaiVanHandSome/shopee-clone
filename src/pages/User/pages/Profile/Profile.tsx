import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getProfile, updateProfile } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import DateSelect from 'src/pages/User/components/DateSelect'
import { setUserToLocalStorage } from 'src/utils/auth'
import { userSchema } from 'src/utils/rules'
import * as yup from 'yup'

type Schema = yup.InferType<typeof userSchema>
type FormData = Pick<Schema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setUser } = useContext(AppContext)
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
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

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile
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

  const onSubmit = handleSubmit((data) => {
    updateProfileMutation.mutate(
      {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString()
      },
      {
        onSuccess: (res) => {
          toast.success('Cập nhật thông tin thành công')
          const userData = res.data.data
          console.log(userData)
          setUser(userData)
          setUserToLocalStorage(userData)
          refetch()
        }
      }
    )
  })

  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sở để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
            <div className='w-[80%] pl-5'>
              <div className='pt-3 text-gray-300'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Tên</div>
            <div className='w-[80%] pl-5'>
              <Input
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
                classNameInput='px-3 py-2 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Số điện thoại</div>
            <div className='w-[80%] pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    placeholder='Số điện thoại'
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
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
            <div className='w-[80%] pl-5'>
              <Input
                register={register}
                name='address'
                placeholder='Địa chỉ'
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
            <div className='w-[20%]'></div>
            <div className='w-[80%] truncate pt-3 text-right capitalize'>
              <Button
                type='submit'
                isLoading={updateProfileMutation.isPending}
                disabled={updateProfileMutation.isPending}
                className='flex h-9 w-36 items-center bg-orange px-6 text-center text-sm text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='my-5 h-24 w-24'>
            <img
              src='https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg'
              alt='avatar'
            />
          </div>
          <input type='file' accept='.jpg,.jpeg,.png' className='hidden' />
          <button
            type='button'
            className='h-10 flex-shrink-0 rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
          >
            Chọn Ảnh
          </button>
          <div className='mt-3 text-gray-400'>
            <p>Dụng lượng file tối đa 1 MB</p>
            <p>Định dạng:.JPEG, .PNG</p>
          </div>
        </div>
      </form>
    </div>
  )
}
