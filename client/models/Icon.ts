export interface IIcon {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    starsPrice: number;
    stakingBonus: number;
    isActive: boolean;
    createdAt: Date;
  }
  
  export interface IUserIcon {
    _id: string;
    telegramId: number;
    iconId: string | IIcon;
    isEquipped: boolean;
    acquiredAt: Date;
  }
  
  export interface IStakedIcon {
    _id: string;
    telegramId: number;
    iconId: string | IIcon;
    stakedAt: Date;
    unstakeAt: Date | null;
    rewardsClaimed: number;
    isActive: boolean;
  }
  