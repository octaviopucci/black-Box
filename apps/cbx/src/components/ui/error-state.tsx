import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

function ErrorState({
  icon: Icon = AlertCircle,
  title = 'Algo deu errado',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
      role="alert"
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-danger/10">
        <Icon className="size-7 text-danger" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { ErrorState }
