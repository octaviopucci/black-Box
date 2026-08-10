import { auditService } from '@/services/auth'
import { formatDateTime } from '@/utils'
import { EmptyState } from '@/components/ui/Feedback'

export function AuditPage() {
  const logs = auditService.list(100)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Auditoria</h1>
        <p className="section-sub">Registro de ações no sistema</p>
      </div>

      {!logs.length ? (
        <EmptyState title="Nenhum registro" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Usuário</th>
                <th>Ação</th>
                <th>Entidade</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap text-xs">{formatDateTime(l.createdAt)}</td>
                  <td>{l.username}</td>
                  <td>{l.action}</td>
                  <td>{l.entityType}</td>
                  <td className="max-w-xs truncate">{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
