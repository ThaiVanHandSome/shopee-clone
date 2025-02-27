/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'
import { isAxiosError, isAxiosUnprocessableEntity } from 'src/utils/utils'
import { describe, it, expect } from 'vitest'

describe('isAxiosError', () => {
  it('isAxiosError trả về boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntity', () => {
  it('isAxiosUnprocessableEntity trả về boolean', () => {
    expect(isAxiosUnprocessableEntity(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect( 
      isAxiosUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
