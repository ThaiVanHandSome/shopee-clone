import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProductDetail, getProducts } from 'src/apis/product.api'
import { addToCart } from 'src/apis/purchase.api'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import Product from 'src/pages/ProductList/components/Product'
import { ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'

const RANGE = 5
export default function ProductDetail() {
  const { t } = useTranslation(['product'])
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      return getProductDetail(id)
    }
  })
  const [currentIndexImages, setCurrentIndexImages] = useState<number>(0)
  const [activeImage, setActiveImage] = useState<string>('')
  const [buyCount, setBuyCount] = useState<number>(1)
  const imageRef = useRef<HTMLImageElement>(null)
  const navigate = useNavigate()

  const product = productData?.data.data
  const currentImages = useMemo(() => {
    return product?.images.slice(currentIndexImages, currentIndexImages + RANGE)
  }, [currentIndexImages, product])

  const queryConfig: QueryConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return getProducts(queryConfig as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })

  const addToCartMutation = useMutation({
    mutationFn: addToCart
  })

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const chooseActive = (imgUrl: string) => {
    setActiveImage(imgUrl)
  }

  const next = () => {
    if (product?.images) {
      setCurrentIndexImages((prev) => {
        if (prev === product?.images.length - 1) return prev
        return prev + 1
      })
    }
  }

  const previous = () => {
    if (product?.images) {
      setCurrentIndexImages((prev) => {
        if (prev === 0) return prev
        return prev - 1
      })
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    ;(imageRef.current as HTMLImageElement).removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const handleAddToCart = () => {
    const body = {
      product_id: product?._id as string,
      buy_count: buyCount
    }
    addToCartMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success(data.data.message, { autoClose: 1000 })
        queryClient.invalidateQueries({
          queryKey: ['purchases', { status: purchaseStatus.inCart }]
        })
      }
    })
  }

  const handleBuyNow = async () => {
    const body = {
      product_id: product?._id as string,
      buy_count: buyCount
    }
    const res = await addToCartMutation.mutateAsync(body)
    const purchase = res.data.data
    queryClient.invalidateQueries({
      queryKey: ['purchases', { status: purchaseStatus.inCart }]
    })
    navigate(path.cart, {
      state: {
        cartId: purchase._id
      }
    })
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 md:col-span-5'>
              <div
                className='relative w-full overflow-hidden pt-[100%] shadow hover:cursor-zoom-in'
                onMouseMove={(event) => handleZoom(event)}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  ref={imageRef}
                  className='pointer-events-none absolute left-0 top-0 h-full w-full bg-white object-cover'
                  src={activeImage}
                  alt={product.name}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-2'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={previous}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-3'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages?.map((imgUrl) => {
                  const isActive = imgUrl === activeImage
                  return (
                    <div
                      key={imgUrl}
                      className='relative col-span-1 w-full cursor-pointer pt-[100%]'
                      onMouseEnter={() => chooseActive(imgUrl)}
                    >
                      <img
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                        src={imgUrl}
                        alt={product.name}
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
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
                </button>
              </div>
            </div>
            <div className='col-span-12 md:col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-4 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-sm text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClassname='fill-current text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className='flex items-center'>
                  <span className='font-bold'>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ms-1 text-sm text-gray-500'>{t('product:sold')}</span>
                </div>
              </div>
              <div className='mt-8 flex flex-col justify-start bg-gray-50 px-5 py-4 md:flex-row md:items-center'>
                <div className='text-gray-500 line-through'>đ{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-0 text-3xl font-medium text-orange md:ml-3'>đ{formatCurrency(product.price)}</div>
                <div className='ml-0 w-1/3 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white md:ml-4 md:w-auto'>
                  {rateSale(product.price_before_discount, product.price)} {t('product:discount')}
                </div>
              </div>
              <div className='mt-8 flex flex-col items-start md:flex-row md:items-center'>
                <div className='mb-2 capitalize text-gray-500 md:mb-0'>{t('product:quantity')}</div>
                <QuantityController
                  max={product.quantity}
                  value={buyCount}
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  classNameWrapper='md:ml-5 mb-2 md:mb-0'
                />
                <div className='text-sm text-gray-500 md:ml-6'>
                  {product.quantity} {t('product:available')}
                </div>
              </div>
              <div className='mt-8 flex flex-col items-center md:flex-row'>
                <button
                  onClick={handleAddToCart}
                  className='mb-2 flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5 md:mb-0'
                >
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
                      d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                    />
                  </svg>
                  <span className='ms-2'>{t('product:addToCart')}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className='ml-4 flex h-12 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90 md:min-w-[5rem]'
                >
                  {t('product:buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg font-semibold capitalize text-slate-700'>
            {t('product:productDescription')}
          </div>
          <div className='mx-4 mb-4 mt-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>{t('product:youMayAlsoLike')}</div>
          {productData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData?.data.data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
