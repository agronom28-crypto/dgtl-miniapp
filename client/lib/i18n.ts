export type Lang = 'ru' | 'en';

// ======= COUNTRY NAMES (37 стран) =======
export const COUNTRY_NAMES: Record<Lang, Record<string, string>> = {
  ru: {
    UZ: 'Узбекистан', US: 'США', ID: 'Индонезия', RU: 'Россия', DO: 'Доминикана',
    PG: 'Папуа — Новая Гвинея', CD: 'ДР Конго', AU: 'Австралия', ML: 'Мали',
    ZA: 'ЮАР', CA: 'Канада', CL: 'Чили', GH: 'Гана', PE: 'Перу', ZM: 'Замбия',
    BR: 'Бразилия', SE: 'Швеция', UA: 'Украина', CG: 'Конго', GN: 'Гвинея',
    IN: 'Индия', CN: 'Китай', GL: 'Гренландия', TZ: 'Танзания', BI: 'Бурунди',
    MW: 'Малави', SA: 'Саудовская Аравия', KW: 'Кувейт', IQ: 'Ирак',
    KZ: 'Казахстан', AE: 'ОАЭ', MX: 'Мексика', QA: 'Катар', DZ: 'Алжир',
    BW: 'Ботсвана', AO: 'Ангола', LS: 'Лесото',
        GA: 'Габон', NA: 'Намибия', CO: 'Колумбия', BO: 'Боливия',
  },
  en: {
    UZ: 'Uzbekistan', US: 'United States', ID: 'Indonesia', RU: 'Russia', DO: 'Dominican Republic',
    PG: 'Papua New Guinea', CD: 'DR Congo', AU: 'Australia', ML: 'Mali',
    ZA: 'South Africa', CA: 'Canada', CL: 'Chile', GH: 'Ghana', PE: 'Peru', ZM: 'Zambia',
    BR: 'Brazil', SE: 'Sweden', UA: 'Ukraine', CG: 'Congo', GN: 'Guinea',
    IN: 'India', CN: 'China', GL: 'Greenland', TZ: 'Tanzania', BI: 'Burundi',
    MW: 'Malawi', SA: 'Saudi Arabia', KW: 'Kuwait', IQ: 'Iraq',
    KZ: 'Kazakhstan', AE: 'UAE', MX: 'Mexico', QA: 'Qatar', DZ: 'Algeria',
    BW: 'Botswana', AO: 'Angola', LS: 'Lesotho',
        GA: 'Gabon', NA: 'Namibia', CO: 'Colombia', BO: 'Bolivia',
  },
};

export function getCountryName(lang: Lang, code: string): string {
  return COUNTRY_NAMES[lang][code] || code;
}

// ======= MINERAL NAMES =======
export const MINERAL_NAMES: Record<Lang, Record<string, string>> = {
  ru: {
    Carbon: 'Углерод', Gold: 'Золото', Arsenic: 'Мышьяк', Silver: 'Серебро',
    Platinum: 'Платина', Copper: 'Медь', Iron: 'Железо', Nickel: 'Никель',
    Titanium: 'Титан', Lithium: 'Литий', Cobalt: 'Кобальт', Uranium: 'Уран',
  },
  en: {
    Carbon: 'Carbon', Gold: 'Gold', Arsenic: 'Arsenic', Silver: 'Silver',
    Platinum: 'Platinum', Copper: 'Copper', Iron: 'Iron', Nickel: 'Nickel',
    Titanium: 'Titanium', Lithium: 'Lithium', Cobalt: 'Cobalt', Uranium: 'Uranium',
  },
};

export function getMineralName(lang: Lang, name: string): string {
  return MINERAL_NAMES[lang][name] || name;
}

// ======= RESOURCE TYPE NAMES =======
export const RESOURCE_TYPE_NAMES: Record<Lang, Record<string, string>> = {
  ru: {
    gold: 'Золото', copper: 'Медь', iron: 'Железо',
    rare_metals: 'Редкие металлы', oil_gas: 'Нефть и газ',
    diamonds: 'Алмазы', coal: 'Уголь',
  },
  en: {
    gold: 'Gold', copper: 'Copper', iron: 'Iron',
    rare_metals: 'Rare Metals', oil_gas: 'Oil & Gas',
    diamonds: 'Diamonds', coal: 'Coal',
  },
};

export function getResourceTypeName(lang: Lang, type: string): string {
  return RESOURCE_TYPE_NAMES[lang][type] || type;
}

// ======= BOOST CARD NAMES =======
export const BOOST_NAMES: Record<Lang, Record<string, string>> = {
  ru: {
    'Hashrate Boost S': 'Буст хешрейта S',
    'Hashrate Boost M': 'Буст хешрейта M',
    'Hashrate Boost L': 'Буст хешрейта L',
    'Income Boost': 'Буст дохода',
    'Speed Boost': 'Буст скорости',
    'Lucky Boost': 'Буст удачи',
    'Shield Boost': 'Буст защиты',
  },
  en: {
    'Hashrate Boost S': 'Hashrate Boost S',
    'Hashrate Boost M': 'Hashrate Boost M',
    'Hashrate Boost L': 'Hashrate Boost L',
    'Income Boost': 'Income Boost',
    'Speed Boost': 'Speed Boost',
    'Lucky Boost': 'Lucky Boost',
    'Shield Boost': 'Shield Boost',
  },
};

export function getBoostName(lang: Lang, title: string): string {
  return BOOST_NAMES[lang][title] || title;
}

// ======= TRANSLATIONS =======
export const translations = {
  ru: {
    // Shop
    shop_title: 'Месторождения',
    shop_coins: 'монет',
    shop_map_hint: 'Нажмите на регион, чтобы увидеть месторождения',
    shop_owned: 'Ваши доли',
    shop_back: '← Карта',
    shop_loading: 'Загрузка...',
    shop_empty: 'Нет месторождений в этом регионе',
    shop_share: '1/10 доли',
    shop_owned_label: '✓ Куплено',
    shop_buy_stars: 'Stars',
    shop_no_stars: 'Оплата Stars недоступна для этого лота',
    shop_auth: 'Авторизуйтесь для покупки',
    shop_bought: 'Доля месторождения куплена!',
    shop_paid: 'Оплата Stars прошла успешно!',
    shop_cancelled: 'Оплата отменена',
    shop_error: 'Ошибка покупки',
    shop_error_stars: 'Ошибка оплаты Stars',
    shop_invoice_error: 'Ошибка создания инвойса',
    shop_per_hour: '/час',
    // Staking
    staking_title: 'Стейкинг',
    staking_subtitle: 'Застейкайте доли месторождений и получайте пассивный доход',
    staking_loading: 'Загрузка...',
    staking_active: 'Активные стейки',
    staking_claim: 'Собрать всё',
    staking_staked_label: 'Застейкано',
    staking_unstake: 'Снять',
    staking_available: 'Доступные доли',
    staking_empty_all: 'Нет долей. Купите доли месторождений в магазине.',
    staking_empty_all_staked: 'Все доли уже застейканы.',
    staking_stake_btn: 'Стейк',
    staking_error: 'Ошибка стейкинга',
    staking_claim_success: 'монет!',
    staking_claim_prefix: 'Собрано',
    staking_page_title: 'Стейкинг — DGTL',
    // Boosts
    boosts_title: '🚀 Магазин',
    boosts_subtitle: 'Покупайте бусты и минералы для ускорения прогресса!',
    boosts_balance: 'Баланс',
    boosts_section: 'Буст-карточки',
    boosts_minerals: 'Минеральные карточки',
    boosts_no_cards: 'Нет доступных буст-карточек',
    boosts_owned: 'Куплено',
    boosts_buy: '💰 Купить',
    boosts_stars: '⭐ Stars',
    boosts_buy_success: 'Буст куплен за монеты!',
    boosts_stars_success: 'Инвойс Stars создан! Завершите оплату в Telegram.',
    boosts_initiated: 'Оплата Stars инициирована!',
    boosts_no_coins: 'Недостаточно монет!',
    boosts_stars_fail: 'Ошибка оплаты Stars!',
    boosts_stars_error: 'Ошибка при оплате Stars',
    boosts_mineral_success: 'минеральная карточка куплена!',
    boosts_not_enough: 'Недостаточно токенов!',
    // Resource filters
    filter_all: 'Все',
    filter_gold: 'Золото',
    filter_copper: 'Медь',
    filter_iron: 'Железо',
    filter_rare: 'Редкие',
    filter_oil: 'Нефть',
    filter_diamonds: 'Алмазы',
    filter_coal: 'Уголь',
    // Continent labels
    continent_africa: 'Африка',
    continent_asia: 'Азия',
    continent_europe: 'Европа',
    continent_north_america: 'Северная Америка',
    continent_south_america: 'Южная Америка',
    continent_australia: 'Австралия',
    continent_russia: 'Россия',
    // Index (Home)
    home_loading: 'Загрузка...',
    home_error: 'Не удалось загрузить данные пользователя. Пожалуйста, попробуйте снова.',
    home_balance: 'Баланс аккаунта',
    home_level: 'Уровень',
    home_levels: 'Уровни',
    home_play: 'Играть',
    home_locked: 'Закрыто',
    home_no_levels: 'Нет доступных уровней на данный момент. Пожалуйста, зайдите позже.',
    home_load_levels_error: 'Не удалось загрузить уровни.',
    home_load_user_error: 'Не удалось загрузить данные пользователя.',
    home_level_placeholder: 'Уровень',
    // Payment
    payment_title: 'Покупка за Stars',
    payment_subtitle: 'Оплата через Telegram Stars',
    payment_empty: 'Нет товаров для покупки за Stars',
    payment_buy: 'Купить',
    payment_success: 'Покупка совершена!',
    payment_error: 'Не удалось создать счёт',
    payment_tg_alert: 'Откройте через Telegram',
    // Friends
    friends_title: '👥 Пригласить друзей',
    friends_subtitle: 'Получайте бонусы вместе с друзьями 🎁💸',
    friends_invite_card: 'Пригласи друга!',
    friends_invite_desc: 'Получите +1,000 за каждого приглашенного друга',
    friends_btn: 'Пригласить друзей',
    friends_frens_count: 'друзей',
    // Tasks
    tasks_title: '👣 Присоединяйтесь',
    tasks_subtitle: 'Вступайте в сообщество GTL в соцсетях для получения новостей и бонусов! 🎁💸',
    tasks_follow: 'Подпишитесь на GTL в',
    tasks_open: 'Открыть',
        // Wallet
        wallet_title: 'TON Кошелёк',
        wallet_loading: 'Загрузка...',
        wallet_connected: 'Подключённый кошелёк',
        wallet_gtl_balance: 'Баланс GTL',
        wallet_ton_balance: 'Баланс TON',
        wallet_withdraw: 'Вывести DGTL токены',
        wallet_disconnect: 'Отключить кошелёк',
        wallet_connect_title: 'Подключите кошелёк',
        wallet_connect_desc: 'Подключите TON кошелёк для вывода DGTL токенов',
        wallet_connecting: 'Подключение...',
        wallet_connect_btn: 'Подключить TON кошелёк',
        wallet_error_detect: 'Не удалось определить Telegram. Откройте через Telegram.',
        wallet_error_init: 'TON Connect не инициализирован',
        // Withdraw
        withdraw_title: 'Вывод DGTL',
      withdraw_balance: 'Доступный баланс',
      withdraw_amount: 'Сумма (GTL)',
      withdraw_commission: 'Комиссия',
      withdraw_receive: 'Вы получите',
      withdraw_btn: 'Вывести',
      withdraw_processing: 'Обработка...',
      withdraw_history: 'История',
      withdraw_success: 'Вывод успешен!',
      withdraw_processing_msg: 'Вывод обрабатывается. Проверьте историю.',
      withdraw_failed: 'Ошибка вывода. GTL возвращены.',
  },
  en: {
    // Shop
    shop_title: 'Mining Sites',
    shop_coins: 'coins',
    shop_map_hint: 'Click on a region to see mining sites',
    shop_owned: 'Your shares',
    shop_back: '← Map',
    shop_loading: 'Loading...',
    shop_empty: 'No mining sites in this region',
    shop_share: '1/10 share',
    shop_owned_label: '✓ Owned',
    shop_buy_stars: 'Stars',
    shop_no_stars: 'Stars payment not available for this item',
    shop_auth: 'Please log in to purchase',
    shop_bought: 'Mining share purchased!',
    shop_paid: 'Stars payment successful!',
    shop_cancelled: 'Payment cancelled',
    shop_error: 'Purchase error',
    shop_error_stars: 'Stars payment error',
    shop_invoice_error: 'Invoice creation error',
    shop_per_hour: '/hr',
    // Staking
    staking_title: 'Staking',
    staking_subtitle: 'Stake your mining shares and earn passive income',
    staking_loading: 'Loading...',
    staking_active: 'Active Stakes',
    staking_claim: 'Claim All',
    staking_staked_label: 'Staked',
    staking_unstake: 'Unstake',
    staking_available: 'Available Shares',
    staking_empty_all: 'No shares. Buy mining shares in the shop.',
    staking_empty_all_staked: 'All shares are already staked.',
    staking_stake_btn: 'Stake',
    staking_error: 'Staking error',
    staking_claim_success: 'coins!',
    staking_claim_prefix: 'Claimed',
    staking_page_title: 'Staking — DGTL',
    // Boosts
    boosts_title: '🚀 Store',
    boosts_subtitle: 'Purchase boosts and collect minerals to accelerate your progress!',
    boosts_balance: 'Balance',
    boosts_section: 'Boost Cards',
    boosts_minerals: 'Mineral Cards',
    boosts_no_cards: 'No boost cards available',
    boosts_owned: 'Owned',
    boosts_buy: '💰 Buy',
    boosts_stars: '⭐ Stars',
    boosts_buy_success: 'Boost purchased for coins!',
    boosts_stars_success: 'Stars invoice created! Complete payment in Telegram.',
    boosts_initiated: 'Stars payment initiated!',
    boosts_no_coins: 'Not enough coins!',
    boosts_stars_fail: 'Stars payment failed!',
    boosts_stars_error: 'Stars payment error',
    boosts_mineral_success: 'mineral card purchased!',
    boosts_not_enough: 'Not enough tokens!',
    // Resource filters
    filter_all: 'All',
    filter_gold: 'Gold',
    filter_copper: 'Copper',
    filter_iron: 'Iron',
    filter_rare: 'Rare Metals',
    filter_oil: 'Oil & Gas',
    filter_diamonds: 'Diamonds',
    filter_coal: 'Coal',
    // Continent labels
    continent_africa: 'Africa',
    continent_asia: 'Asia',
    continent_europe: 'Europe',
    continent_north_america: 'North America',
    continent_south_america: 'South America',
    continent_australia: 'Australia',
    continent_russia: 'Russia',
    // Index (Home)
    home_loading: 'Loading...',
    home_error: 'Failed to load user data. Please try again.',
    home_balance: 'Account balance',
    home_level: 'Level',
    home_levels: 'Levels',
    home_play: 'Play',
    home_locked: 'Locked',
    home_no_levels: 'No levels available at the moment. Please check back later.',
    home_load_levels_error: 'Could not load levels.',
    home_load_user_error: 'Could not load user data.',
    home_level_placeholder: 'Level',
    // Payment
    payment_title: 'Purchase with Stars',
    payment_subtitle: 'Payment via Telegram Stars',
    payment_empty: 'No items available for Stars purchase',
    payment_buy: 'Buy',
    payment_success: 'Purchase successful!',
    payment_error: 'Failed to create invoice',
    payment_tg_alert: 'Open via Telegram',
    // Friends
    friends_title: '👥 Invite Friends',
    friends_subtitle: 'Earn bonuses with your friends 🎁💸',
    friends_invite_card: 'Invite a friend!',
    friends_invite_desc: 'Get +1,000 for every invited friend',
    friends_btn: 'Invite Friends',
    friends_frens_count: 'frens',
    // Tasks
    tasks_title: '👣 Join Us',
    tasks_subtitle: 'Join the GTL community on social media for the latest updates and exclusive bonuses! 🎁💸',
    tasks_follow: 'Follow GTL on',
    tasks_open: 'Open',
          // Wallet
          wallet_title: 'TON Wallet',
          wallet_loading: 'Loading...',
          wallet_connected: 'Connected Wallet',
          wallet_gtl_balance: 'GTL Balance',
          wallet_ton_balance: 'TON Balance',
          wallet_withdraw: 'Withdraw DGTL Tokens',
          wallet_disconnect: 'Disconnect Wallet',
          wallet_connect_title: 'Connect Your Wallet',
          wallet_connect_desc: 'Connect your TON wallet to withdraw DGTL tokens',
          wallet_connecting: 'Connecting...',
          wallet_connect_btn: 'Connect TON Wallet',
          wallet_error_detect: 'Could not detect Telegram user. Please open in Telegram.',
          wallet_error_init: 'TON Connect is not initialized',
          // Withdraw
          withdraw_title: 'Withdraw DGTL',
          withdraw_balance: 'Available Balance',
          withdraw_amount: 'Amount (GTL)',
          withdraw_commission: 'Commission',
          withdraw_receive: 'You receive',
          withdraw_btn: 'Withdraw',
          withdraw_processing: 'Processing...',
          withdraw_history: 'History',
          withdraw_success: 'Withdrawal successful!',
          withdraw_processing_msg: 'Withdrawal is being processed. Check history.',
          withdraw_failed: 'Withdrawal failed. GTL refunded.',
  },
};

export function getTranslations(lang: Lang) {
  return translations[lang];
}
