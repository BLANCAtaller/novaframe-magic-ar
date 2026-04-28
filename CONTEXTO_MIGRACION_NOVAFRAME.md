# 🌌 CONTEXTO DE DESARROLLO: NOVAFRAME (MIGRACIÓN DE AGENTE)

¡Hola, nuevo agente Antigravity! Si estás leyendo esto, significa que el usuario ha migrado de computadora o sesión y necesita que retomes el desarrollo de **NovaFrame** exactamente donde lo dejamos. 

NovaFrame es una plataforma de comercio electrónico orientada a la venta de arte en lienzos y cuadros con calidad de museo y galería. El enfoque principal es **altísimo realismo 3D, estética premium, y una interfaz de usuario fluida y sofisticada**.

## 📍 ESTADO ACTUAL DEL PROYECTO

Hemos estado trabajando intensamente en el **Laboratorio 3D** (`src/components/EnvironmentEngine3D.jsx` y `src/components/WallProjector.jsx`), elevando el fotorrealismo de los entornos de previsualización.

### Logros Recientes:
1. **Suite Zenith (Entorno de Lujo):** Pasamos de usar geometrías básicas (cajas) a muebles orgánicos altamente detallados. Las almohadas ahora tienen bordes estilo Oxford, los cojines decorativos tienen botones y costuras, y agregamos iluminación LED ambiental bajo la cama. Todo esto renderizado con `meshPhysicalMaterial` para simular telas reales y cuero.
2. **Limpieza de Interfaz:** Eliminamos los enormes botones de cambio de ambiente (Terminal 04, Pabellón, etc.) que flotaban en el `WallProjector.jsx`. La idea es que la selección de ambientes se maneje de forma más sutil desde el panel de control izquierdo (`ConfiguratorLayout.jsx` / `RomanticCustomizer.jsx`).
3. **Optimización de Entornos:** Eliminamos el ambiente "Recámara Oscura" por petición del usuario y reajustamos la exposición global de la luz (`toneMappingExposure`) para evitar que el cuadro se vea sobreiluminado o "quemado".

## ✅ ÚLTIMO LOGRO: EL BORDE DEL LIENZO (CANVAS EDGE) RESUELTO

**El Problema Anterior:**
El usuario notó que el borde del cuadro de lienzo (`CanvasFrame` en `WallProjector.jsx`) era plano. Intentamos rellenarlo con la imagen completa pero se comprimió horriblemente. Un borde negro tampoco le gustó porque no se veía como un lienzo real.

**La Solución Actual (Completada):** 
Implementé un **Gallery Wrap Matemático (Mirror Wrap)**. Cloné la textura original y ajusté matemáticamente las coordenadas UV (`repeat` y `offset`) basándome en el grosor físico real del cuadro (`D / W`). Ahora, exactamente los últimos milímetros de los bordes de la imagen se envuelven y actúan como espejo en las 4 caras laterales del marco. El resultado es un lienzo 100% continuo, ultra-realista y de nivel museo.

### 🛠️ Próximos pasos para el nuevo agente:
Con el Laboratorio 3D luciendo tan fotorrealista, tu siguiente tarea es consultarle al usuario qué flujo desea abordar ahora. Algunas opciones son:
1. Afinar la sincronización entre el panel izquierdo de variantes (`RomanticCustomizer`) y el modelo 3D.
2. Mejorar la iluminación específica en otros entornos como Oficina Industrial.
3. Avanzar con la pasarela de compra (CheckoutProtocol).

## 📁 ARCHIVOS CLAVE DE ESTE FLUJO
* `src/components/EnvironmentEngine3D.jsx` -> Contiene los modelos 3D del mobiliario y la iluminación. ¡Cuidado con el rendimiento al agregar más polígonos!
* `src/components/WallProjector.jsx` -> Gestiona la cámara, la proyección de la obra sobre la pared, y la construcción del marco/lienzo (`CanvasFrame`).
* `src/components/ConfiguratorLayout.jsx` -> El cascarón de la UI. Aquí residen los controles de la barra lateral izquierda.

## 🧠 DIRECTRICES DE DISEÑO
* **Realismo Ante Todo:** Si algo parece plástico o "de videojuego viejo", está mal. Usa `roughness` y texturas detalladas.
* **UI Minimalista:** Evita saturar la pantalla. Usa el "glassmorphism" (fondos semitransparentes con blur), tipografías modernas y contrastes elegantes.
* **Rendimiento:** Mantén los FPS altos. Evita luces que proyecten sombras dinámicas innecesarias.

---
**Instrucción para el Nuevo Agente:** 
Preséntate con el usuario, confirma que has leído este contexto de migración, y pregúntale cuál de las 3 opciones para los bordes del lienzo le gustaría implementar primero.
