import * as THREE from 'three'

const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

function baseUniforms() {
  return {
    uTime: { value: 0 },
    uLightSweep: { value: 0 },
    uMaterialBlend: { value: 0 },
    uTransparent: { value: 0 },
    uCeramic: { value: 0 },
    uEnvIntensity: { value: 1 },
  }
}

function metalFragment(extra = '') {
  return `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    varying vec3 vTangent;
    uniform float uTime;
    uniform float uLightSweep;
    uniform float uMaterialBlend;
    uniform float uTransparent;
    uniform float uCeramic;
    uniform float uEnvIntensity;
    ${NOISE_GLSL}

    vec3 envReflect(vec3 n, vec3 v) {
      vec3 r = reflect(-v, n);
      float y = r.y * 0.5 + 0.5;
      return mix(vec3(0.08), vec3(0.92), y);
    }

    void main() {
      vec3 N = normalize(vNormal);
      vec3 T = normalize(vTangent);
      vec3 B = cross(N, T);
      vec3 V = normalize(cameraPosition - vWorldPos);

      float brush = snoise(vec3(vUv.x * 180.0, vUv.y * 12.0, 0.0));
      float aniso = pow(abs(dot(normalize(T + B * brush * 0.4), V)), 12.0);
      float grain = snoise(vWorldPos * 40.0) * 0.04;

      vec3 tiBase = vec3(0.62, 0.64, 0.66);
      vec3 tiSpec = mix(vec3(0.35), vec3(0.95), aniso + grain);
      float tiRough = mix(0.28, 0.08, aniso);

      vec3 ceBase = vec3(0.04, 0.04, 0.045);
      float orange = snoise(vWorldPos * 80.0) * 0.015;
      vec3 ceSpec = vec3(0.12 + orange);

      vec3 base = mix(tiBase, ceBase, uCeramic);
      vec3 spec = mix(tiSpec, ceSpec, uCeramic);
      float rough = mix(tiRough, 0.35, uCeramic);

      vec3 R = envReflect(N, V);
      float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      vec3 col = base * 0.35 + R * (0.55 + fres * 0.35) * spec * uEnvIntensity;

      float sweep = smoothstep(uLightSweep - 0.08, uLightSweep + 0.02, vWorldPos.y + vWorldPos.x * 0.2);
      col += vec3(0.25) * sweep * (1.0 - uCeramic * 0.6);

      ${extra}

      if (uTransparent > 0.5) {
        float alpha = 0.22 + fres * 0.35;
        gl_FragColor = vec4(col * 0.6 + R * 0.4, alpha);
      } else {
        gl_FragColor = vec4(col, 1.0);
      }
    }
  `
}

const metalVertex = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  varying vec3 vTangent;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vTangent = normalize(normalMatrix * vec3(1.0, 0.0, 0.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export function createBrushedMetalMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: baseUniforms(),
    vertexShader: metalVertex,
    fragmentShader: metalFragment(),
    transparent: true,
  })
}

export function createCeramicMaterial(): THREE.ShaderMaterial {
  const mat = createBrushedMetalMaterial()
  mat.uniforms.uCeramic = { value: 1 }
  return mat
}

export function createGlassMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIridescence: { value: 1 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIridescence;
      ${NOISE_GLSL}
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
        float n = snoise(vWorldPos * 30.0) * 0.5 + 0.5;
        vec3 iri = 0.5 + 0.5 * cos(vUv.y * 12.0 + vec3(0.0, 2.0, 4.0) + n);
        vec3 col = mix(vec3(0.06, 0.06, 0.07), iri * 0.15 + vec3(0.85), fres);
        float alpha = 0.15 + fres * 0.55;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
}

export function createMeshMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform float uTime;
      void main() {
        float weave = sin(vUv.x * 180.0) * sin(vUv.y * 180.0);
        float knit = smoothstep(0.2, 0.8, weave * 0.5 + 0.5);
        vec3 col = mix(vec3(0.08), vec3(0.18), knit);
        float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0,0,1))), 2.0);
        col += rim * 0.08;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
}

export function createPCBMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        vec2 g = fract(vUv * vec2(40.0, 24.0));
        float trace = step(0.88, g.x) + step(0.92, g.y);
        trace = clamp(trace, 0.0, 1.0);
        vec3 green = vec3(0.05, 0.18, 0.08);
        vec3 gold = vec3(0.55, 0.45, 0.2);
        vec3 col = mix(green, gold, trace * 0.7);
        float pad = step(0.45, length(fract(vUv * 12.0) - 0.5));
        col = mix(col, gold, pad * 0.3);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
}

export function createCoilMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xb87333,
    metalness: 0.85,
    roughness: 0.35,
  })
}

export function createMagnetMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x1a1a1f,
    metalness: 0.6,
    roughness: 0.45,
  })
}

export function createBatteryMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x111114,
    metalness: 0.3,
    roughness: 0.7,
  })
}

export function createFlexMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xd4a017,
    metalness: 0.9,
    roughness: 0.25,
  })
}

export function createHingeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    metalness: 0.15,
    roughness: 0.08,
  })
}

export function createScrewMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x888890,
    metalness: 0.95,
    roughness: 0.2,
  })
}

export function createMaterials() {
  return {
    titanium: createBrushedMetalMaterial(),
    ceramic: createCeramicMaterial(),
    glass: createGlassMaterial(),
    mesh: createMeshMaterial(),
    pcb: createPCBMaterial(),
    coil: createCoilMaterial(),
    magnet: createMagnetMaterial(),
    battery: createBatteryMaterial(),
    flex: createFlexMaterial(),
    hinge: createHingeMaterial(),
    screw: createScrewMaterial(),
    aluminum: createBrushedMetalMaterial(),
  }
}

export type MaterialSet = ReturnType<typeof createMaterials>

export function applyMaterialMode(
  parts: THREE.Object3D[],
  mode: 'titanium' | 'ceramic' | 'transparent',
  sweep: number,
) {
  for (const obj of parts) {
    obj.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const mat = child.material as THREE.ShaderMaterial | THREE.MeshStandardMaterial
      if (mat instanceof THREE.ShaderMaterial && mat.uniforms?.uCeramic !== undefined) {
        mat.uniforms.uCeramic.value = mode === 'ceramic' ? 1 : 0
        mat.uniforms.uTransparent.value = mode === 'transparent' ? 1 : 0
        mat.uniforms.uLightSweep.value = sweep
        mat.transparent = mode === 'transparent'
        mat.depthWrite = mode !== 'transparent'
      }
    })
  }
}
