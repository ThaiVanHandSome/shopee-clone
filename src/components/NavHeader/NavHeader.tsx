import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { logout } from 'src/apis/auth.api'
import Popover from 'src/components/Popover'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'

export default function NavHeader() {
  const queryClient = useQueryClient()
  const { isAuthenticated, setIsAuthenticated, user: profile, setUser } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setUser(null)
      queryClient.removeQueries({
        queryKey: ['purchases', { status: purchaseStatus.inCart }]
      })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className='hidden justify-end md:flex'>
      <Popover
        className='me-4 flex cursor-pointer items-center py-1 hover:text-gray-300'
        renderPopover={
          <div className='flex flex-col px-3 py-2 text-sm text-black'>
            <button className='px-3 py-2 hover:text-orange'>Tiếng Việt</button>
            <button className='mt-2 px-3 py-2 hover:text-orange'>English</button>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1 text-sm'>Tiếng Việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex cursor-pointer items-center py-1 hover:text-gray-300'
          renderPopover={
            <div className='w-full text-sm'>
              <Link
                to={path.profile}
                className='block w-full bg-white px-3 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchase}
                className='block w-full bg-white px-3 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                Đơn mua
              </Link>
              <button
                className='block w-full bg-white px-3 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            <img className='h-full w-full rounded-full object-cover' src={getAvatarUrl(profile?.avatar)} alt='avatar' />
          </div>
          <div className='text-sm'>{profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center text-sm'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Đăng ký
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
