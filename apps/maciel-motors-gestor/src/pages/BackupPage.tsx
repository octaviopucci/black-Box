import { useRef, useState } from 'react'
import { Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { useApp } from '@/context/AppContext'

export function BackupPage() {
  const { exportBackup, importBackup, restoreSeed, resetData, vehicles, customers, sales, expenses } =
    useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmSeed, setConfirmSeed] = useState(false)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide">Backup</h1>
        <p className="mt-1 text-sm text-white/50">
          Exporte, importe e restaure a base JSON completa do sistema
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Veículos', vehicles.length],
          ['Clientes', customers.length],
          ['Vendas', sales.length],
          ['Despesas', expenses.length],
        ].map(([label, value]) => (
          <div key={label as string} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold tracking-wide">Exportar / Importar</h2>
          <p className="text-sm text-white/55">
            O backup inclui vehicles, sales, expenses, customers, users, settings e history.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportBackup}>
              <Download className="h-4 w-4" /> Exportar JSON
            </Button>
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Importar JSON
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) await importBackup(file)
                e.target.value = ''
              }}
            />
          </div>
        </section>

        <section className="panel space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold tracking-wide">Restaurar / Resetar</h2>
          <p className="text-sm text-white/55">
            Restaurar demo recarrega os dados de exemplo. Resetar limpa tudo mantendo usuários padrão.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setConfirmSeed(true)}>
              <RotateCcw className="h-4 w-4" /> Restaurar backup demo
            </Button>
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              <Trash2 className="h-4 w-4" /> Resetar dados
            </Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmSeed}
        title="Restaurar dados demo"
        message="Os dados atuais serão substituídos pelos dados de demonstração. Continuar?"
        confirmLabel="Restaurar"
        onCancel={() => setConfirmSeed(false)}
        onConfirm={async () => {
          await restoreSeed()
          setConfirmSeed(false)
        }}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Resetar dados"
        message="Todos os veículos, vendas, despesas, clientes e histórico serão apagados."
        confirmLabel="Resetar"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={async () => {
          await resetData()
          setConfirmReset(false)
        }}
      />
    </div>
  )
}
