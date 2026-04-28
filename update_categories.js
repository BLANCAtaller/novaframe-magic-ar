const fs = require('fs');
const filepath = 'src/types/index.js';
let content = fs.readFileSync(filepath, 'utf8');

// Update CATEGORIES constant
content = content.replace(
  /export const CATEGORIES = \[.*?\];/s,
  `export const CATEGORIES = ['Matías Pug', 'Pokémon GB', 'Alice Protocol', 'Mario Steampunk', 'Cultura Geek', 'Finanzas', 'Arte Figurativo'];`
);

// Map common identifiers to new categories
const mapping = {
  'matias-bubble-bath': "'Matías Pug'",
  'pokemon-gb': "'Pokémon GB'",
  'alice-geometric': "'Alice Protocol'",
  'lego-alice': "'Alice Protocol'",
  'white-rabbit-lego': "'Alice Protocol'",
  'chrono-rabbit': "'Alice Protocol'",
  'alice-awakening': "'Alice Protocol'",
  'alice-typography': "'Alice Protocol'",
  'alice-pixel': "'Alice Protocol'",
  'mario-steampunk': "'Mario Steampunk'",
  'pikachu-steampunk': "'Cultura Geek'",
  'charmander-evolution': "'Cultura Geek'",
  'bunny-ambition': "'Finanzas'",
  'capital-king': "'Finanzas'",
  'wall-street-mcduck': "'Finanzas'",
  'mona-lisa': "'Arte Figurativo'",
  'napoleon-rebellion': "'Arte Figurativo'",
  'courage-berserk': "'Cultura Geek'"
};

// Use a loop to replace categories in the file content
// This is a bit complex with regex so I'll do it sequentially for each slug
for (const [slug, category] of Object.entries(mapping)) {
  const regex = new RegExp(`slug:\\s*'${slug}',[\\s\\S]*?category:\\s*'.*?'`, 'g');
  content = content.replace(regex, (match) => match.replace(/category:\s*'.*?'/, `category: ${category}`));
}

fs.writeFileSync(filepath, content, 'utf8');
console.log("Updated categories for high-fidelity pieces.");
