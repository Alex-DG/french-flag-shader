import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { generateUUID } from 'three/src/math/MathUtils'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugOptions = {
  color: '#8a2be2',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
// const material = new THREE.RawShaderMaterial({
//   vertexShader,
//   fragmentShader,
//   // transparent: true,
//   side: THREE.DoubleSide,
//   uniforms: {
//     uTime: { value: 0 },
//     uFrequency: { value: new THREE.Vector2(10, 2) },
//     uColor: { value: new THREE.Color(debugOptions.color) },
//     uTexture: { value: flagTexture },
//   },
// })
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(10, 2) },
    uColor: { value: new THREE.Color(debugOptions.color) },
    uTexture: { value: flagTexture },
  },
})

// Debug
gui
  .add(material.uniforms.uFrequency.value, 'x')
  .min(0)
  .max(20)
  .step(0.001)
  .name('frequencyX')
gui
  .add(material.uniforms.uFrequency.value, 'y')
  .min(0)
  .max(20)
  .step(0.001)
  .name('frequencyY')
gui
  .addColor(debugOptions, 'color')
  .onChange(() => material.uniforms.uColor.value.set(debugOptions.color))

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0.25, -0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Update material
  material.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
