import clsx from 'clsx'
import { useState } from 'react'
import InputNumber, { InputNumberProps } from 'src/components/InputNumber'

interface Props extends InputNumberProps {
  readonly max?: number
  readonly onIncrease?: (value: number) => void
  readonly onDecrease?: (value: number) => void
  readonly onType?: (value: number) => void
  readonly onFocusOut?: (value: number) => void
  readonly classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  classNameWrapper = '',
  value,
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState(Number(value || 0))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onType && onType(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={clsx('flex items-center', classNameWrapper)}>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border-2 border-x-gray-300 text-gray-600'
        onClick={decrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-3'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <InputNumber
        value={value || localValue}
        className=''
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        onBlur={(event) => handleBlur(event)}
        {...rest}
      />
      <button
        className='flex h-8 w-8 items-center justify-center rounded-r-sm border-2 border-x-gray-300 text-gray-600'
        onClick={increase}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-3'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
