# 🩺 Plantilla Landing Page Médica de Alta Conversión

Esta es una base técnica profesional para crear landing pages médicas rápidas, accesibles y optimizadas para SEO. Construida con un stack moderno y ligero.

## 🚀 Stack Tecnológico
- **Vite**: Build tool ultra rápida.
- **Tailwind CSS**: Framework de CSS utilitario para diseño rápido y consistente.
- **Alpine.js**: Interactividad ligera sin la sobrecarga de frameworks pesados.
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

### 1. Datos Generales e Identidad
- **Colores**: Modifica `tailwind.config.js` en la sección `extend.colors` para cambiar `medical-blue` y `medical-accent`.
- **Textos**: Abre `index.html` y reemplaza los titulares, párrafos y nombres de especialistas.
- **Logo**: Reemplaza el texto o SVG en la sección `<header>`.

### 2. SEO y Redes Sociales
- Cambia los valores de `<title>`, `<meta name="description">` y las OG tags en el `<head>`.
- Actualiza el script `application/ld+json` con los datos reales del negocio local (dirección, teléfono, coordenadas).

### 3. Contacto y Conversión
- **WhatsApp**: Busca `wa.me/[numero]` y reemplaza `[numero]` con el teléfono del cliente (ej. `5215512345678`).
- **Formulario**: La base es estática. Para que funcione, puedes usar servicios como Formspree, Basin o Netlify Forms.

### 4. Imágenes
- Guarda las imágenes reales en `public/images/`.
- Recomendamos usar formatos **WebP** o **AVIF** para mejor rendimiento.
- El atributo `loading="lazy"` ya está aplicado donde corresponde.

## ♿ Accesibilidad
- Mantén la jerarquía de headings (`h1`, `h2`, `h3`).
- No elimines los atributos `aria-label` en botones sin texto.
- Los estados de focus están configurados globalmente en `src/styles/main.css`.

## 📁 Estructura del Proyecto
- `index.html`: Estructura principal y SEO.
- `src/styles/main.css`: Configuración de Tailwind y estilos base.
- `src/scripts/main.js`: Inicialización de Alpine.js y lógica global.
- `public/`: Archivos estáticos (imágenes, favicon, robots.txt).
