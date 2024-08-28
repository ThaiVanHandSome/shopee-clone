import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'
import { getProducts } from 'src/apis/product.api'
import SortProductList from 'src/pages/ProductList/components/SortProductList'
import Product from 'src/pages/ProductList/components/Product/Product'
import { ProductListConfig } from 'src/types/product.type'
import { getCategories } from 'src/apis/category.api'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import Paginate from 'src/components/Paginate'
import { useEffect, useRef, useState } from 'react'

export default function ProductList() {
  const filterRef = useRef<HTMLDivElement>(null)
  const queryConfig: QueryConfig = useQueryConfig()
  const [openMobileFilter, setOpenMobileFilter] = useState<boolean>(false)
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

  useEffect(() => {
    if (filterRef.current) {
      if (openMobileFilter) {
        filterRef.current.style.left = '0'
        filterRef.current.style.transition = 'all .3s'
      } else {
        filterRef.current.style.left = '-300px'
        filterRef.current.style.transition = 'none'
      }
    }
  }, [openMobileFilter])

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productsData && (
          <div className='relative grid grid-cols-12 gap-6'>
            <div
              aria-hidden='true'
              className='fixed left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer md:hidden'
              onClick={() => setOpenMobileFilter(true)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-10 rounded-xl bg-black text-white shadow-lg'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5' />
              </svg>
            </div>
            <div
              ref={filterRef}
              className='fixed bottom-0 left-[-300px] top-0 z-40 w-[300px] bg-white transition-all md:relative md:!left-0 md:col-span-3 md:w-auto md:bg-gray-200'
            >
              <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            {openMobileFilter && (
              <div
                aria-hidden='true'
                className='bg-black-layer fixed bottom-0 left-0 right-0 top-0 z-30'
                onClick={() => setOpenMobileFilter(false)}
              />
            )}
            <div className='col-span-12 md:col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
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
