import { useNavigate, useParams } from 'react-router-dom'
import { VehicleForm } from '@/components/vehicles/VehicleForm'
import { Loading, EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import type { VehicleInput } from '@/services/vehicles'

export function VehicleEditPage() {
  const { id } = useParams()
  const { vehicles, ready, updateVehicle } = useApp()
  const navigate = useNavigate()
  const vehicle = vehicles.find((v) => v.id === id)

  if (!ready) return <Loading />
  if (!vehicle) return <EmptyState title="Veículo não encontrado" />

  const onSubmit = async (data: VehicleInput) => {
    await updateVehicle(vehicle.id, data)
    navigate(`/veiculos/${vehicle.id}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Editar veículo</h1>
        <p className="section-sub">
          {vehicle.marca} {vehicle.modelo} · {vehicle.placa || vehicle.codigoInterno}
        </p>
      </div>
      <VehicleForm initial={vehicle} onSubmit={onSubmit} submitLabel="Salvar alterações" />
    </div>
  )
}
