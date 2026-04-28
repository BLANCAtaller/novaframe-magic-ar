# 🚀 NOVAFRAME — ROADMAP MAESTRO DE IMPLEMENTACIÓN

> **Última actualización:** 24 de Abril 2026  
> **Estado del proyecto:** ~90% completado  
> **Stack:** Next.js 16 + React 19 + Firebase Firestore + Framer Motion + Three.js  
> **Deploy:** Cloudflare Pages (static export)

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ Lo que YA funciona
| Módulo | Estado | Notas |
|--------|--------|-------|
| Landing/Home | ✅ Completo | Hero, Slider, Colecciones, Testimonios, TechSpecs |
| Navbar + Menú móvil | ✅ Completo | Bilingüe ES/EN, glitch effects, carrito |
| Catálogo (Top Deployments) | ✅ Completo | Grid de productos con filtros |
| Laboratorio 3D | ✅ Completo | Visualización Three.js |
| Configurador de Producto | ✅ Completo | Selección de tamaño, acabado, variante |
| Checkout Protocol | ✅ Completo | Formulario + guardado Firestore + WhatsApp |
| Carrito (Deployment Hub) | ✅ Completo | Agregar/eliminar artefactos, Arreglo automático |
| Deployment Hub 3D | ⚡ Refinado | Manipulación manual, Snapping, Quick Edit HUD |
| Admin Dashboard | ✅ Completo | Analytics, pipeline 5 etapas, filtros |
| Admin Order Detail | ✅ Completo | Pipeline interactivo, acciones rápidas |
| Footer | ✅ Completo | Links, branding |
| Custom Cursor | ✅ Completo | Solo desktop |
| Particle Background | ✅ Completo | Efecto visual global |
| System Loader | ✅ Completo | Splash screen de carga |
| WhatsApp FAB | ✅ Completo | Botón flotante |
| Firebase Integration | ✅ Completo | Firestore CRUD de órdenes |
| Soporte | ✅ Completo | Página de soporte/FAQ |

### ⚠️ Lo que necesita MEJORA
| Módulo | Problema | Prioridad |
|--------|----------|-----------|
| Responsive móvil | Varios componentes no optimizados para <768px | ✅ COMPLETO |
| SEO + Metadata | Falta meta por página, OG tags, structured data | ✅ COMPLETO |
| Performance | Bundle size grande (~47 componentes), sin lazy loading | ✅ COMPLETO |
| Seguridad Admin | Sin autenticación — cualquiera puede acceder a /admin | 🔴 CRÍTICA |
| Error Handling | Sin boundary errors, estados de error inconsistentes | ✅ COMPLETO |
| Accesibilidad | Falta aria-labels, focus rings, teclado nav | 🟡 MEDIA |

---

## 🗺️ FASES DE IMPLEMENTACIÓN

---

### FASE 1: 🔒 SEGURIDAD Y ESTABILIDAD (Prioridad Máxima)
> **Objetivo:** Proteger el admin y eliminar bugs críticos  
> **Tiempo estimado:** Completado ✅

#### 1.1 — Autenticación del Admin
```
📁 Archivos a crear/modificar:
   - src/lib/firebase.js          → Agregar getAuth()
   - src/app/admin/layout.js      → CREAR: wrapper con protección de ruta
   - src/components/AdminLogin.jsx → CREAR: pantalla de login
   - .env.local                   → Agregar NEXT_PUBLIC_ADMIN_EMAIL
```
**Qué hacer:**
- [x] Activar Firebase Authentication en consola Firebase (Email/Password)
- [x] Crear un admin user en Firebase Auth con tu correo
- [x] Crear componente `AdminLogin.jsx` con formulario de login
- [x] Crear `src/app/admin/layout.js` (o ClientAdminGuard) que verifique autenticación
- [x] Si no está autenticado → mostrar LoginScreen
- [x] Si está autenticado → mostrar children (dashboard)
- [x] Agregar botón "Cerrar sesión" en el dashboard

#### 1.2 — Firestore Security Rules
```
📁 Archivos:
   - firestore.rules
```
**Qué hacer:**
- [x] En la consola de Firebase > Firestore > Rules, actualizar:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Órdenes: cualquiera puede crear, solo admin puede leer/modificar
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null 
        && request.auth.token.email == "TU_EMAIL_ADMIN";
    }
  }
}
```

#### 1.3 — Error Boundaries
```
📁 Archivos a crear:
   - src/components/ErrorBoundary.jsx
   - src/app/not-found.js          → Página 404 personalizada
   - src/app/error.js              → Página de error global
```
**Qué hacer:**
- [x] Crear Error Boundary con UI estilo NovaFrame (glitch/terminal theme)
- [x] Crear página 404 con animación y link de regreso
- [x] Crear error.js global que capture errores de renderizado
- [x] Envolver rutas sensibles en Error Boundaries

---

### FASE 2: 📱 RESPONSIVE MÓVIL COMPLETO (Prioridad Alta)
> **Objetivo:** Experiencia perfecta en iPhone/Android  
> **Tiempo estimado:** Completado ✅

#### 2.1 — Auditoría Responsive
**Componentes revisados:**
- [x] Abrir DevTools > Toggle Device (Ctrl+Shift+M)
- [x] Probar en: iPhone SE (375px), iPhone 14 (390px), iPad (768px)
- [x] Verificar que NO haya scroll horizontal en ninguna página
- [x] Verificar que todos los botones tengan min 44x44px tap target
- [x] Verificar que textos NO se corten o desborden

#### 2.2 — Fixes Específicos por Componente
- [x] Agregar breakpoints `sm:`, `md:`, `lg:` donde falten
- [x] Convertir layouts horizontales → stack vertical en móvil
- [x] Reducir paddings y font-sizes
- [x] Fix Hero heading size
- [x] Fix Support Page layout
- [x] Fix Admin Order Details sidebar layout
- [x] Fix TopDeployments mobile grid

#### 2.3 — Touch Optimizations
- [x] Desactivar `CustomCursor.jsx` en dispositivos touch (ya hecho ✅)
- [x] Agregar `-webkit-tap-highlight-color: transparent` global
- [x] Convertir hover effects a `active:` en móvil

---

### FASE 3: ⚡ PERFORMANCE Y OPTIMIZACIÓN (Prioridad Media)
> **Objetivo:** Carga rápida, bundle optimizado  
> **Tiempo estimado:** Completado ✅

#### 3.1 — Lazy Loading de Componentes Pesados
- [x] Cambiar imports estáticos por dinámicos en `page.js`

#### 3.2 — Optimización de Imágenes
- [x] Verificar que TODAS las imágenes usen `next/image` con `sizes` prop

---

### FASE 4: 🎨 SEO Y METADATA (Prioridad Alta)
> **Objetivo:** Aparecer en Google, compartir bien en redes  
> **Tiempo estimado:** Completado ✅

#### 4.1 — Metadata por Página
- [x] `layout.js` global
- [x] `page.js` home
- [x] `top-deployments/layout.js` catálogo
- [x] `laboratorio/layout.js` lab
- [x] `support/layout.js` soporte
- [x] `admin/layout.js` excluido con noindex

#### 4.2 — Open Graph Image
- [x] Referenciar en todas las metadatas `/images/branding/logo_v3.webp`

#### 4.3 — Robots y Sitemap
- [x] `robots.js` creado con exclusion de /admin
- [x] `sitemap.js` creado dinámicamente

---

### FASE 5: 🧹 LIMPIEZA Y CÓDIGO MUERTO (Prioridad Media)
> **Objetivo:** Reducir complejidad, eliminar lo que no se usa  
> **Tiempo estimado:** Completado ✅

#### 5.1 — Componentes Redundantes Eliminados
- [x] `ProductModal.jsx` (Eliminado)
- [x] `Header.jsx` (Eliminado)
- [x] `Gallery.jsx` (Eliminado)
- [x] `DesignGallery.jsx` (Eliminado)

---

### FASE 6 — ✨ FEATURES ADICIONALES
**ESTADO: 70% FINALIZADO**

- [ ] **6.1 — Notificaciones**: Sistema de alertas vía Telegram/WhatsApp para nuevas órdenes.
- [ ] **6.2 — Historial de Estados**: Timeline detallado de cambios en el Pipeline por cada orden.
- [x] **6.3 — Export de Datos**: Herramienta de extracción CSV para logística y manufactura (Admin Hub).
- [ ] Notificación push al admin cuando llega nueva orden
- [ ] Badge de "nuevas" en el dashboard

#### 6.2 — Historial de Estados en Order Detail
- [ ] Mostrar timeline de cuándo cambió cada estado

#### 6.4 — Modo Preview de Impresión
- [ ] En el order detail, botón "Vista de Impresión"
- [ ] CSS `@media print` con layout limpio sin fondos oscuros

#### 6.5 — Analytics Avanzados
- [ ] Gráfica de ventas por semana/mes (usar chart library como recharts)
- [ ] Top productos más vendidos
- [ ] Tasa de conversión (órdenes vs visitas)

#### 6.6 — PWA (Progressive Web App)
- [ ] Agregar `manifest.json` con iconos
- [ ] Service worker para cache offline
- [ ] "Instalar app" en celular

---

### FASE 7 — ✨ 3D EXPERIENCE & DEPLOYMENT HUB
**ESTADO: 95% FINALIZADO**
*Meta: Visualización táctica de activos en un entorno 3D de alta fidelidad.*

- [x] **7.1 — Holodeck v2.0**: Implementación de `DeploymentGallery3D` con motor de física suave.
- [x] **7.2 — Protocolos de Arreglo**:
    - [x] Lineal (Centro/Base)
    - [x] Pirámide Táctica (Grid dinámico)
    - [x] **Circular Nexus** (Arreglo en anillo)
    - [x] **Espiral Fractal** (Distribución expansiva)
- [x] **7.3 — HUD Administrativo**: Consolidación de controles en una barra táctica de cristal (Industrial Noir).
- [x] **7.4 — Snapping Magnético**: Lógica de alineación automática a 15cm (umbral táctico).
- [x] **7.5 — Integración Checkout**: Botón "Ejecutar Compra" vinculado al protocolo de pago.
- [ ] **7.6 — Persistencia Remota**: Sincronización de `customOffsets` con Firestore (En Desarrollo).

---

---

## 📋 CHECKLIST PRE-LANZAMIENTO

### Funcionalidad
- [ ] Todas las rutas cargan sin errores de consola
- [ ] Checkout genera orden en Firestore correctamente
- [ ] WhatsApp link se genera con datos correctos
- [ ] Admin puede cambiar estados de órdenes
- [ ] Búsqueda y filtros del admin funcionan
- [ ] Carrito agrega/elimina items correctamente
- [ ] Navegación entre páginas es fluida

### Visual / Mobile
- [ ] Home se ve perfecto en iPhone SE (375px)
- [ ] Home se ve perfecto en iPhone 14 Pro (393px)
- [ ] Home se ve perfecto en iPad (768px)
- [ ] NO hay scroll horizontal en ninguna página
- [ ] Todos los textos son legibles (no se cortan)
- [ ] Todos los botones son clickeables (min 44x44px)
- [ ] Imágenes cargan correctamente

### Performance
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 85
- [ ] First Contentful Paint < 2s
- [ ] No hay console.error en producción

### SEO
- [ ] Cada página tiene title y description únicos
- [ ] Open Graph tags presentes
- [ ] /admin excluido de robots.txt
- [ ] Sitemap generado

### Seguridad
- [ ] Admin protegido con autenticación
- [ ] Firestore rules configuradas
- [ ] No hay API keys expuestas en el cliente (usar NEXT_PUBLIC_ solo)
- [ ] Variables de entorno en .env.local (no commiteadas)

---

## 🔢 ORDEN RECOMENDADO DE EJECUCIÓN

```
SEMANA 1:  Fase 1 (Seguridad) + Fase 2.1-2.2 (Responsive crítico)
SEMANA 2:  Fase 2.3 (Touch) + Fase 4 (SEO) 
SEMANA 3:  Fase 3 (Performance) + Fase 5 (Limpieza)
SEMANA 4:  Fase 7 (3D Experience) + Checklist Pre-Lanzamiento
```

---

## 🛠️ COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev                    # Servidor local en localhost:3000

# Build de producción
npm run build                  # Verificar que compila sin errores

# Deploy a Cloudflare
npx wrangler pages deploy out  # Después del build

# Análisis
ANALYZE=true npm run build     # Ver tamaño del bundle

# Linting
npm run lint                   # Verificar errores de código
```

---

> **Nota:** Este roadmap está diseñado para ser ejecutado paso a paso.  
> Cada fase es independiente — puedes completar una sin depender de las otras.  
> Las fases están ordenadas por impacto: seguridad primero, features opcionales al final.
