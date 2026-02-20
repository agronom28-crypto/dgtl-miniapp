const mongoose = require('mongoose');
const Icon = require('./models/Icon');
require('dotenv').config();

const MINING_SITES = [
  // === NORTH AMERICA (25 sites) ===
  { name: 'Rockdale TX', region: 'north_america', country: 'US', lat: 30.65, lng: -97.0, hashrate: 450, price: 120, emoji: '\u26A1' },
  { name: 'Massena NY', region: 'north_america', country: 'US', lat: 44.93, lng: -74.89, hashrate: 280, price: 95, emoji: '\u26A1' },
  { name: 'Dalton GA', region: 'north_america', country: 'US', lat: 34.77, lng: -84.97, hashrate: 320, price: 105, emoji: '\u26A1' },
  { name: 'Moses Lake WA', region: 'north_america', country: 'US', lat: 47.13, lng: -119.28, hashrate: 510, price: 135, emoji: '\u26A1' },
  { name: 'Wenatchee WA', region: 'north_america', country: 'US', lat: 47.42, lng: -120.31, hashrate: 390, price: 110, emoji: '\u26A1' },
  { name: 'The Dalles OR', region: 'north_america', country: 'US', lat: 45.60, lng: -121.18, hashrate: 280, price: 90, emoji: '\u26A1' },
  { name: 'Plattsburgh NY', region: 'north_america', country: 'US', lat: 44.70, lng: -73.45, hashrate: 210, price: 80, emoji: '\u26A1' },
  { name: 'Limestone TN', region: 'north_america', country: 'US', lat: 36.22, lng: -82.61, hashrate: 180, price: 75, emoji: '\u26A1' },
  { name: 'Cottonwood Falls KS', region: 'north_america', country: 'US', lat: 38.37, lng: -96.54, hashrate: 150, price: 65, emoji: '\u26A1' },
  { name: 'Kearney NE', region: 'north_america', country: 'US', lat: 40.70, lng: -99.08, hashrate: 200, price: 85, emoji: '\u26A1' },
  { name: 'Sheridan WY', region: 'north_america', country: 'US', lat: 44.80, lng: -106.96, hashrate: 170, price: 70, emoji: '\u26A1' },
  { name: 'Bonner MT', region: 'north_america', country: 'US', lat: 46.87, lng: -113.88, hashrate: 140, price: 60, emoji: '\u26A1' },
  { name: 'Miami FL', region: 'north_america', country: 'US', lat: 25.76, lng: -80.19, hashrate: 350, price: 115, emoji: '\u26A1' },
  { name: 'Austin TX', region: 'north_america', country: 'US', lat: 30.27, lng: -97.74, hashrate: 420, price: 125, emoji: '\u26A1' },
  { name: 'Niagara Falls ON', region: 'north_america', country: 'CA', lat: 43.09, lng: -79.07, hashrate: 260, price: 90, emoji: '\u26A1' },
  { name: 'Drumheller AB', region: 'north_america', country: 'CA', lat: 51.46, lng: -112.71, hashrate: 310, price: 100, emoji: '\u26A1' },
  { name: 'Medicine Hat AB', region: 'north_america', country: 'CA', lat: 50.04, lng: -110.68, hashrate: 290, price: 95, emoji: '\u26A1' },
  { name: 'Labrador City NL', region: 'north_america', country: 'CA', lat: 52.95, lng: -66.91, hashrate: 240, price: 85, emoji: '\u26A1' },
  { name: 'Quebec City QC', region: 'north_america', country: 'CA', lat: 46.81, lng: -71.21, hashrate: 380, price: 110, emoji: '\u26A1' },
  { name: 'Prince George BC', region: 'north_america', country: 'CA', lat: 53.92, lng: -122.75, hashrate: 220, price: 80, emoji: '\u26A1' },
  { name: 'Monterrey', region: 'north_america', country: 'MX', lat: 25.67, lng: -100.31, hashrate: 160, price: 70, emoji: '\u26A1' },
  { name: 'Winnipeg MB', region: 'north_america', country: 'CA', lat: 49.90, lng: -97.14, hashrate: 270, price: 90, emoji: '\u26A1' },
  { name: 'Cheyenne WY', region: 'north_america', country: 'US', lat: 41.14, lng: -104.82, hashrate: 190, price: 78, emoji: '\u26A1' },
  { name: 'Reno NV', region: 'north_america', country: 'US', lat: 39.53, lng: -119.81, hashrate: 230, price: 88, emoji: '\u26A1' },
  { name: 'Marquette MI', region: 'north_america', country: 'US', lat: 46.54, lng: -87.40, hashrate: 160, price: 68, emoji: '\u26A1' },
  // === EUROPE (22 sites) ===
  { name: 'Boden', region: 'europe', country: 'SE', lat: 66.06, lng: 21.69, hashrate: 480, price: 130, emoji: '\u2744' },
  { name: 'Lulea', region: 'europe', country: 'SE', lat: 65.58, lng: 22.15, hashrate: 420, price: 120, emoji: '\u2744' },
  { name: 'Reykjavik', region: 'europe', country: 'IS', lat: 64.15, lng: -21.94, hashrate: 550, price: 140, emoji: '\u2744' },
  { name: 'Keflavik', region: 'europe', country: 'IS', lat: 64.0, lng: -22.56, hashrate: 380, price: 110, emoji: '\u2744' },
  { name: 'Mo i Rana', region: 'europe', country: 'NO', lat: 66.31, lng: 14.14, hashrate: 410, price: 115, emoji: '\u2744' },
  { name: 'Narvik', region: 'europe', country: 'NO', lat: 68.43, lng: 17.43, hashrate: 340, price: 105, emoji: '\u2744' },
  { name: 'Bratsk', region: 'russia', country: 'RU', lat: 56.13, lng: 101.61, hashrate: 520, price: 85, emoji: '\u2744' },
  { name: 'Krasnoyarsk', region: 'russia', country: 'RU', lat: 56.01, lng: 92.87, hashrate: 460, price: 80, emoji: '\u2744' },
  { name: 'Irkutsk', region: 'russia', country: 'RU', lat: 52.30, lng: 104.30, hashrate: 490, price: 78, emoji: '\u2744' },
  { name: 'Norilsk', region: 'russia', country: 'RU', lat: 69.35, lng: 88.20, hashrate: 300, price: 70, emoji: '\u2744' },
  { name: 'Helsinki', region: 'europe', country: 'FI', lat: 60.17, lng: 24.94, hashrate: 270, price: 100, emoji: '\u2744' },
  { name: 'Rovaniemi', region: 'europe', country: 'FI', lat: 66.50, lng: 25.72, hashrate: 220, price: 90, emoji: '\u2744' },
  { name: 'Frankfurt', region: 'europe', country: 'DE', lat: 50.11, lng: 8.68, hashrate: 310, price: 110, emoji: '\u2744' },
  { name: 'Zurich', region: 'europe', country: 'CH', lat: 47.38, lng: 8.54, hashrate: 250, price: 105, emoji: '\u2744' },
  { name: 'Tbilisi', region: 'asia', country: 'GE', lat: 41.72, lng: 44.79, hashrate: 180, price: 65, emoji: '\u2744' },
  { name: 'Yerevan', region: 'asia', country: 'AM', lat: 40.18, lng: 44.51, hashrate: 150, price: 58, emoji: '\u2744' },
  { name: 'Mariehamn', region: 'europe', country: 'FI', lat: 60.10, lng: 19.94, hashrate: 130, price: 88, emoji: '\u2744' },
  { name: 'Dublin', region: 'europe', country: 'IE', lat: 53.35, lng: -6.26, hashrate: 200, price: 95, emoji: '\u2744' },
  { name: 'Kouvola', region: 'europe', country: 'FI', lat: 60.87, lng: 26.70, hashrate: 190, price: 85, emoji: '\u2744' },
  { name: 'Amsterdam', region: 'europe', country: 'NL', lat: 52.37, lng: 4.90, hashrate: 280, price: 105, emoji: '\u2744' },
  { name: 'Bucharest', region: 'europe', country: 'RO', lat: 44.43, lng: 26.10, hashrate: 170, price: 68, emoji: '\u2744' },
  // === ASIA (25 sites) ===
  { name: 'Ordos', region: 'asia', country: 'CN', lat: 39.63, lng: 109.78, hashrate: 600, price: 90, emoji: '\uD83C\uDFED' },
  { name: 'Sichuan Kangding', region: 'asia', country: 'CN', lat: 30.05, lng: 101.96, hashrate: 700, price: 75, emoji: '\uD83C\uDFED' },
  { name: 'Xinjiang Urumqi', region: 'asia', country: 'CN', lat: 43.83, lng: 87.62, hashrate: 550, price: 70, emoji: '\uD83C\uDFED' },
  { name: 'Yunnan Qujing', region: 'asia', country: 'CN', lat: 25.49, lng: 103.80, hashrate: 480, price: 68, emoji: '\uD83C\uDFED' },
  { name: 'Inner Mongolia', region: 'asia', country: 'CN', lat: 40.82, lng: 111.66, hashrate: 520, price: 72, emoji: '\uD83C\uDFED' },
  { name: 'Guizhou Guiyang', region: 'asia', country: 'CN', lat: 26.65, lng: 106.63, hashrate: 350, price: 65, emoji: '\uD83C\uDFED' },
  { name: 'Almaty', region: 'asia', country: 'KZ', lat: 43.24, lng: 76.95, hashrate: 420, price: 60, emoji: '\uD83C\uDFED' },
  { name: 'Nur-Sultan', region: 'asia', country: 'KZ', lat: 51.17, lng: 71.47, hashrate: 380, price: 58, emoji: '\uD83C\uDFED' },
  { name: 'Ekibastuz', region: 'asia', country: 'KZ', lat: 51.73, lng: 75.32, hashrate: 450, price: 55, emoji: '\uD83C\uDFED' },
  { name: 'Tashkent', region: 'asia', country: 'UZ', lat: 41.30, lng: 69.28, hashrate: 280, price: 50, emoji: '\uD83C\uDFED' },
  { name: 'Novosibirsk', region: 'russia', country: 'RU', lat: 55.03, lng: 82.92, hashrate: 390, price: 75, emoji: '\uD83C\uDFED' },
  { name: 'Chelyabinsk', region: 'russia', country: 'RU', lat: 55.15, lng: 61.43, hashrate: 310, price: 70, emoji: '\uD83C\uDFED' },
  { name: 'Tokyo', region: 'asia', country: 'JP', lat: 35.68, lng: 139.69, hashrate: 200, price: 130, emoji: '\uD83C\uDFED' },
  { name: 'Seoul', region: 'asia', country: 'KR', lat: 37.57, lng: 126.98, hashrate: 180, price: 120, emoji: '\uD83C\uDFED' },
  { name: 'Bhutan Thimphu', region: 'asia', country: 'BT', lat: 27.47, lng: 89.64, hashrate: 250, price: 45, emoji: '\uD83C\uDFED' },
  { name: 'Laos Vientiane', region: 'asia', country: 'LA', lat: 17.97, lng: 102.63, hashrate: 190, price: 40, emoji: '\uD83C\uDFED' },
  { name: 'Malaysia Johor', region: 'asia', country: 'MY', lat: 1.49, lng: 103.74, hashrate: 230, price: 85, emoji: '\uD83C\uDFED' },
  { name: 'Singapore', region: 'asia', country: 'SG', lat: 1.35, lng: 103.82, hashrate: 160, price: 140, emoji: '\uD83C\uDFED' },
  { name: 'Myanmar Mandalay', region: 'asia', country: 'MM', lat: 21.97, lng: 96.08, hashrate: 140, price: 35, emoji: '\uD83C\uDFED' },
  { name: 'Bishkek', region: 'asia', country: 'KG', lat: 42.87, lng: 74.59, hashrate: 220, price: 48, emoji: '\uD83C\uDFED' },
  { name: 'Dushanbe', region: 'asia', country: 'TJ', lat: 38.56, lng: 68.77, hashrate: 200, price: 42, emoji: '\uD83C\uDFED' },
  { name: 'Ulaanbaatar', region: 'asia', country: 'MN', lat: 47.92, lng: 106.91, hashrate: 170, price: 52, emoji: '\uD83C\uDFED' },
  { name: 'Islamabad', region: 'asia', country: 'PK', lat: 33.69, lng: 73.04, hashrate: 150, price: 55, emoji: '\uD83C\uDFED' },
  { name: 'Hanoi', region: 'asia', country: 'VN', lat: 21.03, lng: 105.85, hashrate: 210, price: 60, emoji: '\uD83C\uDFED' },
  { name: 'Vladivostok', region: 'russia', country: 'RU', lat: 43.12, lng: 131.87, hashrate: 260, price: 72, emoji: '\uD83C\uDFED' },
  // === MIDDLE EAST (12 sites) ===
  { name: 'Abu Dhabi', region: 'asia', country: 'AE', lat: 24.45, lng: 54.65, hashrate: 500, price: 150, emoji: '\uD83C\uDFDC' },
  { name: 'Dubai', region: 'asia', country: 'AE', lat: 25.20, lng: 55.27, hashrate: 450, price: 145, emoji: '\uD83C\uDFDC' },
  { name: 'Ras Al Khaimah', region: 'asia', country: 'AE', lat: 25.79, lng: 55.94, hashrate: 320, price: 125, emoji: '\uD83C\uDFDC' },
  { name: 'Riyadh', region: 'asia', country: 'SA', lat: 24.71, lng: 46.68, hashrate: 380, price: 130, emoji: '\uD83C\uDFDC' },
  { name: 'Dammam', region: 'asia', country: 'SA', lat: 26.43, lng: 50.10, hashrate: 290, price: 110, emoji: '\uD83C\uDFDC' },
  { name: 'Muscat', region: 'asia', country: 'OM', lat: 23.59, lng: 58.38, hashrate: 240, price: 100, emoji: '\uD83C\uDFDC' },
  { name: 'Doha', region: 'asia', country: 'QA', lat: 25.29, lng: 51.53, hashrate: 310, price: 120, emoji: '\uD83C\uDFDC' },
  { name: 'Kuwait City', region: 'asia', country: 'KW', lat: 29.38, lng: 47.99, hashrate: 260, price: 115, emoji: '\uD83C\uDFDC' },
  { name: 'Tehran', region: 'asia', country: 'IR', lat: 35.69, lng: 51.39, hashrate: 350, price: 45, emoji: '\uD83C\uDFDC' },
  { name: 'Isfahan', region: 'asia', country: 'IR', lat: 32.65, lng: 51.68, hashrate: 280, price: 40, emoji: '\uD83C\uDFDC' },
  { name: 'Bahrain Manama', region: 'asia', country: 'BH', lat: 26.23, lng: 50.59, hashrate: 200, price: 105, emoji: '\uD83C\uDFDC' },
  { name: 'Amman', region: 'asia', country: 'JO', lat: 31.95, lng: 35.93, hashrate: 150, price: 80, emoji: '\uD83C\uDFDC' },
  // === SOUTH AMERICA (15 sites) ===
  { name: 'Buenos Aires', region: 'south_america', country: 'AR', lat: -34.60, lng: -58.38, hashrate: 280, price: 70, emoji: '\uD83C\uDF0B' },
  { name: 'Mendoza', region: 'south_america', country: 'AR', lat: -32.89, lng: -68.83, hashrate: 200, price: 60, emoji: '\uD83C\uDF0B' },
  { name: 'Sao Paulo', region: 'south_america', country: 'BR', lat: -23.55, lng: -46.63, hashrate: 350, price: 85, emoji: '\uD83C\uDF0B' },
  { name: 'Manaus', region: 'south_america', country: 'BR', lat: -3.12, lng: -60.02, hashrate: 220, price: 55, emoji: '\uD83C\uDF0B' },
  { name: 'Itaipu', region: 'south_america', country: 'BR', lat: -25.41, lng: -54.59, hashrate: 400, price: 50, emoji: '\uD83C\uDF0B' },
  { name: 'Bogota', region: 'south_america', country: 'CO', lat: 4.71, lng: -74.07, hashrate: 190, price: 65, emoji: '\uD83C\uDF0B' },
  { name: 'Medellin', region: 'south_america', country: 'CO', lat: 6.25, lng: -75.56, hashrate: 170, price: 60, emoji: '\uD83C\uDF0B' },
  { name: 'Santiago', region: 'south_america', country: 'CL', lat: -33.45, lng: -70.67, hashrate: 240, price: 75, emoji: '\uD83C\uDF0B' },
  { name: 'Lima', region: 'south_america', country: 'PE', lat: -12.05, lng: -77.04, hashrate: 160, price: 58, emoji: '\uD83C\uDF0B' },
  { name: 'Caracas', region: 'south_america', country: 'VE', lat: 10.48, lng: -66.90, hashrate: 300, price: 30, emoji: '\uD83C\uDF0B' },
  { name: 'Maracaibo', region: 'south_america', country: 'VE', lat: 10.63, lng: -71.63, hashrate: 250, price: 28, emoji: '\uD83C\uDF0B' },
  { name: 'Quito', region: 'south_america', country: 'EC', lat: -0.18, lng: -78.47, hashrate: 140, price: 52, emoji: '\uD83C\uDF0B' },
  { name: 'Asuncion', region: 'south_america', country: 'PY', lat: -25.26, lng: -57.58, hashrate: 320, price: 35, emoji: '\uD83C\uDF0B' },
  { name: 'Montevideo', region: 'south_america', country: 'UY', lat: -34.88, lng: -56.17, hashrate: 130, price: 72, emoji: '\uD83C\uDF0B' },
  { name: 'La Paz', region: 'south_america', country: 'BO', lat: -16.50, lng: -68.15, hashrate: 110, price: 40, emoji: '\uD83C\uDF0B' },
  // === AFRICA (8 sites) ===
  { name: 'Nairobi', region: 'africa', country: 'KE', lat: -1.29, lng: 36.82, hashrate: 150, price: 55, emoji: '\uD83C\uDF1E' },
  { name: 'Lagos', region: 'africa', country: 'NG', lat: 6.52, lng: 3.38, hashrate: 180, price: 50, emoji: '\uD83C\uDF1E' },
  { name: 'Johannesburg', region: 'africa', country: 'ZA', lat: -26.20, lng: 28.05, hashrate: 220, price: 65, emoji: '\uD83C\uDF1E' },
  { name: 'Cape Town', region: 'africa', country: 'ZA', lat: -33.93, lng: 18.42, hashrate: 190, price: 62, emoji: '\uD83C\uDF1E' },
  { name: 'Cairo', region: 'africa', country: 'EG', lat: 30.04, lng: 31.24, hashrate: 170, price: 48, emoji: '\uD83C\uDF1E' },
  { name: 'Addis Ababa', region: 'africa', country: 'ET', lat: 9.02, lng: 38.75, hashrate: 250, price: 35, emoji: '\uD83C\uDF1E' },
  { name: 'Accra', region: 'africa', country: 'GH', lat: 5.56, lng: -0.19, hashrate: 130, price: 45, emoji: '\uD83C\uDF1E' },
  { name: 'Kinshasa', region: 'africa', country: 'CD', lat: -4.44, lng: 15.27, hashrate: 300, price: 25, emoji: '\uD83C\uDF1E' },
  // === OCEANIA (5 sites) ===
  { name: 'Sydney', region: 'australia', country: 'AU', lat: -33.87, lng: 151.21, hashrate: 200, price: 110, emoji: '\uD83C\uDFDD' },
  { name: 'Melbourne', region: 'australia', country: 'AU', lat: -37.81, lng: 144.96, hashrate: 180, price: 105, emoji: '\uD83C\uDFDD' },
  { name: 'Perth', region: 'australia', country: 'AU', lat: -31.95, lng: 115.86, hashrate: 160, price: 95, emoji: '\uD83C\uDFDD' },
  { name: 'Auckland', region: 'australia', country: 'NZ', lat: -36.85, lng: 174.76, hashrate: 140, price: 90, emoji: '\uD83C\uDFDD' },
  { name: 'Queenstown NZ', region: 'australia', country: 'NZ', lat: -45.03, lng: 168.66, hashrate: 120, price: 85, emoji: '\uD83C\uDFDD' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing icons
    await Icon.deleteMany({});
    console.log('Cleared existing icons');

    const icons = MINING_SITES.map((site, index) => ({
      name: `${site.emoji} ${site.name}`,
      category: site.region,
      price: site.price,
      totalShares: 10,
      availableShares: 10,
      country: site.country,
      lat: site.lat,
      lng: site.lng,
      hashrate: site.hashrate,
      description: `Mining facility in ${site.name}, ${site.country}. Hashrate: ${site.hashrate} PH/s`,
      order: index + 1,
    }));

    await Icon.insertMany(icons);
    console.log(`Seeded ${icons.length} mining sites across ${[...new Set(MINING_SITES.map(s => s.region))].length} regions`);

    // Log stats per region
    const regions = {};
    MINING_SITES.forEach(s => {
      regions[s.region] = (regions[s.region] || 0) + 1;
    });
    console.log('Sites per region:', regions);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
