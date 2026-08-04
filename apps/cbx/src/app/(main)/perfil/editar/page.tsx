'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { ROUTES } from '@/constants/brand'
import { userService } from '@/services'

export default function EditarPerfilPage() {
  const router = useRouter()
  const user = userService.current()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [bio, setBio] = useState(user.bio ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast.success('Perfil atualizado com sucesso!')
    router.push(ROUTES.perfil)
  }

  return (
    <PageShell>
      <Container className="py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={ROUTES.perfil}>
            <ChevronLeft className="mr-1 size-4" />
            Perfil
          </Link>
        </Button>
        <SectionHeader title="Editar perfil" subtitle="Atualize suas informações pessoais" />

        <div className="mb-6 flex justify-center">
          <Avatar src={user.avatar} fallback={user.name} size="xl" />
        </div>

        <div className="mx-auto max-w-lg space-y-4">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </div>
      </Container>
    </PageShell>
  )
}
