export type MaterialMode = 'titanium' | 'ceramic' | 'transparent'

export const COMPONENT_COUNT = 146

export const ACTS = [
  { id: 'darkness', start: 0, end: 0.07, label: '01 Darkness' },
  { id: 'reveal', start: 0.07, end: 0.17, label: '02 Reveal' },
  { id: 'macro', start: 0.17, end: 0.33, label: '03 Macro' },
  { id: 'exploded', start: 0.33, end: 0.48, label: '04 Exploded' },
  { id: 'flythrough', start: 0.48, end: 0.56, label: '05 Fly Through' },
  { id: 'core', start: 0.56, end: 0.64, label: '06 The Core' },
  { id: 'reassembly', start: 0.64, end: 0.72, label: '07 Remontagem' },
  { id: 'oneform', start: 0.72, end: 0.82, label: '08 One Form' },
  { id: 'particles', start: 0.82, end: 0.91, label: '09 Particles' },
  { id: 'final', start: 0.91, end: 1, label: '10 Final' },
] as const

export type ActId = (typeof ACTS)[number]['id']

export function getActAt(progress: number) {
  return ACTS.find((a) => progress >= a.start && progress < a.end) ?? ACTS[ACTS.length - 1]
}

export function actLocalT(progress: number, actId: ActId): number {
  const act = ACTS.find((a) => a.id === actId)!
  return Math.max(0, Math.min(1, (progress - act.start) / (act.end - act.start)))
}

export const MACRO_POINTS = [
  { label: 'BRUSHED ARC', pos: [0.42, 0.08, 0.18] as const, look: [0.35, 0.05, 0.1] as const },
  { label: 'INDEX MARK', pos: [0.28, -0.02, 0.22] as const, look: [0.22, -0.04, 0.18] as const },
  { label: 'CERAMIC HINGE', pos: [0.12, 0.04, 0.08] as const, look: [0.08, 0.02, 0.04] as const },
  { label: 'SHELL SEAM', pos: [-0.38, 0.06, 0.14] as const, look: [-0.32, 0.04, 0.1] as const },
  { label: 'CROWN DIAL', pos: [-0.22, 0.12, 0.2] as const, look: [-0.18, 0.1, 0.16] as const },
  { label: 'MESH FOAM', pos: [-0.42, -0.06, 0.12] as const, look: [-0.36, -0.08, 0.08] as const },
  { label: 'SMOKED GLASS', pos: [0.08, 0.02, 0.24] as const, look: [0.04, 0, 0.18] as const },
  { label: 'USB-C PORT', pos: [0, -0.14, 0.06] as const, look: [0, -0.1, 0.02] as const },
] as const
