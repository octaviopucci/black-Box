/** Soft ambient washes — presence without clutter. */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <div className="absolute -left-[20%] top-[-10%] h-[55vh] w-[55vh] rounded-full bg-signal/[0.07] blur-[100px]" />
      <div className="absolute -right-[15%] top-[35%] h-[45vh] w-[45vh] rounded-full bg-champagne/[0.05] blur-[110px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[50vh] w-[50vh] rounded-full bg-signal/[0.04] blur-[120px]" />
    </div>
  )
}
