import { useEffect, useState } from 'react'

/** Mobile / touch devices: video seek often flashes black — use frame sequence instead. */
export function usePreferFrameScrub() {
  const [preferFrames, setPreferFrames] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)')
    const update = () => setPreferFrames(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return preferFrames
}
