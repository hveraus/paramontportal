import { RoleProvider } from './context/RoleContext'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { LangProvider } from './context/LanguageContext'
import DashboardPage from './pages/DashboardPage'
import ProductDetailPage from './ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function PageRouter() {
  const { page } = useNavigation()
  if (page === 'product-detail') return <ProductDetailPage />
  if (page === 'products')       return <ProductsPage />
  return <DashboardPage />
}

export default function App() {
  return (
    <RoleProvider>
      <LangProvider>
        <NavigationProvider>
          <PageRouter />
        </NavigationProvider>
      </LangProvider>
    </RoleProvider>
  )
}
