const mongoose = require('mongoose');
const Icon = require('./models/Icon');
require('dotenv').config();

const MINING_SITES = [
  // === GOLD (20 sites) ===
  { name: 'Muruntau', region: 'asia', country: 'UZ', lat: 41.52, lng: 64.57, resourceType: 'gold', hashrate: 700, price: 185, valuationUsd: '$68,000,000,000', description: 'Muruntau, Uzbekistan. Largest open-pit gold mine in the world. Reserves: 150M oz. Pit: 5.5x3.4 km, depth 650m.' },
  { name: 'Carlin Trend', region: 'north_america', country: 'US', lat: 40.72, lng: -116.07, resourceType: 'gold', hashrate: 650, price: 170, valuationUsd: '$42,000,000,000', description: 'Carlin Trend, Nevada, USA. Largest gold-producing district in Western Hemisphere. Over 80M oz produced since 1960s.' },
  { name: 'Grasberg', region: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'gold', hashrate: 750, price: 200, valuationUsd: '$55,000,000,000', description: 'Grasberg, Indonesia. Largest gold mine and second-largest copper mine in the world. Underground at 4,200m elevation.' },
  { name: 'Olimpiada', region: 'russia', country: 'RU', lat: 58.73, lng: 93.65, resourceType: 'gold', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Olimpiada, Krasnoyarsk, Russia. One of the largest gold deposits in Russia. Operated by Polyus. ~1.5M oz/year.' },
  { name: 'Cortez', region: 'north_america', country: 'US', lat: 40.17, lng: -116.61, resourceType: 'gold', hashrate: 580, price: 150, valuationUsd: '$35,000,000,000', description: 'Cortez Complex, Nevada, USA. Major Barrick Gold operation. Reserves exceed 15M oz. Open-pit and underground.' },
  { name: 'Pueblo Viejo', region: 'south_america', country: 'DO', lat: 19.05, lng: -70.17, resourceType: 'gold', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Pueblo Viejo, Dominican Republic. Largest gold mine in the Caribbean. Over 1M oz annual production.' },
  { name: 'Lihir', region: 'australia', country: 'PG', lat: -3.12, lng: 152.64, resourceType: 'gold', hashrate: 520, price: 135, valuationUsd: '$31,000,000,000', description: 'Lihir Island, Papua New Guinea. Built inside a volcanic crater. One of the largest gold deposits globally.' },
  { name: 'Kibali', region: 'africa', country: 'CD', lat: 3.01, lng: 29.59, resourceType: 'gold', hashrate: 490, price: 125, valuationUsd: '$18,000,000,000', description: 'Kibali, DR Congo. Largest gold mine in Africa. Produces over 800K oz annually. Open-pit and underground.' },
  { name: 'Boddington', region: 'australia', country: 'AU', lat: -32.75, lng: 116.38, resourceType: 'gold', hashrate: 470, price: 120, valuationUsd: '$24,000,000,000', description: 'Boddington, Western Australia. Largest gold mine in Australia. Operated by Newmont. ~700K oz/year.' },
  { name: 'Loulo-Gounkoto', region: 'africa', country: 'ML', lat: 14.43, lng: -11.67, resourceType: 'gold', hashrate: 460, price: 115, valuationUsd: '$15,000,000,000', description: 'Loulo-Gounkoto, Mali. Major Barrick Gold complex in West Africa. Produces ~600K oz annually.' },
  { name: 'Cadia Valley', region: 'australia', country: 'AU', lat: -33.47, lng: 148.99, resourceType: 'gold', hashrate: 450, price: 110, valuationUsd: '$20,000,000,000', description: 'Cadia Valley, New South Wales, Australia. One of Australias largest underground gold-copper mines.' },
  { name: 'South Deep', region: 'africa', country: 'ZA', lat: -26.42, lng: 27.67, resourceType: 'gold', hashrate: 440, price: 108, valuationUsd: '$32,000,000,000', description: 'South Deep, South Africa. Worlds largest gold deposit by reserves. Over 32M oz remaining at depths to 3km.' },
  { name: 'Mponeng', region: 'africa', country: 'ZA', lat: -26.41, lng: 27.42, resourceType: 'gold', hashrate: 430, price: 105, valuationUsd: '$17,000,000,000', description: 'Mponeng, South Africa. Deepest mine in the world at nearly 4km. High-grade gold ore body.' },
  { name: 'Canadian Malartic', region: 'north_america', country: 'CA', lat: 48.13, lng: -78.12, resourceType: 'gold', hashrate: 420, price: 100, valuationUsd: '$14,000,000,000', description: 'Canadian Malartic, Quebec, Canada. Largest open-pit gold mine in Canada. ~600K oz/year.' },
  { name: 'Norte Abierto', region: 'south_america', country: 'CL', lat: -27.35, lng: -69.27, resourceType: 'gold', hashrate: 500, price: 130, valuationUsd: '$27,000,000,000', description: 'Norte Abierto (Cerro Casale + Caspiche), Chile. Massive gold-copper project in Atacama Desert.' },
  { name: 'Obuasi', region: 'africa', country: 'GH', lat: 6.2, lng: -1.67, resourceType: 'gold', hashrate: 380, price: 95, valuationUsd: '$12,000,000,000', description: 'Obuasi, Ghana. One of the richest gold mines in the world with over 100 years of production history.' },
  { name: 'Detour Lake', region: 'north_america', country: 'CA', lat: 50.05, lng: -79.7, resourceType: 'gold', hashrate: 400, price: 98, valuationUsd: '$16,000,000,000', description: 'Detour Lake, Ontario, Canada. Large open-pit mine. Reserves over 15M oz. ~700K oz/year production.' },
  { name: 'Yanacocha', region: 'south_america', country: 'PE', lat: -6.98, lng: -78.53, resourceType: 'gold', hashrate: 410, price: 102, valuationUsd: '$19,000,000,000', description: 'Yanacocha, Peru. Largest gold mine in South America. Over 35M oz produced since 1993.' },
  { name: 'Pascua-Lama', region: 'south_america', country: 'CL', lat: -29.32, lng: -70.07, resourceType: 'gold', hashrate: 350, price: 90, valuationUsd: '$25,000,000,000', description: 'Pascua-Lama, Chile/Argentina border. Massive cross-border gold-silver project at 5,000m altitude.' },
  { name: 'Olympic Dam Gold', region: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'gold', hashrate: 480, price: 122, valuationUsd: '$45,000,000,000', description: 'Olympic Dam, South Australia. Worlds largest uranium deposit, also major copper-gold-silver mine.' },
  // === COPPER (20 sites) ===
  { name: 'Escondida', region: 'south_america', country: 'CL', lat: -24.27, lng: -69.07, resourceType: 'copper', hashrate: 720, price: 190, valuationUsd: '$52,000,000,000', description: 'Escondida, Chile. Worlds largest copper mine. Produces ~1.2M tonnes of copper annually.' },
  { name: 'Collahuasi', region: 'south_america', country: 'CL', lat: -20.98, lng: -68.72, resourceType: 'copper', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Collahuasi, Chile. Third-largest copper mine globally. Located at 4,400m in the Andes.' },
  { name: 'Kamoa-Kakula', region: 'africa', country: 'CD', lat: -10.77, lng: 26.32, resourceType: 'copper', hashrate: 680, price: 175, valuationUsd: '$38,000,000,000', description: 'Kamoa-Kakula, DR Congo. Worlds fastest-growing major copper mine. Discovery of the century.' },
  { name: 'Grasberg Copper', region: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'copper', hashrate: 700, price: 185, valuationUsd: '$55,000,000,000', description: 'Grasberg, Indonesia. Second-largest copper mine. Underground block-cave operation at extreme altitude.' },
  { name: 'Tenke Fungurume', region: 'africa', country: 'CD', lat: -10.62, lng: 26.12, resourceType: 'copper', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Tenke Fungurume, DR Congo. Major copper-cobalt mine. One of the highest-grade copper deposits.' },
  { name: 'El Teniente', region: 'south_america', country: 'CL', lat: -34.09, lng: -70.35, resourceType: 'copper', hashrate: 580, price: 148, valuationUsd: '$35,000,000,000', description: 'El Teniente, Chile. Worlds largest underground copper mine. Operated by Codelco since 1905.' },
  { name: 'Bingham Canyon', region: 'north_america', country: 'US', lat: 40.52, lng: -112.15, resourceType: 'copper', hashrate: 560, price: 145, valuationUsd: '$40,000,000,000', description: 'Bingham Canyon, Utah, USA. Largest man-made excavation on Earth. Over 19M tonnes copper extracted.' },
  { name: 'Cerro Verde', region: 'south_america', country: 'PE', lat: -16.54, lng: -71.6, resourceType: 'copper', hashrate: 530, price: 138, valuationUsd: '$18,000,000,000', description: 'Cerro Verde, Peru. Major open-pit copper-molybdenum mine near Arequipa.' },
  { name: 'Antamina', region: 'south_america', country: 'PE', lat: -9.54, lng: -77.05, resourceType: 'copper', hashrate: 520, price: 135, valuationUsd: '$20,000,000,000', description: 'Antamina, Peru. One of worlds largest copper-zinc mines. Located at 4,300m in the Andes.' },
  { name: 'Chuquicamata', region: 'south_america', country: 'CL', lat: -22.31, lng: -68.9, resourceType: 'copper', hashrate: 650, price: 168, valuationUsd: '$48,000,000,000', description: 'Chuquicamata, Chile. Largest open-pit copper mine by volume. Over 100 years of mining history.' },
  { name: 'Los Pelambres', region: 'south_america', country: 'CL', lat: -31.72, lng: -70.5, resourceType: 'copper', hashrate: 480, price: 125, valuationUsd: '$15,000,000,000', description: 'Los Pelambres, Chile. Major open-pit copper-molybdenum mine in Coquimbo region.' },
  { name: 'Radomiro Tomic', region: 'south_america', country: 'CL', lat: -22.24, lng: -68.9, resourceType: 'copper', hashrate: 500, price: 130, valuationUsd: '$25,000,000,000', description: 'Radomiro Tomic, Chile. Adjacent to Chuquicamata. Major Codelco open-pit copper operation.' },
  { name: 'Morenci', region: 'north_america', country: 'US', lat: 33.07, lng: -109.35, resourceType: 'copper', hashrate: 540, price: 142, valuationUsd: '$30,000,000,000', description: 'Morenci, Arizona, USA. Largest copper mine in North America. Operated by Freeport-McMoRan.' },
  { name: 'Mutanda', region: 'africa', country: 'CD', lat: -10.87, lng: 25.95, resourceType: 'copper', hashrate: 460, price: 118, valuationUsd: '$12,000,000,000', description: 'Mutanda, DR Congo. One of worlds largest cobalt-copper mines. Rich oxide copper ores.' },
  { name: 'Kamoto', region: 'africa', country: 'CD', lat: -10.72, lng: 25.44, resourceType: 'copper', hashrate: 450, price: 115, valuationUsd: '$14,000,000,000', description: 'Kamoto, DR Congo. Historic underground copper-cobalt mine in the Katanga Copperbelt.' },
  { name: 'Sentinel', region: 'africa', country: 'ZM', lat: -12.78, lng: 25.52, resourceType: 'copper', hashrate: 440, price: 112, valuationUsd: '$10,000,000,000', description: 'Sentinel, Zambia. Modern open-pit copper mine. One of the largest in the Zambian Copperbelt.' },
  { name: 'Los Bronces', region: 'south_america', country: 'CL', lat: -33.15, lng: -70.28, resourceType: 'copper', hashrate: 470, price: 122, valuationUsd: '$22,000,000,000', description: 'Los Bronces, Chile. Major Anglo American copper mine near Santiago at 3,500m elevation.' },
  { name: 'Las Bambas', region: 'south_america', country: 'PE', lat: -14.05, lng: -72.32, resourceType: 'copper', hashrate: 510, price: 132, valuationUsd: '$19,000,000,000', description: 'Las Bambas, Peru. One of worlds newest major copper mines. ~400K tonnes/year production.' },
  { name: 'Udokan', region: 'russia', country: 'RU', lat: 56.49, lng: 118.37, resourceType: 'copper', hashrate: 400, price: 105, valuationUsd: '$16,000,000,000', description: 'Udokan, Zabaykalsky, Russia. Largest undeveloped copper deposit in Russia. Reserves ~26M tonnes.' },
  { name: 'Olympic Dam Copper', region: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'copper', hashrate: 490, price: 128, valuationUsd: '$45,000,000,000', description: 'Olympic Dam, South Australia. Fourth-largest copper deposit globally. Also produces uranium and gold.' },
  // === IRON (15 sites) ===
  { name: 'Carajas', region: 'south_america', country: 'BR', lat: -6.07, lng: -50.17, resourceType: 'iron', hashrate: 750, price: 160, valuationUsd: '$75,000,000,000', description: 'Carajas, Brazil. Worlds largest iron ore mine. Operated by Vale. Reserves over 7 billion tonnes.' },
  { name: 'Hamersley', region: 'australia', country: 'AU', lat: -22.32, lng: 118.37, resourceType: 'iron', hashrate: 700, price: 150, valuationUsd: '$60,000,000,000', description: 'Hamersley Basin, Western Australia. Rio Tinto flagship iron ore operations. Massive Pilbara deposits.' },
  { name: 'Pilbara', region: 'australia', country: 'AU', lat: -21.95, lng: 118.85, resourceType: 'iron', hashrate: 680, price: 145, valuationUsd: '$85,000,000,000', description: 'Pilbara Region, Western Australia. Contains the largest iron ore reserves on Earth. Multiple mega-mines.' },
  { name: 'Kiruna', region: 'europe', country: 'SE', lat: 67.86, lng: 20.22, resourceType: 'iron', hashrate: 620, price: 135, valuationUsd: '$30,000,000,000', description: 'Kiruna, Sweden. Largest underground iron ore mine in the world. The city is being relocated due to mining.' },
  { name: 'Mikhailovsky GOK', region: 'russia', country: 'RU', lat: 52.22, lng: 35.39, resourceType: 'iron', hashrate: 580, price: 125, valuationUsd: '$18,000,000,000', description: 'Mikhailovsky GOK, Kursk, Russia. Major iron ore producer in the Kursk Magnetic Anomaly region.' },
  { name: 'Stoilensky GOK', region: 'russia', country: 'RU', lat: 51.32, lng: 37.85, resourceType: 'iron', hashrate: 560, price: 120, valuationUsd: '$15,000,000,000', description: 'Stoilensky GOK, Belgorod, Russia. Large open-pit iron ore mine. Part of NLMK Group.' },
  { name: 'Lebedinsky GOK', region: 'russia', country: 'RU', lat: 51.37, lng: 37.73, resourceType: 'iron', hashrate: 600, price: 130, valuationUsd: '$20,000,000,000', description: 'Lebedinsky GOK, Russia. Largest open-pit mine in the CIS. Guinness World Record pit dimensions.' },
  { name: 'Minas Gerais', region: 'south_america', country: 'BR', lat: -19.92, lng: -43.94, resourceType: 'iron', hashrate: 650, price: 140, valuationUsd: '$55,000,000,000', description: 'Iron Quadrangle, Minas Gerais, Brazil. Historic iron ore mining region. Multiple massive deposits.' },
  { name: 'Simandou', region: 'africa', country: 'GN', lat: -8.58, lng: -8.92, resourceType: 'iron', hashrate: 540, price: 115, valuationUsd: '$42,000,000,000', description: 'Simandou, Guinea. Worlds largest untapped high-grade iron ore deposit. Over 2 billion tonnes reserves.' },
  { name: 'Sishen', region: 'africa', country: 'ZA', lat: -27.73, lng: 22.98, resourceType: 'iron', hashrate: 520, price: 110, valuationUsd: '$14,000,000,000', description: 'Sishen, South Africa. One of the largest open-pit mines in the world. High-grade hematite ore.' },
  { name: 'Mount Whaleback', region: 'australia', country: 'AU', lat: -23.36, lng: 119.67, resourceType: 'iron', hashrate: 500, price: 105, valuationUsd: '$25,000,000,000', description: 'Mount Whaleback, Western Australia. BHP flagship iron ore mine. Largest single-pit open-cut mine in Pilbara.' },
  { name: 'Roy Hill', region: 'australia', country: 'AU', lat: -22.58, lng: 119.95, resourceType: 'iron', hashrate: 480, price: 100, valuationUsd: '$22,000,000,000', description: 'Roy Hill, Western Australia. Modern high-capacity iron ore mine. Produces 60M tonnes/year.' },
  { name: 'Chichester Hub', region: 'australia', country: 'AU', lat: -22.05, lng: 118.62, resourceType: 'iron', hashrate: 470, price: 98, valuationUsd: '$18,000,000,000', description: 'Chichester Hub, Western Australia. Fortescue Metals Group operations. Major Pilbara iron ore hub.' },
  { name: 'Carol Lake', region: 'north_america', country: 'CA', lat: 52.95, lng: -66.87, resourceType: 'iron', hashrate: 450, price: 95, valuationUsd: '$12,000,000,000', description: 'Carol Lake (Labrador Trough), Canada. Major iron ore deposit in Labrador. IOC operations.' },
  { name: 'Kovdorsky GOK', region: 'russia', country: 'RU', lat: 67.56, lng: 30.47, resourceType: 'iron', hashrate: 430, price: 90, valuationUsd: '$8,000,000,000', description: 'Kovdorsky GOK, Murmansk, Russia. Unique iron-apatite-baddeleyite deposit above the Arctic Circle.' },
  // === RARE METALS (15 sites) ===
  { name: 'Bayan Obo', region: 'asia', country: 'CN', lat: 41.8, lng: 109.97, resourceType: 'rare_metals', hashrate: 800, price: 250, valuationUsd: '$120,000,000,000', description: 'Bayan Obo, Inner Mongolia, China. Worlds largest rare earth mine. Supplies ~60% of global rare earths.' },
  { name: 'Mount Weld', region: 'australia', country: 'AU', lat: -28.77, lng: 122.55, resourceType: 'rare_metals', hashrate: 700, price: 220, valuationUsd: '$35,000,000,000', description: 'Mount Weld, Western Australia. Richest known rare earth deposit. Operated by Lynas Rare Earths.' },
  { name: 'Mountain Pass', region: 'north_america', country: 'US', lat: 35.47, lng: -115.53, resourceType: 'rare_metals', hashrate: 650, price: 200, valuationUsd: '$28,000,000,000', description: 'Mountain Pass, California, USA. Only active rare earth mine in the US. Critical for defense supply chain.' },
  { name: 'Lovozero', region: 'russia', country: 'RU', lat: 67.89, lng: 34.78, resourceType: 'rare_metals', hashrate: 600, price: 185, valuationUsd: '$22,000,000,000', description: 'Lovozero, Kola Peninsula, Russia. Major source of loparite ore, rich in rare earth elements and niobium.' },
  { name: 'Tomtor', region: 'russia', country: 'RU', lat: 71.15, lng: 116.35, resourceType: 'rare_metals', hashrate: 580, price: 175, valuationUsd: '$45,000,000,000', description: 'Tomtor, Yakutia, Russia. One of the richest rare earth and niobium deposits in the world. Arctic location.' },
  { name: 'Nolans', region: 'australia', country: 'AU', lat: -22.59, lng: 133.24, resourceType: 'rare_metals', hashrate: 550, price: 165, valuationUsd: '$18,000,000,000', description: 'Nolans, Northern Territory, Australia. Significant rare earth-phosphate deposit. Advanced development.' },
  { name: 'Steenkampskraal', region: 'africa', country: 'ZA', lat: -31.3, lng: 18.95, resourceType: 'rare_metals', hashrate: 520, price: 155, valuationUsd: '$12,000,000,000', description: 'Steenkampskraal, Western Cape, South Africa. High-grade monazite rare earth deposit.' },
  { name: 'Kvanefjeld', region: 'europe', country: 'GL', lat: 60.98, lng: -45.98, resourceType: 'rare_metals', hashrate: 500, price: 148, valuationUsd: '$30,000,000,000', description: 'Kvanefjeld, Greenland. One of worlds largest undeveloped rare earth deposits. Also contains uranium.' },
  { name: 'Brown Range', region: 'australia', country: 'AU', lat: -19.12, lng: 127.89, resourceType: 'rare_metals', hashrate: 480, price: 140, valuationUsd: '$10,000,000,000', description: 'Brown Range, Western Australia. Heavy rare earth deposit. Rich in dysprosium and other critical elements.' },
  { name: 'Songwe Hill', region: 'africa', country: 'MW', lat: -10.47, lng: 35.62, resourceType: 'rare_metals', hashrate: 460, price: 135, valuationUsd: '$8,000,000,000', description: 'Songwe Hill, Malawi. Rare earth and strontium deposit. One of the most advanced RE projects in Africa.' },
  { name: 'Round Top', region: 'north_america', country: 'US', lat: 31.35, lng: -105.52, resourceType: 'rare_metals', hashrate: 440, price: 128, valuationUsd: '$15,000,000,000', description: 'Round Top, Texas, USA. Massive heavy rare earth deposit. Contains 16 of 17 rare earth elements.' },
  { name: 'Wicheeda', region: 'north_america', country: 'CA', lat: 54.22, lng: -122.17, resourceType: 'rare_metals', hashrate: 420, price: 120, valuationUsd: '$9,000,000,000', description: 'Wicheeda, British Columbia, Canada. Advanced rare earth project. High-grade carbonatite deposit.' },
  { name: 'Ngualla', region: 'africa', country: 'TZ', lat: -7.94, lng: 31.59, resourceType: 'rare_metals', hashrate: 400, price: 115, valuationUsd: '$7,000,000,000', description: 'Ngualla, Tanzania. Worlds fifth-largest rare earth deposit. High-grade bastnaesite mineralization.' },
  { name: 'Zandkopsdrift', region: 'africa', country: 'ZA', lat: -31.23, lng: 18.08, resourceType: 'rare_metals', hashrate: 380, price: 108, valuationUsd: '$6,000,000,000', description: 'Zandkopsdrift, South Africa. Emerging rare earth deposit in the Northern Cape province.' },
  { name: 'Dubbo', region: 'australia', country: 'AU', lat: -32.25, lng: 148.61, resourceType: 'rare_metals', hashrate: 360, price: 100, valuationUsd: '$11,000,000,000', description: 'Dubbo, New South Wales, Australia. Polymetallic deposit with rare earths, zirconium and niobium.' },
  // === OIL & GAS (20 sites) ===
  { name: 'Ghawar', region: 'asia', country: 'SA', lat: 25.37, lng: 49.4, resourceType: 'oil_gas', hashrate: 900, price: 300, valuationUsd: '$12,500,000,000,000', description: 'Ghawar, Saudi Arabia. Largest conventional oil field in the world. Reserves ~48B barrels. 3.8M bbl/day.' },
  { name: 'Burgan', region: 'asia', country: 'KW', lat: 28.98, lng: 47.65, resourceType: 'oil_gas', hashrate: 850, price: 280, valuationUsd: '$6,800,000,000,000', description: 'Greater Burgan, Kuwait. Second-largest oil field in the world. Reserves ~70B barrels total.' },
  { name: 'Safaniya', region: 'asia', country: 'SA', lat: 28.17, lng: 48.75, resourceType: 'oil_gas', hashrate: 800, price: 260, valuationUsd: '$2,500,000,000,000', description: 'Safaniya, Saudi Arabia. Worlds largest offshore oil field. Reserves ~37B barrels.' },
  { name: 'Rumaila', region: 'asia', country: 'IQ', lat: 30.53, lng: 47.33, resourceType: 'oil_gas', hashrate: 780, price: 245, valuationUsd: '$1,200,000,000,000', description: 'Rumaila, Iraq. Third-largest oil field globally. Reserves ~17B barrels. 1.5M bbl/day production.' },
  { name: 'Priobskoye', region: 'russia', country: 'RU', lat: 61.05, lng: 70.18, resourceType: 'oil_gas', hashrate: 750, price: 230, valuationUsd: '$450,000,000,000', description: 'Priobskoye, Western Siberia, Russia. One of Russias largest oil fields. Rosneft operation.' },
  { name: 'Samotlor', region: 'russia', country: 'RU', lat: 61.18, lng: 76.73, resourceType: 'oil_gas', hashrate: 720, price: 215, valuationUsd: '$900,000,000,000', description: 'Samotlor, Tyumen, Russia. Sixth-largest oil field ever discovered. Over 2.7B tonnes produced.' },
  { name: 'Prudhoe Bay', region: 'north_america', country: 'US', lat: 70.25, lng: -148.34, resourceType: 'oil_gas', hashrate: 700, price: 200, valuationUsd: '$800,000,000,000', description: 'Prudhoe Bay, Alaska, USA. Largest oil field in North America. Over 13B barrels produced.' },
  { name: 'Cantarell', region: 'north_america', country: 'MX', lat: 19.88, lng: -91.95, resourceType: 'oil_gas', hashrate: 680, price: 190, valuationUsd: '$500,000,000,000', description: 'Cantarell, Gulf of Mexico, Mexico. Major offshore oil field complex. Peak 2.1M bbl/day.' },
  { name: 'Kashagan', region: 'asia', country: 'KZ', lat: 46.25, lng: 51.45, resourceType: 'oil_gas', hashrate: 660, price: 185, valuationUsd: '$1,500,000,000,000', description: 'Kashagan, Caspian Sea, Kazakhstan. Largest oil discovery in 40 years. Reserves ~13B barrels.' },
  { name: 'Tupi (Lula)', region: 'south_america', country: 'BR', lat: -25.32, lng: -42.79, resourceType: 'oil_gas', hashrate: 640, price: 175, valuationUsd: '$700,000,000,000', description: 'Lula (Tupi), Santos Basin, Brazil. Largest deep-water pre-salt discovery. ~8B barrels reserves.' },
  { name: 'Tengiz', region: 'asia', country: 'KZ', lat: 46.15, lng: 53.35, resourceType: 'oil_gas', hashrate: 620, price: 170, valuationUsd: '$600,000,000,000', description: 'Tengiz, Kazakhstan. Super-giant oil field. Operated by Chevron. Reserves ~6-9B barrels.' },
  { name: 'Zakum', region: 'asia', country: 'AE', lat: 24.83, lng: 53.55, resourceType: 'oil_gas', hashrate: 600, price: 165, valuationUsd: '$1,000,000,000,000', description: 'Upper Zakum, Abu Dhabi, UAE. Fourth-largest oil field in the world. Reserves ~50B barrels.' },
  { name: 'Hassi Messaoud', region: 'africa', country: 'DZ', lat: 31.67, lng: 6.07, resourceType: 'oil_gas', hashrate: 580, price: 155, valuationUsd: '$350,000,000,000', description: 'Hassi Messaoud, Algeria. Largest oil field in Africa. Over 60 years of production history.' },
  { name: 'Agbami', region: 'africa', country: 'NG', lat: 4.18, lng: 4.82, resourceType: 'oil_gas', hashrate: 560, price: 148, valuationUsd: '$200,000,000,000', description: 'Agbami, Nigeria. Major deepwater oil field in Gulf of Guinea. Peak ~250K bbl/day.' },
  { name: 'Shaybah', region: 'asia', country: 'SA', lat: 22.52, lng: 54.0, resourceType: 'oil_gas', hashrate: 540, price: 140, valuationUsd: '$1,100,000,000,000', description: 'Shaybah, Rub al-Khali, Saudi Arabia. Remote desert field with ~15B barrels. Fully automated operations.' },
  { name: 'Vankor', region: 'russia', country: 'RU', lat: 67.83, lng: 83.58, resourceType: 'oil_gas', hashrate: 520, price: 135, valuationUsd: '$280,000,000,000', description: 'Vankor, Krasnoyarsk, Russia. Largest oil discovery in Russia in 25 years. Arctic conditions.' },
  { name: 'Marlim', region: 'south_america', country: 'BR', lat: -22.37, lng: -40.02, resourceType: 'oil_gas', hashrate: 500, price: 128, valuationUsd: '$250,000,000,000', description: 'Marlim, Campos Basin, Brazil. Giant deepwater oil field. Petrobras flagship operation.' },
  { name: 'Buzzard', region: 'europe', country: 'GB', lat: 57.48, lng: 1.08, resourceType: 'oil_gas', hashrate: 480, price: 120, valuationUsd: '$150,000,000,000', description: 'Buzzard, North Sea, UK. Largest North Sea oil discovery in a decade. CNOOC operation.' },
  { name: 'Karachaganak', region: 'asia', country: 'KZ', lat: 50.17, lng: 51.8, resourceType: 'oil_gas', hashrate: 460, price: 115, valuationUsd: '$400,000,000,000', description: 'Karachaganak, Kazakhstan. Major oil and gas condensate field. Reserves ~9B barrels equivalent.' },
  { name: 'Jack-2', region: 'north_america', country: 'US', lat: 26.68, lng: -89.67, resourceType: 'oil_gas', hashrate: 440, price: 108, valuationUsd: '$180,000,000,000', description: 'Jack field, Gulf of Mexico, USA. Ultra-deepwater discovery. Up to 15B barrels potential.' },
  // === DIAMONDS (10 sites) ===
  { name: 'Jwaneng', region: 'africa', country: 'BW', lat: -24.53, lng: 24.73, resourceType: 'diamonds', hashrate: 850, price: 350, valuationUsd: '$96,000,000,000', description: 'Jwaneng, Botswana. Richest diamond mine in the world by value. Over $96B revenue since 1982.' },
  { name: 'Orapa', region: 'africa', country: 'BW', lat: -21.31, lng: 25.37, resourceType: 'diamonds', hashrate: 780, price: 300, valuationUsd: '$45,000,000,000', description: 'Orapa, Botswana. Largest diamond mine by area in the world. Debswana operation since 1971.' },
  { name: 'Udachny', region: 'russia', country: 'RU', lat: 66.43, lng: 112.35, resourceType: 'diamonds', hashrate: 750, price: 280, valuationUsd: '$35,000,000,000', description: 'Udachny, Yakutia, Russia. Major ALROSA diamond mine. Underground at 600m+ depth in permafrost.' },
  { name: 'Catoca', region: 'africa', country: 'AO', lat: -9.22, lng: 20.2, resourceType: 'diamonds', hashrate: 700, price: 250, valuationUsd: '$28,000,000,000', description: 'Catoca, Angola. Fourth-largest kimberlite pipe in the world. ~6.8M carats annual production.' },
  { name: 'Mirny', region: 'russia', country: 'RU', lat: 62.54, lng: 113.96, resourceType: 'diamonds', hashrate: 680, price: 240, valuationUsd: '$55,000,000,000', description: 'Mirny, Yakutia, Russia. Legendary diamond mine with iconic 525m deep open pit. Over $17B diamonds extracted.' },
  { name: 'Argyle', region: 'australia', country: 'AU', lat: -16.72, lng: 128.39, resourceType: 'diamonds', hashrate: 650, price: 220, valuationUsd: '$30,000,000,000', description: 'Argyle, Western Australia. Former worlds largest producer of natural diamonds. Famous pink diamonds.' },
  { name: 'Venetia', region: 'africa', country: 'ZA', lat: -22.43, lng: 29.32, resourceType: 'diamonds', hashrate: 620, price: 200, valuationUsd: '$22,000,000,000', description: 'Venetia, Limpopo, South Africa. De Beers largest mine. Transitioning to underground ~$2.3B investment.' },
  { name: 'Diavik', region: 'north_america', country: 'CA', lat: 64.5, lng: -110.28, resourceType: 'diamonds', hashrate: 600, price: 190, valuationUsd: '$18,000,000,000', description: 'Diavik, Northwest Territories, Canada. Island diamond mine. Over 100M carats produced.' },
  { name: 'Ekati', region: 'north_america', country: 'CA', lat: 64.72, lng: -110.62, resourceType: 'diamonds', hashrate: 580, price: 175, valuationUsd: '$15,000,000,000', description: 'Ekati, Northwest Territories, Canada. First diamond mine in Canada (1998). Multiple kimberlite pipes.' },
  { name: 'Grib', region: 'russia', country: 'RU', lat: 64.98, lng: 40.45, resourceType: 'diamonds', hashrate: 550, price: 160, valuationUsd: '$12,000,000,000', description: 'Grib (Verkhotina), Arkhangelsk, Russia. Major diamond pipe. ~4.5M carats/year. High gem-quality share.' },
  // === COAL (10 sites) ===
  { name: 'Kuzbass', region: 'russia', country: 'RU', lat: 54.0, lng: 86.97, resourceType: 'coal', hashrate: 700, price: 120, valuationUsd: '$180,000,000,000', description: 'Kuzbass (Kuznetsk Basin), Russia. Largest coal mining region in Russia. Over 200M tonnes/year.' },
  { name: 'Powder River Basin', region: 'north_america', country: 'US', lat: 44.78, lng: -105.5, resourceType: 'coal', hashrate: 680, price: 115, valuationUsd: '$150,000,000,000', description: 'Powder River Basin, Wyoming, USA. Largest coal-producing region in the US. ~40% of US coal production.' },
  { name: 'Hunter Valley', region: 'australia', country: 'AU', lat: -32.37, lng: 151.08, resourceType: 'coal', hashrate: 650, price: 110, valuationUsd: '$120,000,000,000', description: 'Hunter Valley, NSW, Australia. Australias main coal export region. Premium thermal and coking coal.' },
  { name: 'Kalimantan', region: 'asia', country: 'ID', lat: -1.68, lng: 116.42, resourceType: 'coal', hashrate: 620, price: 105, valuationUsd: '$100,000,000,000', description: 'Kalimantan, Indonesia. Major coal producing island. Indonesia is worlds largest thermal coal exporter.' },
  { name: 'Mpumalanga', region: 'africa', country: 'ZA', lat: -25.77, lng: 29.45, resourceType: 'coal', hashrate: 600, price: 100, valuationUsd: '$85,000,000,000', description: 'Mpumalanga, South Africa. Produces ~80% of South Africas coal. Major energy source for ESKOM.' },
  { name: 'Shanxi Basin', region: 'asia', country: 'CN', lat: 37.87, lng: 112.55, resourceType: 'coal', hashrate: 580, price: 95, valuationUsd: '$250,000,000,000', description: 'Shanxi Province, China. Worlds largest coal-producing region. Over 1 billion tonnes/year.' },
  { name: 'Cerrejon', region: 'south_america', country: 'CO', lat: 10.97, lng: -72.65, resourceType: 'coal', hashrate: 550, price: 90, valuationUsd: '$60,000,000,000', description: 'Cerrejon, Colombia. Largest open-pit coal mine in Latin America. Thermal coal for export.' },
  { name: 'Bowen Basin', region: 'australia', country: 'AU', lat: -22.08, lng: 148.17, resourceType: 'coal', hashrate: 530, price: 85, valuationUsd: '$130,000,000,000', description: 'Bowen Basin, Queensland, Australia. Major coking coal region. Supplies global steel industry.' },
  { name: 'Ekibastuz', region: 'asia', country: 'KZ', lat: 51.72, lng: 75.32, resourceType: 'coal', hashrate: 500, price: 80, valuationUsd: '$40,000,000,000', description: 'Ekibastuz, Kazakhstan. One of largest coal basins in the world. Major thermal coal producer.' },
  { name: 'Tavan Tolgoi', region: 'asia', country: 'MN', lat: 43.58, lng: 105.95, resourceType: 'coal', hashrate: 480, price: 75, valuationUsd: '$55,000,000,000', description: 'Tavan Tolgoi, Mongolia. One of worlds largest untapped coking coal deposits. ~6.4B tonnes reserves.' },
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
  gold: 'Золото',
  copper: 'Медь',
  iron: 'Железо',
  rare_metals: 'Редкие металлы',
  oil_gas: 'Нефть и газ',
  diamonds: 'Алмазы',
  coal: 'Уголь'
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

async function seedMiningSites() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding mining sites');

    await Icon.deleteMany({ category: 'mining' });
    console.log('Old mining icons removed');

    const icons = MINING_SITES.map((site, i) => ({
      name: `${RESOURCE_EMOJI[site.resourceType] || ''} ${site.name}`,
      description: site.description || '',
      imageUrl: getResourceImage(site.resourceType),
      price: site.price,
      valuationUsd: site.valuationUsd || '',
      category: 'mining',
      resourceType: site.resourceType,
      continent: site.region,
      country: site.country,
      lat: site.lat,
      lng: site.lng,
      hashrate: site.hashrate,
      shareLabel: '',
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
