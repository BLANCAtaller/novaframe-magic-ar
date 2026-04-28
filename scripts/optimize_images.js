const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * ESTE SCRIPT OPTIMIZA LAS IMÁGENES PARA MÓVIL
 * 1. Busca todos los PNG/JPG en public/images
 * 2. Los convierte a WebP (mucho más ligero)
 * 3. Crea versiones "thumb" para los fondos difuminados
 * 
 * INSTRUCCIONES:
 * 1. Instalar sharp: npm install sharp
 * 2. Ejecutar: node scripts/optimize_images.js
 */

const TARGET_DIR = path.join(__dirname, '../public/images');

async function walk(dir) {
    let files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await walk(fullPath);
        } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
            await optimize(fullPath);
        }
    }
}

async function optimize(filePath) {
    const ext = path.extname(filePath);
    const webpPath = filePath.replace(ext, '.webp');
    
    try {
        // Generar WebP de alta calidad pero comprimido
        await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
        
        console.log(`✅ Optimizado: ${path.basename(webpPath)}`);

        // Opcional: Generar una versión mini (thumb) para efectos de blur
        const thumbPath = filePath.replace(ext, '_thumb.webp');
        await sharp(filePath)
            .resize(50) // Muy pequeña
            .webp({ quality: 20 })
            .toFile(thumbPath);
            
        console.log(`   └─ Miniatura creada para blur`);

    } catch (err) {
        console.error(`❌ Error en ${filePath}:`, err.message);
    }
}

console.log('--- INICIANDO OPTIMIZACIÓN DE ASSETS ---');
walk(TARGET_DIR).then(() => {
    console.log('--- PROCESO COMPLETADO ---');
    console.log('TIP: Ahora puedes actualizar tus componentes para usar .webp en lugar de .png');
});
