const mongoose = require('mongoose');
const Icon = require('./models/Icon');
require('dotenv').config();

const MINING_SITES = [
  // === GOLD (20 sites) ===
  { name: 'Muruntau', region: 'asia', country: 'UZ', lat: 41.52, lng: 64.57, resourceType: 'gold', hashrate: 700, price: 185 },
  { name: 'Carlin Trend', region: 'north_america', country: 'US', lat: 40.72, lng: -116.07, resourceType: 'gold', hashrate: 650, price: 170 },
  { name: 'Grasberg', region: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'gold', hashrate: 750, price: 200 },
  { name: 'Olimpiada', region: 'russia', country: 'RU', lat: 58.73, lng: 93.65, resourceType: 'gold', hashrate: 600, price: 155 },
  { name: 'Cortez', region: 'north_america', country: 'US', lat: 40.17, lng: -116.61, resourceType: 'gold', hashrate: 580, price: 150 },
  { name: 'Pueblo Viejo', region: 'south_america', country: 'DO', lat: 19.05, lng: -70.17, resourceType: 'gold', hashrate: 550, price: 140 },
  { name: 'Lihir', region: 'australia', country: 'PG', lat: -3.12, lng: 152.64, resourceType: 'gold', hashrate: 520, price: 135 },
  { name: 'Kibali', region: 'africa', country: 'CD', lat: 3.01, lng: 29.59, resourceType: 'gold', hashrate: 490, price: 125 },
  { name: 'Boddington', region: 'australia', country: 'AU', lat: -32.75, lng: 116.38, resourceType: 'gold', hashrate: 470, price: 120 },
  { name: 'Loulo-Gounkoto', region: 'africa', country: 'ML', lat: 14.43, lng: -11.67, resourceType: 'gold', hashrate: 460, price: 115 },
  { name: 'Cadia Valley', region: 'australia', country: 'AU', lat: -33.47, lng: 148.99, resourceType: 'gold', hashrate: 450, price: 110 },
  { name: 'South Deep', region: 'africa', country: 'ZA', lat: -26.42, lng: 27.67, resourceType: 'gold', hashrate: 440, price: 108 },
  { name: 'Mponeng', region: 'africa', country: 'ZA', lat: -26.41, lng: 27.42, resourceType: 'gold', hashrate: 430, price: 105 },
  { name: 'Canadian Malartic', region: 'north_america', country: 'CA', lat: 48.13, lng: -78.12, resourceType: 'gold', hashrate: 420, price: 100 },
  { name: 'Norte Abierto', region: 'south_america', country: 'CL', lat: -27.35, lng: -69.27, resourceType: 'gold', hashrate: 500, price: 130 },
  { name: 'Obuasi', region: 'africa', country: 'GH', lat: 6.2, lng: -1.67, resourceType: 'gold', hashrate: 380, price: 95 },
  { name: 'Detour Lake', region: 'north_america', country: 'CA', lat: 50.05, lng: -79.7, resourceType: 'gold', hashrate: 400, price: 98 },
  { name: 'Yanacocha', region: 'south_america', country: 'PE', lat: -6.98, lng: -78.53, resourceType: 'gold', hashrate: 410, price: 102 },
  { name: 'Pascua-Lama', region: 'south_america', country: 'CL', lat: -29.32, lng: -70.07, resourceType: 'gold', hashrate: 350, price: 90 },
  { name: 'Olympic Dam Gold', region: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'gold', hashrate: 480, price: 122 },
  // === COPPER (20 sites) ===
  { name: 'Escondida', region: 'south_america', country: 'CL', lat: -24.27, lng: -69.07, resourceType: 'copper', hashrate: 720, price: 190 },
  { name: 'Collahuasi', region: 'south_america', country: 'CL', lat: -20.98, lng: -68.72, resourceType: 'copper', hashrate: 600, price: 155 },
  { name: 'Kamoa-Kakula', region: 'africa', country: 'CD', lat: -10.77, lng: 26.32, resourceType: 'copper', hashrate: 680, price: 175 },
  { name: 'Grasberg Copper', region: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'copper', hashrate: 700, price: 185 },
  { name: 'Tenke Fungurume', region: 'africa', country: 'CD', lat: -10.62, lng: 26.12, resourceType: 'copper', hashrate: 550, price: 140 },
  { name: 'El Teniente', region: 'south_america', country: 'CL', lat: -34.09, lng: -70.35, resourceType: 'copper', hashrate: 580, price: 148 },
  { name: 'Bingham Canyon', region: 'north_america', country: 'US', lat: 40.52, lng: -112.15, resourceType: 'copper', hashrate: 560, price: 145 },
  { name: 'Cerro Verde', region: 'south_america', country: 'PE', lat: -16.54, lng: -71.6, resourceType: 'copper', hashrate: 530, price: 138 },
  { name: 'Antamina', region: 'south_america', country: 'PE', lat: -9.54, lng: -77.05, resourceType: 'copper', hashrate: 520, price: 135 },
  { name: 'Chuquicamata', region: 'south_america', country: 'CL', lat: -22.31, lng: -68.9, resourceType: 'copper', hashrate: 650, price: 168 },
  { name: 'Los Pelambres', region: 'south_america', country: 'CL', lat: -31.72, lng: -70.5, resourceType: 'copper', hashrate: 480, price: 125 },
  { name: 'Radomiro Tomic', region: 'south_america', country: 'CL', lat: -22.24, lng: -68.9, resourceType: 'copper', hashrate: 500, price: 130 },
  { name: 'Morenci', region: 'north_america', country: 'US', lat: 33.07, lng: -109.35, resourceType: 'copper', hashrate: 540, price: 142 },
  { name: 'Mutanda', region: 'africa', country: 'CD', lat: -10.87, lng: 25.95, resourceType: 'copper', hashrate: 460, price: 118 },
  { name: 'Kamoto', region: 'africa', country: 'CD', lat: -10.72, lng: 25.44, resourceType: 'copper', hashrate: 450, price: 115 },
  { name: 'Sentinel', region: 'africa', country: 'ZM', lat: -12.78, lng: 25.52, resourceType: 'copper', hashrate: 440, price: 112 },
  { name: 'Los Bronces', region: 'south_america', country: 'CL', lat: -33.15, lng: -70.28, resourceType: 'copper', hashrate: 470, price: 122 },
  { name: 'Las Bambas', region: 'south_america', country: 'PE', lat: -14.05, lng: -72.32, resourceType: 'copper', hashrate: 510, price: 132 },
  { name: 'Udokan', region: 'russia', country: 'RU', lat: 56.49, lng: 118.37, resourceType: 'copper', hashrate: 400, price: 105 },
  { name: 'Olympic Dam Copper', region: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'copper', hashrate: 490, price: 128 },
  // === IRON (15 sites) ===
  { name: 'Carajas', region: 'south_america', country: 'BR', lat: -6.07, lng: -50.17, resourceType: 'iron', hashrate: 750, price: 160 },
  { name: 'Hamersley', region: 'australia', country: 'AU', lat: -22.32, lng: 118.37, resourceType: 'iron', hashrate: 700, price: 150 },
  { name: 'Pilbara', region: 'australia', country: 'AU', lat: -21.95, lng: 118.85, resourceType: 'iron', hashrate: 680, price: 145 },
  { name: 'Kiruna', region: 'europe', country: 'SE', lat: 67.86, lng: 20.22, resourceType: 'iron', hashrate: 620, price: 135 },
  { name: 'Mikhailovsky GOK', region: 'russia', country: 'RU', lat: 52.22, lng: 35.39, resourceType: 'iron', hashrate: 580, price: 125 },
  { name: 'Stoilensky GOK', region: 'russia', country: 'RU', lat: 51.32, lng: 37.85, resourceType: 'iron', hashrate: 560, price: 120 },
  { name: 'Lebedinsky GOK', region: 'russia', country: 'RU', lat: 51.37, lng: 37.73, resourceType: 'iron', hashrate: 600, price: 130 },
  { name: 'Minas Gerais', region: 'south_america', country: 'BR', lat: -19.92, lng: -43.94, resourceType: 'iron', hashrate: 650, price: 140 },
  { name: 'Simandou', region: 'africa', country: 'GN', lat: -8.58, lng: -8.92, resourceType: 'iron', hashrate: 540, price: 115 },
  { name: 'Sishen', region: 'africa', country: 'ZA', lat: -27.73, lng: 22.98, resourceType: 'iron', hashrate: 520, price: 110 },
  { name: 'Mount Whaleback', region: 'australia', country: 'AU', lat: -23.36, lng: 119.67, resourceType: 'iron', hashrate: 500, price: 105 },
  { name: 'Roy Hill', region: 'australia', country: 'AU', lat: -22.58, lng: 119.95, resourceType: 'iron', hashrate: 480, price: 100 },
  { name: 'Chichester Hub', region: 'australia', country: 'AU', lat: -22.05, lng: 118.62, resourceType: 'iron', hashrate: 470, price: 98 },
  { name: 'Carol Lake', region: 'north_america', country: 'CA', lat: 52.95, lng: -66.87, resourceType: 'iron', hashrate: 450, price: 95 },
  { name: 'Kovdorsky GOK', region: 'russia', country: 'RU', lat: 67.56, lng: 30.47, resourceType: 'iron', hashrate: 430, price: 90 },
  // === RARE METALS (15 sites) ===
  { name: 'Bayan Obo', region: 'asia', country: 'CN', lat: 41.8, lng: 109.97, resourceType: 'rare_metals', hashrate: 800, price: 250 },
  { name: 'Mount Weld', region: 'australia', country: 'AU', lat: -28.77, lng: 122.55, resourceType: 'rare_metals', hashrate: 700, price: 220 },
  { name: 'Mountain Pass', region: 'north_america', country: 'US', lat: 35.47, lng: -115.53, resourceType: 'rare_metals', hashrate: 650, price: 200 },
  { name: 'Lovozero', region: 'russia', country: 'RU', lat: 67.89, lng: 34.78, resourceType: 'rare_metals', hashrate: 600, price: 185 },
  { name: 'Tomtor', region: 'russia', country: 'RU', lat: 71.15, lng: 116.35, resourceType: 'rare_metals', hashrate: 580, price: 175 },
  { name: 'Nolans', region: 'australia', country: 'AU', lat: -22.59, lng: 133.24, resourceType: 'rare_metals', hashrate: 550, price: 165 },
  { name: 'Steenkampskraal', region: 'africa', country: 'ZA', lat: -31.3, lng: 18.95, resourceType: 'rare_metals', hashrate: 520, price: 155 },
  { name: 'Kvanefjeld', region: 'europe', country: 'GL', lat: 60.98, lng: -45.98, resourceType: 'rare_metals', hashrate: 500, price: 148 },
  { name: 'Brown Range', region: 'australia', country: 'AU', lat: -19.12, lng: 127.89, resourceType: 'rare_metals', hashrate: 480, price: 140 },
  { name: 'Songwe Hill', region: 'africa', country: 'MW', lat: -10.47, lng: 35.62, resourceType: 'rare_metals', hashrate: 460, price: 135 },
  { name: 'Round Top', region: 'north_america', country: 'US', lat: 31.35, lng: -105.52, resourceType: 'rare_metals', hashrate: 440, price: 128 },
  { name: 'Wicheeda', region: 'north_america', country: 'CA', lat: 54.22, lng: -122.17, resourceType: 'rare_metals', hashrate: 420, price: 120 },
  { name: 'Ngualla', region: 'africa', country: 'TZ', lat: -7.94, lng: 31.59, resourceType: 'rare_metals', hashrate: 400, price: 115 },
  { name: 'Zandkopsdrift', region: 'africa', country: 'ZA', lat: -31.23, lng: 18.08, resourceType: 'rare_metals', hashrate: 380, price: 108 },
  { name: 'Dubbo', region: 'australia', country: 'AU', lat: -32.25, lng: 148.61, resourceType: 'rare_metals', hashrate: 360, price: 100 },
  // === OIL & GAS (20 sites) ===
  { name: 'Ghawar', region: 'asia', country: 'SA', lat: 25.37, lng: 49.4, resourceType: 'oil_gas', hashrate: 900, price: 300 },
  { name: 'Burgan', region: 'asia', country: 'KW', lat: 28.98, lng: 47.65, resourceType: 'oil_gas', hashrate: 850, price: 280 },
  { name: 'Safaniya', region: 'asia', country: 'SA', lat: 28.17, lng: 48.75, resourceType: 'oil_gas', hashrate: 800, price: 260 },
  { name: 'Rumaila', region: 'asia', country: 'IQ', lat: 30.53, lng: 47.33, resourceType: 'oil_gas', hashrate: 780, price: 245 },
  { name: 'Priobskoye', region: 'russia', country: 'RU', lat: 61.05, lng: 70.18, resourceType: 'oil_gas', hashrate: 750, price: 230 },
  { name: 'Samotlor', region: 'russia', country: 'RU', lat: 61.18, lng: 76.73, resourceType: 'oil_gas', hashrate: 720, price: 215 },
  { name: 'Prudhoe Bay', region: 'north_america', country: 'US', lat: 70.25, lng: -148.34, resourceType: 'oil_gas', hashrate: 700, price: 200 },
  { name: 'Cantarell', region: 'north_america', country: 'MX', lat: 19.88, lng: -91.95, resourceType: 'oil_gas', hashrate: 680, price: 190 },
  { name: 'Kashagan', region: 'asia', country: 'KZ', lat: 46.25, lng: 51.45, resourceType: 'oil_gas', hashrate: 660, price: 185 },
  { name: 'Tupi (Lula)', region: 'south_america', country: 'BR', lat: -25.32, lng: -42.79, resourceType: 'oil_gas', hashrate: 640, price: 175 },
  { name: 'Tengiz', region: 'asia', country: 'KZ', lat: 46.15, lng: 53.35, resourceType: 'oil_gas', hashrate: 620, price: 170 },
  { name: 'Zakum', region: 'asia', country: 'AE', lat: 24.83, lng: 53.55, resourceType: 'oil_gas', hashrate: 600, price: 165 },
  { name: 'Hassi Messaoud', region: 'africa', country: 'DZ', lat: 31.67, lng: 6.07, resourceType: 'oil_gas', hashrate: 580, price: 155 },
  { name: 'Agbami', region: 'africa', country: 'NG', lat: 4.18, lng: 4.82, resourceType: 'oil_gas', hashrate: 560, price: 148 },
  { name: 'Shaybah', region: 'asia', country: 'SA', lat: 22.52, lng: 54.0, resourceType: 'oil_gas', hashrate: 540, price: 140 },
  { name: 'Vankor', region: 'russia', country: 'RU', lat: 67.83, lng: 83.58, resourceType: 'oil_gas', hashrate: 520, price: 135 },
  { name: 'Marlim', region: 'south_america', country: 'BR', lat: -22.37, lng: -40.02, resourceType: 'oil_gas', hashrate: 500, price: 128 },
  { name: 'Buzzard', region: 'europe', country: 'GB', lat: 57.48, lng: 1.08, resourceType: 'oil_gas', hashrate: 480, price: 120 },
  { name: 'Karachaganak', region: 'asia', country: 'KZ', lat: 50.17, lng: 51.8, resourceType: 'oil_gas', hashrate: 460, price: 115 },
  { name: 'Jack-2', region: 'north_america', country: 'US', lat: 26.68, lng: -89.67, resourceType: 'oil_gas', hashrate: 440, price: 108 },
  // === DIAMONDS (10 sites) ===
  { name: 'Jwaneng', region: 'africa', country: 'BW', lat: -24.53, lng: 24.73, resourceType: 'diamonds', hashrate: 850, price: 350 },
  { name: 'Orapa', region: 'africa', country: 'BW', lat: -21.31, lng: 25.37, resourceType: 'diamonds', hashrate: 780, price: 300 },
  { name: 'Udachny', region: 'russia', country: 'RU', lat: 66.43, lng: 112.35, resourceType: 'diamonds', hashrate: 750, price: 280 },
  { name: 'Catoca', region: 'africa', country: 'AO', lat: -9.22, lng: 20.2, resourceType: 'diamonds', hashrate: 700, price: 250 },
  { name: 'Mirny', region: 'russia', country: 'RU', lat: 62.54, lng: 113.96, resourceType: 'diamonds', hashrate: 680, price: 240 },
  { name: 'Argyle', region: 'australia', country: 'AU', lat: -16.72, lng: 128.39, resourceType: 'diamonds', hashrate: 650, price: 220 },
  { name: 'Venetia', region: 'africa', country: 'ZA', lat: -22.43, lng: 29.32, resourceType: 'diamonds', hashrate: 620, price: 200 },
  { name: 'Diavik', region: 'north_america', country: 'CA', lat: 64.5, lng: -110.28, resourceType: 'diamonds', hashrate: 600, price: 190 },
  { name: 'Ekati', region: 'north_america', country: 'CA', lat: 64.72, lng: -110.62, resourceType: 'diamonds', hashrate: 580, price: 175 },
  { name: 'Grib', region: 'russia', country: 'RU', lat: 64.98, lng: 40.45, resourceType: 'diamonds', hashrate: 550, price: 160 },
  // === COAL (10 sites) ===
  { name: 'Kuzbass', region: 'russia', country: 'RU', lat: 54.0, lng: 86.97, resourceType: 'coal', hashrate: 700, price: 120 },
  { name: 'Powder River Basin', region: 'north_america', country: 'US', lat: 44.78, lng: -105.5, resourceType: 'coal', hashrate: 680, price: 115 },
  { name: 'Hunter Valley', region: 'australia', country: 'AU', lat: -32.37, lng: 151.08, resourceType: 'coal', hashrate: 650, price: 110 },
  { name: 'Kalimantan', region: 'asia', country: 'ID', lat: -1.68, lng: 116.42, resourceType: 'coal', hashrate: 620, price: 105 },
  { name: 'Mpumalanga', region: 'africa', country: 'ZA', lat: -25.77, lng: 29.45, resourceType: 'coal', hashrate: 600, price: 100 },
  { name: 'Shanxi Basin', region: 'asia', country: 'CN', lat: 37.87, lng: 112.55, resourceType: 'coal', hashrate: 580, price: 95 },
  { name: 'Cerrejon', region: 'south_america', country: 'CO', lat: 10.97, lng: -72.65, resourceType: 'coal', hashrate: 550, price: 90 },
  { name: 'Bowen Basin', region: 'australia', country: 'AU', lat: -22.08, lng: 148.17, resourceType: 'coal', hashrate: 530, price: 85 },
  { name: 'Ekibastuz', region: 'asia', country: 'KZ', lat: 51.72, lng: 75.32, resourceType: 'coal', hashrate: 500, price: 80 },
  { name: 'Tavan Tolgoi', region: 'asia', country: 'MN', lat: 43.58, lng: 105.95, resourceType: 'coal', hashrate: 480, price: 75 },
];

const RESOURCE_EMOJI = {
  gold: '\u{1F7E1}',
  copper: '\u{1F534}',
  iron: '\u{1F518}',
  rare_metals: '\u269B',
  oil_gas: '\u{1F6E2}',
  diamonds: '\u{1F48E}',
  coal: '\u26AB'
};

const RESOURCE_LABELS = {
  gold: '\u0417\u043E\u043B\u043E\u0442\u043E',
  copper: '\u041C\u0435\u0434\u044C',
  iron: '\u0416\u0435\u043B\u0435\u0437\u043E',
  rare_metals: '\u0420\u0435\u0434\u043A\u0438\u0435 \u043C\u0435\u0442\u0430\u043B\u043B\u044B',
  oil_gas: '\u041D\u0435\u0444\u0442\u044C \u0438 \u0433\u0430\u0437',
  diamonds: '\u0410\u043B\u043C\u0430\u0437\u044B',
  coal: '\u0423\u0433\u043E\u043B\u044C'
};

function getResourceImage(type) {
  const map = {
    gold: '/icons/resources/gold.svg',
    copper: '/icons/resources/copper.svg',
    iron: '/icons/resources/iron.svg',
    rare_metals: '/icons/resources/rare_metals.svg',
    oil_gas: '/icons/resources/oil_gas.svg',
    diamonds: '/icons/resources/diamonds.svg',
    coal: '/icons/resources/coal.svg'
  };
  return map[type] || '/icons/resources/gold.svg';
}

function getDescription(site) {
  const emoji = RESOURCE_EMOJI[site.resourceType] || '';
  const label = RESOURCE_LABELS[site.resourceType] || site.resourceType;
  return `${emoji} ${site.name} — ${label}. ${site.region.replace('_', ' ')} (${site.country}). 1/10 доли месторождения.`;
}

async function seedMiningSites() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding mining sites');

    await Icon.deleteMany({ category: 'mining' });
    console.log('Old mining icons removed');

    const icons = MINING_SITES.map((site, i) => ({
      name: `${RESOURCE_EMOJI[site.resourceType] || ''} ${site.name}`,
      description: getDescription(site),
      imageUrl: getResourceImage(site.resourceType),
      price: site.price,
      category: 'mining',
      resourceType: site.resourceType,
      region: site.region,
      country: site.country,
      lat: site.lat,
      lng: site.lng,
      hashrate: site.hashrate,
      shareLabel: '1/10 доли',
      sortOrder: i + 1
    }));

    await Icon.insertMany(icons);
    console.log(`${icons.length} mining site icons seeded successfully`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedMiningSites();
