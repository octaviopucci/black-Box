'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  value: string
  onValueChange: (value: string) => void
  className?: string
  layoutId?: string
}

function Tabs({
  tabs,
  value,
  onValueChange,
  className,
  layoutId = 'tabs-underline',
}: TabsProps) {
  return (
    <div
      className={cn('relative flex gap-1 border-b border-border', className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onValueChange(tab.id)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:pointer-events-none disabled:opacity-50',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs }
