import * as THREE from 'three'
import type { AuraEngine } from '../three/engine'
import {
  ACTS,
  actLocalT,
  getActAt,
  MACRO_POINTS,
  type ActId,
} from './constants'
import type { HeadphonePart } from '../three/headphone/builder'

export interface FilmState {
  progress: number
  actId: ActId
  actLabel: string
  lightMode: boolean
  lightModeBlend: number
  title: string | null
  subtitle: string | null
  displayTitle: string | null
  specs: string | null
  showComponentCount: boolean
  showOneForm: boolean
  showDesignedFromNothing: boolean
  interactive: boolean
  macroLabel: string | null
  macroIndex: number
  showGrid: boolean
  showDust: boolean
  showCrosshair: boolean
  bokehFocus: number
  bokehStrength: number
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function camLerp(
  cam: THREE.PerspectiveCamera,
  pos: THREE.Vector3,
  look: THREE.Vector3,
  alpha: number,
) {
  cam.position.lerp(pos, alpha)
  cam.lookAt(look)
}

export class FilmDirector {
  engine: AuraEngine
  progress = 0
  materialOverride: 'titanium' | 'ceramic' | 'transparent' = 'titanium'
  lightSweep = 0
  explodeAmount = 0
  particlePhase = 0
  reassemblyPhase = 0
  materialScan = 0
  flyThroughZ = 0
  coreZoom = 0
  snapAmount = 0
  tempVec = new THREE.Vector3()
  tempLook = new THREE.Vector3()
  driverClone: THREE.Object3D | null = null

  constructor(engine: AuraEngine) {
    this.engine = engine
  }

  setProgress(p: number) {
    this.progress = Math.max(0, Math.min(1, p))
    this.applyFrame()
  }

  getState(): FilmState {
    const act = getActAt(this.progress)
    const t = actLocalT(this.progress, act.id)
    const lightModeBlend =
      act.id === 'reveal'
        ? smooth(Math.max(0, (t - 0.55) / 0.45))
        : act.id === 'macro'
          ? 1
          : act.id === 'oneform' && t > 0.66
            ? smooth((t - 0.66) / 0.34)
            : act.id === 'final'
              ? 0
              : ['exploded', 'flythrough', 'core', 'reassembly', 'particles'].includes(act.id)
                ? 0
                : 0

    let title: string | null = null
    let subtitle: string | null = null
    let displayTitle: string | null = null
    let specs: string | null = null

    if (act.id === 'darkness' && t > 0.1) title = 'AURA PRESENTS'
    if (act.id === 'reveal') {
      if (t > 0.25) displayTitle = 'AURA ONE'
      if (t > 0.65) subtitle = 'ENGINEERED TO DISAPPEAR.'
    }
    if (act.id === 'exploded' && t > 0.15) {
      displayTitle = '146 COMPONENTS.'
      if (t > 0.45) subtitle = 'ONE OBJECT.'
    }
    if (act.id === 'oneform' && t > 0.1) displayTitle = 'ONE FORM.'
    if (act.id === 'particles' && t > 0.55) subtitle = 'DESIGNED FROM NOTHING.'
    if (act.id === 'final') {
      displayTitle = 'AURA ONE'
      subtitle = 'Designed for what comes next.'
      specs = '40mm planar · −96dB · 46h · 254g · BT 5.4'
    }

    const macroIndex =
      act.id === 'macro' ? Math.min(MACRO_POINTS.length - 1, Math.floor(t * MACRO_POINTS.length)) : -1
    const macroLabel = macroIndex >= 0 ? MACRO_POINTS[macroIndex].label : null

    return {
      progress: this.progress,
      actId: act.id,
      actLabel: act.label,
      lightMode: lightModeBlend > 0.5,
      lightModeBlend,
      title,
      subtitle,
      displayTitle,
      specs,
      showComponentCount: act.id === 'exploded' && t > 0.1,
      showOneForm: act.id === 'oneform',
      showDesignedFromNothing: act.id === 'particles' && t > 0.5,
      interactive: act.id === 'final',
      macroLabel,
      macroIndex,
      showGrid: act.id === 'exploded' && t > 0.05,
      showDust: act.id === 'exploded' || act.id === 'flythrough',
      showCrosshair: act.id === 'macro' || act.id === 'exploded',
      bokehFocus: act.id === 'macro' ? 0.35 : 2.0,
      bokehStrength: act.id === 'macro' ? 0.015 : 0.003,
    }
  }

  applyFrame() {
    const { engine } = this
    const act = getActAt(this.progress)
    const t = actLocalT(this.progress, act.id)
    const state = this.getState()
    const hp = engine.headphone
    const root = hp.root
    const cam = engine.camera
    const scene = engine.scene

    const bgDark = new THREE.Color(0x050505)
    const bgLight = new THREE.Color(0xf2f2f2)
    const bg = bgDark.clone().lerp(bgLight, state.lightModeBlend)
    if (act.id === 'oneform' && t > 0.66 && this.materialOverride === 'transparent') {
      bg.lerp(new THREE.Color(0xffffff), 0.85)
    }
    scene.background = bg
    scene.fog = new THREE.FogExp2(bg.getHex(), state.lightMode ? 0.02 : 0.08)

    engine.floor.visible = act.id === 'final'
    engine.gridHelper.visible = state.showGrid
    engine.dustParticles.visible = state.showDust
    engine.soundRings.visible = act.id === 'core'
    engine.particlePoints!.visible = act.id === 'particles'

    const bokehUniforms = engine.bokehPass.uniforms as Record<string, { value: number }>
    bokehUniforms.focus.value = state.bokehFocus
    bokehUniforms.aperture.value = state.bokehStrength

    root.visible = act.id !== 'core' || t < 0.85
    root.rotation.set(0, 0, 0)
    root.position.set(0, 0, 0)
    root.scale.setScalar(1)

    this.lightSweep = (Math.sin(engine.clock.getElapsedTime() * 0.4) * 0.5 + 0.5) * 0.6 + 0.2

    switch (act.id) {
      case 'darkness':
        this.applyDarkness(t, cam, root)
        break
      case 'reveal':
        this.applyReveal(t, cam, root)
        break
      case 'macro':
        this.applyMacro(t, cam, root)
        break
      case 'exploded':
        this.applyExploded(t, cam, hp.parts)
        break
      case 'flythrough':
        this.applyFlythrough(t, cam, hp.parts)
        break
      case 'core':
        this.applyCore(t, cam, hp.parts)
        break
      case 'reassembly':
        this.applyReassembly(t, cam, hp.parts)
        break
      case 'oneform':
        this.applyOneForm(t, cam, root)
        break
      case 'particles':
        this.applyParticles(t, cam, root)
        break
      case 'final':
        this.applyFinal(t, cam, root)
        break
    }

    engine.keyLight.intensity = state.lightMode ? 1.5 : 1.2
    engine.rimLight.intensity = state.lightMode ? 0.4 : 0.65
  }

  applyDarkness(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    const reveal = ease(t)
    root.rotation.y = -0.3 + reveal * 0.2
    root.position.y = -0.05
    root.scale.setScalar(0.85 + reveal * 0.15)
    root.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        const mats = Array.isArray(c.material) ? c.material : [c.material]
        mats.forEach((m) => {
          m.opacity = 0.02 + reveal * 0.98
          m.transparent = reveal < 0.98
        })
      }
    })
    this.lightSweep = reveal * 0.15 + 0.02
    camLerp(cam, new THREE.Vector3(0.3, 0.05, 2.5 - reveal * 0.35), new THREE.Vector3(0, 0, 0), 0.08)
    this.resetParts(this.engine.headphone.parts, 0)
  }

  applyReveal(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    const orbit = t * Math.PI * 0.35
    root.rotation.y = -0.1 + orbit
    root.position.y = 0
    root.scale.setScalar(1)
    root.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        const mats = Array.isArray(c.material) ? c.material : [c.material]
        mats.forEach((m) => {
          m.opacity = 1
          m.transparent = false
        })
      }
    })
    const radius = 2.0
    camLerp(
      cam,
      new THREE.Vector3(Math.sin(orbit) * 0.4, 0.08 + Math.sin(t * Math.PI) * 0.05, radius),
      new THREE.Vector3(0, 0.02, 0),
      0.06,
    )
    this.resetParts(this.engine.headphone.parts, 0)
  }

  applyMacro(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    const idx = Math.min(MACRO_POINTS.length - 1, Math.floor(t * MACRO_POINTS.length))
    const local = (t * MACRO_POINTS.length) % 1
    const pt = MACRO_POINTS[idx]
    const next = MACRO_POINTS[Math.min(idx + 1, MACRO_POINTS.length - 1)]
    const pos = new THREE.Vector3(...pt.pos).lerp(new THREE.Vector3(...next.pos), local * 0.3)
    const look = new THREE.Vector3(...pt.look).lerp(new THREE.Vector3(...next.look), local * 0.3)
    pos.applyMatrix4(root.matrixWorld)
    look.applyMatrix4(root.matrixWorld)
    camLerp(cam, pos, look, 0.08)
    root.rotation.y = -0.05
    this.resetParts(this.engine.headphone.parts, 0)
  }

  applyExploded(t: number, cam: THREE.PerspectiveCamera, parts: HeadphonePart[]) {
    const explode = ease(Math.min(1, t * 1.4))
    this.explodeAmount = explode
    parts.forEach((p) => {
      const offset = p.explodeOffset.clone().multiplyScalar(explode)
      p.mesh.position.copy(p.homePos).add(offset)
      p.mesh.rotation.set(
        p.homeRot.x + p.explodeRot.x * explode,
        p.homeRot.y + p.explodeRot.y * explode,
        p.homeRot.z + p.explodeRot.z * explode,
      )
    })
    const orbit = t * Math.PI * 0.6
    camLerp(
      cam,
      new THREE.Vector3(Math.sin(orbit) * 1.8, 0.2 + Math.sin(t * 2) * 0.1, Math.cos(orbit) * 1.8),
      new THREE.Vector3(0, 0, 0),
      0.05,
    )
    this.engine.headphone.root.rotation.y = orbit * 0.15
  }

  applyFlythrough(t: number, cam: THREE.PerspectiveCamera, parts: HeadphonePart[]) {
    this.applyExploded(1, cam, parts)
    const z = lerp(2.5, -1.2, ease(t))
    cam.position.set(Math.sin(t * 3) * 0.3, Math.cos(t * 2) * 0.15, z)
    cam.lookAt(0, 0, z - 0.5)
    const dissolve = smooth(t)
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]!
      if (p.isDriver) continue
      if (!(p.mesh instanceof THREE.Mesh)) continue
      const scale = 1 - dissolve * (0.3 + (i % 7) * 0.08)
      p.mesh.scale.setScalar(Math.max(0.01, scale))
      const mat = p.mesh.material as THREE.Material
      mat.opacity = 1 - dissolve * 0.9
      mat.transparent = true
    }
  }

  applyCore(t: number, cam: THREE.PerspectiveCamera, parts: HeadphonePart[]) {
    parts.forEach((p) => {
      p.mesh.visible = !!p.isDriver
      if (p.isDriver) {
        p.mesh.position.set(0, 0, 0)
        p.mesh.rotation.set(0, t * 0.5, 0)
        p.mesh.scale.setScalar(2.5)
      }
    })
    const zoom = lerp(1.2, 0.25, ease(t))
    camLerp(cam, new THREE.Vector3(0, 0.05, zoom), new THREE.Vector3(0, 0, 0), 0.08)
    const rings = this.engine.soundRings
    rings.position.set(0, 0, 0)
    rings.children.forEach((c, i) => {
      if (c instanceof THREE.Mesh) {
        const s = 1 + t * 3 + i * 0.4 + Math.sin(t * 8 + i) * 0.05
        c.scale.setScalar(s)
        ;(c.material as THREE.MeshBasicMaterial).opacity = (0.2 - i * 0.025) * (0.5 + t * 0.5)
      }
    })
    const lattice = rings.children[rings.children.length - 1] as THREE.Points
    const pos = lattice.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, Math.sin(t * 6 + i * 0.2) * 0.04 * t)
    }
    pos.needsUpdate = true
  }

  applyReassembly(t: number, cam: THREE.PerspectiveCamera, parts: HeadphonePart[]) {
    if (t < 0.05) {
      parts.forEach((p) => {
        p.mesh.visible = true
        p.mesh.scale.setScalar(1)
        const far = p.explodeOffset.clone().multiplyScalar(3)
        p.mesh.position.copy(p.homePos).add(far)
      })
    }
    const assemble = ease(Math.min(1, t * 1.15))
    this.snapAmount = assemble > 0.92 ? (assemble - 0.92) / 0.08 : 0
    parts.forEach((p) => {
      p.mesh.visible = true
      const start = p.explodeOffset.clone().multiplyScalar(3)
      const end = new THREE.Vector3()
      p.mesh.position.copy(p.homePos).add(start.lerp(end, assemble))
      p.mesh.rotation.set(
        lerp(p.homeRot.x + p.explodeRot.x * 3, p.homeRot.x, assemble),
        lerp(p.homeRot.y + p.explodeRot.y * 3, p.homeRot.y, assemble),
        lerp(p.homeRot.z + p.explodeRot.z * 3, p.homeRot.z, assemble),
      )
      if (p.isScrew && assemble > 0.7) {
        p.mesh.rotation.z += (1 - assemble) * 4
      }
      p.mesh.scale.setScalar(1 + this.snapAmount * 0.02 * Math.sin(this.snapAmount * Math.PI))
      if (p.mesh instanceof THREE.Mesh) {
        const mat = p.mesh.material as THREE.Material
        mat.opacity = 1
        mat.transparent = false
      }
    })
    camLerp(cam, new THREE.Vector3(0.2, 0.1, 2.0), new THREE.Vector3(0, 0, 0), 0.06)
    this.engine.headphone.root.rotation.y = lerp(0.3, 0, assemble)
  }

  applyOneForm(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    this.resetParts(this.engine.headphone.parts, 0)
    const phase = t * 3
    const matPhase = Math.floor(phase) % 3
    const local = phase % 1
    const modes: Array<'titanium' | 'ceramic' | 'transparent'> = ['titanium', 'ceramic', 'transparent']
    this.materialOverride = modes[matPhase]!
    this.materialScan = local

    const scanY = lerp(-0.5, 0.5, local)
    root.traverse((c) => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.ShaderMaterial) {
        if (c.material.uniforms?.uLightSweep) {
          c.material.uniforms.uLightSweep.value = scanY + 0.5
        }
      }
    })

    const camAngles = [
      new THREE.Vector3(0.5, 0.1, 0.35),
      new THREE.Vector3(-0.3, 0.05, 0.28),
      new THREE.Vector3(0, 0, 0.32),
    ]
    const lookPts = [
      new THREE.Vector3(0.2, 0, 0.1),
      new THREE.Vector3(-0.15, 0, 0.08),
      new THREE.Vector3(0, 0, 0.12),
    ]
    camLerp(cam, camAngles[matPhase]!, lookPts[matPhase]!, 0.07)
    root.rotation.y = -0.15
  }

  applyParticles(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    root.visible = t < 0.15 || t > 0.85
    const pts = this.engine.particlePoints!
    const geo = this.engine.particleGeo!
    const base = this.engine.particleBase!
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const count = pos.count

    if (t < 0.2) {
      const breakUp = ease(t / 0.2)
      for (let i = 0; i < count; i++) {
        pos.setXYZ(
          i,
          base[i * 3] + (Math.random() - 0.5) * breakUp * 0.02,
          base[i * 3 + 1] + (Math.random() - 0.5) * breakUp * 0.02,
          base[i * 3 + 2] + (Math.random() - 0.5) * breakUp * 0.02,
        )
      }
    } else if (t < 0.55) {
      const expand = ease((t - 0.2) / 0.35)
      for (let i = 0; i < count; i++) {
        const bx = base[i * 3]
        const by = base[i * 3 + 1]
        const bz = base[i * 3 + 2]
        const dx = (Math.random() - 0.5) * expand * 2.5
        const dy = (Math.random() - 0.5) * expand * 2.0
        const dz = (Math.random() - 0.5) * expand * 2.5 - expand * 1.5
        pos.setXYZ(i, bx + dx, by + dy, bz + dz)
      }
    } else {
      const rebuild = ease((t - 0.55) / 0.45)
      for (let i = 0; i < count; i++) {
        const bx = base[i * 3]
        const by = base[i * 3 + 1]
        const bz = base[i * 3 + 2]
        const sx = (Math.random() - 0.5) * 2
        const sy = (Math.random() - 0.5) * 2
        const sz = (Math.random() - 0.5) * 2 - 1
        pos.setXYZ(
          i,
          lerp(sx, bx, rebuild),
          lerp(sy, by, rebuild),
          lerp(sz, bz, rebuild),
        )
      }
    }
    pos.needsUpdate = true
    camLerp(
      cam,
      new THREE.Vector3(Math.sin(t * 2) * 0.2, 0, lerp(1.8, 0.8, t)),
      new THREE.Vector3(0, 0, 0),
      0.05,
    )
    this.resetParts(this.engine.headphone.parts, 0)
  }

  applyFinal(t: number, cam: THREE.PerspectiveCamera, root: THREE.Group) {
    this.resetParts(this.engine.headphone.parts, 0)
    this.materialOverride = this.engine.director.materialOverride
    root.scale.setScalar(0.72)
    root.position.y = -0.05
    root.rotation.x = this.engine.interactiveRotation.x
    root.rotation.y = this.engine.interactiveRotation.y
    camLerp(
      cam,
      new THREE.Vector3(0, 0.02, 2.35),
      new THREE.Vector3(0, 0, 0),
      0.1,
    )
    this.lightSweep = (Math.sin(this.engine.clock.getElapsedTime() * 0.35) * 0.5 + 0.5) * 0.8
  }

  resetParts(parts: HeadphonePart[], explode: number) {
    parts.forEach((p) => {
      p.mesh.visible = true
      p.mesh.scale.setScalar(1)
      const offset = p.explodeOffset.clone().multiplyScalar(explode)
      p.mesh.position.copy(p.homePos).add(offset)
      p.mesh.rotation.copy(p.homeRot)
      if (p.mesh instanceof THREE.Mesh) {
        const mat = p.mesh.material as THREE.Material
        mat.opacity = 1
        mat.transparent = false
      }
    })
  }

  update(_dt: number, _time: number) {
    this.applyFrame()
  }
}

export function jumpToAct(actId: ActId): number {
  const act = ACTS.find((a) => a.id === actId)!
  return (act.start + act.end) / 2
}
