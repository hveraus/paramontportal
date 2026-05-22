import { RoleProvider } from './context/RoleContext'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { LangProvider } from './context/LanguageContext'
import DashboardPage from './pages/DashboardPage'
import ProductDetailPage from './ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import ArchivesPage from './pages/ArchivesPage'
import SampleRoomPage from './pages/SampleRoomPage'
import SettingsIndexPage from './pages/SettingsIndexPage'
import SettingsPage from './pages/SettingsPage'
import ProgramPage from './pages/ProgramPage'
import SearchResultsPage from './pages/SearchResultsPage'

function PageRouter() {
  const { page } = useNavigation()
  if (page === 'product-detail')       return <ProductDetailPage />
  if (page === 'products')             return <ProductsPage />
  if (page === 'archives')             return <ArchivesPage />
  if (page === 'sample-room')          return <SampleRoomPage />
  if (page === 'program')              return <ProgramPage />
  if (page === 'settings')             return <SettingsIndexPage />
  if (page === 'settings-permissions') return <SettingsPage />
  if (page === 'search')               return <SearchResultsPage />
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
