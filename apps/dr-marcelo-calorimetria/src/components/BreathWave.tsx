type BreathWaveProps = {
  tone?: 'light' | 'dark'
  className?: string
}

const WAVE_PATH =
  'M0 50 C 20 20, 40 20, 60 50 C 80 80, 100 80, 120 50 C 140 20, 160 20, 180 50 C 200 80, 220 80, 240 50 C 260 20, 280 20, 300 50 C 320 80, 340 80, 360 50 C 380 20, 400 20, 420 50'

export function BreathWave({ tone = 'light', className = '' }: BreathWaveProps) {
  const stroke = tone === 'light' ? 'rgba(241,244,242,0.9)' : 'rgba(11,75,74,0.85)'
  const strokeMute = tone === 'light' ? 'rgba(241,244,242,0.28)' : 'rgba(11,75,74,0.24)'

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="breath-track flex w-[840px]">
        {[0, 1].map((copy) => (
          <svg
            key={copy}
            viewBox="0 0 420 100"
            preserveAspectRatio="none"
            className="h-full w-[420px] shrink-0"
          >
            <path d={WAVE_PATH} fill="none" stroke={strokeMute} strokeWidth="1" />
            <path
              d={WAVE_PATH}
              fill="none"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinecap="round"
              className="breath-line"
            />
          </svg>
        ))}
      </div>
    </div>
  )
}
