import { InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly classNameInput?: string
  readonly classNameError?: string
}

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputV2Props) {
  const {
    value,
    type,
    onChange,
    className,
    classNameInput = 'p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-1 text-sm',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFormInput = event.target.value
    const numberCondition = (type === 'number' && /^\d+$/.test(valueFormInput)) || valueFormInput === ''
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFormInput)
      field.onChange(event)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} value={value || localValue} onChange={handleChange} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
