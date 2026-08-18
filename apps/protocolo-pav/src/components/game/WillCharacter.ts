/** High-resolution procedural character for Arena (will avatar). */

export type CharacterPose = 'idle' | 'run' | 'jump' | 'resist' | 'win' | 'hit'

export type CharacterState = {
  x: number
  y: number
  facing: 1 | -1
  pose: CharacterPose
  t: number
  scale: number
}

export function drawWillCharacter(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  palette = { body: '#F3F3F3', accent: '#E10600', will: '#2EE59D', ink: '#050505' },
) {
  const { x, y, facing, pose, t, scale } = state
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(facing * scale, scale)

  const bob =
    pose === 'idle'
      ? Math.sin(t * 3.2) * 2.2
      : pose === 'run'
        ? Math.sin(t * 14) * 3.5
        : pose === 'resist'
          ? Math.sin(t * 18) * 1.2
          : 0
  const lean = pose === 'run' ? 0.12 : pose === 'jump' ? -0.08 : pose === 'hit' ? 0.2 : 0

  ctx.translate(0, bob)
  ctx.rotate(lean)

  // ground contact glow
  ctx.fillStyle = 'rgba(46,229,157,0.18)'
  ctx.beginPath()
  ctx.ellipse(0, 58, 34, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  const legSwing = pose === 'run' ? Math.sin(t * 14) : pose === 'jump' ? 0.55 : Math.sin(t * 2) * 0.12
  const armSwing = pose === 'run' ? Math.sin(t * 14 + Math.PI) : pose === 'resist' ? Math.sin(t * 10) * 0.4 : Math.sin(t * 2 + 0.4) * 0.15

  // legs
  drawLimb(ctx, -8, 18, 10, 28, legSwing * 0.55, palette.body, 7)
  drawLimb(ctx, 8, 18, 10, 28, -legSwing * 0.55, palette.body, 7)

  // torso armor plate
  const torsoGrad = ctx.createLinearGradient(-22, -30, 22, 30)
  torsoGrad.addColorStop(0, '#1a1a1a')
  torsoGrad.addColorStop(0.45, '#2a2a2a')
  torsoGrad.addColorStop(1, '#121212')
  roundRect(ctx, -20, -28, 40, 48, 10)
  ctx.fillStyle = torsoGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // chest core
  ctx.fillStyle = pose === 'win' || pose === 'resist' ? palette.will : palette.accent
  ctx.beginPath()
  ctx.moveTo(0, -12)
  ctx.lineTo(8, 2)
  ctx.lineTo(0, 16)
  ctx.lineTo(-8, 2)
  ctx.closePath()
  ctx.fill()
  ctx.shadowColor = pose === 'resist' ? palette.will : palette.accent
  ctx.shadowBlur = pose === 'resist' ? 18 : 10
  ctx.fill()
  ctx.shadowBlur = 0

  // arms
  drawLimb(ctx, -18, -16, 8, 24, armSwing * 0.7 - 0.3, palette.body, 6)
  drawLimb(ctx, 18, -16, 8, 24, -armSwing * 0.7 + 0.3, palette.body, 6)

  // head
  ctx.fillStyle = '#EDEDED'
  ctx.beginPath()
  ctx.arc(0, -42, 16, 0, Math.PI * 2)
  ctx.fill()

  // visor
  const visor = ctx.createLinearGradient(-12, -48, 12, -36)
  visor.addColorStop(0, palette.accent)
  visor.addColorStop(1, '#7a0400')
  roundRect(ctx, -12, -48, 24, 10, 4)
  ctx.fillStyle = visor
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillRect(-10, -47, 8, 2)

  // shoulder pads
  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.ellipse(-18, -20, 9, 6, -0.3, 0, Math.PI * 2)
  ctx.ellipse(18, -20, 9, 6, 0.3, 0, Math.PI * 2)
  ctx.fill()

  // status ring
  if (pose === 'resist' || pose === 'win') {
    ctx.strokeStyle = pose === 'win' ? palette.will : palette.accent
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.55 + Math.sin(t * 8) * 0.25
    ctx.beginPath()
    ctx.arc(0, -8, 48 + Math.sin(t * 6) * 3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  ctx.restore()
}

function drawLimb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number,
  color: string,
  r: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  roundRect(ctx, -w / 2, 0, w, h, r)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

function roundRect(
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
