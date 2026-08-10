import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { VehicleForm } from '@/components/vehicles/VehicleForm'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import type { VehicleInput } from '@/services/vehicles'

const STEPS = [
  'Identificação',
  'Compra',
  'Documentação',
  'Preparação',
  'Comercial',
  'Fotos',
] as const

export function VehicleCreatePage() {
  const { createVehicle, toast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [draftData, setDraftData] = useState<Partial<VehicleInput>>({})

  const onSubmit = async (data: VehicleInput, asDraft = false) => {
    const vehicle = await createVehicle({ ...data, ...draftData, draft: asDraft })
    navigate(`/veiculos/${vehicle.id}`)
  }

  const saveDraft = async (data: Partial<VehicleInput>) => {
    const merged = { ...draftData, ...data }
    setDraftData(merged)
    const vehicle = await createVehicle({
      marca: merged.marca || 'Rascunho',
      modelo: merged.modelo || 'Sem modelo',
      versao: merged.versao || '',
      ano: merged.ano || new Date().getFullYear(),
      anoModelo: merged.anoModelo || new Date().getFullYear(),
      categoria: merged.categoria || 'Sedan',
      cor: merged.cor || '',
      placa: merged.placa || '',
      renavam: merged.renavam || '',
      chassi: merged.chassi || '',
      motor: merged.motor || '',
      portas: merged.portas || 4,
      combustivel: merged.combustivel || 'flex',
      cambio: merged.cambio || 'automatico',
      quilometragem: merged.quilometragem || 0,
      cidade: merged.cidade || '',
      estado: merged.estado || 'SP',
      fornecedor: merged.fornecedor || '',
      telefoneFornecedor: merged.telefoneFornecedor || '',
      origem: merged.origem || 'Particular',
      cpfCnpjOrigem: merged.cpfCnpjOrigem || '',
      localCompra: merged.localCompra || '',
      formaPagamentoCompra: merged.formaPagamentoCompra || '',
      entradaCompra: merged.entradaCompra || 0,
      financiamentoCompra: merged.financiamentoCompra || 0,
      observacoesCompra: merged.observacoesCompra || '',
      precoFipe: merged.precoFipe || 0,
      valorCompra: merged.valorCompra || 0,
      precoAnunciado: merged.precoAnunciado || 0,
      precoMinimo: merged.precoMinimo || 0,
      observacoes: merged.observacoes || '',
      dataCompra: merged.dataCompra || new Date().toISOString().slice(0, 10),
      fotos: merged.fotos || [],
      fotoPrincipal: merged.fotoPrincipal || 0,
      status: merged.status || 'comprado',
      consignado: merged.consignado || false,
      vendedorResponsavel: merged.vendedorResponsavel || '',
      codigoInterno: merged.codigoInterno || '',
      draft: true,
    })
    toast('Rascunho salvo', 'info')
    navigate(`/veiculos/${vehicle.id}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Cadastrar veículo</h1>
        <p className="section-sub">Assistente em etapas — salve rascunho a qualquer momento</p>
      </div>

      <div className="panel p-4">
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                i === step
                  ? 'bg-lp-accent text-white'
                  : i < step
                    ? 'bg-lp-accent/15 text-lp-accent'
                    : 'bg-lp-mist text-lp-steel'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <VehicleForm
        wizardStep={step}
        initial={draftData as never}
        onStepData={(data) => setDraftData((prev) => ({ ...prev, ...data }))}
        onSubmit={(data) => onSubmit(data, false)}
        submitLabel="Finalizar cadastro"
        extraActions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              onClick={() => saveDraft(draftData)}
            >
              <Save className="h-4 w-4" />
              Salvar rascunho
            </Button>
          </div>
        }
      />
    </div>
  )
}
