import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'

describe('Vite dependency serving', () => {
  it('transforms the R3F renderer module and resolves prebundled deps', async () => {
    const server = await createServer({
      logLevel: 'silent',
      server: { middlewareMode: true },
    })

    try {
      const result = await server.transformRequest('/src/components/Hero3DCanvas/Hero3DRenderer.tsx')
      expect(result?.code).toBeTruthy()

      const code = result?.code ?? ''
      expect(code).toContain('/node_modules/.vite/deps/')
      expect(code).toMatch(/\/node_modules\/\.vite\/deps\/three\.js\?v=/)

      const depMatches = code.match(/\/node_modules\/\.vite\/deps\/[^'"]+/g) ?? []
      expect(depMatches.length).toBeGreaterThan(0)

      for (const dep of depMatches.slice(0, 8)) {
        const depResult = await server.transformRequest(dep)
        expect(depResult?.code).toBeTruthy()
      }
    } finally {
      await server.close()
    }
  })
})

