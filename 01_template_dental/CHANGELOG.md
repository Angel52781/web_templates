# CHANGELOG

## [2026-04-04]

### Reemplazo de imágenes en Casos Clínicos

Se han sustituido las imágenes de los casos clínicos por versiones locales de alta calidad, cumpliendo con los requisitos de resolución (mín. 800x600px) y peso (máx. 500KB).

| Archivo Original (Remoto) | Nuevo Archivo (Local) | Motivo del Cambio | Fecha |
| :--- | :--- | :--- | :--- |
| Unsplash (id: 1516062423079) | `implantes_antes.jpg` | Inconsistencia visual (imagen no dental: "PUNCH TODAY IN THE FACE") | 2026-04-04 |
| Unsplash (id: 1606811971618) | `implantes_despues.jpg` | Baja calidad y falta de coherencia clínica | 2026-04-04 |
| Unsplash (id: 1593059025398) | `carillas_antes.jpg` | Imagen vacía/baja calidad | 2026-04-04 |
| Unsplash (id: 1609840114035) | `carillas_despues.jpg` | Baja calidad y falta de coherencia clínica | 2026-04-04 |

**Nota:** Dado que las imágenes originales eran recursos remotos cargados vía URL, no se pudieron renombrar con el sufijo `_old`. Se han migrado a almacenamiento local en `/public/images/` para mayor control y consistencia.
