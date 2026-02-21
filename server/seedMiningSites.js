const mongoose = require('mongoose');
const Icon = require('./models/Icon');
require('dotenv').config();

const MINING_SITES = [
// === GOLD (20) ===
{ name: 'Muruntau', continent: 'asia', country: 'UZ', lat: 41.52, lng: 64.57, resourceType: 'gold', hashrate: 700, price: 185, valuationUsd: '$68,000,000,000', description: 'Muruntau, Uzbekistan. Largest open-pit gold mine in the world.' },
{ name: 'Carlin Trend', continent: 'north_america', country: 'US', lat: 40.72, lng: -116.07, resourceType: 'gold', hashrate: 650, price: 170, valuationUsd: '$42,000,000,000', description: 'Carlin Trend, Nevada, USA. Largest gold district in Western Hemisphere.' },
{ name: 'Grasberg', continent: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'gold', hashrate: 750, price: 200, valuationUsd: '$55,000,000,000', description: 'Grasberg, Indonesia. Largest gold mine in the world.' },
{ name: 'Olimpiada', continent: 'russia', country: 'RU', lat: 58.73, lng: 93.65, resourceType: 'gold', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Olimpiada, Krasnoyarsk, Russia. One of largest gold deposits in Russia.' },
{ name: 'Cortez', continent: 'north_america', country: 'US', lat: 40.17, lng: -116.61, resourceType: 'gold', hashrate: 580, price: 150, valuationUsd: '$35,000,000,000', description: 'Cortez Complex, Nevada, USA. Major Barrick Gold operation.' },
{ name: 'Pueblo Viejo', continent: 'south_america', country: 'DO', lat: 19.05, lng: -70.17, resourceType: 'gold', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Pueblo Viejo, Dominican Republic. Largest gold mine in Caribbean.' },
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
{ name: 'Pascua-Lama', continent: 'south_america', country: 'CL', lat: -29.32, lng: -70.07, resourceType: 'gold', hashrate: 350, price: 90, valuationUsd: '$25,000,000,000', description: 'Pascua-Lama, Chile/Argentina. Massive cross-border gold-silver project.' },
{ name: 'Olympic Dam Gold', continent: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'gold', hashrate: 480, price: 122, valuationUsd: '$45,000,000,000', description: 'Olympic Dam, South Australia. Worlds largest uranium deposit, also major gold.' },
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
{ name: 'Carajas', continent: 'south_america', country: 'BR', lat: -6.07, lng: -50.17, resourceType: 'iron', hashrate: 680, price: 175, valuationUsd: '$65,000,000,000', description: 'Carajas, Brazil. Worlds largest iron ore mine.' },
{ name: 'Pilbara', continent: 'australia', country: 'AU', lat: -22.3, lng: 118.2, resourceType: 'iron', hashrate: 700, price: 185, valuationUsd: '$72,000,000,000', description: 'Pilbara, Western Australia. Largest iron ore region globally.' },
{ name: 'Hamersley', continent: 'australia', country: 'AU', lat: -22.72, lng: 117.8, resourceType: 'iron', hashrate: 650, price: 168, valuationUsd: '$58,000,000,000', description: 'Hamersley Basin, Australia. Major Rio Tinto iron ore operations.' },
{ name: 'Chichester Hub', continent: 'australia', country: 'AU', lat: -22.37, lng: 119.73, resourceType: 'iron', hashrate: 620, price: 160, valuationUsd: '$45,000,000,000', description: 'Chichester Hub, Australia. Fortescue Metals flagship iron ore hub.' },
{ name: 'Simandou', continent: 'africa', country: 'GN', lat: 8.58, lng: -8.93, resourceType: 'iron', hashrate: 600, price: 155, valuationUsd: '$40,000,000,000', description: 'Simandou, Guinea. Worlds largest untapped high-grade iron ore deposit.' },
{ name: 'Mikhailovsky', continent: 'russia', country: 'RU', lat: 52.2, lng: 35.4, resourceType: 'iron', hashrate: 550, price: 142, valuationUsd: '$25,000,000,000', description: 'Mikhailovsky GOK, Russia. One of largest iron ore processing plants in CIS.' },
{ name: 'Lebedinsky', continent: 'russia', country: 'RU', lat: 51.3, lng: 37.73, resourceType: 'iron', hashrate: 560, price: 145, valuationUsd: '$28,000,000,000', description: 'Lebedinsky GOK, Russia. Largest open-pit iron ore mine in Europe.' },
{ name: 'Sishen', continent: 'africa', country: 'ZA', lat: -27.73, lng: 22.98, resourceType: 'iron', hashrate: 520, price: 135, valuationUsd: '$22,000,000,000', description: 'Sishen, South Africa. One of largest open-pit mines in the world.' },
{ name: 'Marampa', continent: 'africa', country: 'SL', lat: 8.7, lng: -12.5, resourceType: 'iron', hashrate: 400, price: 105, valuationUsd: '$12,000,000,000', description: 'Marampa, Sierra Leone. Historic iron ore mine being revitalized.' },
{ name: 'Kiruna', continent: 'europe', country: 'SE', lat: 67.86, lng: 20.22, resourceType: 'iron', hashrate: 580, price: 150, valuationUsd: '$30,000,000,000', description: 'Kiruna, Sweden. Largest underground iron ore mine in the world.' },
{ name: 'Malmberget', continent: 'europe', country: 'SE', lat: 67.18, lng: 20.65, resourceType: 'iron', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Malmberget, Sweden. Second-largest underground iron mine in Sweden.' },
{ name: 'Mont Wright', continent: 'north_america', country: 'CA', lat: 52.8, lng: -66.8, resourceType: 'iron', hashrate: 480, price: 125, valuationUsd: '$18,000,000,000', description: 'Mont Wright, Quebec, Canada. One of largest open-pit iron ore mines in Canada.' },
{ name: 'Labrador City', continent: 'north_america', country: 'CA', lat: 52.95, lng: -66.92, resourceType: 'iron', hashrate: 490, price: 128, valuationUsd: '$19,000,000,000', description: 'Labrador City, Canada. Major iron ore operations in Labrador Trough.' },
{ name: 'Roy Hill', continent: 'australia', country: 'AU', lat: -22.43, lng: 119.95, resourceType: 'iron', hashrate: 640, price: 165, valuationUsd: '$50,000,000,000', description: 'Roy Hill, Western Australia. Major iron ore mine owned by Hancock Prospecting.' },
{ name: 'Kolomela', continent: 'africa', country: 'ZA', lat: -28.42, lng: 23.28, resourceType: 'iron', hashrate: 450, price: 118, valuationUsd: '$15,000,000,000', description: 'Kolomela, South Africa. Kumba Iron Ore open-pit mine.' },
{ name: 'Minas-Rio', continent: 'south_america', country: 'BR', lat: -18.57, lng: -43.43, resourceType: 'iron', hashrate: 530, price: 138, valuationUsd: '$26,000,000,000', description: 'Minas-Rio, Brazil. Anglo American major iron ore pipeline project.' },
{ name: 'Stoilensky', continent: 'russia', country: 'RU', lat: 51.3, lng: 37.6, resourceType: 'iron', hashrate: 470, price: 122, valuationUsd: '$17,000,000,000', description: 'Stoilensky, Russia. Major NLMK iron ore mining operation.' },
{ name: 'Tonkolili', continent: 'africa', country: 'SL', lat: 8.97, lng: -11.82, resourceType: 'iron', hashrate: 420, price: 110, valuationUsd: '$14,000,000,000', description: 'Tonkolili, Sierra Leone. One of largest iron ore deposits in Africa.' },
{ name: 'Newman', continent: 'australia', country: 'AU', lat: -23.35, lng: 119.73, resourceType: 'iron', hashrate: 610, price: 158, valuationUsd: '$42,000,000,000', description: 'Newman (Mt Whaleback), Western Australia. Iconic BHP iron ore mine.' },
{ name: 'Itabira', continent: 'south_america', country: 'BR', lat: -19.62, lng: -43.23, resourceType: 'iron', hashrate: 540, price: 140, valuationUsd: '$32,000,000,000', description: 'Itabira Complex, Brazil. Historic Vale iron ore operations since 1942.' },
// === RARE METALS (20) ===
{ name: 'Bayan Obo', continent: 'asia', country: 'CN', lat: 41.8, lng: 109.97, resourceType: 'rare_metals', hashrate: 750, price: 200, valuationUsd: '$80,000,000,000', description: 'Bayan Obo, Inner Mongolia, China. Worlds largest rare earth mine.' },
{ name: 'Mount Weld', continent: 'australia', country: 'AU', lat: -28.77, lng: 122.55, resourceType: 'rare_metals', hashrate: 620, price: 160, valuationUsd: '$35,000,000,000', description: 'Mount Weld, Western Australia. Richest known rare earth deposit.' },
{ name: 'Mountain Pass', continent: 'north_america', country: 'US', lat: 35.48, lng: -115.53, resourceType: 'rare_metals', hashrate: 580, price: 150, valuationUsd: '$28,000,000,000', description: 'Mountain Pass, California, USA. Only active rare earth mine in USA.' },
{ name: 'Greenbushes', continent: 'australia', country: 'AU', lat: -33.85, lng: 116.06, resourceType: 'rare_metals', hashrate: 700, price: 185, valuationUsd: '$55,000,000,000', description: 'Greenbushes, Western Australia. Worlds largest lithium mine.' },
{ name: 'Salar de Atacama', continent: 'south_america', country: 'CL', lat: -23.5, lng: -68.2, resourceType: 'rare_metals', hashrate: 680, price: 178, valuationUsd: '$52,000,000,000', description: 'Salar de Atacama, Chile. Worlds largest lithium brine operation.' },
{ name: 'Uyuni', continent: 'south_america', country: 'BO', lat: -20.46, lng: -66.83, resourceType: 'rare_metals', hashrate: 650, price: 170, valuationUsd: '$48,000,000,000', description: 'Salar de Uyuni, Bolivia. Worlds largest lithium reserve.' },
{ name: 'Pilgangoora', continent: 'australia', country: 'AU', lat: -21.33, lng: 118.95, resourceType: 'rare_metals', hashrate: 560, price: 145, valuationUsd: '$22,000,000,000', description: 'Pilgangoora, Western Australia. Major hard-rock lithium mine.' },
{ name: 'Wodgina', continent: 'australia', country: 'AU', lat: -21.18, lng: 118.67, resourceType: 'rare_metals', hashrate: 540, price: 140, valuationUsd: '$20,000,000,000', description: 'Wodgina, Western Australia. One of worlds largest lithium deposits.' },
{ name: 'Lovozero', continent: 'russia', country: 'RU', lat: 67.98, lng: 34.78, resourceType: 'rare_metals', hashrate: 500, price: 130, valuationUsd: '$18,000,000,000', description: 'Lovozero, Kola Peninsula, Russia. Major rare earth and niobium deposit.' },
{ name: 'Tomtor', continent: 'russia', country: 'RU', lat: 71.17, lng: 116.97, resourceType: 'rare_metals', hashrate: 520, price: 135, valuationUsd: '$25,000,000,000', description: 'Tomtor, Yakutia, Russia. One of richest rare earth deposits globally.' },
{ name: 'Araxá', continent: 'south_america', country: 'BR', lat: -19.59, lng: -46.94, resourceType: 'rare_metals', hashrate: 600, price: 155, valuationUsd: '$30,000,000,000', description: 'Araxa, Brazil. Worlds largest niobium mine, 80% of global supply.' },
{ name: 'Kipushi', continent: 'africa', country: 'CD', lat: -11.77, lng: 27.25, resourceType: 'rare_metals', hashrate: 480, price: 125, valuationUsd: '$16,000,000,000', description: 'Kipushi, DR Congo. Historic zinc-copper-germanium mine.' },
{ name: 'Catalao', continent: 'south_america', country: 'BR', lat: -18.17, lng: -47.95, resourceType: 'rare_metals', hashrate: 530, price: 138, valuationUsd: '$22,000,000,000', description: 'Catalao, Brazil. Major niobium and rare earth processing complex.' },
{ name: 'Nechalacho', continent: 'north_america', country: 'CA', lat: 62.14, lng: -112.59, resourceType: 'rare_metals', hashrate: 450, price: 118, valuationUsd: '$14,000,000,000', description: 'Nechalacho, Northwest Territories, Canada. Major rare earth project.' },
{ name: 'Strange Lake', continent: 'north_america', country: 'CA', lat: 56.32, lng: -64.15, resourceType: 'rare_metals', hashrate: 430, price: 112, valuationUsd: '$12,000,000,000', description: 'Strange Lake, Quebec/Labrador, Canada. Significant rare earth deposit.' },
{ name: 'Kenticha', continent: 'africa', country: 'ET', lat: 5.48, lng: 39.02, resourceType: 'rare_metals', hashrate: 420, price: 108, valuationUsd: '$10,000,000,000', description: 'Kenticha, Ethiopia. Major tantalum mining operation in East Africa.' },
{ name: 'Bernic Lake', continent: 'north_america', country: 'CA', lat: 50.42, lng: -95.18, resourceType: 'rare_metals', hashrate: 440, price: 115, valuationUsd: '$11,000,000,000', description: 'Bernic Lake (Tanco), Manitoba, Canada. Major tantalum-cesium mine.' },
{ name: 'Salar del Hombre Muerto', continent: 'south_america', country: 'AR', lat: -25.4, lng: -67.08, resourceType: 'rare_metals', hashrate: 570, price: 148, valuationUsd: '$26,000,000,000', description: 'Salar del Hombre Muerto, Argentina. Major lithium brine deposit.' },
{ name: 'Manono', continent: 'africa', country: 'CD', lat: -7.3, lng: 27.42, resourceType: 'rare_metals', hashrate: 590, price: 152, valuationUsd: '$32,000,000,000', description: 'Manono, DR Congo. One of worlds largest lithium-tin deposits.' },
{ name: 'Jadar', continent: 'europe', country: 'RS', lat: 44.45, lng: 19.35, resourceType: 'rare_metals', hashrate: 510, price: 132, valuationUsd: '$19,000,000,000', description: 'Jadar Valley, Serbia. Unique jadarite lithium-boron deposit.' },
// === OIL & GAS (15) ===
{ name: 'Ghawar', continent: 'asia', country: 'SA', lat: 25.38, lng: 49.4, resourceType: 'oil_gas', hashrate: 800, price: 220, valuationUsd: '$100,000,000,000', description: 'Ghawar, Saudi Arabia. Worlds largest conventional oil field.' },
{ name: 'Burgan', continent: 'asia', country: 'KW', lat: 29.07, lng: 47.97, resourceType: 'oil_gas', hashrate: 720, price: 190, valuationUsd: '$75,000,000,000', description: 'Burgan, Kuwait. Second-largest oil field in the world.' },
{ name: 'Safaniya', continent: 'asia', country: 'SA', lat: 28.2, lng: 48.8, resourceType: 'oil_gas', hashrate: 680, price: 178, valuationUsd: '$60,000,000,000', description: 'Safaniya, Saudi Arabia. Worlds largest offshore oil field.' },
{ name: 'Samotlor', continent: 'russia', country: 'RU', lat: 61.18, lng: 76.73, resourceType: 'oil_gas', hashrate: 650, price: 170, valuationUsd: '$55,000,000,000', description: 'Samotlor, Western Siberia, Russia. Russias largest oil field.' },
{ name: 'Prudhoe Bay', continent: 'north_america', country: 'US', lat: 70.25, lng: -148.33, resourceType: 'oil_gas', hashrate: 600, price: 155, valuationUsd: '$45,000,000,000', description: 'Prudhoe Bay, Alaska, USA. Largest oil field in North America.' },
{ name: 'Kashagan', continent: 'asia', country: 'KZ', lat: 46.27, lng: 51.55, resourceType: 'oil_gas', hashrate: 640, price: 165, valuationUsd: '$50,000,000,000', description: 'Kashagan, Kazakhstan. One of largest oil discoveries in last 50 years.' },
{ name: 'Tupi (Lula)', continent: 'south_america', country: 'BR', lat: -25.2, lng: -43.5, resourceType: 'oil_gas', hashrate: 660, price: 172, valuationUsd: '$58,000,000,000', description: 'Lula (Tupi), Brazil. Largest deepwater pre-salt oil field.' },
{ name: 'Daqing', continent: 'asia', country: 'CN', lat: 46.59, lng: 124.98, resourceType: 'oil_gas', hashrate: 580, price: 150, valuationUsd: '$40,000,000,000', description: 'Daqing, Heilongjiang, China. Chinas largest oil field.' },
{ name: 'Zakum', continent: 'asia', country: 'AE', lat: 24.83, lng: 53.63, resourceType: 'oil_gas', hashrate: 620, price: 160, valuationUsd: '$48,000,000,000', description: 'Upper Zakum, Abu Dhabi, UAE. Fourth-largest oil field in the world.' },
{ name: 'Rumailah', continent: 'asia', country: 'IQ', lat: 30.32, lng: 47.38, resourceType: 'oil_gas', hashrate: 670, price: 175, valuationUsd: '$52,000,000,000', description: 'Rumaila, Iraq. One of worlds largest producing oil fields.' },
{ name: 'Vankor', continent: 'russia', country: 'RU', lat: 67.82, lng: 83.38, resourceType: 'oil_gas', hashrate: 550, price: 142, valuationUsd: '$35,000,000,000', description: 'Vankor, Krasnoyarsk, Russia. Major oil field in Eastern Siberia.' },
{ name: 'Tengiz', continent: 'asia', country: 'KZ', lat: 46.17, lng: 53.37, resourceType: 'oil_gas', hashrate: 630, price: 162, valuationUsd: '$46,000,000,000', description: 'Tengiz, Kazakhstan. Super-giant oil field near Caspian Sea.' },
{ name: 'Permian Basin', continent: 'north_america', country: 'US', lat: 31.95, lng: -102.18, resourceType: 'oil_gas', hashrate: 700, price: 185, valuationUsd: '$68,000,000,000', description: 'Permian Basin, Texas, USA. Largest shale oil producing region.' },
{ name: 'Vaca Muerta', continent: 'south_america', country: 'AR', lat: -38.2, lng: -69.3, resourceType: 'oil_gas', hashrate: 570, price: 148, valuationUsd: '$38,000,000,000', description: 'Vaca Muerta, Argentina. Second-largest shale gas reserve globally.' },
{ name: 'Hassi Messaoud', continent: 'africa', country: 'DZ', lat: 31.68, lng: 6.07, resourceType: 'oil_gas', hashrate: 540, price: 140, valuationUsd: '$32,000,000,000', description: 'Hassi Messaoud, Algeria. Largest oil field in Africa.' },
// === DIAMONDS (10) ===
{ name: 'Orapa', continent: 'africa', country: 'BW', lat: -21.32, lng: 25.37, resourceType: 'diamonds', hashrate: 700, price: 190, valuationUsd: '$65,000,000,000', description: 'Orapa, Botswana. Worlds largest diamond mine by area.' },
{ name: 'Jwaneng', continent: 'africa', country: 'BW', lat: -24.53, lng: 24.72, resourceType: 'diamonds', hashrate: 750, price: 200, valuationUsd: '$80,000,000,000', description: 'Jwaneng, Botswana. Richest diamond mine in the world by value.' },
{ name: 'Udachny', continent: 'russia', country: 'RU', lat: 66.43, lng: 112.35, resourceType: 'diamonds', hashrate: 650, price: 170, valuationUsd: '$55,000,000,000', description: 'Udachny, Yakutia, Russia. One of largest diamond mines in Russia.' },
{ name: 'Mir', continent: 'russia', country: 'RU', lat: 62.53, lng: 113.98, resourceType: 'diamonds', hashrate: 620, price: 162, valuationUsd: '$48,000,000,000', description: 'Mir, Yakutia, Russia. Legendary Soviet-era diamond pipe mine.' },
{ name: 'Catoca', continent: 'africa', country: 'AO', lat: -9.27, lng: 20.28, resourceType: 'diamonds', hashrate: 580, price: 150, valuationUsd: '$35,000,000,000', description: 'Catoca, Angola. Fourth-largest diamond mine in the world.' },
{ name: 'Lomonosov', continent: 'russia', country: 'RU', lat: 64.72, lng: 40.67, resourceType: 'diamonds', hashrate: 560, price: 145, valuationUsd: '$30,000,000,000', description: 'Lomonosov, Arkhangelsk, Russia. Major diamond deposit in European Russia.' },
{ name: 'Letseng', continent: 'africa', country: 'LS', lat: -29.0, lng: 29.08, resourceType: 'diamonds', hashrate: 540, price: 140, valuationUsd: '$25,000,000,000', description: 'Letseng, Lesotho. Known for producing highest average value diamonds.' },
{ name: 'Diavik', continent: 'north_america', country: 'CA', lat: 64.5, lng: -110.27, resourceType: 'diamonds', hashrate: 520, price: 135, valuationUsd: '$22,000,000,000', description: 'Diavik, Northwest Territories, Canada. Major Arctic diamond mine.' },
{ name: 'Ekati', continent: 'north_america', country: 'CA', lat: 64.72, lng: -110.62, resourceType: 'diamonds', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Ekati, Northwest Territories, Canada. First diamond mine in Canada.' },
{ name: 'Venetia', continent: 'africa', country: 'ZA', lat: -22.45, lng: 29.32, resourceType: 'diamonds', hashrate: 550, price: 142, valuationUsd: '$28,000,000,000', description: 'Venetia, South Africa. De Beers flagship diamond mine.' },
// === COAL (5) ===
{ name: 'Shenfu-Dongsheng', continent: 'asia', country: 'CN', lat: 39.83, lng: 110.0, resourceType: 'coal', hashrate: 680, price: 175, valuationUsd: '$70,000,000,000', description: 'Shenfu-Dongsheng, Inner Mongolia, China. Worlds largest coal field.' },
{ name: 'North Antelope Rochelle', continent: 'north_america', country: 'US', lat: 43.65, lng: -105.32, resourceType: 'coal', hashrate: 620, price: 160, valuationUsd: '$45,000,000,000', description: 'North Antelope Rochelle, Wyoming, USA. Largest coal mine in the world.' },
{ name: 'Jharia', continent: 'asia', country: 'IN', lat: 23.75, lng: 86.42, resourceType: 'coal', hashrate: 580, price: 150, valuationUsd: '$38,000,000,000', description: 'Jharia, Jharkhand, India. Largest coal field in India.' },
{ name: 'Donbas', continent: 'europe', country: 'UA', lat: 48.0, lng: 38.5, resourceType: 'coal', hashrate: 500, price: 130, valuationUsd: '$25,000,000,000', description: 'Donbas, Ukraine. Historic coal mining region in Eastern Europe.' },
{ name: 'Kuznetsk Basin', continent: 'russia', country: 'RU', lat: 54.0, lng: 87.0, resourceType: 'coal', hashrate: 600, price: 155, valuationUsd: '$42,000,000,000', description: 'Kuzbass, Kemerovo, Russia. Russias largest coal mining basin.' },
  ];

const seedMiningSites = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/dgtl';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  await Icon.deleteMany({});
  console.log('Cleared old mining sites');
  for (const site of MINING_SITES) {
    await Icon.create({
      
      name: site.name,
      continent: site.continent,
      country: site.country,
      lat: site.lat,
      lng: site.lng,
      resourceType: site.resourceType,
      hashrate: site.hashrate,
      price: site.price,
      valuationUsd: site.valuationUsd,
      description: site.description,
      });
    }
  console.log('Seeded ' + MINING_SITES.length + ' mining sites');
  await mongoose.disconnect();
  console.log('Done');
  };

seedMiningSites().catch(console.error);
