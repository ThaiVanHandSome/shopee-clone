import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const addToCart = (body: { product_id: string; buy_count: number }) =>
  http.post<SuccessResponse<Purchase>>('purchases/add-to-cart', body)

export const getPurchases = (params: { status: PurchaseListStatus }) =>
  http.get<SuccessResponse<Purchase[]>>('purchases', {
    params
  })

export const buyProducts = (body: { product_id: string; buy_count: number }[]) =>
  http.post<SuccessResponse<Purchase[]>>('purchases/buy-products', body)

export const updatePurchase = (body: { product_id: string; buy_count: number }) =>
  http.put<SuccessResponse<Purchase>>('purchases/update-purchase', body)

export const deletePurchases = (product_Ids: string[]) =>
  http.delete<SuccessResponse<{ deleted_count: number }>>('purchases', {
    data: product_Ids
  })
