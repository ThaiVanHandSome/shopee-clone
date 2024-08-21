import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

export const getProducts = (params: ProductListConfig) =>
  http.get<SuccessResponse<ProductList>>('products', {
    params
  })

export const getProductDetail = (id: string) => http.get<SuccessResponse<Product>>(`products/${id}`)
