import { createContext, useMemo, useState } from 'react'
import { ExtendedCart } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLocalStorage, getUserFromLocalStorage } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  extendedCart: ExtendedCart[]
  setExtendedCart: React.Dispatch<React.SetStateAction<ExtendedCart[]>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  user: getUserFromLocalStorage(),
  setUser: () => null,
  extendedCart: [],
  setExtendedCart: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = useState(initialAppContext.user)
  const [extendedCart, setExtendedCart] = useState<ExtendedCart[]>(initialAppContext.extendedCart)

  const value = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      extendedCart,
      setExtendedCart
    }),
    [isAuthenticated, user, extendedCart]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
