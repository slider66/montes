'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const N_TORTILLAS = 8
const N_PARTICLES = 500

export function TortillaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.6

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050200, 0.07)

    const camera = new THREE.PerspectiveCamera(52, canvas.offsetWidth / canvas.offsetHeight, 0.1, 80)
    camera.position.set(0, 0, 9)

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xff9933, 0.5))

    const sun = new THREE.PointLight(0xffd060, 8, 30)
    sun.position.set(3, 4, 5)
    scene.add(sun)

    const fill = new THREE.PointLight(0xff5500, 3, 22)
    fill.position.set(-5, -3, 2)
    scene.add(fill)

    const rim = new THREE.PointLight(0xffcc00, 4, 20)
    rim.position.set(0, -6, -2)
    scene.add(rim)

    // ── Central glow sphere (the "yema" / yolk) ───────────────────────────────
    const yolkGeo = new THREE.SphereGeometry(0.9, 32, 32)
    const yolkMat = new THREE.MeshStandardMaterial({
      color: 0xffc020,
      emissive: 0xff8800,
      emissiveIntensity: 1.8,
      roughness: 0.3,
      metalness: 0.4,
    })
    const yolk = new THREE.Mesh(yolkGeo, yolkMat)
    scene.add(yolk)

    // Inner glow halo
    const haloGeo = new THREE.SphereGeometry(1.3, 24, 24)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    })
    scene.add(new THREE.Mesh(haloGeo, haloMat))

    // ── Tortilla discs ────────────────────────────────────────────────────────
    const topGeo   = new THREE.CylinderGeometry(1, 1, 0.04, 48)
    const sideGeo  = new THREE.CylinderGeometry(1, 1, 0.16, 48, 1, true)
    const cGeo     = new THREE.CylinderGeometry(1.03, 1.03, 0.2, 48, 1, true)

    const palettes = [
      { top: 0xdba520, side: 0xc88810, crust: 0x7a4820 },
      { top: 0xe8b830, side: 0xd0a020, crust: 0x6a3c18 },
      { top: 0xc89010, side: 0xb07808, crust: 0x885030 },
      { top: 0xf0c840, side: 0xd8a828, crust: 0x5c3010 },
    ]

    type TortEntry = { group: THREE.Group; vy: number; vr: THREE.Vector3; phase: number; radius: number; angle: number; speed: number }
    const tortillas: TortEntry[] = []

    for (let i = 0; i < N_TORTILLAS; i++) {
      const p = palettes[i % palettes.length]
      const topM   = new THREE.MeshStandardMaterial({ color: p.top,   roughness: 0.65, metalness: 0.2 })
      const sideM  = new THREE.MeshStandardMaterial({ color: p.side,  roughness: 0.70, metalness: 0.1 })
      const crustM = new THREE.MeshStandardMaterial({ color: p.crust, roughness: 0.90, metalness: 0.04 })

      const g = new THREE.Group()
      const top  = new THREE.Mesh(topGeo,  topM);  top.position.y  =  0.10
      const bot  = new THREE.Mesh(topGeo,  sideM); bot.position.y  = -0.10
      const side = new THREE.Mesh(sideGeo, sideM)
      const cr   = new THREE.Mesh(cGeo,    crustM)
      g.add(top, bot, side, cr)

      const scale = 0.45 + Math.random() * 0.85
      g.scale.setScalar(scale)

      // Orbit placement
      const radius = 2.8 + Math.random() * 2.5
      const angle  = (i / N_TORTILLAS) * Math.PI * 2 + Math.random() * 0.5
      g.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius * 0.5 - 2)
      g.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.6)

      scene.add(g)
      tortillas.push({
        group: g,
        vy:     (Math.random() - 0.5) * 0.012,
        vr:     new THREE.Vector3((Math.random()-0.5)*0.007, (Math.random()-0.5)*0.011, (Math.random()-0.5)*0.005),
        phase:  Math.random() * Math.PI * 2,
        radius,
        angle,
        speed:  0.08 + Math.random() * 0.12,
      })
    }

    // ── Particles (two layers: near gold + far white) ─────────────────────────
    function makeParticles(count: number, spread: number, size: number, r: number, g: number, b: number) {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random()-0.5)*spread
        pos[i*3+1] = (Math.random()-0.5)*(spread*0.7)
        pos[i*3+2] = (Math.random()-0.5)*(spread*0.4) - 3
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({ size, color: new THREE.Color(r, g, b), transparent: true, opacity: 0.55, sizeAttenuation: true })
      return { mesh: new THREE.Points(geo, mat), geo, mat }
    }

    const p1 = makeParticles(N_PARTICLES,      36, 0.055, 0.95, 0.70, 0.20)
    const p2 = makeParticles(N_PARTICLES * 0.6, 50, 0.030, 0.98, 0.92, 0.78)
    scene.add(p1.mesh, p2.mesh)

    // ── Animation ─────────────────────────────────────────────────────────────
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Yolk pulse
      yolk.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04)
      yolkMat.emissiveIntensity = 1.6 + Math.sin(t * 1.8) * 0.5

      // Tortillas: orbit + bob + spin
      for (const { group, vr, phase, radius, speed } of tortillas) {
        const a = phase + t * speed
        group.position.x = Math.cos(a) * radius
        group.position.z = Math.sin(a) * radius * 0.5 - 2
        group.position.y += Math.sin(t * 0.6 + phase) * 0.004
        group.rotation.x += vr.x
        group.rotation.y += vr.y
        group.rotation.z += vr.z
      }

      // Particles drift
      p1.mesh.rotation.y = t * 0.015
      p2.mesh.rotation.y = -t * 0.008
      p2.mesh.rotation.x = Math.sin(t * 0.06) * 0.04

      // Camera gentle bob
      camera.position.x = Math.sin(t * 0.05) * 0.8
      camera.position.y = Math.sin(t * 0.09) * 0.5
      camera.lookAt(0, 0, 0)

      // Light orbit
      sun.position.x = Math.cos(t * 0.25) * 5
      sun.position.z = Math.sin(t * 0.25) * 5

      renderer.render(scene, camera)
    }

    animate()

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
}
