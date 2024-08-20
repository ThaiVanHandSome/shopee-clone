import React from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  readonly type: React.HTMLInputTypeAttribute
  readonly errorMessage?: string
  readonly placeholder?: string
  readonly className?: string
  readonly name: string
  readonly register: UseFormRegister<any>
  readonly rules?: RegisterOptions
}

export default function Input({ type, name, errorMessage, placeholder, className, register, rules }: Props) {
  return (
    <div className={className}>
      <input
        {...register(name, rules)}
        type={type}
        name={name}
        placeholder={placeholder}
        className='p-3 w-full outline-none border-2 border-gray-300 focus:border-gray-500 rounded shadow-sm'
      />
      <div className='mt-1 text-red-600 min-h-1 text-sm'>{errorMessage}</div>
    </div>
  )
}
