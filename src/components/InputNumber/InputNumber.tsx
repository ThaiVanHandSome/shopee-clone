import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly classNameInput?: string
  readonly classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    value = '',
    errorMessage,
    className,
    onChange,
    classNameInput = 'p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-1 text-sm',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      if (onChange) onChange(event)
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input
        value={value || localValue}
        ref={ref}
        className={classNameInput}
        {...rest}
        onChange={(event) => handleChange(event)}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
