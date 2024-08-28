import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import { getPurchases } from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  {
    status: purchaseStatus.all,
    name: 'Tất cả'
  },
  {
    status: purchaseStatus.waitForConfirmation,
    name: 'Chờ xác nhận'
  },
  {
    status: purchaseStatus.waitForGetting,
    name: 'Chờ lấy hàng'
  },
  {
    status: purchaseStatus.inProgress,
    name: 'Đang giao'
  },
  {
    status: purchaseStatus.delivered,
    name: 'Đã giao'
  },
  {
    status: purchaseStatus.cancelled,
    name: 'Đã hủy'
  }
]

export default function HistoryPurchase() {
  const queryParam: { status?: string } = useQueryParams()
  const status = Number(queryParam.status) || purchaseStatus.all

  const { isAuthenticated } = useContext(AppContext)

  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => getPurchases({ status: status as PurchaseListStatus }),
    enabled: isAuthenticated
  })
  const purchases = purchasesData?.data.data

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 rounded-t-sm shadow-sm'>
            <div className='flex'>
              {purchaseTabs.map((tab) => (
                <Link
                  key={tab.status}
                  to={{
                    pathname: path.historyPurchase,
                    search: createSearchParams({
                      status: String(tab.status)
                    }).toString()
                  }}
                  className={clsx('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                    'border-b-orange text-orange': status === tab.status,
                    'border-b-black/10 text-gray-900': status !== tab.status
                  })}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
            <div>
              {purchases?.map((purchase) => (
                <div
                  key={purchase._id}
                  className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                >
                  <Link
                    to={`${path.home}${generateNameId(purchase.product.name, purchase.product._id)}`}
                    className='flex'
                  >
                    <div className='flex-shrink-0'>
                      <img
                        className='h-20 w-20 object-cover'
                        src={purchase.product.image}
                        alt={purchase.product.name}
                      />
                    </div>
                    <div className='ml-3 flex-grow overflow-hidden'>
                      <span className='truncate'>{purchase.product.name}</span>
                      <span className='ml-3 truncate font-bold text-orange'>x{purchase.buy_count}</span>
                    </div>
                    <div className='ml-3 flex-shrink-0'>
                      <span className='truncate text-gray-500 line-through'>
                        đ{formatCurrency(purchase.product.price_before_discount)}
                      </span>
                      <span className='ml-3 truncate text-orange'>đ{formatCurrency(purchase.product.price)}</span>
                    </div>
                  </Link>
                  <div className='flex justify-end'>
                    <div>
                      <span>Tổng giá tiền</span>
                      <span className='ml-4 text-xl text-orange'>
                        đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
