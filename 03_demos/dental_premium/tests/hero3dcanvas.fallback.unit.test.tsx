import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Hero3DCanvas } from '../src/components/Hero3DCanvas/Hero3DCanvas'

describe('Hero3DCanvas fallback', () => {
  it('renders fallback when mode is fallback', () => {
    render(<Hero3DCanvas mode="fallback" />)
    expect(document.querySelector('[data-mode="fallback"]')).toBeTruthy()
  })

  it('renders fallback when prefers-reduced-motion is enabled in auto mode', () => {
    const original = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
    }))

    render(<Hero3DCanvas mode="auto" />)
    expect(document.querySelector('[data-mode="fallback"]')).toBeTruthy()

    window.matchMedia = original
  })
})

