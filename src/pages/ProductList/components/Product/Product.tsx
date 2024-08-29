import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

interface Props {
  readonly product: ProductType
}

let idInterval: any
let indexImage = 0
export default function Product({ product }: Props) {
  const { t } = useTranslation(['product'])
  const [imageProduct, setImageProduct] = useState<string>(product.image)
  const handleChangeImage = () => {
    idInterval = setInterval(() => {
      if (indexImage === product.images.length) indexImage = 0
      setImageProduct(product.images[indexImage])
      indexImage++
    }, 500)
  }

  const handleResetImage = () => {
    clearTimeout(idInterval)
    setImageProduct(product.image)
    indexImage = 0
  }

  useEffect(() => {
    return () => {
      clearInterval(idInterval)
      indexImage = 0
    }
  }, [])

  return (
    <Link key={product._id} to={`${path.home}${generateNameId(product.name, product._id)}`}>
      <div className='rounded-sm bg-white shadow-md transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-xl'>
        <div className='relative w-full overflow-hidden pt-[100%]'>
          <img
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
            src={imageProduct}
            alt={product.name}
            onMouseOver={handleChangeImage}
            onMouseLeave={handleResetImage}
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>đ</span>
              <span className='text-md font-semibold'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-between'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              <span className='me-1'>{t('product:sold')}</span>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
