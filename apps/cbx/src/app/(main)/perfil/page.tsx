'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Megaphone,
  Package,
  Settings,
  Shield,
  Sparkles,
  User,
  FileText,
  Info,
  Headphones,
} from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { ROUTES } from '@/constants/brand'
import { userService } from '@/services'
import { useAppStore } from '@/stores/app-store'

const MENU_SECTIONS = [
  {
    title: 'Conta',
    items: [
      { href: ROUTES.editarPerfil, label: 'Editar perfil', icon: User },
      { href: ROUTES.enderecos, label: 'Endereços', icon: MapPin },
      { href: ROUTES.historico, label: 'Histórico', icon: Clock },
      { href: ROUTES.compras, label: 'Compras', icon: CreditCard },
    ],
  },
  {
    title: 'Vendas',
    items: [
      { href: ROUTES.meusAnuncios, label: 'Meus anúncios', icon: Package },
      { href: ROUTES.favoritos, label: 'Favoritos', icon: Heart },
      { href: ROUTES.planos, label: 'Planos', icon: Sparkles },
      { href: ROUTES.publicar, label: 'Publicar anúncio', icon: Megaphone },
    ],
  },
  {
    title: 'Suporte',
    items: [
      { href: ROUTES.configuracoes, label: 'Configurações', icon: Settings },
      { href: ROUTES.ajuda, label: 'Ajuda', icon: HelpCircle },
      { href: ROUTES.suporte, label: 'Suporte', icon: Headphones },
      { href: ROUTES.sobre, label: 'Sobre o CBX', icon: Info },
      { href: ROUTES.privacidade, label: 'Privacidade', icon: Shield },
      { href: ROUTES.termos, label: 'Termos de uso', icon: FileText },
    ],
  },
]

export default function PerfilPage() {
  const router = useRouter()
  const { logout } = useAppStore()
  const user = userService.current()

  const handleLogout = () => {
    logout()
    router.push(ROUTES.login)
  }

  return (
    <PageShell>
      <Container className="py-6">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
          <Avatar src={user.avatar} fallback={user.name} size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 text-xl font-bold">
              {user.name}
              {user.verified && (
                <Badge variant="success" className="text-[10px]">
                  Verificado
                </Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Rating value={user.rating} count={user.reviewCount} size="sm" className="mt-1" />
            <Badge variant="primary" className="mt-2 capitalize">
              Plano {user.plan}
            </Badge>
          </div>
        </div>

        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            <SectionHeader title={section.title} />
            <nav className="overflow-hidden rounded-xl border border-border/60 bg-card">
              {section.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 ${
                      i < section.items.length - 1 ? 'border-b border-border/40' : ''
                    }`}
                  >
                    <Icon className="size-5 shrink-0 text-primary" />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut className="size-5" />
          Sair da conta
        </button>
      </Container>
    </PageShell>
  )
}
