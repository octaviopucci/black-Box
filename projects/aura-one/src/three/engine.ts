import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { buildHeadphone, sampleSurfacePoints, type HeadphoneAssembly } from './headphone/builder'
import { applyMaterialMode, createMaterials, type MaterialSet } from './materials'
import { FilmDirector, type FilmState } from '../film/director'

export class AuraEngine {
  canvas: HTMLCanvasElement
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  composer: EffectComposer
  bokehPass: BokehPass
  materials: MaterialSet
  headphone: HeadphoneAssembly
  director: FilmDirector
  particlePoints: THREE.Points | null = null
  particleGeo: THREE.BufferGeometry | null = null
  particleBase: Float32Array | null = null
  soundRings: THREE.Group
  dustParticles: THREE.Points
  gridHelper: THREE.GridHelper
  keyLight: THREE.DirectionalLight
  rimLight: THREE.DirectionalLight
  fillLight: THREE.AmbientLight
  floor: THREE.Mesh
  clock = new THREE.Clock()
  mouse = new THREE.Vector2(0, 0)
  drag = new THREE.Vector2(0, 0)
  isDragging = false
  interactiveRotation = new THREE.Euler(0, 0, 0)
  targetInteractiveRotation = new THREE.Euler(0, 0, 0)
  onStateChange?: (state: FilmState) => void
  loaded = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x050505)
    this.scene.fog = new THREE.FogExp2(0x050505, 0.08)

    this.camera = new THREE.PerspectiveCamera(
      42,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      50,
    )
    this.camera.position.set(0, 0.05, 2.2)

    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    this.keyLight.position.set(2, 3, 4)
    this.scene.add(this.keyLight)

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
    this.rimLight.position.set(-3, 1, -2)
    this.scene.add(this.rimLight)

    this.fillLight = new THREE.AmbientLight(0xffffff, 0.08)
    this.scene.add(this.fillLight)

    const floorGeo = new THREE.PlaneGeometry(20, 20)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      metalness: 0.95,
      roughness: 0.15,
    })
    this.floor = new THREE.Mesh(floorGeo, floorMat)
    this.floor.rotation.x = -Math.PI / 2
    this.floor.position.y = -0.55
    this.floor.visible = false
    this.scene.add(this.floor)

    this.gridHelper = new THREE.GridHelper(4, 40, 0x333333, 0x1a1a1a)
    this.gridHelper.position.y = -0.3
    this.gridHelper.visible = false
    this.scene.add(this.gridHelper)

    this.materials = createMaterials()
    this.headphone = buildHeadphone(this.materials)
    this.scene.add(this.headphone.root)

    const dustGeo = new THREE.BufferGeometry()
    const dustCount = 800
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 3
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 2
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    this.dustParticles = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0x888888, size: 0.004, transparent: true, opacity: 0.35 }),
    )
    this.dustParticles.visible = false
    this.scene.add(this.dustParticles)

    this.soundRings = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.08 + i * 0.06, 0.0008, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 - i * 0.02 }),
      )
      ring.rotation.x = Math.PI / 2
      this.soundRings.add(ring)
    }
    const latticeGeo = new THREE.BufferGeometry()
    const latticeCount = 200
    const latticePos = new Float32Array(latticeCount * 3)
    for (let i = 0; i < latticeCount; i++) {
      const a = (i / latticeCount) * Math.PI * 2
      const r = 0.12 + (i % 5) * 0.02
      latticePos[i * 3] = Math.cos(a) * r
      latticePos[i * 3 + 1] = (Math.random() - 0.5) * 0.08
      latticePos[i * 3 + 2] = Math.sin(a) * r
    }
    latticeGeo.setAttribute('position', new THREE.BufferAttribute(latticePos, 3))
    const lattice = new THREE.Points(
      latticeGeo,
      new THREE.PointsMaterial({ color: 0xcccccc, size: 0.006, transparent: true, opacity: 0.5 }),
    )
    this.soundRings.add(lattice)
    this.soundRings.visible = false
    this.scene.add(this.soundRings)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 2.0,
      aperture: 0.00008,
      maxblur: 0.008,
    })
    this.composer.addPass(this.bokehPass)

    this.director = new FilmDirector(this)
    this.initParticles()
    this.loaded = true
  }

  initParticles() {
    const count = 4000
    this.particleBase = sampleSurfacePoints(this.headphone.root, count)
    this.particleGeo = new THREE.BufferGeometry()
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particleBase.slice(), 3))
    this.particlePoints = new THREE.Points(
      this.particleGeo,
      new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.006,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    )
    this.particlePoints.visible = false
    this.scene.add(this.particlePoints)
  }

  setProgress(progress: number) {
    this.director.setProgress(progress)
    const state = this.director.getState()
    this.onStateChange?.(state)
  }

  setMaterial(mode: 'titanium' | 'ceramic' | 'transparent') {
    this.director.materialOverride = mode
    applyMaterialMode(
      [this.headphone.root],
      mode,
      this.director.lightSweep,
    )
  }

  resize(w: number, h: number) {
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)
  }

  handlePointer(x: number, y: number, down: boolean, drag?: { x: number; y: number }) {
    this.mouse.set(x, y)
    if (down !== undefined) this.isDragging = down
    if (drag) this.drag.copy(drag)
    if (this.director.getState().interactive) {
      this.targetInteractiveRotation.y = this.drag.x * 0.4
      this.targetInteractiveRotation.x = this.drag.y * 0.15
    }
  }

  tick() {
    const dt = this.clock.getDelta()
    const t = this.clock.getElapsedTime()
    this.director.update(dt, t)
    this.interactiveRotation.x += (this.targetInteractiveRotation.x - this.interactiveRotation.x) * 0.06
    this.interactiveRotation.y += (this.targetInteractiveRotation.y - this.interactiveRotation.y) * 0.06

    applyMaterialMode(
      [this.headphone.root],
      this.director.materialOverride,
      this.director.lightSweep,
    )

    for (const mat of Object.values(this.materials)) {
      if (mat instanceof THREE.ShaderMaterial && mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = t
      }
    }

    this.composer.render()
  }
}
