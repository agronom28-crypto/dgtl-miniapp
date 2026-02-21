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
{ name: 'Muruntau', continent: 'asia', country: 'UZ', lat: 41.52, lng: 64.57, resourceType: 'gold', hashrate: 700, price: 185, valuationUsd: '$68,000,000,000', description: 'Мурунтау, Узбекистан. Крупнейший в мире золотой карьер.' },
{ name: 'Carlin Trend', continent: 'north_america', country: 'US', lat: 40.72, lng: -116.07, resourceType: 'gold', hashrate: 650, price: 170, valuationUsd: '$42,000,000,000', description: 'Карлин Тренд, Невада, США. Крупнейший золотодобывающий район в Западном полушарии.' },
{ name: 'Grasberg', continent: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'gold', hashrate: 750, price: 200, valuationUsd: '$55,000,000,000', description: 'Грасберг, Индонезия. Крупнейший золотой прииск в мире.' },
{ name: 'Olimpiada', continent: 'russia', country: 'RU', lat: 58.73, lng: 93.65, resourceType: 'gold', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Олимпиада, Красноярск, Россия. Одно из крупнейших месторождений золота в России.' },
{ name: 'Cortez', continent: 'north_america', country: 'US', lat: 40.17, lng: -116.61, resourceType: 'gold', hashrate: 580, price: 150, valuationUsd: '$35,000,000,000', description: 'Кортес, Невада, США. Крупный проект компании Barrick Gold.' },
{ name: 'Pueblo Viejo', continent: 'north_america', country: 'DO', lat: 19.05, lng: -70.17, resourceType: 'gold', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Пуэбло Вьехо, Доминиканская Республика. Крупнейший золотой рудник в Карибском бассейне.' },
{ name: 'Lihir', continent: 'australia', country: 'PG', lat: -3.12, lng: 152.64, resourceType: 'gold', hashrate: 520, price: 135, valuationUsd: '$31,000,000,000', description: 'Лихир, Папуа — Новая Гвинея. Расположен внутри кратера вулкана.' },
{ name: 'Kibali', continent: 'africa', country: 'CD', lat: 3.01, lng: 29.59, resourceType: 'gold', hashrate: 490, price: 125, valuationUsd: '$18,000,000,000', description: 'Кибали, ДР Конго. Крупнейший золотой рудник в Африке.' },
{ name: 'Boddington', continent: 'australia', country: 'AU', lat: -32.75, lng: 116.38, resourceType: 'gold', hashrate: 470, price: 120, valuationUsd: '$24,000,000,000', description: 'Боддингтон, Западная Австралия. Крупнейший золотой рудник в Австралии.' },
{ name: 'Loulo-Gounkoto', continent: 'africa', country: 'ML', lat: 14.43, lng: -11.67, resourceType: 'gold', hashrate: 460, price: 115, valuationUsd: '$15,000,000,000', description: 'Лоло-Гункото, Мали. Ведущий комплекс Barrick Gold в Западной Африке.' },
{ name: 'Cadia Valley', continent: 'australia', country: 'AU', lat: -33.47, lng: 148.99, resourceType: 'gold', hashrate: 450, price: 110, valuationUsd: '$20,000,000,000', description: 'Кадиа-Вэлли, Австралия. Один из крупнейших подземных золотых рудников.' },
{ name: 'South Deep', continent: 'africa', country: 'ZA', lat: -26.42, lng: 27.67, resourceType: 'gold', hashrate: 440, price: 108, valuationUsd: '$32,000,000,000', description: 'Саут-Дип, ЮАР. Крупнейшее в мире месторождение золота по запасам.' },
{ name: 'Mponeng', continent: 'africa', country: 'ZA', lat: -26.41, lng: 27.42, resourceType: 'gold', hashrate: 430, price: 105, valuationUsd: '$17,000,000,000', description: 'Мпоненг, ЮАР. Самая глубокая шахта в мире, глубиной почти 4 км.' },
{ name: 'Canadian Malartic', continent: 'north_america', country: 'CA', lat: 48.13, lng: -78.12, resourceType: 'gold', hashrate: 420, price: 100, valuationUsd: '$14,000,000,000', description: 'Канадиан Малартик, Квебек, Канада. Крупнейший открытый рудник в Канаде.' },
{ name: 'Norte Abierto', continent: 'south_america', country: 'CL', lat: -27.35, lng: -69.27, resourceType: 'gold', hashrate: 500, price: 130, valuationUsd: '$27,000,000,000', description: 'Норте Абьерто, Чили. Масштабный проект в пустыне Атакама.' },
{ name: 'Obuasi', continent: 'africa', country: 'GH', lat: 6.2, lng: -1.67, resourceType: 'gold', hashrate: 380, price: 95, valuationUsd: '$12,000,000,000', description: 'Обуаси, Гана. Один из богатейших рудников с историей более 100 лет.' },
{ name: 'Detour Lake', continent: 'north_america', country: 'CA', lat: 50.05, lng: -79.7, resourceType: 'gold', hashrate: 400, price: 98, valuationUsd: '$16,000,000,000', description: 'Детур Лейк, Онтарио, Канада. Крупный карьер с запасами более 15 млн унций.' },
{ name: 'Yanacocha', continent: 'south_america', country: 'PE', lat: -6.98, lng: -78.53, resourceType: 'gold', hashrate: 410, price: 102, valuationUsd: '$19,000,000,000', description: 'Янакоча, Перу. Крупнейший золотой рудник в Южной Америке.' },
{ name: 'Pascua-Lama', continent: 'south_america', country: 'CL', lat: -29.32, lng: -70.07, resourceType: 'gold', hashrate: 350, price: 90, valuationUsd: '$25,000,000,000', description: 'Паскуа-Лама, граница Чили и Аргентины. Масштабный трансграничный проект.' },
{ name: 'Olympic Dam', continent: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'gold', hashrate: 480, price: 122, valuationUsd: '$45,000,000,000', description: 'Олимпик Дам, Австралия. Крупнейшее в мире месторождение урана и золота.' },

// === COPPER (20) ===
{ name: 'Escondida', continent: 'south_america', country: 'CL', lat: -24.27, lng: -69.07, resourceType: 'copper', hashrate: 720, price: 190, valuationUsd: '$52,000,000,000', description: 'Эскондида, Чили. Крупнейший в мире медный рудник.' },
{ name: 'Collahuasi', continent: 'south_america', country: 'CL', lat: -20.98, lng: -68.72, resourceType: 'copper', hashrate: 600, price: 155, valuationUsd: '$28,000,000,000', description: 'Кольяуаси, Чили. Третий по величине медный рудник в мире.' },
{ name: 'Kamoa-Kakula', continent: 'africa', country: 'CD', lat: -10.77, lng: 26.32, resourceType: 'copper', hashrate: 680, price: 175, valuationUsd: '$38,000,000,000', description: 'Камоа-Какула, ДР Конго. Самый быстрорастущий медный рудник в мире.' },
{ name: 'Grasberg Copper', continent: 'asia', country: 'ID', lat: -4.05, lng: 137.11, resourceType: 'copper', hashrate: 700, price: 185, valuationUsd: '$55,000,000,000', description: 'Грасберг, Индонезия. Второе по величине медное месторождение.' },
{ name: 'Tenke Fungurume', continent: 'africa', country: 'CD', lat: -10.62, lng: 26.12, resourceType: 'copper', hashrate: 550, price: 140, valuationUsd: '$22,000,000,000', description: 'Тенке-Фунгуруме, ДР Конго. Крупный медно-кобальтовый рудник.' },
{ name: 'El Teniente', continent: 'south_america', country: 'CL', lat: -34.09, lng: -70.35, resourceType: 'copper', hashrate: 580, price: 148, valuationUsd: '$35,000,000,000', description: 'Эль-Теньенте, Чили. Крупнейший в мире подземный медный рудник.' },
{ name: 'Bingham Canyon', continent: 'north_america', country: 'US', lat: 40.52, lng: -112.15, resourceType: 'copper', hashrate: 560, price: 145, valuationUsd: '$40,000,000,000', description: 'Бингем-Каньон, Юта, США. Самый большой искусственный карьер на Земле.' },
{ name: 'Cerro Verde', continent: 'south_america', country: 'PE', lat: -16.54, lng: -71.6, resourceType: 'copper', hashrate: 530, price: 138, valuationUsd: '$18,000,000,000', description: 'Серро Верде, Перу. Крупный медно-молибденовый карьер.' },
{ name: 'Antamina', continent: 'south_america', country: 'PE', lat: -9.54, lng: -77.05, resourceType: 'copper', hashrate: 520, price: 135, valuationUsd: '$20,000,000,000', description: 'Антамина, Перу. Одно из крупнейших в мире медно-цинковых месторождений.' },
{ name: 'Chuquicamata', continent: 'south_america', country: 'CL', lat: -22.31, lng: -68.9, resourceType: 'copper', hashrate: 650, price: 168, valuationUsd: '$48,000,000,000', description: 'Чукикамата, Чили. Крупнейший по объему открытый медный рудник.' },
{ name: 'Los Pelambres', continent: 'south_america', country: 'CL', lat: -31.72, lng: -70.5, resourceType: 'copper', hashrate: 480, price: 125, valuationUsd: '$15,000,000,000', description: 'Лос Пеламбрес, Чили. Крупный медно-молибденовый проект.' },
{ name: 'Radomiro Tomic', continent: 'south_america', country: 'CL', lat: -22.24, lng: -68.9, resourceType: 'copper', hashrate: 500, price: 130, valuationUsd: '$25,000,000,000', description: 'Радомиро Томич, Чили. Ведущее предприятие компании Codelco.' },
{ name: 'Morenci', continent: 'north_america', country: 'US', lat: 33.07, lng: -109.35, resourceType: 'copper', hashrate: 540, price: 142, valuationUsd: '$30,000,000,000', description: 'Моренси, Аризона, США. Крупнейший медный рудник в Северной Америке.' },
{ name: 'Mutanda', continent: 'africa', country: 'CD', lat: -10.87, lng: 25.95, resourceType: 'copper', hashrate: 460, price: 118, valuationUsd: '$12,000,000,000', description: 'Мутанда, ДР Конго. Одно из крупнейших кобальтово-медных месторождений.' },
{ name: 'Kamoto', continent: 'africa', country: 'CD', lat: -10.72, lng: 25.44, resourceType: 'copper', hashrate: 450, price: 115, valuationUsd: '$14,000,000,000', description: 'Камото, ДР Конго. Исторический подземный медно-кобальтовый комплекс.' },
{ name: 'Sentinel', continent: 'africa', country: 'ZM', lat: -12.78, lng: 25.52, resourceType: 'copper', hashrate: 440, price: 112, valuationUsd: '$10,000,000,000', description: 'Сентинел, Замбия. Современный медный рудник в Медном поясе.' },
{ name: 'Los Bronces', continent: 'south_america', country: 'CL', lat: -33.15, lng: -70.28, resourceType: 'copper', hashrate: 470, price: 122, valuationUsd: '$22,000,000,000', description: 'Лос Бронсес, Чили. Крупный рудник недалеко от Сантьяго.' },
{ name: 'Las Bambas', continent: 'south_america', country: 'PE', lat: -14.05, lng: -72.32, resourceType: 'copper', hashrate: 510, price: 132, valuationUsd: '$19,000,000,000', description: 'Лас Бамбас, Перу. Один из новейших крупных медных рудников в мире.' },
{ name: 'Udokan', continent: 'russia', country: 'RU', lat: 56.49, lng: 118.37, resourceType: 'copper', hashrate: 400, price: 105, valuationUsd: '$16,000,000,000', description: 'Удокан, Россия. Крупнейшее в России неразработанное месторождение меди.' },
{ name: 'Olympic Dam Copper', continent: 'australia', country: 'AU', lat: -30.45, lng: 136.88, resourceType: 'copper', hashrate: 490, price: 128, valuationUsd: '$45,000,000,000', description: 'Олимпик Дам, Австралия. Четвертое по величине месторождение меди.' },

// === IRON ORE (20) ===
{ name: 'Carajas', continent: 'south_america', country: 'BR', lat: -6.07, lng: -50.12, resourceType: 'iron', hashrate: 680, price: 175, valuationUsd: '$60,000,000,000', description: 'Каражас, Бразилия. Крупнейший в мире железорудный рудник.' },
{ name: 'Hamersley Basin', continent: 'australia', country: 'AU', lat: -22.8, lng: 117.6, resourceType: 'iron', hashrate: 650, price: 165, valuationUsd: '$55,000,000,000', description: 'Бассейн Хамерсли, Австралия. Один из крупнейших железорудных регионов.' },
{ name: 'Pilbara', continent: 'australia', country: 'AU', lat: -23.35, lng: 119.73, resourceType: 'iron', hashrate: 700, price: 180, valuationUsd: '$70,000,000,000', description: 'Пилбара, Австралия. Крупнейший в мире регион по добыче железной руды.' },
{ name: 'Kiruna', continent: 'europe', country: 'SE', lat: 67.85, lng: 20.22, resourceType: 'iron', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Кируна, Швеция. Крупнейший и самый современный подземный рудник.' },
{ name: 'Sishen', continent: 'africa', country: 'ZA', lat: -27.78, lng: 22.99, resourceType: 'iron', hashrate: 520, price: 135, valuationUsd: '$22,000,000,000', description: 'Сишен, ЮАР. Один из крупнейших железорудных карьеров в мире.' },
{ name: 'Lebedinsky', continent: 'russia', country: 'RU', lat: 51.08, lng: 37.46, resourceType: 'iron', hashrate: 480, price: 125, valuationUsd: '$18,000,000,000', description: 'Лебединский ГОК, Россия. Крупнейшее в России предприятие по добыче руды.' },
{ name: 'Mikhailovsky', continent: 'russia', country: 'RU', lat: 51.55, lng: 37.17, resourceType: 'iron', hashrate: 460, price: 120, valuationUsd: '$16,000,000,000', description: 'Михайловский ГОК, Россия. Ведущий горно-обогатительный комплекс.' },
{ name: 'Savage River', continent: 'australia', country: 'AU', lat: -41.55, lng: 145.18, resourceType: 'iron', hashrate: 350, price: 90, valuationUsd: '$8,000,000,000', description: 'Сэвидж-Ривер, Тасмания, Австралия. Месторождение магнетитовой руды.' },
{ name: 'Krivoy Rog', continent: 'europe', country: 'UA', lat: 47.9, lng: 33.39, resourceType: 'iron', hashrate: 440, price: 115, valuationUsd: '$15,000,000,000', description: 'Кривой Рог, Украина. Один из крупнейших железорудных бассейнов в Европе.' },
{ name: 'Itabira', continent: 'south_america', country: 'BR', lat: -19.62, lng: -43.22, resourceType: 'iron', hashrate: 560, price: 145, valuationUsd: '$30,000,000,000', description: 'Итабира, Бразилия. Главный комплекс компании Vale.' },
{ name: 'Minas-Rio', continent: 'south_america', country: 'BR', lat: -18.59, lng: -43.17, resourceType: 'iron', hashrate: 530, price: 138, valuationUsd: '$25,000,000,000', description: 'Минас-Рио, Бразилия. Крупный проект компании Anglo American.' },
{ name: 'IOC Carol Lake', continent: 'north_america', country: 'CA', lat: 52.95, lng: -66.9, resourceType: 'iron', hashrate: 420, price: 108, valuationUsd: '$12,000,000,000', description: 'Кэрол Лейк, Лабрадор, Канада. Ведущий рудник в Северной Америке.' },
{ name: 'Zanaga', continent: 'africa', country: 'CG', lat: -2.85, lng: 13.82, resourceType: 'iron', hashrate: 380, price: 98, valuationUsd: '$10,000,000,000', description: 'Занага, Республика Конго. Одно из крупнейших месторождений в Африке.' },
{ name: 'Simandou', continent: 'africa', country: 'GN', lat: 8.82, lng: -8.83, resourceType: 'iron', hashrate: 600, price: 155, valuationUsd: '$40,000,000,000', description: 'Симанду, Гвинея. Крупнейшее в мире нетронутое месторождение руды.' },
{ name: 'Mount Newman', continent: 'australia', country: 'AU', lat: -23.37, lng: 119.74, resourceType: 'iron', hashrate: 590, price: 152, valuationUsd: '$35,000,000,000', description: 'Маунт Ньюман, Австралия. Ключевое предприятие компании BHP.' },
{ name: 'Chichester Hub', continent: 'australia', country: 'AU', lat: -22.35, lng: 117.62, resourceType: 'iron', hashrate: 540, price: 140, valuationUsd: '$28,000,000,000', description: 'Чичестер Хаб, Австралия. Масштабный проект компании Fortescue.' },
{ name: 'Kudremukh', continent: 'asia', country: 'IN', lat: 13.22, lng: 75.25, resourceType: 'iron', hashrate: 330, price: 85, valuationUsd: '$6,000,000,000', description: 'Кудремукх, Индия. Историческое горнодобывающее предприятие.' },
{ name: 'Bailadila', continent: 'asia', country: 'IN', lat: 18.59, lng: 81.35, resourceType: 'iron', hashrate: 360, price: 92, valuationUsd: '$9,000,000,000', description: 'Байладила, Индия. Масштабный комплекс по добыче железной руды.' },
{ name: 'Marra Mamba', continent: 'australia', country: 'AU', lat: -22.92, lng: 117.18, resourceType: 'iron', hashrate: 490, price: 127, valuationUsd: '$17,000,000,000', description: 'Марра Мамба, Австралия. Рудник компании Rio Tinto.' },
{ name: 'Baffinland', continent: 'north_america', country: 'CA', lat: 72.47, lng: -79.1, resourceType: 'iron', hashrate: 400, price: 103, valuationUsd: '$11,000,000,000', description: 'Баффинленд, Нунавут, Канада. Высококачественная руда в Арктике.' },

// === RARE METALS (20) ===
{ name: 'Bayan Obo', continent: 'asia', country: 'CN', lat: 41.77, lng: 109.97, resourceType: 'rare_metals', hashrate: 720, price: 190, valuationUsd: '$80,000,000,000', description: 'Баян-Обо, Китай. Крупнейшее в мире месторождение редкоземельных металлов.' },
{ name: 'Mountain Pass', continent: 'north_america', country: 'US', lat: 35.48, lng: -115.53, resourceType: 'rare_metals', hashrate: 580, price: 150, valuationUsd: '$30,000,000,000', description: 'Маунтин Пасс, Калифорния, США. Крупнейший рудник вне Китая.' },
{ name: 'Mount Weld', continent: 'australia', country: 'AU', lat: -27.35, lng: 122.65, resourceType: 'rare_metals', hashrate: 560, price: 145, valuationUsd: '$28,000,000,000', description: 'Маунт Уэлд, Австралия. Одно из богатейших месторождений в мире.' },
{ name: 'Lovozero', continent: 'russia', country: 'RU', lat: 67.97, lng: 34.98, resourceType: 'rare_metals', hashrate: 500, price: 130, valuationUsd: '$20,000,000,000', description: 'Ловозеро, Кольский полуостров, Россия. Добыча ниобия и редкоземов.' },
{ name: 'Tomtor', continent: 'russia', country: 'RU', lat: 69.7, lng: 119.07, resourceType: 'rare_metals', hashrate: 540, price: 140, valuationUsd: '$25,000,000,000', description: 'Томтор, Якутия, Россия. Уникальное месторождение ниобия и РЗМ.' },
{ name: 'Kvanefjeld', continent: 'europe', country: 'GL', lat: 60.98, lng: -45.05, resourceType: 'rare_metals', hashrate: 480, price: 125, valuationUsd: '$18,000,000,000', description: 'Кванефельд, Гренландия. Огромные запасы редкоземельных металлов.' },
{ name: 'Browns Range', continent: 'australia', country: 'AU', lat: -19.08, lng: 128.12, resourceType: 'rare_metals', hashrate: 420, price: 108, valuationUsd: '$12,000,000,000', description: 'Браунс Рейндж, Австралия. Месторождение тяжелых редкоземов.' },
{ name: 'Kipawa', continent: 'north_america', country: 'CA', lat: 46.87, lng: -78.97, resourceType: 'rare_metals', hashrate: 390, price: 100, valuationUsd: '$10,000,000,000', description: 'Кипава, Квебек, Канада. Проект по добыче иттрия и тяжелых редкоземов.' },
{ name: 'Ngualla', continent: 'africa', country: 'TZ', lat: -8.65, lng: 32.65, resourceType: 'rare_metals', hashrate: 450, price: 115, valuationUsd: '$15,000,000,000', description: 'Нгуалла, Танзания. Крупный редкоземельный проект в Африке.' },
{ name: 'Gakara', continent: 'africa', country: 'BI', lat: -3.37, lng: 29.37, resourceType: 'rare_metals', hashrate: 380, price: 98, valuationUsd: '$9,000,000,000', description: 'Гакара, Бурунди. Высококачественная добыча редкоземельных минералов.' },
{ name: 'Nolans Bore', continent: 'australia', country: 'AU', lat: -22.42, lng: 133.27, resourceType: 'rare_metals', hashrate: 430, price: 110, valuationUsd: '$13,000,000,000', description: 'Ноланс Бор, Австралия. Богатый апатитовый проект РЗМ.' },
{ name: 'Wigu Hill', continent: 'africa', country: 'TZ', lat: -7.28, lng: 36.85, resourceType: 'rare_metals', hashrate: 370, price: 95, valuationUsd: '$8,000,000,000', description: 'Уигу Хилл, Танзания. Карбонатитовый проект в Восточной Африке.' },
{ name: 'Lynas Mount Weld', continent: 'australia', country: 'AU', lat: -28.05, lng: 122.58, resourceType: 'rare_metals', hashrate: 600, price: 155, valuationUsd: '$35,000,000,000', description: 'Линас Маунт Уэлд, Австралия. Ведущий мировой производитель РЗМ.' },
{ name: 'Zandkopsdrift', continent: 'africa', country: 'ZA', lat: -29.8, lng: 17.58, resourceType: 'rare_metals', hashrate: 360, price: 92, valuationUsd: '$7,500,000,000', description: 'Зандкопсдрифт, ЮАР. Крупное месторождение бастнезита.' },
{ name: 'Eco Ridge', continent: 'north_america', country: 'CA', lat: 46.47, lng: -82.27, resourceType: 'rare_metals', hashrate: 340, price: 88, valuationUsd: '$7,000,000,000', description: 'Эко Ридж, Онтарио, Канада. Совместный проект урана и РЗМ.' },
{ name: 'Strange Lake', continent: 'north_america', country: 'CA', lat: 56.17, lng: -63.55, resourceType: 'rare_metals', hashrate: 410, price: 105, valuationUsd: '$11,000,000,000', description: 'Стрейндж Лейк, Канада. Месторождение, обогащенное тяжелыми редкоземами.' },
{ name: 'Songwe Hill', continent: 'africa', country: 'MW', lat: -9.72, lng: 33.85, resourceType: 'rare_metals', hashrate: 350, price: 90, valuationUsd: '$8,500,000,000', description: 'Сонгве Хилл, Малави. Редкоземельный проект в карбонатитах.' },
{ name: 'Charley Creek', continent: 'australia', country: 'AU', lat: -21.88, lng: 134.85, resourceType: 'rare_metals', hashrate: 320, price: 82, valuationUsd: '$6,000,000,000', description: 'Чарли Крик, Австралия. Месторождение редкоземов в ионных глинах.' },
{ name: 'Bokan Mountain', continent: 'north_america', country: 'US', lat: 55.22, lng: -132.3, resourceType: 'rare_metals', hashrate: 330, price: 85, valuationUsd: '$6,500,000,000', description: 'Бокан Маунтин, Аляска, США. Запасы урана и тяжелых редкоземов.' },
{ name: 'Dubbo', continent: 'australia', country: 'AU', lat: -31.88, lng: 148.6, resourceType: 'rare_metals', hashrate: 460, price: 118, valuationUsd: '$16,000,000,000', description: 'Даббо, Австралия. Полиметаллический проект: ниобий, цирконий, РЗМ.' },

// === OIL & GAS (15) ===
{ name: 'Ghawar', continent: 'asia', country: 'SA', lat: 25.15, lng: 49.48, resourceType: 'oil_gas', hashrate: 800, price: 210, valuationUsd: '$700,000,000,000', description: 'Гавар, Саудовская Аравия. Крупнейшее в мире нефтяное месторождение.' },
{ name: 'Burgan', continent: 'asia', country: 'KW', lat: 28.97, lng: 47.95, resourceType: 'oil_gas', hashrate: 720, price: 185, valuationUsd: '$400,000,000,000', description: 'Большой Бурган, Кувейт. Второе по величине нефтяное поле в мире.' },
{ name: 'Safaniya', continent: 'asia', country: 'SA', lat: 27.97, lng: 48.72, resourceType: 'oil_gas', hashrate: 680, price: 175, valuationUsd: '$300,000,000,000', description: 'Сафания-Хафджи, Саудовская Аравия. Самое большое морское месторождение нефти.' },
{ name: 'Rumaila', continent: 'asia', country: 'IQ', lat: 30.07, lng: 47.52, resourceType: 'oil_gas', hashrate: 650, price: 165, valuationUsd: '$250,000,000,000', description: 'Румайла, Ирак. Огромное нефтяное месторождение на юге страны.' },
{ name: 'Tengiz', continent: 'asia', country: 'KZ', lat: 45.48, lng: 53.03, resourceType: 'oil_gas', hashrate: 620, price: 160, valuationUsd: '$200,000,000,000', description: 'Тенгиз, Казахстан. Гигантское месторождение на шельфе Каспийского моря.' },
{ name: 'Kashagan', continent: 'asia', country: 'KZ', lat: 45.65, lng: 52.15, resourceType: 'oil_gas', hashrate: 600, price: 155, valuationUsd: '$180,000,000,000', description: 'Кашаган, Казахстан. Крупнейшее открытие за последние 40 лет.' },
{ name: 'Priobskoye', continent: 'russia', country: 'RU', lat: 60.87, lng: 69.42, resourceType: 'oil_gas', hashrate: 580, price: 150, valuationUsd: '$160,000,000,000', description: 'Приобское, Россия. Одно из крупнейших нефтяных полей Западной Сибири.' },
{ name: 'Samotlor', continent: 'russia', country: 'RU', lat: 60.97, lng: 76.45, resourceType: 'oil_gas', hashrate: 560, price: 145, valuationUsd: '$140,000,000,000', description: 'Самотлор, Россия. Крупнейшее в России и одно из крупнейших в мире месторождений.' },
{ name: 'Zakum', continent: 'asia', country: 'AE', lat: 24.47, lng: 53.05, resourceType: 'oil_gas', hashrate: 640, price: 163, valuationUsd: '$220,000,000,000', description: 'Закум, ОАЭ. Третье по величине нефтяное поле на Ближнем Востоке.' },
{ name: 'Cantarell', continent: 'north_america', country: 'MX', lat: 19.82, lng: -91.9, resourceType: 'oil_gas', hashrate: 520, price: 135, valuationUsd: '$100,000,000,000', description: 'Кантарелл, Мексика. Гигантский шельфовый комплекс в Мексиканском заливе.' },
{ name: 'Prudhoe Bay', continent: 'north_america', country: 'US', lat: 70.2, lng: -148.5, resourceType: 'oil_gas', hashrate: 540, price: 140, valuationUsd: '$120,000,000,000', description: 'Прудо-Бей, Аляска, США. Самое большое нефтяное месторождение в Северной Америке.' },
{ name: 'North Field', continent: 'asia', country: 'QA', lat: 25.23, lng: 51.7, resourceType: 'oil_gas', hashrate: 760, price: 195, valuationUsd: '$500,000,000,000', description: 'Северное, Катар. Крупнейшее в мире месторождение природного газа.' },
{ name: 'Hassi Messaoud', continent: 'africa', country: 'DZ', lat: 31.68, lng: 6.05, resourceType: 'oil_gas', hashrate: 500, price: 130, valuationUsd: '$90,000,000,000', description: 'Хасси-Месауд, Алжир. Крупнейшее нефтяное месторождение в Африке.' },
{ name: 'Karachaganak', continent: 'asia', country: 'KZ', lat: 50.93, lng: 53.63, resourceType: 'oil_gas', hashrate: 490, price: 127, valuationUsd: '$80,000,000,000', description: 'Карачаганак, Казахстан. Крупнейшее газоконденсатное месторождение страны.' },
{ name: 'Romashkinskoye', continent: 'russia', country: 'RU', lat: 54.53, lng: 52.35, resourceType: 'oil_gas', hashrate: 470, price: 122, valuationUsd: '$70,000,000,000', description: 'Ромашкинское, Татарстан, Россия. Одно из супергигантских месторождений в мире.' },

// === DIAMONDS (10) ===
{ name: 'Jwaneng', continent: 'africa', country: 'BW', lat: -24.6, lng: 24.73, resourceType: 'diamonds', hashrate: 700, price: 180, valuationUsd: '$120,000,000,000', description: 'Джваненг, Ботсвана. Самый богатый алмазный рудник в мире.' },
{ name: 'Orapa', continent: 'africa', country: 'BW', lat: -21.3, lng: 25.38, resourceType: 'diamonds', hashrate: 650, price: 165, valuationUsd: '$90,000,000,000', description: 'Орапа, Ботсвана. Самый большой по площади алмазный рудник в мире.' },
{ name: 'Mir', continent: 'russia', country: 'RU', lat: 62.53, lng: 113.98, resourceType: 'diamonds', hashrate: 600, price: 155, valuationUsd: '$60,000,000,000', description: 'Мир, Якутия, Россия. Знаменитый алмазный карьер, теперь подземный.' },
{ name: 'Aikhal', continent: 'russia', country: 'RU', lat: 65.95, lng: 111.5, resourceType: 'diamonds', hashrate: 560, price: 145, valuationUsd: '$45,000,000,000', description: 'Айхал, Якутия, Россия. Крупнейшее месторождение алмазов в Сибири.' },
{ name: 'Ekati', continent: 'north_america', country: 'CA', lat: 64.72, lng: -110.62, resourceType: 'diamonds', hashrate: 520, price: 135, valuationUsd: '$35,000,000,000', description: 'Экати, Канада. Первая действующая алмазная шахта в Канаде.' },
{ name: 'Diavik', continent: 'north_america', country: 'CA', lat: 64.5, lng: -110.27, resourceType: 'diamonds', hashrate: 500, price: 130, valuationUsd: '$30,000,000,000', description: 'Дайавик, Канада. Крупный рудник в субарктическом регионе.' },
{ name: 'Venetia', continent: 'africa', country: 'ZA', lat: -22.38, lng: 29.33, resourceType: 'diamonds', hashrate: 480, price: 125, valuationUsd: '$25,000,000,000', description: 'Венеция, ЮАР. Крупнейшее в Южной Африке алмазное месторождение.' },
{ name: 'Argyle', continent: 'australia', country: 'AU', lat: -16.72, lng: 128.38, resourceType: 'diamonds', hashrate: 440, price: 115, valuationUsd: '$20,000,000,000', description: 'Аргайл, Австралия. Известен своими редкими розовыми алмазами.' },
{ name: 'Catoca', continent: 'africa', country: 'AO', lat: -9.35, lng: 20.22, resourceType: 'diamonds', hashrate: 420, price: 108, valuationUsd: '$15,000,000,000', description: 'Катока, Ангола. Четвертый по величине алмазный рудник в мире.' },
{ name: 'Letseng', continent: 'africa', country: 'LS', lat: -29.03, lng: 29.03, resourceType: 'diamonds', hashrate: 380, price: 98, valuationUsd: '$10,000,000,000', description: 'Летсенг, Лесото. Высокогорный рудник, известный крупными камнями.' },

// === COAL (5) ===
{ name: 'Kuzbass', continent: 'russia', country: 'RU', lat: 54.07, lng: 86.18, resourceType: 'coal', hashrate: 600, price: 155, valuationUsd: '$200,000,000,000', description: 'Кузбасс, Россия. Один из крупнейших угольных бассейнов мира.' },
{ name: 'Powder River Basin', continent: 'north_america', country: 'US', lat: 43.85, lng: -105.5, resourceType: 'coal', hashrate: 580, price: 148, valuationUsd: '$180,000,000,000', description: 'Паудер-Ривер, США. Крупнейший угледобывающий регион Соединенных Штатов.' },
{ name: 'Bowen Basin', continent: 'australia', country: 'AU', lat: -22.42, lng: 148.08, resourceType: 'coal', hashrate: 620, price: 160, valuationUsd: '$220,000,000,000', description: 'Боуэн, Австралия. Ведущий регион по добыче коксующегося угля.' },
{ name: 'Jharia', continent: 'asia', country: 'IN', lat: 23.75, lng: 86.42, resourceType: 'coal', hashrate: 500, price: 130, valuationUsd: '$100,000,000,000', description: 'Джария, Индия. Главное угольное месторождение коксующегося угля в Индии.' },
{ name: 'Shanxi', continent: 'asia', country: 'CN', lat: 37.87, lng: 112.55, resourceType: 'coal', hashrate: 700, price: 180, valuationUsd: '$500,000,000,000', description: 'Шаньси, Китай. Крупнейшая в мире угледобывающая провинция.' },
];

async function seedMiningSites() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dgtl_miniapp');
    console.log('Connected to MongoDB');
    await Icon.deleteMany({});
    console.log('Cleared existing icons');
    const sites = MINING_SITES.map(site => ({
      ...site,
      imageUrl: RESOURCE_ICONS[site.resourceType] || '/icons/resources/gold.svg',
      share: '1/10',
      isActive: true,
      starsPrice: Math.max(1, Math.round(site.price / 2)),
      stakingRate: site.hashrate,
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
