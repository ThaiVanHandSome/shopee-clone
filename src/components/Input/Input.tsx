import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly register?: UseFormRegister<any>
  readonly rules?: RegisterOptions
  readonly classNameInput?: string
  readonly classNameError?: string
}

export default function Input({
  errorMessage,
  className,
  register,
  name,
  rules,
  classNameInput = 'p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-1 text-sm',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input name={name} {...registerResult} className={classNameInput} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
