# CONTEXTO CORE DE NOVAFRAME (PARA INTEGRACIÓN AR)

Saludos, agente colega. Si estás leyendo esto, fuiste instanciado para desarrollar el **Módulo de Realidad Aumentada (AR)** para NovaFrame. 

A continuación, tienes todo el contexto técnico, arquitectónico y de diseño de la plataforma actual para que puedas construir la experiencia AR y saber exactamente dónde y cómo inyectarla.

---

## 1. ¿Qué es NovaFrame?
NovaFrame es un E-Commerce de gama alta especializado en lienzos acústicos/artísticos. Su propuesta de valor principal es una experiencia de usuario extremadamente técnica e industrial, donde el usuario "sintetiza" (configura) su cuadro en un "Laboratorio 3D" en tiempo real antes de comprar.

## 2. Tech Stack Actual
*   **Framework Core:** Next.js 14 (App Router).
*   **Estilos y UI:** Tailwind CSS, Framer Motion (para animaciones fluidas) y Lucide React (íconos).
*   **Motor 3D Actual:** React Three Fiber (R3F) y Three.js.
*   **Backend / DB:** Firebase (Auth, Firestore, Storage).
*   **Gestión de Estado:** React Context API (`TerminalContext.js`).

## 3. Identidad Visual y Diseño (MUUY IMPORTANTE)
NovaFrame utiliza una estética "Industrial Terminal / Cyber-Minimalista" (Zenith v3.0).
*   **Colores:** Fondos negros oscuros (`#000000`, `#050505`), bordes sutiles grises/blancos (`border-white/10`), y acentos en **Cyan Neón** (`#06b6d4` o `text-neon-cyan`).
*   **Tipografía:** Fuertemente basada en fuentes monoespaciadas (`font-mono`) para etiquetas, datos técnicos y botones, combinada con fuentes sans-serif muy pesadas (`font-black`, `tracking-tighter`) para títulos.
*   **Componentes UI:** Nada de sombras suaves de colores, se usan brillos (glows) y bordes definidos.

## 4. ¿Dónde se acomodará el Módulo AR?
El núcleo de la aplicación de usuario ocurre en el **Laboratorio 3D**.
Ruta actual: `src/app/laboratorio/configurar/page.jsx`.

Actualmente, esta página divide la pantalla en dos partes (en escritorio) o en pestañas (en móvil):
1.  **Panel de Controles (Izquierda/Abajo):** Donde el usuario sube su imagen, elige tamaño, acabado y tipo de borde.
2.  **Visualizador 3D (Derecha/Arriba):** Renderizado por el componente `src/components/Canvas3DViewer.jsx`.

### **Punto de Inyección Sugerido para AR:**
Necesitamos que agregues un botón de **"VER EN TU ESPACIO (AR)"** dentro de la interfaz del Laboratorio (junto al Canvas 3D). Al presionarlo en un dispositivo móvil, debería abrir la cámara y montar la textura generada sobre una superficie física.

## 5. El Estado Global: `TerminalContext.js`
No necesitas reconstruir la lógica de carrito o selección de imágenes. Todo vive en un contexto de React ubicado en `src/context/TerminalContext.js`.

El estado central que tu componente AR debe **leer** contiene:
*   `uploadedImage`: La URL temporal (blob) de la imagen que el usuario subió. **Esta es la textura que debes proyectar en AR.**
*   `selections.size`: El tamaño del cuadro (ej. "60x40", "100x70"). *Debes parsear esto para darle dimensiones físicas reales a tu modelo AR.*
*   `selections.edge`: Tipo de borde ("Espejo", "Color Sólido", "Gota de Imagen").
*   `selections.finish`: Acabado ("Lona HD", "Canvas Premium").

## 6. Tu Misión
1.  Desarrollar el componente AR (evalúa si usar WebXR, 8th Wall, MindAR, o AR.js compatible con Next.js).
2.  Asegurar que el componente AR lea la imagen y las dimensiones del `TerminalContext`.
3.  Diseñar el botón/entrada a la experiencia AR para que haga "match" con nuestra interfaz oscura de terminal.
4.  Cuidar que el paquete AR no rompa el performance de la exportación estática de Next.js (`npm run build`).

¡Mucho éxito con la programación de la matriz espacial!
