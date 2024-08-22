import { useQuery } from '@tanstack/react-query'
import AsideFilter from './AsideFilter'
import useQueryParams from 'src/hooks/useQueryParams'
import { getProducts } from 'src/apis/product.api'
import SortProductList from 'src/pages/ProductList/SortProductList'
import Product from 'src/pages/ProductList/Product/Product'
import { useState } from 'react'
import Paginate from 'src/components/Paginate'

export default function ProductList() {
  const queryParams = useQueryParams()

  const [page, setPage] = useState<number>(1)

  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return getProducts(queryParams)
    }
  })

  return (
    <div className='bg-gray-200 py-6 '>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
              {data && data.data.data.products.map((product) => <Product product={product} />)}
            </div>
            <Paginate page={page} setPage={setPage} pageSize={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
