import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { schema, Schema } from '../../utils/rules'
import Input from '../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'

type FormData = Schema

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
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
                <Link to='/login' className='text-red-400'>
                  Đăng nhập
                </Link>
              </div>
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
