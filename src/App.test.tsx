import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from 'src/App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import path from 'src/constants/path'
import { renderDebug, renderWithoutRouter } from 'src/utils/testUtils'

describe('App', () => {
  it.skip('App render và chuyển trang', async () => {
    const { user } = renderWithoutRouter()

    // await user.click(screen.getByText('Đăng nhập'))
    // await waitFor(() => {
    //   expect(screen.getByText('Bạn chưa có tài khoản?')).toBeInTheDocument()
    // })
    await renderDebug()
  })

  it('Vào một route không có tồn tại', async () => {
    const badRoute = '/some/bad/route'
    renderWithoutRouter(badRoute)
    await renderDebug()
  })

  it.skip('Truy cập vào trang register', async () => {
    render(
      <MemoryRouter initialEntries={[path.register]}>
        <App />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('Bạn đã có tài khoản?')).toBeInTheDocument()
    })
    screen.debug(document.body.parentElement as HTMLElement, 99999999)
  })

  it.skip('Truy cập vào trang register C2', async () => {
    window.history.pushState({}, 'Test page', path.register)
    render(<App />, {
      wrapper: BrowserRouter
    })
    await waitFor(() => {
      expect(screen.getByText('Bạn đã có tài khoản?')).toBeInTheDocument()
    })
    screen.debug(document.body.parentElement as HTMLElement, 99999999)
  })
})
