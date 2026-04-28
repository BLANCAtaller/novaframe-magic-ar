const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/HolographicCube.jsx',
  'src/components/Navbar.jsx',
  'src/components/PhysicalGallery.jsx',
  'src/components/TechSpecs.jsx',
  'src/components/DesignGallery.jsx',
  'src/components/CategoryGrid.jsx',
  'src/components/ArVisualizer.jsx',
  'src/app/support/page.js'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/(\/images\/[^'"]+)\.png/g, '$1.webp');
    content = content.replace(/(\/images\/[^'"]+)\.jpg/g, '$1.webp');
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + file);
  }
});
