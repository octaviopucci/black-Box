import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AutomationsPage } from '@/pages/AutomationsPage'
import { BroadcastsPage } from '@/pages/BroadcastsPage'
import { ChannelsPage } from '@/pages/ChannelsPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FlowEditorPage } from '@/pages/FlowEditorPage'
import { FlowsPage } from '@/pages/FlowsPage'
import { GrowthPage } from '@/pages/GrowthPage'
import { InboxPage } from '@/pages/InboxPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SimulatorPage } from '@/pages/SimulatorPage'
import { useChama } from '@/store/ChamaContext'

function RequireAuth() {
  const { state } = useChama()
  if (!state.user) return <Navigate to="/login" replace />
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="flows" element={<FlowsPage />} />
          <Route path="flows/:id" element={<FlowEditorPage />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="broadcasts" element={<BroadcastsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="growth" element={<GrowthPage />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
