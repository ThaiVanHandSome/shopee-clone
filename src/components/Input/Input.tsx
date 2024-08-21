import React, { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly className?: string
  readonly register?: UseFormRegister<any>
  readonly rules?: RegisterOptions
  readonly classNameInput?: string
  readonly classNameError?: string
}

export default function Input({
  type,
  name,
  errorMessage,
  placeholder,
  className,
  register,
  rules,
  classNameInput = 'p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-1 text-sm'
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input {...registerResult} type={type} name={name} placeholder={placeholder} className={classNameInput} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
