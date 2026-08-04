'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onValueChange, onClear, placeholder = 'Buscar...', ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const hasValue = Boolean(value && value.length > 0)

    const handleClear = () => {
      onValueChange?.('')
      onClear?.()
    }

    return (
      <div
        className={cn(
          'relative flex items-center rounded-xl border bg-card shadow-sm transition-all duration-200',
          focused
            ? 'border-primary/40 ring-2 ring-primary/20'
            : 'border-border hover:border-border/80',
          className,
        )}
      >
        <motion.div
          className="pointer-events-none absolute left-3 text-muted-foreground"
          animate={{ scale: focused || hasValue ? 0.9 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <Search className="size-4" aria-hidden />
        </motion.div>
        <input
          ref={ref}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onValueChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'h-11 w-full bg-transparent pl-10 pr-10 text-sm text-foreground outline-none',
            'placeholder:text-muted-foreground',
          )}
          {...props}
        />
        <AnimatePresence>
          {hasValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-1.5"
            >
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                shape="circle"
                aria-label="Limpar busca"
                onClick={handleClear}
              >
                <X />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
