import { ScheduleButton } from './ScheduleButton'

/** Segundo CTA de agendamento — antes do rodapé, sem alterar seções existentes. */
export function ScheduleCtaFooter() {
  return (
    <section className="bg-paper px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl justify-center">
        <ScheduleButton className="w-full max-w-md py-4 sm:w-auto" />
      </div>
    </section>
  )
}
