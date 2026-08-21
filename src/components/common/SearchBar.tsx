import { Search } from 'lucide-react'
import { cn } from '@/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Pesquisar placa, marca, modelo, chassi...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  )
}
