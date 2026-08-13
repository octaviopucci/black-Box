import { Flame } from 'lucide-react'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${box} relative grid place-items-center rounded-xl bg-gradient-to-br from-flame to-ember shadow-glow`}
      >
        <Flame className="h-[55%] w-[55%] text-night" strokeWidth={2.4} />
      </div>
      <span className={`${text} font-display font-extrabold tracking-tight text-paper`}>
        chama
      </span>
    </div>
  )
}
