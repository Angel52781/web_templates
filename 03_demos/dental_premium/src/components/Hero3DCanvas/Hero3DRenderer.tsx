import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { RefObject } from 'react'
import { Box3, Vector3 } from 'three'
import type { Group } from 'three'
import { useMemo, useRef } from 'react'
import type { Hero3DMotionTuning, Hero3DPointerState } from './Hero3DCanvas'

function damp(current: number, target: number, lambda: number, deltaSeconds: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * deltaSeconds))
}

function clamp01(value: number): number {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

function HeroModel({
  url,
  pointerRef,
  interactionEnabled,
  idleEnabled,
  motionTuning,
  debugMotion,
}: {
  url: string
  pointerRef: RefObject<Hero3DPointerState>
  interactionEnabled: boolean
  idleEnabled: boolean
  motionTuning: Hero3DMotionTuning
  debugMotion: boolean
}) {
  const outerGroupRef = useRef<Group | null>(null)
  const innerGroupRef = useRef<Group | null>(null)
  const gltf = useGLTF(url)
  const lastLogRef = useRef<number>(0)

  const normalized = useMemo(() => {
    const box = new Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const max = Math.max(size.x, size.y, size.z)
    const scale = max > 0 ? 1 / max : 1
    return {
      center: [-center.x, -center.y, -center.z] as const,
      scale: scale * 1.05,
    }
  }, [gltf])

  const pointerInfluenceRef = useRef<number>(0)
  const phaseOffsetRef = useRef<number>(0)
  const tiltYRef = useRef<number>(0)
  const tiltXRef = useRef<number>(0)
  const posXRef = useRef<number>(0)
  const posYRef = useRef<number>(0)
  const spinRef = useRef<number>(0)
  const spinDirRef = useRef<number>(0)

  useFrame((state, delta) => {
    const outer = outerGroupRef.current
    const inner = innerGroupRef.current
    if (!outer || !inner) return

    const t = state.clock.getElapsedTime()

    const pointer = interactionEnabled ? pointerRef.current : { x: 0, y: 0, lastMoveMs: 0 }
    const now = Date.now()
    const since = pointer.lastMoveMs ? now - pointer.lastMoveMs : 10_000
    const pointerFade = interactionEnabled ? 1 - clamp01(since / motionTuning.pointerFadeMs) : 0

    const pointerMag = Math.min(1, Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y))
    const pointerInfluenceTarget = interactionEnabled ? pointerMag * pointerFade : 0
    pointerInfluenceRef.current = damp(pointerInfluenceRef.current, pointerInfluenceTarget, 2.6, delta)

    const phaseTarget = interactionEnabled
      ? (pointer.x * 0.65 + -pointer.y * 0.35) * motionTuning.pointerPhaseMax * pointerFade
      : 0
    phaseOffsetRef.current = damp(phaseOffsetRef.current, phaseTarget, 2.0, delta)

    const tiltTargetY = interactionEnabled ? pointer.x * motionTuning.pointerRotY * pointerFade : 0
    const tiltTargetX = interactionEnabled ? -pointer.y * motionTuning.pointerRotX * pointerFade : 0
    const tiltLambda = motionTuning.bypassDamping ? 1000 : 14
    tiltYRef.current = damp(tiltYRef.current, tiltTargetY, tiltLambda, delta)
    tiltXRef.current = damp(tiltXRef.current, tiltTargetX, tiltLambda, delta)

    const pointerPosTargetX =
      interactionEnabled ? pointer.x * motionTuning.pointerPosX * pointerFade : 0
    const pointerPosTargetY =
      interactionEnabled ? -pointer.y * motionTuning.pointerPosY * pointerFade : 0
    posXRef.current = damp(posXRef.current, pointerPosTargetX, 3.0, delta)
    posYRef.current = damp(posYRef.current, pointerPosTargetY, 3.0, delta)

    const autoOn = idleEnabled ? 1 : 0
    const u = pointerInfluenceRef.current * motionTuning.pointerMix
    const effectiveSpeed = motionTuning.autoSpeed * (1 + u * motionTuning.pointerSpeedMod)
    const amp = (1 + u * motionTuning.pointerAmpMod) * autoOn

    const phase = t * effectiveSpeed + phaseOffsetRef.current

    const autoRotY =
      (Math.sin(phase * 0.22) * motionTuning.autoRotY +
        Math.sin(phase * 0.07 + 1.1) * motionTuning.autoRotY * 0.32) *
      amp
    const autoRotX =
      (Math.cos(phase * 0.18 + 0.6) * motionTuning.autoRotX +
        Math.sin(phase * 0.05 + 2.0) * motionTuning.autoRotX * 0.26) *
      amp
    const autoX =
      (Math.sin(phase * 0.12 + 1.4) * motionTuning.autoPosX +
        Math.cos(phase * 0.05 + 0.2) * motionTuning.autoPosX * 0.28) *
      amp
    const autoY =
      (Math.sin(phase * 0.24) * motionTuning.autoPosY +
        Math.sin(phase * 0.08 + 0.9) * motionTuning.autoPosY * 0.35) *
      amp
    const autoZ =
      (Math.cos(phase * 0.16 + 0.8) * motionTuning.autoPosZ +
        Math.sin(phase * 0.06 + 1.7) * motionTuning.autoPosZ * 0.28) *
      amp

    const tiltMix = interactionEnabled ? motionTuning.pointerMix : 0
    const targetRotY = autoRotY + tiltYRef.current * tiltMix
    const targetRotX = motionTuning.baseRotX + autoRotX + tiltXRef.current * tiltMix
    const targetX = autoX + posXRef.current * motionTuning.pointerMix
    const targetY = autoY + posYRef.current * motionTuning.pointerMix
    const targetZ = autoZ

    if (motionTuning.continuousSpin && idleEnabled) {
      const pointerX = interactionEnabled ? pointer.x : 1
      const dirTarget = pointerX > 0 ? 1 : pointerX < 0 ? -1 : 0
      spinDirRef.current = damp(spinDirRef.current, dirTarget, 8.0, delta)
      spinRef.current += delta * motionTuning.spinSpeed * spinDirRef.current
    }
    outer.position.x = motionTuning.basePosX
    outer.position.y = motionTuning.basePosY
    outer.position.z = 0
    outer.rotation.x = 0
    outer.rotation.y = motionTuning.continuousSpin ? spinRef.current : 0
    outer.rotation.z = 0

    if (debugMotion && motionTuning.bypassDamping) {
      inner.rotation.x = targetRotX
      inner.rotation.y = targetRotY
      inner.position.x = targetX
      inner.position.y = targetY
      inner.position.z = targetZ
    } else {
      const rotationLambda = motionTuning.damping * 1.6
      inner.rotation.x = damp(inner.rotation.x, targetRotX, rotationLambda, delta)
      inner.rotation.y = damp(inner.rotation.y, targetRotY, rotationLambda, delta)
      inner.position.x = damp(inner.position.x, targetX, motionTuning.damping, delta)
      inner.position.y = damp(inner.position.y, targetY, motionTuning.damping, delta)
      inner.position.z = damp(inner.position.z, targetZ, motionTuning.damping, delta)
    }

    if (debugMotion) {
      const logNow = Date.now()
      if (logNow - lastLogRef.current >= 350) {
        lastLogRef.current = logNow
        console.log('[Hero3DRenderer motion]', {
          pointer: { x: pointer.x, y: pointer.y, lastMoveMs: pointer.lastMoveMs },
          pointerFade,
          influence: { pointerInfluence: pointerInfluenceRef.current, u, tiltMix, tiltLambda },
          targets: { rotY: targetRotY, rotX: targetRotX, x: targetX, y: targetY, z: targetZ },
          actual: {
            outerRotY: outer.rotation.y,
            spinDir: spinDirRef.current,
            rotY: inner.rotation.y,
            rotX: inner.rotation.x,
            x: inner.position.x,
            y: inner.position.y,
            z: inner.position.z,
          },
        })
      }
    }
  })

  return (
    <group ref={outerGroupRef}>
      <group ref={innerGroupRef}>
        <group position={normalized.center} scale={normalized.scale}>
          <primitive object={gltf.scene} dispose={null} />
        </group>
      </group>
    </group>
  )
}

export type Hero3DRendererProps = {
  modelUrl: string
  canvasAriaLabel: string
  pointerRef: RefObject<Hero3DPointerState>
  interactionEnabled: boolean
  idleEnabled: boolean
  motionTuning: Hero3DMotionTuning
  debugMotion: boolean
}

export function Hero3DRenderer({
  modelUrl,
  canvasAriaLabel,
  pointerRef,
  interactionEnabled,
  idleEnabled,
  motionTuning,
  debugMotion,
}: Hero3DRendererProps) {
  const gl = useMemo(
    () => ({ alpha: true, antialias: true, powerPreference: 'high-performance' as const }),
    [],
  )

  useGLTF.preload(modelUrl)

  return (
    <Canvas
      gl={gl}
      dpr={[1, 1.35]}
      camera={{ position: [0, 0.12, 2.85], fov: 32, near: 0.1, far: 50 }}
      frameloop={interactionEnabled || idleEnabled ? 'always' : 'demand'}
      style={{ width: '100%', height: '100%' }}
      aria-label={canvasAriaLabel}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3.2, 3.8, 2.6]} intensity={1.25} />
      <directionalLight position={[-2.2, 2.0, -2.6]} intensity={0.45} />
      <directionalLight position={[0, 1.5, 2.8]} intensity={1.35} />
      <HeroModel
        url={modelUrl}
        pointerRef={pointerRef}
        interactionEnabled={interactionEnabled}
        idleEnabled={idleEnabled}
        motionTuning={motionTuning}
        debugMotion={debugMotion}
      />
    </Canvas>
  )
}
