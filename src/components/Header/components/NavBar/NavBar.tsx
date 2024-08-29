import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { logout } from 'src/apis/auth.api'
import { getPurchases } from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { getAvatarUrl } from 'src/utils/utils'

interface Props {
  readonly isOpen: boolean
  readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({ isOpen, setIsOpen }: Props) {
  const { t } = useTranslation(['header'])
  const queryClient = useQueryClient()
  const elementRef = useRef<HTMLDivElement>(null)
  const { onSubmitSearch, register } = useSearchProducts()
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
  const { data: cartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })
  const cart = cartData?.data.data

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  // const handleCloseMenu = () => {
  //   elementRef.current?.style.right = '-300px'
  // }

  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            ref={elementRef}
            className='fixed bottom-0 right-0 top-0 z-40 w-[300px] bg-white px-4 py-6 shadow-sm transition-all'
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.1
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='absolute right-2 top-2 z-30 size-6 cursor-pointer text-black'
              onClick={() => setIsOpen(false)}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>

            {isAuthenticated && (
              <div className='mb-4 flex items-center border-b border-gray-300 pb-4'>
                <div className='mr-2 h-6 w-6 flex-shrink-0'>
                  <img
                    className='h-full w-full rounded-full object-cover'
                    src={getAvatarUrl(profile?.avatar)}
                    alt='avatar'
                  />
                </div>
                <div className='text-sm font-semibold text-orange'>{profile?.email}</div>
              </div>
            )}
            <div className='my-4 bg-orange px-4 py-2'>
              <form className='w-full' onSubmit={onSubmitSearch}>
                <div className='flex rounded-sm bg-white p-1'>
                  <input
                    {...register('search')}
                    name='search'
                    type='text'
                    placeholder='FREESHIP ĐƠN TỪ 0Đ'
                    className='flex-grow border-none bg-transparent px-3 py-2 text-sm text-black outline-none'
                  />
                  <button type='submit' className='flex-shrink-0 rounded-sm bg-orange transition-all hover:opacity-90'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <ul>
              <li>
                <NavLink
                  to={path.home}
                  className={({ isActive }) =>
                    clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                      'font-bold text-orange': isActive,
                      'font-normal text-black': !isActive
                    })
                  }
                >
                  Trang chủ
                </NavLink>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to={path.register}
                      className={({ isActive }) =>
                        clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                          'font-bold text-orange': isActive,
                          'font-normal text-black': !isActive
                        })
                      }
                    >
                      Đăng ký
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={path.login}
                      className={({ isActive }) =>
                        clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                          'font-bold text-orange': isActive,
                          'font-normal text-black': !isActive
                        })
                      }
                    >
                      Đăng nhập
                    </NavLink>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to={path.cart}
                      className={({ isActive }) =>
                        clsx(
                          'mb-2 flex w-full items-center justify-between rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100',
                          {
                            'font-bold text-orange': isActive,
                            'font-normal text-black': !isActive
                          }
                        )
                      }
                    >
                      <span>Giỏ hàng</span>
                      <span className='font-bold text-orange'>{cart?.length}</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={path.profile}
                      className={({ isActive }) =>
                        clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                          'font-bold text-orange': isActive,
                          'font-normal text-black': !isActive
                        })
                      }
                    >
                      Thông tin cá nhân
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={path.changePassword}
                      className={({ isActive }) =>
                        clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                          'font-bold text-orange': isActive,
                          'font-normal text-black': !isActive
                        })
                      }
                    >
                      Đổi mật khẩu
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={path.historyPurchase}
                      className={({ isActive }) =>
                        clsx('mb-2 block w-full rounded-md px-4 py-2 text-left transition-all hover:bg-slate-100', {
                          'font-bold text-orange': isActive,
                          'font-normal text-black': !isActive
                        })
                      }
                    >
                      Đơn hàng
                    </NavLink>
                  </li>
                  <li>
                    <div
                      aria-hidden='true'
                      onClick={handleLogout}
                      className='mb-2 block w-full rounded-md px-4 py-2 text-left text-black transition-all hover:bg-slate-100'
                    >
                      Đăng xuất
                    </div>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}
