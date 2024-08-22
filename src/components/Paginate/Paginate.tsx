import clsx from 'clsx'
interface Props {
  readonly page: number
  readonly setPage: React.Dispatch<React.SetStateAction<number>>
  readonly pageSize: number
}

const RANGE = 2
export default function Paginate({ page, setPage, pageSize }: Props) {
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
          <button
            key={pageNumber}
            className={clsx('bg-white border-2 rounded px-3 py-2 shadow-sm mx-2 cursor-pointer', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </button>
        )
      })
  }

  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      <button className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>Prev</button>
      {renderPagination()}
      <button className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>Next</button>
    </div>
  )
}
