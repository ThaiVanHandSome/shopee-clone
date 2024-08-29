import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { omit } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import RatingStar from 'src/pages/ProductList/components/RatingStar'
import { Category } from 'src/types/category.type'
import { priceSchema } from 'src/utils/rules'
import * as yup from 'yup'

interface Props {
  readonly queryConfig: QueryConfig
  readonly categories: Category[]
}

type FormData = yup.InferType<typeof priceSchema>

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation(['home'])
  const { category } = queryConfig
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const onSubmit = handleSubmit((data) => {
    const { price_min, price_max } = data
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: String(price_max),
        price_min: String(price_min)
      }).toString()
    })
  })

  const handleReset = () => {
    reset()
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter'])).toString()
    })
  }

  return (
    <div className='px-4 py-4 shadow-lg md:px-0 md:shadow-none'>
      <div className='flex items-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5' />
        </svg>
        <span
          className={clsx('ms-2', {
            'text-orange': !category
          })}
        >
          {t('home:asideFilter.allCategories')}
        </span>
      </div>
      <div className='my-4 h-[1px] w-full bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = categoryItem._id === category
          return (
            <li key={categoryItem._id} className='py-2 pl-2'>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={clsx('flex items-center hover:text-orange', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                )}
                <span className='text-sm font-semibold'>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className='mt-4 flex items-center font-bold uppercase'>
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
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
          />
        </svg>
        <span className='ms-2 text-sm uppercase'>{t('home:asideFilter.filter')}</span>
      </div>
      <div className='my-4 h-[1px] w-full bg-gray-300' />
      <div className='my-5'>
        <div className='text-md'>{t('asideFilter.price')}</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    placeholder={t('asideFilter.priceMin')}
                    className='flex-grow'
                    classNameError='hidden'
                    {...field}
                    classNameInput='p-1 text-sm w-full outline-none border-2 border-gray-300 focus:shadow-sm focus:border-gray-500 rounded-sm'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='flex-grow'
                    classNameError='hidden'
                    placeholder={t('asideFilter.priceMax')}
                    {...field}
                    classNameInput='p-1 text-sm w-full outline-none border-2 border-gray-300 focus:shadow-sm focus:border-gray-500 rounded-sm'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-2 text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='w-full rounded-md bg-orange p-2 text-sm uppercase text-white'>
            {t('asideFilter.apply')}
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] w-full bg-gray-300' />
      <div className='text-sm'>{t('asideFilter.rating')}</div>
      <RatingStar queryConfig={queryConfig} />
      <div className='my-4 h-[1px] w-full bg-gray-300' />
      <Button className='w-full rounded-md bg-orange p-2 text-sm uppercase text-white' onClick={handleReset}>
        {t('asideFilter.clearAll')}
      </Button>
    </div>
  )
}
