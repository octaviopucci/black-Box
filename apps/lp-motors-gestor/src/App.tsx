import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { CinematicIntro } from '@/components/common/CinematicIntro'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from '@/layouts/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { StockPage } from '@/pages/StockPage'
import { VehicleCreatePage } from '@/pages/VehicleCreatePage'
import { VehicleEditPage } from '@/pages/VehicleEditPage'
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage'
import { AlertsPage } from '@/pages/AlertsPage'
import { IntelligencePage } from '@/pages/IntelligencePage'
import { FinancePage } from '@/pages/FinancePage'
import { PayablesPage } from '@/pages/PayablesPage'
import { ProfitabilityPage } from '@/pages/ProfitabilityPage'
import { PreparationPage } from '@/pages/PreparationPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { SuppliersPage } from '@/pages/SuppliersPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { UsersPage } from '@/pages/UsersPage'
import { AuditPage } from '@/pages/AuditPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { BackupPage } from '@/pages/BackupPage'
import { FipePage } from '@/pages/FipePage'
import { RegisterPage } from '@/pages/RegisterPage'

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <AppProvider>
      <CinematicIntro />
      <BrowserRouter basename={basename === '/' ? undefined : basename}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="estoque" element={<StockPage />} />
              <Route path="alertas" element={<AlertsPage />} />
              <Route path="inteligencia" element={<IntelligencePage />} />
              <Route path="fipe" element={<FipePage />} />
              <Route path="preparacao" element={<PreparationPage />} />
              <Route path="documentos" element={<DocumentsPage />} />
              <Route path="fornecedores" element={<SuppliersPage />} />
              <Route path="veiculos/novo" element={<VehicleCreatePage />} />
              <Route path="veiculos/:id" element={<VehicleDetailsPage />} />
              <Route path="veiculos/:id/editar" element={<VehicleEditPage />} />
              <Route path="financeiro" element={<FinancePage />} />
              <Route path="contas" element={<PayablesPage />} />
              <Route path="rentabilidade" element={<ProfitabilityPage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="usuarios" element={<UsersPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
              <Route path="auditoria" element={<AuditPage />} />
              <Route path="backup" element={<BackupPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
