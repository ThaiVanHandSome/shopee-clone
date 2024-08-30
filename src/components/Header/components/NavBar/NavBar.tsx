import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { logout } from 'src/apis/auth.api'
import { getPurchases } from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { locales } from 'src/i18n/i18n'
import { getAvatarUrl } from 'src/utils/utils'

interface Props {
  readonly isOpen: boolean
  readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({ isOpen, setIsOpen }: Props) {
  const { i18n, t } = useTranslation(['header'])
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const queryClient = useQueryClient()
  const elementRef = useRef<HTMLDivElement>(null)
  const languageContainerRef = useRef<HTMLDivElement>(null)
  const [openLanguageContainer, setOpenLanguageContainer] = useState<boolean>(false)
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

  const handleOpenLanguageContainer = () => {
    setOpenLanguageContainer((prev) => !prev)
  }

  const changeLanguage = (lng: 'en' | 'vi') => {
    localStorage.setItem('language', lng)
    window.history.go(0)
  }

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
                <div className='text-sm font-semibold text-gray-500'>{profile?.email}</div>
              </div>
            )}

            <div
              aria-hidden='true'
              className='flex cursor-pointer items-center pb-4 text-orange'
              onClick={handleOpenLanguageContainer}
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
              <span className='mx-1 text-sm'>{currentLanguage}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
              </svg>
            </div>
            {openLanguageContainer && (
              <div ref={languageContainerRef} className='flex flex-col px-3 py-2 text-sm text-black'>
                <button className='px-3 py-2 text-left hover:text-orange' onClick={() => changeLanguage('vi')}>
                  Tiếng Việt
                </button>
                <button className='mt-2 px-3 py-2 text-left hover:text-orange' onClick={() => changeLanguage('en')}>
                  English
                </button>
              </div>
            )}
            <div className='my-3 h-[1px] w-full bg-gray-300' />

            <div className='my-4 bg-orange px-4 py-2'>
              <form className='w-full' onSubmit={onSubmitSearch}>
                <div className='flex items-center rounded-sm bg-white p-1'>
                  <input
                    {...register('search')}
                    name='search'
                    type='text'
                    placeholder={t('header:inputPlaceholder')}
                    className='w-[90%] border-none bg-transparent px-3 py-2 text-sm text-black outline-none'
                  />
                  <button type='submit' className='flex-shrink-0 flex-grow rounded-sm transition-all'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6 text-orange'
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
                  {t('header:home')}
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
                      {t('header:register')}
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
                      {t('header:login')}
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
                      <span>{t('header:cart')}</span>
                      <span className='rounded-full bg-orange px-2 py-1 font-bold text-white'>{cart?.length}</span>
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
                      {t('header:account')}
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
                      {t('header:changePassword')}
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
                      {t('header:purchase')}
                    </NavLink>
                  </li>
                  <li>
                    <div
                      aria-hidden='true'
                      onClick={handleLogout}
                      className='mb-2 block w-full rounded-md px-4 py-2 text-left text-black transition-all hover:bg-slate-100'
                    >
                      {t('header:logout')}
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
