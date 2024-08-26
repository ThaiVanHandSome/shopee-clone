import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import MainLayout from 'src/layouts/MainLayout'
import ProductList from 'src/pages/ProductList'
import Login from 'src/pages/Login'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Register from 'src/pages/Register'
import ProductDetail from 'src/pages/ProductDetail'
import Cart from 'src/pages/Cart'
import CartLayout from 'src/layouts/CartLayout'
import UserLayout from 'src/pages/User/layouts/UserLayout'
import Profile from 'src/pages/User/pages/Profile'
import ChangePassword from 'src/pages/User/pages/ChangePassword'
import HistoryPurchase from 'src/pages/User/pages/HistoryPurchase'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}
export default function useRouteElement() {
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
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
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
