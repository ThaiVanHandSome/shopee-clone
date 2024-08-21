import { Link } from 'react-router-dom'
import path from '../../../constants/path'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

export default function AsideFilter() {
  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
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
        <span className='ms-2'>Tất cả danh mục</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4 w-full' />
      <ul>
        <li className='py-2 pl-2'>
          <Link to={path.home} className='flex items-center text-orange'>
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
            <span className='text-sm font-semibold'>Thời trang nam</span>
          </Link>
        </li>
        <li className='py-2 pl-2'>
          <Link to={path.home} className='relative px-2'>
            <span className='text-sm font-semibold'>Thời trang nam</span>
          </Link>
        </li>
        <li className='py-2 pl-2'>
          <Link to={path.home} className='relative px-2'>
            <span className='text-sm font-semibold'>Thời trang nam</span>
          </Link>
        </li>
      </ul>
      <Link to={path.home} className='flex items-center font-bold mt-4 uppercase'>
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
        <span className='ms-2 text-sm'>BỘ LỌC TÌM KIẾM</span>
      </Link>
      <div className='bg-gray-300 h-[1px] my-4 w-full' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2'>
          <div className='flex items-start'>
            <Input
              type='text'
              placeholder='TỪ'
              className='flex-grow'
              name='from'
              classNameInput='p-1 text-sm w-full outline-none border-2 border-gray-300 focus:shadow-sm focus:border-gray-500 rounded-sm'
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Input
              type='text'
              className='flex-grow'
              placeholder='ĐẾN'
              name='to'
              classNameInput='p-1 text-sm w-full outline-none border-2 border-gray-300 focus:shadow-sm focus:border-gray-500 rounded-sm'
            />
          </div>
          <Button className='w-full p-2 bg-orange text-white text-sm rounded-md'>ÁP DỤNG</Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4 w-full' />
      <div className='text-sm'>Đánh giá</div>
      <ul>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center'>
            <div className='flex items-center text-sm'>
              {Array(5)
                .fill(1)
                .map((_, index) => (
                  <svg key={index} viewBox='0 0 9.5 8' className='w-5 h-5 me-1'>
                    <defs>
                      <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                        <stop offset={0} stopColor='#ffca11' />
                        <stop offset={1} stopColor='#ffad27' />
                      </linearGradient>
                      <polygon
                        id='ratingStar'
                        points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                      />
                    </defs>
                    <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                      <g transform='translate(-876 -1270)'>
                        <g transform='translate(155 992)'>
                          <g transform='translate(600 29)'>
                            <g transform='translate(10 239)'>
                              <g transform='translate(101 10)'>
                                <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                ))}
            </div>
            <span className='ms-2 text-sm'>trở lên</span>
          </Link>
        </li>
      </ul>
      <div className='bg-gray-300 h-[1px] my-4 w-full' />
      <Button className='w-full p-2 bg-orange text-white text-sm rounded-md'>XÓA TẤT CẢ</Button>
    </div>
  )
}
