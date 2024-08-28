import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useRouteElement from './hooks/useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

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
    <div>
      {routeElement} <ToastContainer /> <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
