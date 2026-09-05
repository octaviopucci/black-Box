import { useRef } from 'react'
import { useInView, type UseInViewOptions } from 'framer-motion'

type StageOptions = {
  amount?: number
  margin?: UseInViewOptions['margin']
}

export function useReportStage({ amount = 0.45, margin = '0px 0px -10% 0px' }: StageOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { once: true, amount, margin })
  return { ref, active }
}

/** Chart needs to be well inside viewport before drawing starts */
export function useChartStage() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, {
    once: true,
    amount: 0.55,
    margin: '0px 0px -15% 0px' as UseInViewOptions['margin'],
  })
  return { ref, active }
}
