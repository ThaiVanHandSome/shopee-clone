import { InputHTMLAttributes, forwardRef } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly classNameInput?: string
  readonly classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessage,
    className,
    onChange,
    classNameInput = 'p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-1 text-sm',
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }

  return (
    <div className={className}>
      <input ref={ref} className={classNameInput} {...rest} onChange={(event) => handleChange(event)} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
