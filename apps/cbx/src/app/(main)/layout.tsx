import { AppHeader } from '@/components/navigation/app-header'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { Sidebar } from '@/components/navigation/sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
