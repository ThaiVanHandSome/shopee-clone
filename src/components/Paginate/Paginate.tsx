import clsx from 'clsx'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
interface Props {
  readonly pageSize: number
  readonly queryConfig: QueryConfig
}

const RANGE = 2
export default function Paginate({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true
        return <div className='bg-white rounded px-3 py-2 shadow-sm mx-2'>...</div>
      }
      return null
    }

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true
        return <div className='bg-white rounded px-3 py-2 shadow-sm mx-2'>...</div>
      }
      return null
    }
    return Array(pageSize)
      .fill(1)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter()
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore()
          } else if (pageNumber > page + RANGE && pageNumber <= pageSize - RANGE) {
            return renderDotAfter()
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore()
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={pageNumber}
            className={clsx('bg-white border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-pointer', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      {page > 1 ? (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className={'bg-white border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'}
        >
          Prev
        </Link>
      ) : (
        <span className='bg-white/60 border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed'>Prev</span>
      )}

      {renderPagination()}
      {page < pageSize ? (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className={'bg-white border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'}
        >
          Next
        </Link>
      ) : (
        <span className='bg-white/60 border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed'>Next</span>
      )}
    </div>
  )
}
