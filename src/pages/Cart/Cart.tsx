import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPurchases, updatePurchase } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce, enableMapSet } from 'immer'
import { keyBy } from 'lodash'

enableMapSet()
interface ExtendedCart extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  const [extendedCart, setExtendedCart] = useState<ExtendedCart[]>([])
  const { data: cartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => getPurchases({ status: purchaseStatus.inCart })
  })
  const cart = cartData?.data.data

  const updateCartMutation = useMutation({
    mutationFn: updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const isAllChecked = useMemo(() => {
    return extendedCart.every((item) => item.checked)
  }, [extendedCart])

  useEffect(() => {
    setExtendedCart((prev) => {
      const extendedCartObj = keyBy(prev, '_id')
      return (
        cart?.map((item) => ({
          ...item,
          disabled: false,
          checked: Boolean(extendedCartObj[item._id]?.checked)
        })) || []
      )
    })
  }, [cartData])

  const handleCheck = (cartIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedCart((prev) => {
      const newState = produce(prev, (draft: any) => {
        draft[cartIndex].checked = event.target.checked
      })
      return newState
    })
  }

  const handleCheckAll = () => {
    setExtendedCart((prev) => {
      let newState = [...prev]
      newState = newState.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
      return newState
    })
  }

  const handleQuantity = (cartIndex: number, value: number, enable: boolean) => {
    if (!enable) return
    const cart = extendedCart[cartIndex]
    setExtendedCart((prev) => {
      const newState = produce(prev, (draft) => {
        draft[cartIndex].disabled = true
      })
      return newState
    })

    updateCartMutation.mutate(
      { product_id: cart.product._id, buy_count: value },
      {
        onSuccess: (data) => {
          setExtendedCart((prev) => {
            const newState = produce(prev, (draft) => {
              draft[cartIndex].buy_count = data.data.data.buy_count
              draft[cartIndex].disabled = false
            })
            return newState
          })
        }
      }
    )
  }

  const handleTypeQuantity = (cartIndex: number) => (value: number) => {
    setExtendedCart((prev) => {
      const newState = produce(prev, (draft) => {
        draft[cartIndex].buy_count = value
      })
      return newState
    })
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      checked={isAllChecked}
                      type='checkbox'
                      className='h-5 w-5 accent-orange cursor-pointer'
                      onClick={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-gray-200 p-5 shadow'>
              {extendedCart?.map((item, index) => (
                <div
                  key={item._id}
                  className='grid grid-cols-12 rounded-sm bg-white py-5 px-4 text-center text-sm text-gray-500 mt-5'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          checked={item.checked}
                          type='checkbox'
                          className='h-5 w-5 accent-orange cursor-pointer'
                          onChange={handleCheck(index)}
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId(item.product.name, item.product._id)}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img src={item.product.image} alt={item.product.name} />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              to={`${path.home}${generateNameId(item.product.name, item.product._id)}`}
                              className='line-clamp-2'
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 items-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            đ{formatCurrency(item.product.price_before_discount)}
                          </span>
                          <span className='ml-3'>đ{formatCurrency(item.product.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={item.product.quantity}
                          value={item.buy_count}
                          onIncrease={(value) => handleQuantity(index, value, item.buy_count < item.product.quantity)}
                          onDecrease={(value) => handleQuantity(index, value, item.buy_count > 1)}
                          onType={handleTypeQuantity(index)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= item.product.quantity &&
                                value !== (cart as Purchase[])[index].buy_count
                            )
                          }
                          disabled={item.disabled}
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>đ{formatCurrency(item.buy_count * item.product.price)}</span>
                      </div>
                      <div className='col-span-1'>
                        <button className='bg-none text-black transition-colors hover:text-orange'>Xóa</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-5 shadow'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                checked={isAllChecked}
                type='checkbox'
                className='h-5 w-5 accent-orange cursor-pointer'
                onClick={handleCheckAll}
              />
            </div>
            <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedCart.length})</button>
            <button className='mx-3 border-none bg-none'>Xóa</button>
          </div>
          <div className='sm:ml-auto mt-5 sm:mt-0 flex flex-col sm:flex-row items-center justify-center'>
            <div>
              <div className='flex items-center justify-end'>
                <div>Tổng thanh toán (0 sản phẩm): </div>
                <div className='ml-2 text-2xl text-orange'>đ138000</div>
              </div>
              <div className='flex items-center justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>đ138000</div>
              </div>
            </div>
            <Button className='ml-4 mt-4 sm:mt-0 h-10 w-52 text-center uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
