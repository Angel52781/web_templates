# 🩺 Plantilla Landing Page Salud & Estética

Esta es una base técnica profesional para crear landing pages médicas o de estética rápidas, accesibles y optimizadas para SEO. Construida con un stack moderno y ligero dentro de la carpeta `02_template_estetica`.

## 🚀 Stack Tecnológico
- **Vite**: Build tool ultra rápida.
- **Tailwind CSS**: Framework de CSS utilitario para diseño rápido y consistente.
- **Alpine.js**: Interactividad ligera (menús, acordeones, modales).
- **HTML5 Semántico**: Para mejor SEO y accesibilidad.

## 🛠️ Requisitos Previos
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- npm o yarn

## 📦 Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción (Genera archivos estáticos en `/dist`):**
   ```bash
   npm run build
   ```

## 📝 Guía de Personalización rápida

Busca los placeholders entre corchetes `[...]` en los archivos para adaptar la landing a tu cliente:

### 1. Colores y Estilo
- Modifica `tailwind.config.js` en la sección `extend.colors` para cambiar `primary` y `accent`.
- Los estilos base y componentes se encuentran en `src/styles/main.css`.

### 2. SEO y Datos Estructurados
- Cambia los valores de `<title>`, `<meta name="description">` y las OG tags en el `<head>` de `index.html`.
- Actualiza el script `application/ld+json` con los datos reales del negocio local.

### 3. Contacto y Conversión
- **WhatsApp**: Busca `wa.me/[numero]` y reemplaza `[numero]` con el teléfono del cliente.
- **Formulario**: La base es estática. Recomendamos usar Formspree o Netlify Forms.

## 📁 Estructura del Proyecto
- `index.html`: Estructura principal y SEO.
- `src/styles/main.css`: Configuración de Tailwind y estilos base.
- `src/scripts/main.js`: Inicialización de Alpine.js y plugins.
- `public/`: Archivos estáticos (imágenes, favicon).
