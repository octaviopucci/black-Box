import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/utils'
import { DOCUMENT_LABELS } from '@/utils/constants'
import { EmptyState } from '@/components/ui/Feedback'

export function DocumentsPage() {
  const { documents, vehicles } = useApp()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Documentos</h1>
        <p className="section-sub">{documents.length} documento(s) no sistema</p>
      </div>

      {!documents.length ? (
        <EmptyState
          title="Nenhum documento"
          description="Anexe documentos pelo dossiê de cada veículo."
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Categoria</th>
                <th>Veículo</th>
                <th>Vencimento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => {
                const v = vehicles.find((x) => x.id === d.vehicleId)
                return (
                  <tr key={d.id}>
                    <td>{d.nome}</td>
                    <td>{DOCUMENT_LABELS[d.categoria]}</td>
                    <td>
                      {v ? (
                        <Link to={`/veiculos/${v.id}`} className="text-lp-accent hover:underline">
                          {v.marca} {v.modelo}
                        </Link>
                      ) : '—'}
                    </td>
                    <td>{d.dataVencimento ? formatDate(d.dataVencimento) : '—'}</td>
                    <td className="capitalize">{d.status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
