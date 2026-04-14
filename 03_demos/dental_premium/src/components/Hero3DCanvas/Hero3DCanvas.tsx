import { Suspense, lazy, useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import styles from './Hero3DCanvas.module.css'

export type Hero3DCanvasMode = 'auto' | 'canvas' | 'fallback'
export type Hero3DCanvasPresentation = 'background' | 'card'

export type Hero3DPointerState = {
  x: number
  y: number
  lastMoveMs: number
}

export type Hero3DCanvasProps = {
  className?: string
  presentation?: Hero3DCanvasPresentation
  mode?: Hero3DCanvasMode
  interactionTargetRef?: RefObject<HTMLElement | null>
  fallbackImageSrc?: string
  fallbackAlt?: string
  canvasAriaLabel?: string
  modelUrl?: string
  rotationSensitivity?: number
  continuousRotation?: boolean
  continuousRotationSpeed?: number
}

export type Hero3DMotionTuning = {
  pointerRotY: number
  pointerRotX: number
  pointerPosX: number
  pointerPosY: number
  pointerMix: number
  pointerSpeedMod: number
  pointerAmpMod: number
  pointerPhaseMax: number
  autoRotY: number
  autoRotX: number
  autoPosX: number
  autoPosY: number
  autoPosZ: number
  autoSpeed: number
  continuousSpin: boolean
  spinSpeed: number
  baseRotX: number
  basePosX: number
  basePosY: number
  damping: number
  pointerFadeMs: number
  bypassDamping: boolean
}

const Hero3DRenderer = lazy(() =>
  import('./Hero3DRenderer').then((m) => ({ default: m.Hero3DRenderer })),
)

function getLowEndInfo() {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    hardwareConcurrency?: number
    connection?: { saveData?: boolean }
  }

  const saveData = Boolean(nav.connection?.saveData)
  const deviceMemory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined
  const hardwareConcurrency =
    typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined

  const lowEnd =
    saveData ||
    (typeof deviceMemory === 'number' && deviceMemory <= 4) ||
    (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4)

  return { lowEnd, saveData, deviceMemory, hardwareConcurrency }
}

function getReducedMotionSignal(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function isCoarsePointer(): boolean {
  return window.matchMedia?.('(pointer: coarse)')?.matches ?? false
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function usePointerRef(targetRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const pointerRef = useRef<Hero3DPointerState>({
    x: 0,
    y: 0,
    lastMoveMs: 0,
  })
  const rafRef = useRef<number | null>(null)
  const lastEventRef = useRef<{ clientX: number; clientY: number } | null>(null)

  useEffect(() => {
    if (!enabled) {
      pointerRef.current = { x: 0, y: 0, lastMoveMs: 0 }
      return
    }

    const onTick = () => {
      rafRef.current = null
      const el = targetRef.current
      if (!el) return
      const evt = lastEventRef.current
      if (!evt) return

      const rect = el.getBoundingClientRect()
      const nx = ((evt.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1
      const ny = ((evt.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1
      pointerRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
        lastMoveMs: Date.now(),
      }
    }

    const schedule = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(onTick)
    }

    const onMove = (e: PointerEvent) => {
      lastEventRef.current = { clientX: e.clientX, clientY: e.clientY }
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', schedule)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, targetRef])

  return pointerRef
}

export function Hero3DCanvas({
  className,
  presentation = 'background',
  mode = 'auto',
  interactionTargetRef,
  fallbackImageSrc,
  fallbackAlt = 'Fondo 3D premium',
  canvasAriaLabel = 'Fondo 3D del hero',
  modelUrl = '/models/hero-dental.glb',
  rotationSensitivity = 5,
  continuousRotation = true,
  continuousRotationSpeed = 0.22,
}: Hero3DCanvasProps) {
  const devMotionDebug =
    typeof window !== 'undefined' &&
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has('motionDebug')
  const stageRef = useRef<HTMLDivElement | null>(null)
  const hudRef = useRef<HTMLDivElement | null>(null)

  const shouldFallback = useMemo(() => {
    if (mode === 'fallback') return true
    if (mode === 'canvas') return false
    if (typeof window === 'undefined') return true

    if (import.meta.env.DEV) return false

    const reducedMotion = getReducedMotionSignal()
    const lowEnd = getLowEndInfo().lowEnd
    const webgl = hasWebGL()
    return reducedMotion || lowEnd || !webgl
  }, [mode])

  const reducedMotionSignal = useMemo(() => {
    if (typeof window === 'undefined') return true
    return getReducedMotionSignal()
  }, [])

  const reducedMotion = import.meta.env.DEV ? false : reducedMotionSignal

  const interactionEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (shouldFallback) return false
    if (reducedMotion) return false
    return !isCoarsePointer()
  }, [reducedMotion, shouldFallback])

  const idleEnabled = useMemo(() => {
    if (shouldFallback) return false
    return !reducedMotion
  }, [reducedMotion, shouldFallback])

  const rotationSensitivityClamped = useMemo(() => {
    const raw = Number.isFinite(rotationSensitivity) ? rotationSensitivity : 5
    return Math.max(0.5, Math.min(10, raw))
  }, [rotationSensitivity])

  const continuousRotationSpeedClamped = useMemo(() => {
    const raw = Number.isFinite(continuousRotationSpeed) ? continuousRotationSpeed : 0.22
    return Math.max(0, Math.min(1.8, raw))
  }, [continuousRotationSpeed])

  const motionTuning = useMemo<Hero3DMotionTuning>(() => {
    const devBoost = import.meta.env.DEV ? 1.15 : 1
    const debugBoost = devMotionDebug ? 4.2 : 1
    return {
      pointerRotY:
        (devMotionDebug ? 0.065 : 0.038) * devBoost * debugBoost * rotationSensitivityClamped,
      pointerRotX:
        (devMotionDebug ? 0.038 : 0.022) * devBoost * debugBoost * rotationSensitivityClamped,
      pointerPosX: devMotionDebug ? 0.08 : 0.045,
      pointerPosY: devMotionDebug ? 0.04 : 0.024,
      pointerMix: devMotionDebug ? 1 : 0.42,
      pointerSpeedMod: devMotionDebug ? 0.28 : 0.11,
      pointerAmpMod: devMotionDebug ? 0.5 : 0.18,
      pointerPhaseMax: devMotionDebug ? 0.95 : 0.42,
      autoRotY: devMotionDebug ? 0.18 : 0.118,
      autoRotX: devMotionDebug ? 0.12 : 0.07,
      autoPosX: devMotionDebug ? 0.05 : 0.012,
      autoPosY: devMotionDebug ? 0.07 : 0.018,
      autoPosZ: devMotionDebug ? 0.05 : 0.014,
      autoSpeed: devMotionDebug ? 1.2 : 0.92,
      continuousSpin: Boolean(continuousRotation),
      spinSpeed: continuousRotationSpeedClamped,
      baseRotX: -0.03,
      basePosX: 0.5,
      basePosY: -0.12,
      damping: devMotionDebug ? 22 : 5.5,
      pointerFadeMs: devMotionDebug ? 1200 : 5200,
      bypassDamping: devMotionDebug,
    }
  }, [continuousRotation, continuousRotationSpeedClamped, devMotionDebug, rotationSensitivityClamped])

  const pointerTargetRef = interactionTargetRef ?? stageRef
  const pointerRef = usePointerRef(pointerTargetRef, interactionEnabled)

  useEffect(() => {
    if (!devMotionDebug) return
    let raf = 0
    const tick = () => {
      const el = hudRef.current
      if (el) {
        const p = pointerRef.current
        const now = Date.now()
        const since = p.lastMoveMs ? now - p.lastMoveMs : 10_000
        const pointerFade = interactionEnabled
          ? 1 - Math.max(0, Math.min(1, since / motionTuning.pointerFadeMs))
          : 0
        el.textContent =
          `pointer x/y: ${p.x.toFixed(2)} ${p.y.toFixed(2)}\n` +
          `fade: ${pointerFade.toFixed(2)}\n` +
          `interaction: ${interactionEnabled ? 'on' : 'off'} idle: ${idleEnabled ? 'on' : 'off'}`
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [devMotionDebug, idleEnabled, interactionEnabled, motionTuning.pointerFadeMs, pointerRef])

  return (
    <div
      ref={stageRef}
      className={[styles.stage, styles[presentation], className].filter(Boolean).join(' ')}
    >
      {shouldFallback ? (
        <div className={styles.fallback} data-mode="fallback">
          {fallbackImageSrc ? (
            <img className={styles.fallbackImg} src={fallbackImageSrc} alt={fallbackAlt} />
          ) : (
            <div className={styles.fallbackArt} role="img" aria-label={fallbackAlt} />
          )}
        </div>
      ) : (
        <div className={styles.canvasWrap} data-mode="canvas">
          {devMotionDebug ? <div ref={hudRef} className={styles.devHud} aria-hidden="true" /> : null}
          <Suspense
            fallback={<div className={styles.fallbackArt} role="img" aria-label={fallbackAlt} />}
          >
            <Hero3DRenderer
              modelUrl={modelUrl}
              canvasAriaLabel={canvasAriaLabel}
              pointerRef={pointerRef}
              interactionEnabled={interactionEnabled}
              idleEnabled={idleEnabled}
              motionTuning={motionTuning}
              debugMotion={devMotionDebug}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
