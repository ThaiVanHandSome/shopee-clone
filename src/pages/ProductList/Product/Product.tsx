import { Link } from 'react-router-dom'
import path from '../../../constants/path'

export default function Product() {
  return (
    <Link to={path.home}>
      <div className='bg-white shadow-md rounded-sm hover:translate-y-[-0.0625rem] hover:shadow-xl duration-100 transition-transform'>
        <div className='w-full pt-[100%] relative overflow-hidden'>
          <img
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
            src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lpfn82x8nham5a_tn'
            alt='product'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>
            ⚡️ Giá Sốc ⚡️Thắt lưng nam da cao cấp khóa kim loại tự động không gỉ - Cam kết 1 đổi 1 bảo hành 12 tháng
          </div>
        </div>
        <div className='flex items-center mt-3'>
          <div className='line-through max-w-[50%] text-gray-500 truncate'>
            <span className='text-xs'>đ</span>
            <span>2.000</span>
          </div>
          <div className='text-orange truncate ml-1'>
            <span className='text-xs'>đ</span>
            <span>5.000</span>
          </div>
        </div>
        <div className='mt-3 flex items-center justify-end'>
          <div className='relative'>
            <div className='absolute top-0 left-0 h-full overflow-hidden w-[50%]'>
              <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x={0}
                y={0}
                className='size-3 fill-yellow-300 text-yellow-300'
              >
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
            <svg
              enableBackground='new 0 0 15 15'
              viewBox='0 0 15 15'
              x={0}
              y={0}
              className='size-3 fill-current text-gray-300'
            >
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </svg>
          </div>
          <div className='ml-2 text-xs'>
            <span className='me-1'>Đã bán</span>
            <span>5.66k</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
