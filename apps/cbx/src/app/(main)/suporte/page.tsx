'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BRAND } from '@/constants/brand'

export default function SuportePage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Preencha todos os campos')
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))
    setSending(false)
    toast.success('Mensagem enviada! Responderemos em até 24 horas.')
    setSubject('')
    setMessage('')
  }

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Suporte"
          subtitle="Entre em contato com nossa equipe"
        />

        <div className="mb-6 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p>
            E-mail: <strong className="text-foreground">{BRAND.email}</strong>
          </p>
          <p className="mt-1">
            WhatsApp: <strong className="text-foreground">(15) 99999-9999</strong>
          </p>
          <p className="mt-1">Horário: Seg–Sex, 9h às 18h</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
          <Input
            label="Assunto"
            placeholder="Ex: Problema com meu anúncio"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            label="Mensagem"
            placeholder="Descreva sua dúvida ou problema..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
          <Button type="submit" disabled={sending}>
            <Send className="mr-2 size-4" />
            {sending ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
        </form>
      </Container>
    </PageShell>
  )
}
