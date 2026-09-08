import { cn } from '@/lib/utils'

type StateProps = {
  title: string
  description?: string
  className?: string
  action?: React.ReactNode
}

export function LoadingState({ title, description, className }: StateProps) {
  return (
    <StateCard className={className}>
      <div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-zinc-800" />
      <StateTitle>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
    </StateCard>
  )
}

export function ErrorState({ title, description, className, action }: StateProps) {
  return (
    <StateCard className={className}>
      <StateTitle>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </StateCard>
  )
}

export function EmptyState({ title, description, className, action }: StateProps) {
  return (
    <StateCard className={className}>
      <StateTitle>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </StateCard>
  )
}

function StateCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

function StateTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-medium text-zinc-100">{children}</h2>
}

function StateDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm text-zinc-400">{children}</p>
}
