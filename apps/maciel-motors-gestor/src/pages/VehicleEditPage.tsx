import { useNavigate, useParams } from 'react-router-dom'
import { VehicleForm } from '@/components/vehicles/VehicleForm'
import { EmptyState, Loading } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import type { VehicleInput } from '@/services/vehicles'

export function VehicleEditPage() {
  const { id } = useParams()
  const { vehicles, updateVehicle, ready } = useApp()
  const navigate = useNavigate()
  const vehicle = vehicles.find((v) => v.id === id)

  if (!ready) return <Loading />
  if (!vehicle) {
    return (
      <EmptyState
        title="Veículo não encontrado"
        action={
          <button className="btn-primary" onClick={() => navigate('/estoque')}>
            Voltar ao estoque
          </button>
        }
      />
    )
  }

  const onSubmit = async (data: VehicleInput) => {
    await updateVehicle(vehicle.id, data)
    navigate(`/veiculos/${vehicle.id}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide">Editar veículo</h1>
        <p className="mt-1 text-sm text-white/50">
          {vehicle.marca} {vehicle.modelo} · {vehicle.placa || 'S/ placa'}
        </p>
      </div>
      <VehicleForm initial={vehicle} onSubmit={onSubmit} submitLabel="Salvar alterações" />
    </div>
  )
}
