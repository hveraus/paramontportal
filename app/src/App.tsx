import { RoleProvider } from './context/RoleContext'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import ProductDetailPage from './ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function PageRouter() {
  const { page } = useNavigation()
  return page === 'product-detail' ? <ProductDetailPage /> : <ProductsPage />
}

export default function App() {
  return (
    <RoleProvider>
      <NavigationProvider>
        <PageRouter />
      </NavigationProvider>
    </RoleProvider>
  )
}
