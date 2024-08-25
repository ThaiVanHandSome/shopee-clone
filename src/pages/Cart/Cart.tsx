import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { buyProducts, deletePurchases, getPurchases, updatePurchase } from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce, enableMapSet } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import noproduct from 'src/assets/images/no-product.png'

enableMapSet()

export default function Cart() {
  const location = useLocation()
  const cartId = (location.state as { cartId: string } | null)?.cartId
  const { extendedCart, setExtendedCart } = useContext(AppContext)
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

  const buyProductsMutation = useMutation({
    mutationFn: buyProducts,
    onSuccess: () => {
      refetch()
    }
  })

  const deleteProductsMutation = useMutation({
    mutationFn: deletePurchases,
    onSuccess: () => {
      refetch()
    }
  })

  const isAllChecked = useMemo(() => {
    return extendedCart.every((item) => item.checked)
  }, [extendedCart])

  const checkedCarts = extendedCart.filter((item) => item.checked)
  const checkedCartsCount = checkedCarts.length
  const totalCheckedPrice = checkedCarts.reduce((result, curr) => {
    return result + curr.product.price * curr.buy_count
  }, 0)
  const totalCheckedSavingPrice = checkedCarts.reduce((result, curr) => {
    return result + (curr.product.price_before_discount - curr.product.price) * curr.buy_count
  }, 0)

  useEffect(() => {
    setExtendedCart((prev) => {
      const extendedCartObj = keyBy(prev, '_id')
      return (
        cart?.map((item) => ({
          ...item,
          disabled: false,
          checked: item._id === cartId || Boolean(extendedCartObj[item._id]?.checked)
        })) || []
      )
    })
  }, [cart, cartId])

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

    updateCartMutation.mutate({ product_id: cart.product._id, buy_count: value })
  }

  const handleTypeQuantity = (cartIndex: number) => (value: number) => {
    setExtendedCart((prev) => {
      const newState = produce(prev, (draft) => {
        draft[cartIndex].buy_count = value
      })
      return newState
    })
  }

  const handleDelete = (cartIndex: number) => () => {
    const cartId = extendedCart[cartIndex]._id
    deleteProductsMutation.mutate([cartId])
  }

  const handleDeleteManyProducts = () => {
    const cartIds = checkedCarts.map((item) => {
      return item._id
    })
    deleteProductsMutation.mutate(cartIds)
  }

  const handleBuyProducts = () => {
    if (checkedCarts.length === 0) return
    const body = checkedCarts.map((item) => ({
      product_id: item.product._id,
      buy_count: item.buy_count
    }))
    buyProductsMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success(data.data.message, {
          position: 'top-center'
        })
      }
    })
  }

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedCart.length > 0 && (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6 bg-white'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          checked={isAllChecked}
                          type='checkbox'
                          className='h-5 w-5 cursor-pointer accent-orange'
                          onChange={handleCheckAll}
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
                      className='mt-5 grid grid-cols-12 items-center rounded-sm bg-white px-4 py-5 text-center text-sm text-gray-500'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              checked={item.checked}
                              type='checkbox'
                              className='h-5 w-5 cursor-pointer accent-orange'
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
                              <div className='flex-grow px-2 pb-2 pt-1'>
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
                              onIncrease={(value) =>
                                handleQuantity(index, value, item.buy_count < item.product.quantity)
                              }
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
                            <button
                              onClick={handleDelete(index)}
                              className='bg-none text-black transition-colors hover:text-orange'
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 flex flex-col rounded-sm bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    checked={isAllChecked}
                    type='checkbox'
                    className='h-5 w-5 cursor-pointer accent-orange'
                    onChange={handleCheckAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedCart.length})</button>
                <button onClick={handleDeleteManyProducts} className='mx-3 border-none bg-none'>
                  Xóa
                </button>
              </div>
              <div className='mt-5 flex flex-col items-center justify-center sm:ml-auto sm:mt-0 sm:flex-row'>
                <div>
                  <div className='flex items-center justify-end'>
                    <div>Tổng thanh toán ({checkedCartsCount} sản phẩm): </div>
                    <div className='ml-2 text-2xl text-orange'>đ{formatCurrency(totalCheckedPrice)}</div>
                  </div>
                  <div className='flex items-center justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>đ{formatCurrency(totalCheckedSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyProducts}
                  isLoading={buyProductsMutation.isPending}
                  disabled={buyProductsMutation.isPending}
                  className='ml-4 mt-4 h-10 w-52 bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:mt-0'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        )}
        {extendedCart.length === 0 && (
          <div className='text-center'>
            <img src={noproduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold text-gray-600'>Giỏ hàng của bạn còn trống</div>
            <Link to={path.home} className='mt-5 inline-block bg-orange px-6 py-2 uppercase text-white'>
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
