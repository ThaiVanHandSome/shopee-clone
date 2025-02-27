import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useRouteElement from './hooks/useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from 'src/contexts/app.context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

function App() {
  const location = useLocation()
  const routeElement = useRouteElement()
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [location])
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div>
          {routeElement} <ToastContainer /> <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
