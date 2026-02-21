export type ContinentKey = 'africa' | 'asia' | 'europe' | 'north_america' | 'south_america' | 'australia' | 'russia';
export type ResourceType = 'gold' | 'copper' | 'iron' | 'rare_metals' | 'oil_gas' | 'diamonds' | 'coal';

export interface IIcon {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    continent: ContinentKey;
    country: string;
    resourceType: ResourceType;
    resourceEmoji: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    valuationUsd?: string;
    realPhotoUrl?: string;
    stakingRate: number;
    isActive: boolean;
    shareLabel: string;
    createdAt: Date;
    totalShares: number;
    availableShares: number;
    lat?: number;
    lng?: number;
    hashrate: number;
    order: number;
}

export interface IUserIcon {
    _id: string;
    userId: string;
    iconId: string | IIcon;
    shareLabel: string;
    purchasedAt: Date;
}

export interface IStakedIcon {
    _id: string;
    userId: string;
    iconId: string | IIcon;
    stakedAt: Date;
    lastClaimAt: Date;
    isActive: boolean;
}

export const CONTINENT_LABELS: Record<ContinentKey, string> = {
    africa: 'Африка',
    asia: 'Азия',
    europe: 'Европа',
    north_america: 'Северная Америка',
    south_america: 'Южная Америка',
    australia: 'Австралия',
    russia: 'Россия'
};

export const RESOURCE_LABELS: Record<ResourceType, { label: string; emoji: string }> = {
    gold: { label: 'Золото', emoji: '🟡' },
    copper: { label: 'Медь', emoji: '🟠' },
    iron: { label: 'Железо', emoji: '⚪' },
    rare_metals: { label: 'Редкие металлы', emoji: '✨' },
    oil_gas: { label: 'Нефть и газ', emoji: '🟥' },
    diamonds: { label: 'Алмазы', emoji: '💎' },
    coal: { label: 'Уголь', emoji: '▪️' },
};
