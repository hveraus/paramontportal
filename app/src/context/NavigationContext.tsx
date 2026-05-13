import { createContext, useContext, useState, type ReactNode } from 'react'

export type Page = 'dashboard' | 'products' | 'product-detail'

interface NavigationCtx {
  page: Page
  navigate: (p: Page) => void
}

const NavigationContext = createContext<NavigationCtx | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('dashboard')
  return (
    <NavigationContext.Provider value={{ page, navigate: setPage }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be inside NavigationProvider')
  return ctx
}
