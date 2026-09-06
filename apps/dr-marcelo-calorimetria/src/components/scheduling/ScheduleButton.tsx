import { useScheduling } from '../../context/SchedulingContext'

type ScheduleButtonProps = {
  className?: string
}

export function ScheduleButton({ className = '' }: ScheduleButtonProps) {
  const { openScheduling } = useScheduling()

  return (
    <button type="button" onClick={openScheduling} className={`cta-solid justify-center uppercase tracking-wide ${className}`.trim()}>
      Agendar minha avaliação
    </button>
  )
}
