import { useNavigate } from 'react-router-dom'
import { VehicleForm } from '@/components/vehicles/VehicleForm'
import { useApp } from '@/context/AppContext'
import type { VehicleInput } from '@/services/vehicles'

export function VehicleCreatePage() {
  const { createVehicle } = useApp()
  const navigate = useNavigate()

  const onSubmit = async (data: VehicleInput) => {
    const vehicle = await createVehicle(data)
    navigate(`/veiculos/${vehicle.id}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide">Cadastrar veículo</h1>
        <p className="mt-1 text-sm text-white/50">
          Preencha os dados completos. O ID é gerado automaticamente.
        </p>
      </div>
      <VehicleForm onSubmit={onSubmit} submitLabel="Cadastrar veículo" />
    </div>
  )
}
