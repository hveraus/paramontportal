import { createContext, useContext, useState, type ReactNode } from 'react'

export type Page = 'login' | 'dashboard' | 'products' | 'product-detail' | 'archives' | 'sample-room' | 'program' | 'settings' | 'settings-permissions' | 'search' | 'sol-files'

interface NavigationCtx {
  page: Page
  navigate: (p: Page) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const NavigationContext = createContext<NavigationCtx | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('login')
  const [searchQuery, setSearchQuery] = useState<string>('')
  return (
    <NavigationContext.Provider value={{ page, navigate: setPage, searchQuery, setSearchQuery }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be inside NavigationProvider')
  return ctx
}
