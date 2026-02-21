const mongoose = require('mongoose');
const Icon = require('./models/Icon');
require('dotenv').config();

const RESOURCE_ICONS = {
  gold: '/icons/resources/gold.svg',
  copper: '/icons/resources/copper.svg',
  iron: '/icons/resources/iron.svg',
  rare_metals: '/icons/resources/rare_metals.svg',
  oil_gas: '/icons/resources/oil_gas.svg',
  diamonds: '/icons/resources/diamonds.svg',
  coal: '/icons/resources/coal.svg',
};

const MINING_SITES = [
// === GOLD (20) ===
{ name: 'Muruntau', continent: 'asia', country: 'UZ', lat: 41.52, lng: 64.57, resourceType: 'gold', hashrate: 700, price: 185, valuationUsd: '$68,000,000,000', description: 'Muruntau, Uzbekistan. Largest open-pit gold mine in the world.' },
{ name: 'Carlin Trend', continent: 'north_america', country: 'US', lat: 40.72, lng: -116.07, resourceType: 'gold', hashrate: 650, price: 170, valuationUsd: '$42,000,000,000', description: 'Carlin Trend, Nevada, USA. Largest gold district in Western Hemisphere.' },
{ name: 'Grasberg', continent: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'gold', hashrate: 750, price: 200, valuationUsd: '$55,000,000,000', description: 'Grasberg, Indonesia. Largest gold mine in the world.' },
{ name: 'Olimpiada', continent: 'russia', country: 'RU', lat: 58.73, lng: 93.65, resourceType: 'gold', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Olimpiada, Krasnoyarsk, Russia. One of largest gold deposits in Russia.' },
{ name: 'Cortez', continent: 'north_america', country: 'US', lat: 40.17, lng: -116.61, resourceType: 'gold', hashrate: 580, price: 150, valuationUsd: '$35,000,000,000', description: 'Cortez Complex, Nevada, USA. Major Barrick Gold operation.' },
{ name: 'Pueblo Viejo', continent: 'north_america', country: 'DO', lat: 19.05, lng: -70.17, resourceType: 'gold', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Pueblo Viejo, Dominican Republic. Largest gold mine in Caribbean.' },
{ name: 'Lihir', continent: 'australia', country: 'PG', lat: -3.12, lng: 152.64, resourceType: 'gold', hashrate: 520, price: 135, valuationUsd: '$31,000,000,000', description: 'Lihir Island, Papua New Guinea. Built inside volcanic crater.' },
{ name: 'Kibali', continent: 'africa', country: 'CD', lat: 3.01, lng: 29.59, resourceType: 'gold', hashrate: 490, price: 125, valuationUsd: '$18,000,000,000', description: 'Kibali, DR Congo. Largest gold mine in Africa.' },
{ name: 'Boddington', continent: 'australia', country: 'AU', lat: -32.75, lng: 116.38, resourceType: 'gold', hashrate: 470, price: 120, valuationUsd: '$24,000,000,000', description: 'Boddington, Western Australia. Largest gold mine in Australia.' },
{ name: 'Loulo-Gounkoto', continent: 'africa', country: 'ML', lat: 14.43, lng: -11.67, resourceType: 'gold', hashrate: 460, price: 115, valuationUsd: '$15,000,000,000', description: 'Loulo-Gounkoto, Mali. Major Barrick Gold complex in West Africa.' },
{ name: 'Cadia Valley', continent: 'australia', country: 'AU', lat: -33.47, lng: 148.99, resourceType: 'gold', hashrate: 450, price: 110, valuationUsd: '$20,000,000,000', description: 'Cadia Valley, NSW, Australia. One of largest underground gold-copper mines.' },
{ name: 'South Deep', continent: 'africa', country: 'ZA', lat: -26.42, lng: 27.67, resourceType: 'gold', hashrate: 440, price: 108, valuationUsd: '$32,000,000,000', description: 'South Deep, South Africa. Worlds largest gold deposit by reserves.' },
{ name: 'Mponeng', continent: 'africa', country: 'ZA', lat: -26.41, lng: 27.42, resourceType: 'gold', hashrate: 430, price: 105, valuationUsd: '$17,000,000,000', description: 'Mponeng, South Africa. Deepest mine in the world at nearly 4km.' },
{ name: 'Canadian Malartic', continent: 'north_america', country: 'CA', lat: 48.13, lng: -78.12, resourceType: 'gold', hashrate: 420, price: 100, valuationUsd: '$14,000,000,000', description: 'Canadian Malartic, Quebec, Canada. Largest open-pit gold mine in Canada.' },
{ name: 'Norte Abierto', continent: 'south_america', country: 'CL', lat: -27.35, lng: -69.27, resourceType: 'gold', hashrate: 500, price: 130, valuationUsd: '$27,000,000,000', description: 'Norte Abierto, Chile. Massive gold-copper project in Atacama Desert.' },
{ name: 'Obuasi', continent: 'africa', country: 'GH', lat: 6.2, lng: -1.67, resourceType: 'gold', hashrate: 380, price: 95, valuationUsd: '$12,000,000,000', description: 'Obuasi, Ghana. One of richest gold mines with over 100 years of history.' },
{ name: 'Detour Lake', continent: 'north_america', country: 'CA', lat: 50.05, lng: -79.7, resourceType: 'gold', hashrate: 400, price: 98, valuationUsd: '$16,000,000,000', description: 'Detour Lake, Ontario, Canada. Large open-pit mine. Reserves over 15M oz.' },
{ name: 'Yanacocha', continent: 'south_america', country: 'PE', lat: -6.98, lng: -78.53, resourceType: 'gold', hashrate: 410, price: 102, valuationUsd: '$19,000,000,000', description: 'Yanacocha, Peru. Largest gold mine in South America.' },
{ name: 'Pascua-Lama', continent: 'south_america', country: 'CL', lat: -29.32, lng: -70.07, resourceType: 'gold', hashrate: 350, price: 90, valuationUsd: '$25,000,000,000', description: 'Pascua-Lama, Chile/Argentina border. Massive cross-border gold-silver project.' },
{ name: 'Olympic Dam', continent: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'gold', hashrate: 480, price: 122, valuationUsd: '$45,000,000,000', description: 'Olympic Dam, South Australia. Worlds largest uranium deposit, also major gold.' },
// === COPPER (20) ===
{ name: 'Escondida', continent: 'south_america', country: 'CL', lat: -24.27, lng: -69.07, resourceType: 'copper', hashrate: 720, price: 190, valuationUsd: '$52,000,000,000', description: 'Escondida, Chile. Worlds largest copper mine.' },
{ name: 'Collahuasi', continent: 'south_america', country: 'CL', lat: -20.98, lng: -68.72, resourceType: 'copper', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Collahuasi, Chile. Third-largest copper mine globally.' },
{ name: 'Kamoa-Kakula', continent: 'africa', country: 'CD', lat: -10.77, lng: 26.32, resourceType: 'copper', hashrate: 680, price: 175, valuationUsd: '$38,000,000,000', description: 'Kamoa-Kakula, DR Congo. Worlds fastest-growing major copper mine.' },
{ name: 'Grasberg Copper', continent: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'copper', hashrate: 700, price: 185, valuationUsd: '$55,000,000,000', description: 'Grasberg, Indonesia. Second-largest copper mine.' },
{ name: 'Tenke Fungurume', continent: 'africa', country: 'CD', lat: -10.62, lng: 26.12, resourceType: 'copper', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Tenke Fungurume, DR Congo. Major copper-cobalt mine.' },
{ name: 'El Teniente', continent: 'south_america', country: 'CL', lat: -34.09, lng: -70.35, resourceType: 'copper', hashrate: 580, price: 148, valuationUsd: '$35,000,000,000', description: 'El Teniente, Chile. Worlds largest underground copper mine.' },
{ name: 'Bingham Canyon', continent: 'north_america', country: 'US', lat: 40.52, lng: -112.15, resourceType: 'copper', hashrate: 560, price: 145, valuationUsd: '$40,000,000,000', description: 'Bingham Canyon, Utah, USA. Largest man-made excavation on Earth.' },
{ name: 'Cerro Verde', continent: 'south_america', country: 'PE', lat: -16.54, lng: -71.6, resourceType: 'copper', hashrate: 530, price: 138, valuationUsd: '$18,000,000,000', description: 'Cerro Verde, Peru. Major open-pit copper-molybdenum mine.' },
{ name: 'Antamina', continent: 'south_america', country: 'PE', lat: -9.54, lng: -77.05, resourceType: 'copper', hashrate: 520, price: 135, valuationUsd: '$20,000,000,000', description: 'Antamina, Peru. One of worlds largest copper-zinc mines.' },
{ name: 'Chuquicamata', continent: 'south_america', country: 'CL', lat: -22.31, lng: -68.9, resourceType: 'copper', hashrate: 650, price: 168, valuationUsd: '$48,000,000,000', description: 'Chuquicamata, Chile. Largest open-pit copper mine by volume.' },
{ name: 'Los Pelambres', continent: 'south_america', country: 'CL', lat: -31.72, lng: -70.5, resourceType: 'copper', hashrate: 480, price: 125, valuationUsd: '$15,000,000,000', description: 'Los Pelambres, Chile. Major open-pit copper-molybdenum mine.' },
{ name: 'Radomiro Tomic', continent: 'south_america', country: 'CL', lat: -22.24, lng: -68.9, resourceType: 'copper', hashrate: 500, price: 130, valuationUsd: '$25,000,000,000', description: 'Radomiro Tomic, Chile. Major Codelco open-pit copper operation.' },
{ name: 'Morenci', continent: 'north_america', country: 'US', lat: 33.07, lng: -109.35, resourceType: 'copper', hashrate: 540, price: 142, valuationUsd: '$30,000,000,000', description: 'Morenci, Arizona, USA. Largest copper mine in North America.' },
{ name: 'Mutanda', continent: 'africa', country: 'CD', lat: -10.87, lng: 25.95, resourceType: 'copper', hashrate: 460, price: 118, valuationUsd: '$12,000,000,000', description: 'Mutanda, DR Congo. One of worlds largest cobalt-copper mines.' },
{ name: 'Kamoto', continent: 'africa', country: 'CD', lat: -10.72, lng: 25.44, resourceType: 'copper', hashrate: 450, price: 115, valuationUsd: '$14,000,000,000', description: 'Kamoto, DR Congo. Historic underground copper-cobalt mine.' },
{ name: 'Sentinel', continent: 'africa', country: 'ZM', lat: -12.78, lng: 25.52, resourceType: 'copper', hashrate: 440, price: 112, valuationUsd: '$10,000,000,000', description: 'Sentinel, Zambia. Modern open-pit copper mine in Zambian Copperbelt.' },
{ name: 'Los Bronces', continent: 'south_america', country: 'CL', lat: -33.15, lng: -70.28, resourceType: 'copper', hashrate: 470, price: 122, valuationUsd: '$22,000,000,000', description: 'Los Bronces, Chile. Major copper mine near Santiago.' },
{ name: 'Las Bambas', continent: 'south_america', country: 'PE', lat: -14.05, lng: -72.32, resourceType: 'copper', hashrate: 510, price: 132, valuationUsd: '$19,000,000,000', description: 'Las Bambas, Peru. One of worlds newest major copper mines.' },
{ name: 'Udokan', continent: 'russia', country: 'RU', lat: 56.49, lng: 118.37, resourceType: 'copper', hashrate: 400, price: 105, valuationUsd: '$16,000,000,000', description: 'Udokan, Russia. Largest undeveloped copper deposit in Russia.' },
{ name: 'Olympic Dam Copper', continent: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'copper', hashrate: 490, price: 128, valuationUsd: '$45,000,000,000', description: 'Olympic Dam, South Australia. Fourth-largest copper deposit globally.' },
// === IRON ORE (20) ===
{ name: 'Carajas', continent: 'south_america', country: 'BR', lat: -6.07, lng: -50.12, resourceType: 'iron', hashrate: 680, price: 175, valuationUsd: '$60,000,000,000', description: 'Carajas, Brazil. Worlds largest iron ore mine by reserves and production.' },
{ name: 'Hamersley Basin', continent: 'australia', country: 'AU', lat: -22.8, lng: 117.6, resourceType: 'iron', hashrate: 650, price: 165, valuationUsd: '$55,000,000,000', description: 'Hamersley Basin, Western Australia. One of worlds largest iron ore regions.' },
{ name: 'Pilbara', continent: 'australia', country: 'AU', lat: -23.35, lng: 119.73, resourceType: 'iron', hashrate: 700, price: 180, valuationUsd: '$70,000,000,000', description: 'Pilbara, Western Australia. Largest iron ore producing region in the world.' },
{ name: 'Kiruna', continent: 'europe', country: 'SE', lat: 67.85, lng: 20.22, resourceType: 'iron', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Kiruna, Sweden. Worlds largest and most modern underground iron ore mine.' },
{ name: 'Sishen', continent: 'africa', country: 'ZA', lat: -27.78, lng: 22.99, resourceType: 'iron', hashrate: 520, price: 135, valuationUsd: '$22,000,000,000', description: 'Sishen, South Africa. One of largest iron ore mines in the world.' },
{ name: 'Lebedinsky', continent: 'russia', country: 'RU', lat: 51.08, lng: 37.46, resourceType: 'iron', hashrate: 480, price: 125, valuationUsd: '$18,000,000,000', description: 'Lebedinsky, Belgorod, Russia. Largest iron ore mine in Russia.' },
{ name: 'Mikhailovsky', continent: 'russia', country: 'RU', lat: 51.55, lng: 37.17, resourceType: 'iron', hashrate: 460, price: 120, valuationUsd: '$16,000,000,000', description: 'Mikhailovsky, Kursk region, Russia. Major iron ore mining complex.' },
{ name: 'Savage River', continent: 'australia', country: 'AU', lat: -41.55, lng: 145.18, resourceType: 'iron', hashrate: 350, price: 90, valuationUsd: '$8,000,000,000', description: 'Savage River, Tasmania, Australia. Iron ore magnetite mine.' },
{ name: 'Krivoy Rog', continent: 'europe', country: 'UA', lat: 47.9, lng: 33.39, resourceType: 'iron', hashrate: 440, price: 115, valuationUsd: '$15,000,000,000', description: 'Krivoy Rog, Ukraine. One of largest iron ore basins in Europe.' },
{ name: 'Itabira', continent: 'south_america', country: 'BR', lat: -19.62, lng: -43.22, resourceType: 'iron', hashrate: 560, price: 145, valuationUsd: '$30,000,000,000', description: 'Itabira, Minas Gerais, Brazil. Major Vale iron ore complex.' },
{ name: 'Minas-Rio', continent: 'south_america', country: 'BR', lat: -18.59, lng: -43.17, resourceType: 'iron', hashrate: 530, price: 138, valuationUsd: '$25,000,000,000', description: 'Minas-Rio, Brazil. Anglo American large iron ore mine with long pipeline.' },
{ name: 'IOC Carol Lake', continent: 'north_america', country: 'CA', lat: 52.95, lng: -66.9, resourceType: 'iron', hashrate: 420, price: 108, valuationUsd: '$12,000,000,000', description: 'IOC Carol Lake, Labrador, Canada. Major North American iron ore mine.' },
{ name: 'Zanaga', continent: 'africa', country: 'CG', lat: -2.85, lng: 13.82, resourceType: 'iron', hashrate: 380, price: 98, valuationUsd: '$10,000,000,000', description: 'Zanaga, Republic of Congo. One of largest undeveloped iron ore deposits in Africa.' },
{ name: 'Simandou', continent: 'africa', country: 'GN', lat: 8.82, lng: -8.83, resourceType: 'iron', hashrate: 600, price: 155, valuationUsd: '$40,000,000,000', description: 'Simandou, Guinea. Worlds largest untapped high-grade iron ore deposit.' },
{ name: 'Mount Newman', continent: 'australia', country: 'AU', lat: -23.37, lng: 119.74, resourceType: 'iron', hashrate: 590, price: 152, valuationUsd: '$35,000,000,000', description: 'Mount Newman, Pilbara, Australia. Major BHP iron ore operation.' },
{ name: 'Chichester Hub', continent: 'australia', country: 'AU', lat: -22.35, lng: 117.62, resourceType: 'iron', hashrate: 540, price: 140, valuationUsd: '$28,000,000,000', description: 'Chichester Hub, Pilbara. Major Fortescue iron ore operation.' },
{ name: 'Kudremukh', continent: 'asia', country: 'IN', lat: 13.22, lng: 75.25, resourceType: 'iron', hashrate: 330, price: 85, valuationUsd: '$6,000,000,000', description: 'Kudremukh, Karnataka, India. Historic large-scale iron ore mine in India.' },
{ name: 'Bailadila', continent: 'asia', country: 'IN', lat: 18.59, lng: 81.35, resourceType: 'iron', hashrate: 360, price: 92, valuationUsd: '$9,000,000,000', description: 'Bailadila, Chhattisgarh, India. NMDC iron ore complex, major exporter.' },
{ name: 'Marra Mamba', continent: 'australia', country: 'AU', lat: -22.92, lng: 117.18, resourceType: 'iron', hashrate: 490, price: 127, valuationUsd: '$17,000,000,000', description: 'Marra Mamba, Pilbara, Australia. Rio Tinto iron ore operation.' },
{ name: 'Baffinland', continent: 'north_america', country: 'CA', lat: 72.47, lng: -79.1, resourceType: 'iron', hashrate: 400, price: 103, valuationUsd: '$11,000,000,000', description: 'Baffinland Mary River, Nunavut, Canada. High-grade iron ore in the Arctic.' },
// === RARE METALS (20) ===
{ name: 'Bayan Obo', continent: 'asia', country: 'CN', lat: 41.77, lng: 109.97, resourceType: 'rare_metals', hashrate: 720, price: 190, valuationUsd: '$80,000,000,000', description: 'Bayan Obo, Inner Mongolia, China. Worlds largest rare earth deposit.' },
{ name: 'Mountain Pass', continent: 'north_america', country: 'US', lat: 35.48, lng: -115.53, resourceType: 'rare_metals', hashrate: 580, price: 150, valuationUsd: '$30,000,000,000', description: 'Mountain Pass, California, USA. Largest rare earth mine outside China.' },
{ name: 'Mount Weld', continent: 'australia', country: 'AU', lat: -27.35, lng: 122.65, resourceType: 'rare_metals', hashrate: 560, price: 145, valuationUsd: '$28,000,000,000', description: 'Mount Weld, Western Australia. Highest-grade rare earth deposit in the world.' },
{ name: 'Lovozero', continent: 'russia', country: 'RU', lat: 67.97, lng: 34.98, resourceType: 'rare_metals', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Lovozero, Kola Peninsula, Russia. Major rare earth and niobium deposit.' },
{ name: 'Tomtor', continent: 'russia', country: 'RU', lat: 69.7, lng: 119.07, resourceType: 'rare_metals', hashrate: 540, price: 140, valuationUsd: '$25,000,000,000', description: 'Tomtor, Yakutia, Russia. Exceptionally rich rare earth and niobium deposit.' },
{ name: 'Kvanefjeld', continent: 'europe', country: 'GL', lat: 60.98, lng: -45.05, resourceType: 'rare_metals', hashrate: 480, price: 125, valuationUsd: '$18,000,000,000', description: 'Kvanefjeld, Greenland. One of worlds largest rare earth projects.' },
{ name: 'Browns Range', continent: 'australia', country: 'AU', lat: -19.08, lng: 128.12, resourceType: 'rare_metals', hashrate: 420, price: 108, valuationUsd: '$12,000,000,000', description: 'Browns Range, Western Australia. Xenotime-rich rare earth deposit.' },
{ name: 'Kipawa', continent: 'north_america', country: 'CA', lat: 46.87, lng: -78.97, resourceType: 'rare_metals', hashrate: 390, price: 100, valuationUsd: '$10,000,000,000', description: 'Kipawa, Quebec, Canada. Yttrium and heavy rare earth deposit.' },
{ name: 'Ngualla', continent: 'africa', country: 'TZ', lat: -8.65, lng: 32.65, resourceType: 'rare_metals', hashrate: 450, price: 115, valuationUsd: '$15,000,000,000', description: 'Ngualla, Tanzania. One of largest rare earth deposits in Africa.' },
{ name: 'Gakara', continent: 'africa', country: 'BI', lat: -3.37, lng: 29.37, resourceType: 'rare_metals', hashrate: 380, price: 98, valuationUsd: '$9,000,000,000', description: 'Gakara, Burundi. High-grade rare earth minerals project in Africa.' },
{ name: 'Nolans Bore', continent: 'australia', country: 'AU', lat: -22.42, lng: 133.27, resourceType: 'rare_metals', hashrate: 430, price: 110, valuationUsd: '$13,000,000,000', description: 'Nolans Bore, Northern Territory, Australia. Apatite-rich rare earth project.' },
{ name: 'Wigu Hill', continent: 'africa', country: 'TZ', lat: -7.28, lng: 36.85, resourceType: 'rare_metals', hashrate: 370, price: 95, valuationUsd: '$8,000,000,000', description: 'Wigu Hill, Tanzania. Carbonatite rare earth project in East Africa.' },
{ name: 'Lynas Mount Weld', continent: 'australia', country: 'AU', lat: -28.05, lng: 122.58, resourceType: 'rare_metals', hashrate: 600, price: 155, valuationUsd: '$35,000,000,000', description: 'Lynas Mount Weld processing, Western Australia. Premier rare earth producer.' },
{ name: 'Zandkopsdrift', continent: 'africa', country: 'ZA', lat: -29.8, lng: 17.58, resourceType: 'rare_metals', hashrate: 360, price: 92, valuationUsd: '$7,500,000,000', description: 'Zandkopsdrift, Northern Cape, South Africa. Bastnaesite rare earth deposit.' },
{ name: 'Eco Ridge', continent: 'north_america', country: 'CA', lat: 46.47, lng: -82.27, resourceType: 'rare_metals', hashrate: 340, price: 88, valuationUsd: '$7,000,000,000', description: 'Eco Ridge, Ontario, Canada. Uranium and rare earth project.' },
{ name: 'Strange Lake', continent: 'north_america', country: 'CA', lat: 56.17, lng: -63.55, resourceType: 'rare_metals', hashrate: 410, price: 105, valuationUsd: '$11,000,000,000', description: 'Strange Lake, Quebec/Labrador, Canada. Heavy rare earth enriched deposit.' },
{ name: 'Songwe Hill', continent: 'africa', country: 'MW', lat: -9.72, lng: 33.85, resourceType: 'rare_metals', hashrate: 350, price: 90, valuationUsd: '$8,500,000,000', description: 'Songwe Hill, Malawi. Carbonatite-hosted rare earth elements project.' },
{ name: 'Charley Creek', continent: 'australia', country: 'AU', lat: -21.88, lng: 134.85, resourceType: 'rare_metals', hashrate: 320, price: 82, valuationUsd: '$6,000,000,000', description: 'Charley Creek, Northern Territory, Australia. Ionic clay rare earth deposit.' },
{ name: 'Bokan Mountain', continent: 'north_america', country: 'US', lat: 55.22, lng: -132.3, resourceType: 'rare_metals', hashrate: 330, price: 85, valuationUsd: '$6,500,000,000', description: 'Bokan Mountain, Alaska, USA. Heavy rare earth uranium deposit.' },
{ name: 'Dubbo', continent: 'australia', country: 'AU', lat: -31.88, lng: 148.6, resourceType: 'rare_metals', hashrate: 460, price: 118, valuationUsd: '$16,000,000,000', description: 'Dubbo, NSW, Australia. Polymetallic rare earth zirconium niobium project.' },
// === OIL & GAS (15) ===
{ name: 'Ghawar', continent: 'asia', country: 'SA', lat: 25.15, lng: 49.48, resourceType: 'oil_gas', hashrate: 800, price: 210, valuationUsd: '$700,000,000,000', description: 'Ghawar, Saudi Arabia. Worlds largest conventional oil field.' },
{ name: 'Burgan', continent: 'asia', country: 'KW', lat: 28.97, lng: 47.95, resourceType: 'oil_gas', hashrate: 720, price: 185, valuationUsd: '$400,000,000,000', description: 'Burgan, Kuwait. Second largest oil field in the world.' },
{ name: 'Safaniya', continent: 'asia', country: 'SA', lat: 27.97, lng: 48.72, resourceType: 'oil_gas', hashrate: 680, price: 175, valuationUsd: '$300,000,000,000', description: 'Safaniya, Saudi Arabia. Worlds largest offshore oil field.' },
{ name: 'Rumaila', continent: 'asia', country: 'IQ', lat: 30.07, lng: 47.52, resourceType: 'oil_gas', hashrate: 650, price: 165, valuationUsd: '$250,000,000,000', description: 'Rumaila, Iraq. One of worlds largest oil fields.' },
{ name: 'Tengiz', continent: 'asia', country: 'KZ', lat: 45.48, lng: 53.03, resourceType: 'oil_gas', hashrate: 620, price: 160, valuationUsd: '$200,000,000,000', description: 'Tengiz, Kazakhstan. Giant oil field on northeastern shore of Caspian Sea.' },
{ name: 'Kashagan', continent: 'asia', country: 'KZ', lat: 45.65, lng: 52.15, resourceType: 'oil_gas', hashrate: 600, price: 155, valuationUsd: '$180,000,000,000', description: 'Kashagan, Kazakhstan. Largest oil field discovered in last 40 years.' },
{ name: 'Priobskoye', continent: 'russia', country: 'RU', lat: 60.87, lng: 69.42, resourceType: 'oil_gas', hashrate: 580, price: 150, valuationUsd: '$160,000,000,000', description: 'Priobskoye, Siberia, Russia. One of Russias largest oil fields.' },
{ name: 'Samotlor', continent: 'russia', country: 'RU', lat: 60.97, lng: 76.45, resourceType: 'oil_gas', hashrate: 560, price: 145, valuationUsd: '$140,000,000,000', description: 'Samotlor, Siberia, Russia. One of the world top ten oil fields.' },
{ name: 'Zakum', continent: 'asia', country: 'AE', lat: 24.47, lng: 53.05, resourceType: 'oil_gas', hashrate: 640, price: 163, valuationUsd: '$220,000,000,000', description: 'Zakum, Abu Dhabi, UAE. Third largest oil field in the Middle East.' },
{ name: 'Cantarell', continent: 'north_america', country: 'MX', lat: 19.82, lng: -91.9, resourceType: 'oil_gas', hashrate: 520, price: 135, valuationUsd: '$100,000,000,000', description: 'Cantarell, Mexico. Giant offshore oil complex in Gulf of Mexico.' },
{ name: 'Prudhoe Bay', continent: 'north_america', country: 'US', lat: 70.2, lng: -148.5, resourceType: 'oil_gas', hashrate: 540, price: 140, valuationUsd: '$120,000,000,000', description: 'Prudhoe Bay, Alaska, USA. Largest oil field in North America.' },
{ name: 'North Field', continent: 'asia', country: 'QA', lat: 25.23, lng: 51.7, resourceType: 'oil_gas', hashrate: 760, price: 195, valuationUsd: '$500,000,000,000', description: 'North Field, Qatar. Worlds largest natural gas field, shared with Iran.' },
{ name: 'Hassi Messaoud', continent: 'africa', country: 'DZ', lat: 31.68, lng: 6.05, resourceType: 'oil_gas', hashrate: 500, price: 130, valuationUsd: '$90,000,000,000', description: 'Hassi Messaoud, Algeria. Largest oil field in Africa.' },
{ name: 'Karachaganak', continent: 'asia', country: 'KZ', lat: 50.93, lng: 53.63, resourceType: 'oil_gas', hashrate: 490, price: 127, valuationUsd: '$80,000,000,000', description: 'Karachaganak, Kazakhstan. Largest gas condensate field in Kazakhstan.' },
{ name: 'Romashkinskoye', continent: 'russia', country: 'RU', lat: 54.53, lng: 52.35, resourceType: 'oil_gas', hashrate: 470, price: 122, valuationUsd: '$70,000,000,000', description: 'Romashkinskoye, Tatarstan, Russia. Giant oil field, one of worlds largest.' },
// === DIAMONDS (10) ===
{ name: 'Jwaneng', continent: 'africa', country: 'BW', lat: -24.6, lng: 24.73, resourceType: 'diamonds', hashrate: 700, price: 180, valuationUsd: '$120,000,000,000', description: 'Jwaneng, Botswana. Richest diamond mine in the world by value.' },
{ name: 'Orapa', continent: 'africa', country: 'BW', lat: -21.3, lng: 25.38, resourceType: 'diamonds', hashrate: 650, price: 165, valuationUsd: '$90,000,000,000', description: 'Orapa, Botswana. Largest diamond mine in the world by area.' },
{ name: 'Mir', continent: 'russia', country: 'RU', lat: 62.53, lng: 113.98, resourceType: 'diamonds', hashrate: 600, price: 155, valuationUsd: '$60,000,000,000', description: 'Mir, Yakutia, Russia. Famous open-pit diamond mine, now underground.' },
{ name: 'Aikhal', continent: 'russia', country: 'RU', lat: 65.95, lng: 111.5, resourceType: 'diamonds', hashrate: 560, price: 145, valuationUsd: '$45,000,000,000', description: 'Aikhal, Yakutia, Russia. Large diamond deposit in Siberia.' },
{ name: 'Ekati', continent: 'north_america', country: 'CA', lat: 64.72, lng: -110.62, resourceType: 'diamonds', hashrate: 520, price: 135, valuationUsd: '$35,000,000,000', description: 'Ekati, Northwest Territories, Canada. First diamond mine in Canada.' },
{ name: 'Diavik', continent: 'north_america', country: 'CA', lat: 64.5, lng: -110.27, resourceType: 'diamonds', hashrate: 500, price: 130, valuationUsd: '$30,000,000,000', description: 'Diavik, Northwest Territories, Canada. Major diamond mine in Canadian subarctic.' },
{ name: 'Venetia', continent: 'africa', country: 'ZA', lat: -22.38, lng: 29.33, resourceType: 'diamonds', hashrate: 480, price: 125, valuationUsd: '$25,000,000,000', description: 'Venetia, Limpopo, South Africa. Largest diamond mine in South Africa.' },
{ name: 'Argyle', continent: 'australia', country: 'AU', lat: -16.72, lng: 128.38, resourceType: 'diamonds', hashrate: 440, price: 115, valuationUsd: '$20,000,000,000', description: 'Argyle, Western Australia. Worlds largest diamond producer by volume, famous for pinks.' },
{ name: 'Catoca', continent: 'africa', country: 'AO', lat: -9.35, lng: 20.22, resourceType: 'diamonds', hashrate: 420, price: 108, valuationUsd: '$15,000,000,000', description: 'Catoca, Angola. Fourth largest diamond mine in the world.' },
{ name: 'Letseng', continent: 'africa', country: 'LS', lat: -29.03, lng: 29.03, resourceType: 'diamonds', hashrate: 380, price: 98, valuationUsd: '$10,000,000,000', description: 'Letseng, Lesotho. Highest-altitude diamond mine, known for large gem stones.' },
// === COAL (5) ===
{ name: 'Kuzbass', continent: 'russia', country: 'RU', lat: 54.07, lng: 86.18, resourceType: 'coal', hashrate: 600, price: 155, valuationUsd: '$200,000,000,000', description: 'Kuzbass, Kemerovo, Russia. Largest coal basin in Russia and one of the world.' },
{ name: 'Powder River Basin', continent: 'north_america', country: 'US', lat: 43.85, lng: -105.5, resourceType: 'coal', hashrate: 580, price: 148, valuationUsd: '$180,000,000,000', description: 'Powder River Basin, Wyoming/Montana, USA. Largest coal producing region in USA.' },
{ name: 'Bowen Basin', continent: 'australia', country: 'AU', lat: -22.42, lng: 148.08, resourceType: 'coal', hashrate: 620, price: 160, valuationUsd: '$220,000,000,000', description: 'Bowen Basin, Queensland, Australia. Worlds premier metallurgical coal region.' },
{ name: 'Jharia', continent: 'asia', country: 'IN', lat: 23.75, lng: 86.42, resourceType: 'coal', hashrate: 500, price: 130, valuationUsd: '$100,000,000,000', description: 'Jharia, Jharkhand, India. Largest coalfield in India, prime coking coal.' },
{ name: 'Shanxi', continent: 'asia', country: 'CN', lat: 37.87, lng: 112.55, resourceType: 'coal', hashrate: 700, price: 180, valuationUsd: '$500,000,000,000', description: 'Shanxi Province, China. Worlds largest coal producing region by output.' },
];

async function seedMiningSites() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Icon.deleteMany({});
    console.log('Cleared existing icons');
    const sites = MINING_SITES.map(site => ({
      ...site,
      imageUrl: RESOURCE_ICONS[site.resourceType] || '/icons/resources/gold.svg',
      share: '1/10',
      isActive: true,
    }));
    await Icon.insertMany(sites);
    console.log(`Seeded ${sites.length} mining sites`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedMiningSites();
