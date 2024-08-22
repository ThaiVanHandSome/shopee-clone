import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'

interface Props {
  readonly product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link key={product._id} to={path.home}>
      <div className='bg-white shadow-md rounded-sm hover:translate-y-[-0.0625rem] hover:shadow-xl duration-100 transition-transform'>
        <div className='w-full pt-[100%] relative overflow-hidden'>
          <img
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-between'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              <span className='me-1'>Đã bán</span>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
