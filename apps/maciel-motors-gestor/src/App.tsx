import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from '@/layouts/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { StockPage } from '@/pages/StockPage'
import { VehicleCreatePage } from '@/pages/VehicleCreatePage'
import { VehicleEditPage } from '@/pages/VehicleEditPage'
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage'
import { FinancePage } from '@/pages/FinancePage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { BackupPage } from '@/pages/BackupPage'
import { SettingsPage } from '@/pages/SettingsPage'

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={basename === '/' ? undefined : basename}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="estoque" element={<StockPage />} />
              <Route path="veiculos/novo" element={<VehicleCreatePage />} />
              <Route path="veiculos/:id" element={<VehicleDetailsPage />} />
              <Route path="veiculos/:id/editar" element={<VehicleEditPage />} />
              <Route path="financeiro" element={<FinancePage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="backup" element={<BackupPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
