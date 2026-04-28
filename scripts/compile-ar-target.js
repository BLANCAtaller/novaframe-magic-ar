/**
 * ════════════════════════════════════════════════════════════════
 * NOVAFRAME — MIND TARGET COMPILER
 * ════════════════════════════════════════════════════════════════
 * 
 * Este script compila una imagen en un archivo .mind 
 * que MindAR usa para reconocer la obra de arte.
 * 
 * USO:
 *   node scripts/compile-ar-target.js <ruta-de-imagen>
 * 
 * EJEMPLO:
 *   node scripts/compile-ar-target.js public/images/products/lego-alice/color/lego-alice-v1.png
 * 
 * RESULTADO:
 *   Genera un archivo .mind en public/ar/targets/
 * 
 * REQUISITOS:
 *   npm install mind-ar
 * 
 * ALTERNATIVA MANUAL (sin instalar nada):
 *   1. Ve a: https://hiukim.github.io/mind-ar-js-doc/tools/compile
 *   2. Sube tu imagen
 *   3. Descarga el archivo .mind resultante
 *   4. Colócalo en: public/ar/targets/
 * ════════════════════════════════════════════════════════════════
 */

const path = require('path');
const fs = require('fs');

async function main() {
  const imagePath = process.argv[2];
  
  if (!imagePath) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  NOVAFRAME — Compilador de Targets AR                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Uso: node scripts/compile-ar-target.js <imagen>             ║
║                                                              ║
║  Ejemplo:                                                    ║
║  node scripts/compile-ar-target.js \\                         ║
║    public/images/products/lego-alice/color/lego-alice-v1.png ║
║                                                              ║
║  ─────────────────────────────────────────────────────────── ║
║                                                              ║
║  ALTERNATIVA MANUAL (Recomendada para primera vez):          ║
║                                                              ║
║  1. Abre en tu navegador:                                    ║
║     https://hiukim.github.io/mind-ar-js-doc/tools/compile    ║
║                                                              ║
║  2. Sube la imagen de tu cuadro                              ║
║                                                              ║
║  3. Descarga el archivo .mind generado                       ║
║                                                              ║
║  4. Renómbralo a "demo.mind" y colócalo en:                  ║
║     public/ar/targets/demo.mind                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
    return;
  }

  const absolutePath = path.resolve(imagePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`\n❌ Error: No se encontró la imagen en "${absolutePath}"\n`);
    process.exit(1);
  }

  console.log(`\n🔧 Compilando target AR desde: ${absolutePath}`);
  console.log(`   Esto puede tardar unos segundos...\n`);

  try {
    // Try to use mind-ar compiler if installed
    const { MindARImageCompiler } = require('mind-ar/dist/mindar-image-compiler.prod.js');
    const { createCanvas, loadImage } = require('canvas');
    
    const compiler = new MindARImageCompiler();
    const image = await loadImage(absolutePath);
    
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    await compiler.compileImageTargets([canvas], (progress) => {
      const pct = Math.round(progress * 100);
      process.stdout.write(`\r   Progreso: [${'█'.repeat(Math.floor(pct / 5))}${'░'.repeat(20 - Math.floor(pct / 5))}] ${pct}%`);
    });
    
    const exportedData = compiler.exportData();
    const outputName = path.basename(absolutePath, path.extname(absolutePath));
    const outputPath = path.resolve(__dirname, '../public/ar/targets', `${outputName}.mind`);
    
    fs.writeFileSync(outputPath, Buffer.from(exportedData));
    
    console.log(`\n\n✅ Target compilado exitosamente!`);
    console.log(`   Archivo: ${outputPath}`);
    console.log(`\n   Para usarlo, actualiza el "imageTargetSrc" en public/ar/index.html`);
    console.log(`   a: ./targets/${outputName}.mind\n`);
    
  } catch (e) {
    console.log(`\n⚠️  Las dependencias de compilación no están instaladas.`);
    console.log(`   Ejecuta: npm install mind-ar canvas\n`);
    console.log(`   O usa la herramienta web manual:`);
    console.log(`   https://hiukim.github.io/mind-ar-js-doc/tools/compile\n`);
    console.log(`   Detalle del error: ${e.message}\n`);
  }
}

main();
