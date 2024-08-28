import clsx from 'clsx'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
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
        return <div className='mx-2 rounded bg-white px-3 py-2 shadow-sm'>...</div>
      }
      return null
    }

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true
        return <div className='mx-2 rounded bg-white px-3 py-2 shadow-sm'>...</div>
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
            className={clsx('mx-2 cursor-pointer rounded border-2 bg-white px-3 py-2 shadow-sm', {
              'border-orange': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  const prevIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-4'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5' />
    </svg>
  )

  const nextIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-4'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5' />
    </svg>
  )

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page > 1 ? (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className={'mx-1 cursor-pointer rounded border-2 bg-white px-3 py-2 shadow-sm'}
        >
          {prevIcon()}
        </Link>
      ) : (
        <span className='mx-2 flex cursor-not-allowed items-center justify-center rounded border-2 bg-white/60 px-3 py-2 text-sm shadow-sm'>
          {prevIcon()}
        </span>
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
          className={'mx-2 cursor-pointer rounded border-2 bg-white px-3 py-2 shadow-sm'}
        >
          {nextIcon()}
        </Link>
      ) : (
        <span className='mx-2 flex cursor-not-allowed items-center justify-center rounded border-2 bg-white/60 px-3 py-2 text-sm shadow-sm'>
          {nextIcon()}
        </span>
      )}
    </div>
  )
}
