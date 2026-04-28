const fs = require('fs');

const filepath = 'src/types/index.js';
let content = fs.readFileSync(filepath, 'utf8');

const replacements = [
    [/(\/images\/products\/color\/matias-bubble-bath-)(v\d)(\.png)/g, '/images/products/matias-bubble-bath/color/matias-bubble-bath-$2$3'],
    [/(\/images\/products\/color\/pokemon-gb-)(\w+)(\.png)/g, '/images/products/pokemon-gb/color/pokemon-gb-$2$3'],
    [/(\/images\/products\/color\/jhungle-gb-color\.png)/g, '/images/products/pokemon-gb/color/jhungle-gb-color.png'],
    [/(\/images\/products\/paint-by-numbers\/pokemon-gb-)(\w+)(\.png)/g, '/images/products/pokemon-gb/paint-by-numbers/pokemon-gb-$2$3'],
    [/(\/images\/products\/color\/alice-pixel-)(\w+)(\.png)/g, '/images/products/alice-pixel/color/alice-pixel-$2$3'],
    [/(\/images\/products\/paint-by-numbers\/alice-pixel-)(\w+)(\.png)/g, '/images/products/alice-pixel/paint-by-numbers/alice-pixel-$2$3'],
    [/(\/images\/products\/color\/courage-berserk-)(v\d)(\.png)/g, '/images/products/courage-berserk/color/courage-berserk-$2$3'],
    [/(\/images\/products\/color\/white-rabbit-lego-)(v\d)(\.png)/g, '/images/products/white-rabbit-lego/color/white-rabbit-lego-$2$3'],
    [/(\/images\/products\/color\/lego-alice-)(v\d|guide)(\.png)/g, '/images/products/lego-alice/color/lego-alice-$2$3'],
    [/(\/images\/products\/color\/alice-geometric-)(v\d)(\.png)/g, '/images/products/alice-geometric/color/alice-geometric-$2$3'],
    [/(\/images\/products\/color\/bunny_ambition_wealth_high_res\.png)/g, '/images/products/bunny-ambition/color/bunny_ambition_wealth_high_res.png'],
    [/(\/images\/products\/paint-by-numbers\/bunny_ambition_wealth_pbn\.png)/g, '/images/products/bunny-ambition/paint-by-numbers/bunny_ambition_wealth_pbn.png'],
    [/(\/images\/products\/color\/alice_typography_studio\.jpg)/g, '/images/products/alice-typography/color/alice_typography_studio.jpg'],
    [/(\/images\/products\/color\/alice_typography_urban\.(png|jpg))/g, '/images/products/alice-typography/color/alice_typography_urban.$2'],
    [/(\/images\/products\/paint-by-numbers\/alice_typography_pbn\.jpg)/g, '/images/products/alice-typography/paint-by-numbers/alice_typography_pbn.jpg'],
    [/(\/images\/products\/color\/capital-is-king-)(v\d)(\.png)/g, '/images/products/capital-king/color/capital-is-king-$2$3'],
    [/(\/images\/products\/paint-by-numbers\/capital-is-king-)(v\d)(\.png)/g, '/images/products/capital-king/paint-by-numbers/capital-is-king-$2$3'],
    [/(\/images\/products\/color\/charmander-)(\w+)(\.png)/g, '/images/products/charmander-evolution/color/charmander-$2$3'],
    [/(\/images\/products\/paint-by-numbers\/charmander-)(\w+)(\.png)/g, '/images/products/charmander-evolution/paint-by-numbers/charmander-$2$3'],
    [/(\/images\/products\/paint-by-numbers\/mario-pbn-)(v\d)(\.png)/g, '/images/products/mario-steampunk/paint-by-numbers/mario-pbn-$2$3'],
    [/(\/images\/products\/color\/alice_awakening_protocol\.png)/g, '/images/products/alice-awakening/color/alice_awakening_protocol.png'],
    [/(\/images\/products\/paint-by-numbers\/alice_awakening_pbn\.png)/g, '/images/products/alice-awakening/paint-by-numbers/alice_awakening_pbn.png'],
     [/(\/images\/products\/color\/alice_dreaming_data\.png)/g, '/images/products/alice-dreaming/color/alice_dreaming_data.png'],
    [/(\/images\/products\/paint-by-numbers\/alice_dreaming_pbn_(v\d)\.png)/g, '/images/products/alice-dreaming/paint-by-numbers/alice_dreaming_pbn_$2.png'],
    [/(\/images\/products\/color\/chrono_rabbit_zenith\.png)/g, '/images/products/chrono-rabbit/color/chrono_rabbit_zenith.png'],
    [/(\/images\/products\/paint-by-numbers\/chrono_rabbit_pbn\.png)/g, '/images/products/chrono-rabbit/paint-by-numbers/chrono_rabbit_pbn.png'],
    [/(\/images\/products\/color\/cyber_bunny_v1\.png)/g, '/images/products/cyber-bunny/color/cyber_bunny_v1.png'],
    [/(\/images\/products\/paint-by-numbers\/cyber_bunny_pbn\.png)/g, '/images/products/cyber-bunny/paint-by-numbers/cyber_bunny_pbn.png'],
    [/(\/images\/products\/color\/pikachu-steampunk\.png)/g, '/images/products/pikachu-steampunk/color/pikachu-steampunk.png'],
    [/(\/images\/products\/paint-by-numbers\/pikachu-steampunk\.png)/g, '/images/products/pikachu-steampunk/paint-by-numbers/pikachu-steampunk.png'],
    [/(\/images\/products\/color\/yoshi-ruby-cosmic\.png)/g, '/images/products/yoshi-ruby/color/yoshi-ruby-cosmic.png'],
    [/(\/images\/products\/color\/yoshi-variant-v2\.png)/g, '/images/products/yoshi-ruby/color/yoshi-variant-v2.png'],
    [/(\/images\/products\/paint-by-numbers\/yoshi-ruby-cosmic\.png)/g, '/images/products/yoshi-ruby/paint-by-numbers/yoshi-ruby-cosmic.png'],
     [/(\/images\/products\/color\/savage-mona-lisa\.png)/g, '/images/products/mona-lisa/color/savage-mona-lisa.png'],
     [/(\/images\/products\/color\/alice_wonderland_street_high_res\.png)/g, '/images/products/alice-wonderland-street/color/alice_wonderland_street_high_res.png'],
     [/(\/images\/products\/paint-by-numbers\/alice_wonderland_street_pbn\.png)/g, '/images/products/alice-wonderland-street/paint-by-numbers/alice_wonderland_street_pbn.png'],
     [/(\/images\/products\/color\/wall-street-mcduck\.png)/g, '/images/products/wall-street-mcduck/color/wall-street-mcduck.png'],
     [/(\/images\/products\/color\/hong-kong-mcduck\.png)/g, '/images/products/hong-kong-mcduck/color/hong-kong-mcduck.png'],
     [/(\/images\/products\/color\/wonderland-alice\.png)/g, '/images/products/wonderland-alice/color/wonderland-alice.png'],
     [/(\/images\/products\/paint-by-numbers\/wonderland-alice\.png)/g, '/images/products/wonderland-alice/paint-by-numbers/wonderland-alice.png'],
     [/(\/images\/products\/paint-by-numbers\/wonderland-mcduck\.png)/g, '/images/products/wonderland-mcduck/paint-by-numbers/wonderland-mcduck.png']
];

let newContent = content;
for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
}

fs.writeFileSync(filepath, newContent, 'utf8');
console.log("Updated index.js successfully.");
