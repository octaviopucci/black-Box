import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useApp } from '@/context/AppContext'
import { authService } from '@/services/auth'
import { ROLE_LABELS } from '@/utils/constants'
import type { UserRole } from '@/types'

export function UsersPage() {
  const { createUser, updateUser } = useApp()
  const users = authService.listUsers()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', nome: '', role: 'vendedor' as UserRole })

  const submit = async () => {
    await createUser(form)
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="section-title">Usuários</h1>
          <p className="section-sub">Gerenciamento de acesso</p>
        </div>
        <Button onClick={() => setOpen(true)}>Novo usuário</Button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>Perfil</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.username}</td>
                <td>{ROLE_LABELS[u.role]}</td>
                <td>{u.active ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <button
                    type="button"
                    className="text-xs font-semibold text-lp-accent"
                    onClick={() => updateUser(u.id, { active: !u.active })}
                  >
                    {u.active ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo usuário">
        <div className="space-y-3">
          <Input label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <Input label="Login" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input label="Senha" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select label="Perfil" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <Button onClick={submit}>Criar</Button>
        </div>
      </Modal>
    </div>
  )
}
