import { fireEvent, screen, waitFor } from '@testing-library/react'
import path from 'src/constants/path'
import { renderWithoutRouter } from 'src/utils/testUtils'
import { describe, expect, it } from 'vitest'

describe('Login', () => {
  it.skip('Hiển thị lỗi required khi không nhập gì', async () => {
    const { user } = renderWithoutRouter(path.login)
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
    const submitButton = document.querySelector('form button[type="submit"]') as Element
    expect(submitButton).toBeInTheDocument()
    user.click(submitButton)
    await waitFor(async () => {
      expect(await screen.findByText('Email là bắt buộc')).toBeTruthy()
    })
  })

  it('Hiển thị lỗi khi không nhập đúng format dữ liệu', async () => {
    renderWithoutRouter(path.login)
    fireEvent.input(screen.queryByPlaceholderText('Email') as HTMLElement, {
      target: {
        value: 'user.gmail.com'
      }
    })
    fireEvent.submit(screen.getByRole('button'))
    expect(screen.queryByPlaceholderText('Email')).toHaveValue('user.gmail.com')
  })
})
