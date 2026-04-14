## Rotación continua (360°) del Hero 3D

El Hero 3D soporta dos tipos de rotación:

- Rotación autónoma (coreografía base) + modulación por mouse.
- Rotación continua 360° (spin) alrededor del eje Y del objeto, con velocidad ajustable.

### Parámetros disponibles

El componente [Hero3DCanvas](file:///c:/Users/angel/OneDrive/Escritorio/Empresa/web-templates/03_demos/dental_premium/src/components/Hero3DCanvas/Hero3DCanvas.tsx) acepta:

- `continuousRotation?: boolean`
  - Activa/desactiva la rotación continua 360°.
  - Por defecto: `true`.
- `continuousRotationSpeed?: number`
  - Velocidad en radianes/segundo para el spin continuo.
  - Por defecto: `0.22` (aprox. 12.6°/s, una vuelta completa ~28.5s).
  - Rango validado: `0 … 1.8`.
- `rotationSensitivity?: number`
  - Multiplicador de sensibilidad de rotación por mouse (tilt).
  - Rango validado: `0.5 … 10`.

### Ejemplos de uso

```tsx
<Hero3DCanvas continuousRotation />
```

```tsx
<Hero3DCanvas continuousRotationSpeed={0.35} />
```

```tsx
<Hero3DCanvas continuousRotation={false} rotationSensitivity={6} />
```

