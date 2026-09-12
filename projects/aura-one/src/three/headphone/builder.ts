import * as THREE from 'three'
import type { MaterialSet } from '../materials'
import { COMPONENT_COUNT } from '../../film/constants'

export interface HeadphonePart {
  mesh: THREE.Object3D
  id: string
  label: string
  category: string
  homePos: THREE.Vector3
  homeRot: THREE.Euler
  explodeOffset: THREE.Vector3
  explodeRot: THREE.Euler
  isDriver?: boolean
  isScrew?: boolean
}

export interface HeadphoneAssembly {
  root: THREE.Group
  parts: HeadphonePart[]
  driverGroup: THREE.Group
  leftCup: THREE.Group
  rightCup: THREE.Group
  headband: THREE.Group
}

function screwGeo(): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(0.004, 0.004, 0.012, 8)
  g.rotateX(Math.PI / 2)
  return g
}

function addScrews(
  parent: THREE.Group,
  positions: [number, number, number][],
  mat: THREE.Material,
  prefix: string,
  parts: HeadphonePart[],
  baseExplode: THREE.Vector3,
) {
  positions.forEach((p, i) => {
    const mesh = new THREE.Mesh(screwGeo(), mat)
    mesh.position.set(...p)
    parent.add(mesh)
    parts.push({
      mesh,
      id: `${prefix}_screw_${i}`,
      label: `M1.4×4 ${i + 1}`,
      category: 'fastener',
      homePos: mesh.position.clone(),
      homeRot: mesh.rotation.clone(),
      explodeOffset: baseExplode.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.15, Math.random() * 0.2, (Math.random() - 0.5) * 0.1)),
      explodeRot: new THREE.Euler(Math.random() * 0.5, Math.random() * Math.PI, 0),
      isScrew: true,
    })
  })
}

function buildEarCup(
  side: 'L' | 'R',
  materials: MaterialSet,
  parts: HeadphonePart[],
): THREE.Group {
  const sign = side === 'L' ? -1 : 1
  const cup = new THREE.Group()
  cup.name = `cup_${side}`
  cup.position.x = sign * 0.42

  const shellOuter = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.55),
    materials.titanium.clone(),
  )
  shellOuter.scale.set(1, 0.85, 0.95)
  shellOuter.rotation.y = sign * 0.15
  cup.add(shellOuter)
  parts.push({
    mesh: shellOuter,
    id: `${side}_shell_outer`,
    label: 'TITANIUM SHELL',
    category: 'enclosure',
    homePos: shellOuter.position.clone(),
    homeRot: shellOuter.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.35, 0.12, 0.25),
    explodeRot: new THREE.Euler(0.2, sign * 0.3, 0),
  })

  const shellInner = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
    materials.aluminum.clone(),
  )
  shellInner.scale.set(1, 0.82, 0.9)
  shellInner.position.z = -0.02
  cup.add(shellInner)
  parts.push({
    mesh: shellInner,
    id: `${side}_shell_inner`,
    label: 'INNER SHELL',
    category: 'enclosure',
    homePos: shellInner.position.clone(),
    homeRot: shellInner.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.2, -0.08, -0.15),
    explodeRot: new THREE.Euler(-0.15, 0, 0),
  })

  const glassWindow = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.35),
    materials.glass.clone(),
  )
  glassWindow.position.set(sign * -0.04, 0.02, 0.18)
  glassWindow.rotation.x = -0.3
  cup.add(glassWindow)
  parts.push({
    mesh: glassWindow,
    id: `${side}_glass`,
    label: 'SMOKED GLASS',
    category: 'optics',
    homePos: glassWindow.position.clone(),
    homeRot: glassWindow.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.1, 0.25, 0.35),
    explodeRot: new THREE.Euler(0.4, 0, 0),
  })

  const cushion = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.055, 24, 64),
    materials.mesh.clone(),
  )
  cushion.rotation.x = Math.PI / 2
  cushion.position.z = -0.08
  cup.add(cushion)
  parts.push({
    mesh: cushion,
    id: `${side}_cushion`,
    label: 'MEMORY FOAM MESH',
    category: 'comfort',
    homePos: cushion.position.clone(),
    homeRot: cushion.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.45, -0.05, -0.3),
    explodeRot: new THREE.Euler(0, 0, sign * 0.2),
  })

  const foamCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.04, 32),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 }),
  )
  foamCore.rotation.x = Math.PI / 2
  foamCore.position.z = -0.06
  cup.add(foamCore)
  parts.push({
    mesh: foamCore,
    id: `${side}_foam`,
    label: 'FOAM CORE',
    category: 'comfort',
    homePos: foamCore.position.clone(),
    homeRot: foamCore.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.38, -0.12, -0.22),
    explodeRot: new THREE.Euler(0, 0, 0),
  })

  const driverGroup = new THREE.Group()
  driverGroup.position.z = -0.04

  const magnet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.025, 32),
    materials.magnet.clone(),
  )
  magnet.rotation.x = Math.PI / 2
  driverGroup.add(magnet)

  const coil = new THREE.Mesh(
    new THREE.TorusGeometry(0.055, 0.008, 12, 48),
    materials.coil.clone(),
  )
  coil.rotation.x = Math.PI / 2
  coil.position.z = 0.02
  driverGroup.add(coil)

  for (let w = 0; w < 8; w++) {
    const wind = new THREE.Mesh(
      new THREE.TorusGeometry(0.04 + w * 0.002, 0.0015, 6, 32),
      materials.coil.clone(),
    )
    wind.rotation.x = Math.PI / 2
    wind.position.z = 0.018 + w * 0.001
    driverGroup.add(wind)
    parts.push({
      mesh: wind,
      id: `${side}_wind_${w}`,
      label: `COIL WIND ${w + 1}`,
      category: 'driver',
      homePos: wind.position.clone(),
      homeRot: wind.rotation.clone(),
      explodeOffset: new THREE.Vector3(sign * (0.08 + w * 0.02), 0.05, -0.08 - w * 0.03),
      explodeRot: new THREE.Euler(0, w * 0.2, 0),
    })
  }

  const diaphragm = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.015, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.4, roughness: 0.6, side: THREE.DoubleSide }),
  )
  diaphragm.rotation.x = -Math.PI / 2
  diaphragm.position.z = 0.035
  driverGroup.add(diaphragm)

  parts.push({
    mesh: magnet,
    id: `${side}_magnet`,
    label: 'NEODYMIUM CORE',
    category: 'driver',
    homePos: magnet.position.clone(),
    homeRot: magnet.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.15, -0.1, -0.05),
    explodeRot: new THREE.Euler(0.3, 0, 0),
    isDriver: side === 'R',
  })
  parts.push({
    mesh: coil,
    id: `${side}_coil`,
    label: 'VOICE COIL',
    category: 'driver',
    homePos: coil.position.clone(),
    homeRot: coil.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.12, 0.08, -0.12),
    explodeRot: new THREE.Euler(0, 0.5, 0),
  })
  parts.push({
    mesh: diaphragm,
    id: `${side}_diaphragm`,
    label: 'BIOMIMETIC DIAPHRAGM',
    category: 'driver',
    homePos: diaphragm.position.clone(),
    homeRot: diaphragm.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.18, 0.15, 0.05),
    explodeRot: new THREE.Euler(-0.2, 0, 0),
    isDriver: true,
  })

  cup.add(driverGroup)

  const pcb = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.08, 0.008),
    materials.pcb.clone(),
  )
  pcb.position.set(sign * -0.06, -0.06, 0.02)
  pcb.rotation.y = sign * 0.2
  cup.add(pcb)
  parts.push({
    mesh: pcb,
    id: `${side}_pcb`,
    label: 'DSP BOARD',
    category: 'electronics',
    homePos: pcb.position.clone(),
    homeRot: pcb.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.25, -0.2, 0.1),
    explodeRot: new THREE.Euler(0.5, sign * 0.4, 0),
  })

  for (let c = 0; c < 12; c++) {
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.012, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.4 }),
    )
    chip.position.set(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.05,
      0.005,
    )
    pcb.add(chip)
    parts.push({
      mesh: chip,
      id: `${side}_chip_${c}`,
      label: `SMD ${c + 1}`,
      category: 'electronics',
      homePos: chip.position.clone(),
      homeRot: chip.rotation.clone(),
      explodeOffset: new THREE.Vector3(sign * (0.2 + c * 0.015), -0.15 + c * 0.01, 0.08),
      explodeRot: new THREE.Euler(Math.random(), Math.random(), Math.random()),
    })
  }

  const battery = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.025, 0.12),
    materials.battery.clone(),
  )
  battery.position.set(sign * 0.04, -0.04, -0.02)
  cup.add(battery)
  parts.push({
    mesh: battery,
    id: `${side}_battery`,
    label: 'Li-Po CELL',
    category: 'power',
    homePos: battery.position.clone(),
    homeRot: battery.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.3, -0.25, -0.08),
    explodeRot: new THREE.Euler(0.2, 0, 0),
  })

  const hinge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.035, 16),
    materials.hinge.clone(),
  )
  hinge.rotation.z = Math.PI / 2
  hinge.position.set(sign * 0.22, 0.18, 0)
  cup.add(hinge)
  parts.push({
    mesh: hinge,
    id: `${side}_hinge`,
    label: 'CERAMIC HINGE',
    category: 'mechanism',
    homePos: hinge.position.clone(),
    homeRot: hinge.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.08, 0.35, 0.05),
    explodeRot: new THREE.Euler(0, 0, sign * 0.8),
  })

  const sliderOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.08, 16),
    materials.aluminum.clone(),
  )
  sliderOuter.rotation.x = Math.PI / 2
  sliderOuter.position.set(sign * 0.26, 0.22, 0.02)
  cup.add(sliderOuter)

  const sliderInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.06, 12),
    materials.titanium.clone(),
  )
  sliderInner.rotation.x = Math.PI / 2
  sliderInner.position.set(sign * 0.26, 0.22, 0.06)
  cup.add(sliderInner)

  parts.push({
    mesh: sliderOuter,
    id: `${side}_slider_outer`,
    label: 'SLIDER HOUSING',
    category: 'mechanism',
    homePos: sliderOuter.position.clone(),
    homeRot: sliderOuter.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.15, 0.42, 0.12),
    explodeRot: new THREE.Euler(0.3, 0, 0),
  })
  parts.push({
    mesh: sliderInner,
    id: `${side}_slider_inner`,
    label: 'INDEX SLIDER',
    category: 'mechanism',
    homePos: sliderInner.position.clone(),
    homeRot: sliderInner.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.12, 0.48, 0.08),
    explodeRot: new THREE.Euler(0, 0, 0),
  })

  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.015, 32),
    materials.titanium.clone(),
  )
  crown.position.set(sign * -0.12, 0.14, 0.16)
  crown.rotation.x = Math.PI / 2
  cup.add(crown)
  parts.push({
    mesh: crown,
    id: `${side}_crown`,
    label: 'SERRATED CROWN',
    category: 'control',
    homePos: crown.position.clone(),
    homeRot: crown.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * -0.05, 0.32, 0.28),
    explodeRot: new THREE.Euler(0.6, 0, 0),
  })

  const usbPort = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.008, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.8, roughness: 0.3 }),
  )
  usbPort.position.set(0, -0.2, 0.08)
  cup.add(usbPort)
  parts.push({
    mesh: usbPort,
    id: `${side}_usbc`,
    label: 'USB-C',
    category: 'io',
    homePos: usbPort.position.clone(),
    homeRot: usbPort.rotation.clone(),
    explodeOffset: new THREE.Vector3(sign * 0.05, -0.35, 0.15),
    explodeRot: new THREE.Euler(0.8, 0, 0),
  })

  const flexPoints: [number, number, number][] = []
  for (let f = 0; f < 6; f++) {
    const flex = new THREE.Mesh(
      new THREE.BoxGeometry(0.003, 0.012, 0.025),
      materials.flex.clone(),
    )
    flex.position.set(sign * (0.08 + f * 0.008), -0.02 + f * 0.01, 0.04)
    flex.rotation.y = sign * 0.3
    cup.add(flex)
    flexPoints.push([flex.position.x, flex.position.y, flex.position.z])
    parts.push({
      mesh: flex,
      id: `${side}_flex_${f}`,
      label: `FLEX ${f + 1}`,
      category: 'cable',
      homePos: flex.position.clone(),
      homeRot: flex.rotation.clone(),
      explodeOffset: new THREE.Vector3(sign * (0.1 + f * 0.02), 0.05, 0.2 + f * 0.03),
      explodeRot: new THREE.Euler(0, f * 0.3, 0),
    })
  }

  const screwPositions: [number, number, number][] = []
  for (let s = 0; s < 10; s++) {
    const angle = (s / 10) * Math.PI * 2
    screwPositions.push([
      Math.cos(angle) * 0.2 * sign,
      Math.sin(angle) * 0.08,
      0.12,
    ])
  }
  addScrews(cup, screwPositions, materials.screw.clone(), side, parts, new THREE.Vector3(sign * 0.2, 0.1, 0.2))

  const auraLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 0.008),
    new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.5 }),
  )
  auraLabel.position.set(sign * -0.08, -0.1, 0.2)
  auraLabel.rotation.y = sign * -0.3
  cup.add(auraLabel)

  return cup
}

export function buildHeadphone(materials: MaterialSet): HeadphoneAssembly {
  const root = new THREE.Group()
  root.name = 'aura_one'
  const parts: HeadphonePart[] = []

  const headband = new THREE.Group()
  const bandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.05, 0),
    new THREE.Vector3(-0.2, 0.38, 0),
    new THREE.Vector3(0, 0.48, 0),
    new THREE.Vector3(0.2, 0.38, 0),
    new THREE.Vector3(0.42, 0.05, 0),
  ])
  const bandGeo = new THREE.TubeGeometry(bandCurve, 64, 0.035, 12, false)
  const bandMesh = new THREE.Mesh(bandGeo, materials.titanium.clone())
  headband.add(bandMesh)
  parts.push({
    mesh: bandMesh,
    id: 'headband_tube',
    label: 'TITANIUM BAND',
    category: 'structure',
    homePos: bandMesh.position.clone(),
    homeRot: bandMesh.rotation.clone(),
    explodeOffset: new THREE.Vector3(0, 0.55, 0),
    explodeRot: new THREE.Euler(0.3, 0, 0),
  })

  const padTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.22, 0.025),
    materials.mesh.clone(),
  )
  padTop.position.y = 0.42
  headband.add(padTop)
  parts.push({
    mesh: padTop,
    id: 'headband_pad',
    label: 'HEAD PAD',
    category: 'comfort',
    homePos: padTop.position.clone(),
    homeRot: padTop.rotation.clone(),
    explodeOffset: new THREE.Vector3(0, 0.65, 0.1),
    explodeRot: new THREE.Euler(0.1, 0, 0),
  })

  for (let i = 0; i < 8; i++) {
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.02, 0.015),
      materials.aluminum.clone(),
    )
    seg.position.set((i - 3.5) * 0.05, 0.35 + Math.sin(i) * 0.02, 0)
    headband.add(seg)
    parts.push({
      mesh: seg,
      id: `band_seg_${i}`,
      label: `BAND SEG ${i + 1}`,
      category: 'structure',
      homePos: seg.position.clone(),
      homeRot: seg.rotation.clone(),
      explodeOffset: new THREE.Vector3((i - 3.5) * 0.08, 0.5 + i * 0.03, (Math.random() - 0.5) * 0.1),
      explodeRot: new THREE.Euler(Math.random() * 0.3, 0, 0),
    })
  }

  const yokeL = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.08, 0.04),
    materials.titanium.clone(),
  )
  yokeL.position.set(-0.42, 0.12, 0)
  headband.add(yokeL)
  const yokeR = yokeL.clone()
  yokeR.position.x = 0.42
  headband.add(yokeR)
  parts.push({
    mesh: yokeL,
    id: 'yoke_L',
    label: 'FORK YOKE',
    category: 'structure',
    homePos: yokeL.position.clone(),
    homeRot: yokeL.rotation.clone(),
    explodeOffset: new THREE.Vector3(-0.25, 0.3, 0.08),
    explodeRot: new THREE.Euler(0, 0, -0.4),
  })
  parts.push({
    mesh: yokeR,
    id: 'yoke_R',
    label: 'FORK YOKE',
    category: 'structure',
    homePos: yokeR.position.clone(),
    homeRot: yokeR.rotation.clone(),
    explodeOffset: new THREE.Vector3(0.25, 0.3, 0.08),
    explodeRot: new THREE.Euler(0, 0, 0.4),
  })

  root.add(headband)

  const leftCup = buildEarCup('L', materials, parts)
  const rightCup = buildEarCup('R', materials, parts)
  root.add(leftCup, rightCup)

  const washers: THREE.Mesh[] = []
  for (let w = 0; w < 20; w++) {
    const washer = new THREE.Mesh(
      new THREE.TorusGeometry(0.006, 0.001, 8, 16),
      materials.screw.clone(),
    )
    washer.position.set((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.2)
    root.add(washer)
    parts.push({
      mesh: washer,
      id: `washer_${w}`,
      label: `WASHER ${w + 1}`,
      category: 'fastener',
      homePos: washer.position.clone(),
      homeRot: washer.rotation.clone(),
      explodeOffset: new THREE.Vector3((Math.random() - 0.5) * 0.5, Math.random() * 0.4, (Math.random() - 0.5) * 0.3),
      explodeRot: new THREE.Euler(Math.random(), Math.random(), Math.random()),
      isScrew: true,
    })
  }

  while (parts.length < COMPONENT_COUNT) {
    const i = parts.length
    const micro = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.004, 0.002),
      new THREE.MeshStandardMaterial({ color: 0x333338, metalness: 0.7, roughness: 0.4 }),
    )
    micro.position.set(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.15,
    )
    rightCup.add(micro)
    parts.push({
      mesh: micro,
      id: `micro_${i}`,
      label: `COMP ${i + 1}`,
      category: 'micro',
      homePos: micro.position.clone(),
      homeRot: micro.rotation.clone(),
      explodeOffset: new THREE.Vector3((Math.random() - 0.5) * 0.6, Math.random() * 0.5, (Math.random() - 0.5) * 0.4),
      explodeRot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
    })
  }

  const driverGroup = new THREE.Group()
  const mainDriver = parts.find((p) => p.id === 'R_diaphragm')!
  driverGroup.add(mainDriver.mesh.clone())

  return {
    root,
    parts: parts.slice(0, COMPONENT_COUNT),
    driverGroup,
    leftCup,
    rightCup,
    headband,
  }
}

export function sampleSurfacePoints(root: THREE.Object3D, count: number): Float32Array {
  const positions: number[] = []
  root.updateMatrixWorld(true)
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || positions.length / 3 >= count) return
    const geo = child.geometry as THREE.BufferGeometry
    const pos = geo.getAttribute('position')
    if (!pos) return
    const step = Math.max(1, Math.floor(pos.count / (count / 20)))
    const m = child.matrixWorld
    for (let i = 0; i < pos.count && positions.length / 3 < count; i += step) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(m)
      positions.push(v.x, v.y, v.z)
    }
  })
  while (positions.length / 3 < count) {
    positions.push(
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.4,
    )
  }
  return new Float32Array(positions.slice(0, count * 3))
}
