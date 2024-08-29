/* eslint-disable react-hooks/exhaustive-deps */
import { range } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onChange?: (value: Date) => void
  readonly value?: Date
  readonly errorMessage?: string
}

export default function DateSelect({ value, onChange, errorMessage }: Props) {
  const { t } = useTranslation(['user'])
  const [date, setDate] = useState({
    day: value?.getDate() ?? 1,
    month: value?.getMonth() ?? 0,
    year: value?.getFullYear() ?? 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: newValue, name } = event.target
    const newDate = {
      ...date,
      [name]: newValue
    }
    setDate(newDate)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day))
  }

  useEffect(() => {
    const newDate = {
      day: value?.getDate() ?? 1,
      month: value?.getMonth() ?? 0,
      year: value?.getFullYear() ?? 1990
    }
    setDate(newDate)
  }, [value])

  return (
    <div className='mt-2 flex flex-wrap'>
      <div className='w-[20%] truncate pt-3 text-right capitalize'>{t('user:dayOfBirth')}</div>
      <div className='w-[80%] pl-5'>
        <div className='flex'>
          <div className='w-1/3 px-3'>
            <select
              onChange={handleChange}
              value={date.day}
              name='day'
              className='h-10 w-full cursor-pointer rounded-sm border border-black/10 hover:border-orange'
            >
              <option disabled>Ngày</option>
              {range(1, 32).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className='w-1/3 px-3'>
            <select
              onChange={handleChange}
              name='month'
              value={date.month}
              className='h-10 w-full cursor-pointer rounded-sm border border-black/10 hover:border-orange'
            >
              <option disabled>Tháng</option>
              {range(0, 12).map((item) => (
                <option value={item} key={item}>
                  {item + 1}
                </option>
              ))}
            </select>
          </div>
          <div className='w-1/3 px-3'>
            <select
              onChange={handleChange}
              name='year'
              value={date.year}
              className='h-10 w-full cursor-pointer rounded-sm border border-black/10 hover:border-orange'
            >
              <option disabled>Năm</option>
              {range(1990, 2025).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='mt-1 min-h-1 text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
