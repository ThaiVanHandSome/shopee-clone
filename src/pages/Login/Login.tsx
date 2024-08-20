import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 py-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng Nhập</div>
              <div className='mt-8'>
                <input
                  type='text'
                  name='email'
                  placeholder='Email'
                  className='p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
                />
                <div className='mt-1 text-red-600 min-h-1 text-sm'>Email không hợp lệ</div>
              </div>
              <div className='mt-3'>
                <input
                  type='password'
                  autoComplete='on'
                  name='password'
                  placeholder='Password'
                  className='p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
                />
                <div className='mt-1 text-red-600 min-h-1 text-sm'></div>
              </div>
              <div className='mt-4 text-center flex items-center'>
                <span className='text-gray-400 me-2'>Bạn chưa có tài khoản?</span>
                <Link to='/register' className='text-red-400'>
                  Đăng ký
                </Link>
              </div>
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
