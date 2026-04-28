const fs = require('fs');
const filepath = 'src/types/index.js';
let content = fs.readFileSync(filepath, 'utf8');

const v2v3 = [
  {
    id: 'p51',
    slug: 'capital-king',
    name: 'Capital Is King // Silver Protocol V2',
    description: 'Refinamiento visual del trono del capital. Una versión técnica en tonos plata y cromo para entornos minimalistas.',
    price: 185,
    imageUrl: '/images/products/capital-king/color/capital-is-king-v2.png',
    imageUrlColor: '/images/products/capital-king/color/capital-is-king-v2.png',
    imageUrlPBN: '/images/products/capital-king/paint-by-numbers/capital-is-king-v2.png',
    category: 'Finanzas',
    tags: ['MONEY', 'SILVER', 'POWER'],
    rarity: 'Legendary',
    nodeId: 'NF-CAP-V2',
    featured: false,
    isBestSeller: false,
    salesCount: 0,
    shape: 'Vertical',
    theme: 'Lustre',
    variants: ['color', 'pbn'],
  },
  {
    id: 'p52',
    slug: 'capital-king',
    name: 'Capital Is King // Obsidian Protocol V3',
    description: 'La máxima expresión de la autoridad financiera. Contrastes profundos y texturas de obsidiana en alta resolución.',
    price: 185,
    imageUrl: '/images/products/capital-king/color/capital-is-king-v3.png',
    imageUrlColor: '/images/products/capital-king/color/capital-is-king-v3.png',
    imageUrlPBN: '/images/products/capital-king/paint-by-numbers/capital-is-king-v3.png',
    category: 'Finanzas',
    tags: ['MONEY', 'DARK', 'POWER'],
    rarity: 'Zenith',
    nodeId: 'NF-CAP-V3',
    featured: false,
    isBestSeller: false,
    salesCount: 0,
    shape: 'Vertical',
    theme: 'Dark',
    variants: ['color', 'pbn'],
  }
];

const newProductsStr = JSON.stringify(v2v3, null, 2).replace(/^\[/, '').replace(/\]$/, ',');
content = content.replace(/(export const SAMPLE_PRODUCTS = \[)/, `$1\n${newProductsStr}`);

fs.writeFileSync(filepath, content, 'utf8');
console.log("Registered V2/V3 assets in the catalog.");
