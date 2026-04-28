const fs = require('fs');
const path = require('path');

const baseDir = 'public/images/products';
const groups = {
    'pokemon-gb': ['pokemon-gb-', 'jhungle-gb-color'],
    'alice-pixel': ['alice-pixel-'],
    'bunny-ambition': ['bunny_ambition_'],
    'alice-typography': ['alice_typography_'],
    'capital-king': ['capital-is-king-'],
    'charmander-evolution': ['charmander-'],
    'courage-berserk': ['courage-berserk-'],
    'alice-awakening': ['alice_awakening_', 'alice_awakening_protocol'],
    'alice-dreaming': ['alice_dreaming_'],
    'chrono-rabbit': ['chrono_rabbit_'],
    'cyber-bunny': ['cyber_bunny_v1', 'cyber_bunny_pbn'],
    'mona-lisa': ['mona-lisa', 'mona_lisa', 'savage-mona-lisa', 'chaos-mona-lisa'],
    'pikachu-steampunk': ['pikachu-steampunk'],
    'boss-bunny': ['boss-bunny'],
    'yoshi-ruby': ['yoshi-ruby-cosmic', 'yoshi-variant-v2', 'yoshi-sketch-matrix'],
    'matias-bubble-bath': ['matias-bubble-bath-'],
    'white-rabbit-lego': ['white-rabbit-lego-'],
    'lego-alice': ['lego-alice-'],
    'alice-geometric': ['alice-geometric-'],
    'mario-steampunk': ['mario-pbn-'],
    'alice-wonderland-street': ['alice_wonderland_street_'],
    'wall-street-mcduck': ['wall-street-mcduck'],
    'hong-kong-mcduck': ['hong-kong-mcduck'],
    'wonderland-alice': ['wonderland-alice'],
    'wonderland-mcduck': ['wonderland-mcduck']
};

function migrateFolder(subFolder) {
    const src = path.join(baseDir, subFolder);
    if (!fs.existsSync(src)) {
        console.log(`Source ${src} does not exist.`);
        return;
    }
    
    fs.readdirSync(src).forEach(file => {
        let moved = false;
        for (const [group, prefixes] of Object.entries(groups)) {
            if (prefixes.some(p => file.startsWith(p))) {
                const destCol = path.join(baseDir, group, 'color');
                const destPBN = path.join(baseDir, group, 'paint-by-numbers');
                const dest = subFolder === 'paint-by-numbers' ? destPBN : destCol;
                
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                
                const oldPath = path.join(src, file);
                const newPath = path.join(dest, file);
                
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`Moved ${file} to ${dest}`);
                    moved = true;
                } catch (e) {
                    console.error(`Error moving ${file}: ${e.message}`);
                }
                break;
            }
        }
        if (!moved) {
            console.log(`File ${file} in ${subFolder} did not match any group.`);
        }
    });
}

console.log("Starting migration...");
migrateFolder('color');
migrateFolder('paint-by-numbers');
console.log("Migration finished.");
