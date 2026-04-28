const fs = require('fs');
const filepath = 'src/types/index.js';
let content = fs.readFileSync(filepath, 'utf8');

// Replace all price: XXX with price: 185
let newContent = content.replace(/price:\s*\d+/g, 'price: 185');

fs.writeFileSync(filepath, newContent, 'utf8');
console.log("Standardized all product base prices to 185.");
