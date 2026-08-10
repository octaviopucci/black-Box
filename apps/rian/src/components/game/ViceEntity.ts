/** Procedural addiction / impulse entity for the symbolic fight. */

export function drawViceEntity(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  t: number,
  power: number,
  scale = 1,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  const pulse = 1 + Math.sin(t * 6) * 0.06 + power * 0.18
  const rage = Math.min(1, power)

  // smoke aura
  for (let i = 0; i < 5; i++) {
    const a = t * 1.4 + i * 1.2
    const rx = Math.cos(a) * (38 + i * 10) * pulse
    const ry = Math.sin(a * 1.3) * (22 + i * 6)
    ctx.beginPath()
    ctx.ellipse(rx * 0.3, ry - 10, 28 - i * 3, 16 - i * 2, a, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(225,6,0,${0.08 + rage * 0.08})`
    ctx.fill()
  }

  // core mass
  const g = ctx.createRadialGradient(0, -8, 4, 0, -8, 52 * pulse)
  g.addColorStop(0, `rgba(255,60,40,${0.85})`)
  g.addColorStop(0.45, `rgba(180,10,0,${0.75})`)
  g.addColorStop(1, 'rgba(40,0,0,0)')
  ctx.beginPath()
  ctx.ellipse(0, -6, 40 * pulse, 48 * pulse, 0, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()

  // eye slits
  ctx.fillStyle = '#050505'
  ctx.fillRect(-16, -18, 12, 3)
  ctx.fillRect(4, -18, 12, 3)
  ctx.fillStyle = `rgba(255,220,180,${0.5 + rage * 0.5})`
  ctx.fillRect(-14, -17, 8, 1.5)
  ctx.fillRect(6, -17, 8, 1.5)

  // tendrils toward the player (left)
  ctx.strokeStyle = `rgba(255,42,31,${0.35 + rage * 0.4})`
  ctx.lineWidth = 2.5
  for (let i = 0; i < 3; i++) {
    const wave = Math.sin(t * 5 + i) * (10 + rage * 16)
    ctx.beginPath()
    ctx.moveTo(-30, -4 + i * 10)
    ctx.bezierCurveTo(-70, wave - 20, -110, -wave, -150 - rage * 40, wave * 0.4)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawBasePillar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  active: boolean,
  t: number,
) {
  ctx.save()
  ctx.translate(x, y)

  const h = active ? 96 : 54
  const glow = active ? 0.55 + Math.sin(t * 4) * 0.15 : 0.15

  ctx.fillStyle = `rgba(46,229,157,${glow * 0.2})`
  ctx.beginPath()
  ctx.ellipse(0, 8, 28, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  const g = ctx.createLinearGradient(0, -h, 0, 0)
  g.addColorStop(0, active ? '#2EE59D' : '#3a3a3a')
  g.addColorStop(1, active ? '#0F3D2C' : '#1a1a1a')
  roundPillar(ctx, -12, -h, 24, h, 6)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = active ? 'rgba(46,229,157,0.8)' : 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // BASE mark
  ctx.fillStyle = active ? '#F3F3F3' : '#666'
  ctx.font = '700 9px "Chakra Petch", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('BASE', 0, -h + 16)

  ctx.fillStyle = active ? '#2EE59D' : '#888'
  ctx.font = '600 10px "IBM Plex Mono", monospace'
  ctx.fillText(label, 0, 22)

  ctx.restore()
}

function roundPillar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
