import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'
import { getProducts } from 'src/apis/product.api'
import SortProductList from 'src/pages/ProductList/components/SortProductList'
import Product from 'src/pages/ProductList/components/Product/Product'
import { ProductListConfig } from 'src/types/product.type'
import { getCategories } from 'src/apis/category.api'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import Paginate from 'src/components/Paginate'

export default function ProductList() {
  const queryConfig: QueryConfig = useQueryConfig()
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
