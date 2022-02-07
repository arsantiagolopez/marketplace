export interface UserEntity {
  id: string;
  walletAddress: string;
  name: string;
  signature?: string;
  isSeller: boolean;
  createdAt: Date;
  sellerProfile?: SellerProfileEntity;
}

export interface SellerProfileEntity {
  id: string;
  name: string;
  image?: string;
  address: string;
  createdAt: Date;
  userId: string;
}

export interface ListingEntity {
  id: string;
  name: string;
  description: string;
  image: string;
  sellerAddress: string;
  tokenContract: string;
  tokenId: number;
  createdAt: Date;
  userId: string;
  price?: ListingPriceEntity;
  items?: ItemEntity[];
}

export interface ItemEntity {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
  userId: string;
  price?: ItemPriceEntity;
}

export interface ListingItemEntity {
  id: string;
  listingId: string;
  itemId: string;
}

export interface ListingPriceEntity {
  id: string;
  selectCurrency: string;
  usd: number;
  eth: string;
  lockedEthRate: string;
  createdAt: Date;
  listingId: string;
}

export interface ItemPriceEntity {
  id: string;
  selectCurrency: string;
  usd: number;
  eth: string;
  lockedEthRate: string;
  createdAt: Date;
  itemId: string;
}
