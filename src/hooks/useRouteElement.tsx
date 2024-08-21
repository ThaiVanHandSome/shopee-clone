import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from '../pages/ProductList'
import Login from '../pages/Login'
import Register from '../pages/Register'
import RegisterLayout from '../layouts/RegisterLayout'
import MainLayout from '../layouts/MainLayout'
import Profile from '../pages/Profile'
import { useContext } from 'react'
import { AppContext } from '../contexts/app.context'
import path from '../constants/path'

export default function useRouteElement() {
  const { isAuthenticated } = useContext(AppContext)
  function ProtectedRoute() {
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
  }

  function RejectedRoute() {
    return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
  }

  const routeElement = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routeElement
}
