import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import App from 'src/App'
import { BrowserRouter } from 'react-router-dom'

const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })

export const renderDebug = async (time = 1000) => {
  await waitFor(
    async () => {
      expect(await delay(time - 100)).toBe(true)
    },
    {
      timeout: time
    }
  )
  screen.debug(document.body.parentElement as HTMLElement, 999999999)
}

export const renderWithoutRouter = (path = '/') => {
  window.history.pushState({}, 'Url', path)
  return {
    user: userEvent.setup(),
    ...render(<App />, { wrapper: BrowserRouter })
  }
}
