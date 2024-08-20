import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useRouteElement from './hooks/useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElement = useRouteElement()
  return (
    <div>
      {routeElement} <ToastContainer /> <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
