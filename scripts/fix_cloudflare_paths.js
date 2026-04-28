const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const nextDir = path.join(outDir, '_next');
const targetDir = path.join(outDir, 'next_assets');

// 1. Rename _next to next_assets if it exists
if (fs.existsSync(nextDir)) {
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.renameSync(nextDir, targetDir);
    console.log('Renamed _next to next_assets');
}

// 2. Replace all occurrences in HTML/JS/CSS/JSON/TXT
function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (['.html', '.js', '.css', '.json', '.txt'].includes(ext)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('/_next/') || content.includes('_next/')) {
                    // Update paths to use next_assets instead of _next
                    content = content.replace(/\/_next\//g, '/next_assets/');
                    content = content.replace(/_next\//g, 'next_assets/');
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated paths in: ${file}`);
                }
            }
        }
    }
}

console.log('Fixing paths for Cloudflare...');
replaceInDir(outDir);
console.log('Replacement complete.');
