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

export interface TokenEntity {
  tokenId: number;
  tokenContract: string;
  tokenHash: string;
  price: string;
  seller: string;
}

export interface ItemEntity {
  itemId: number;
  name: string;
  image: string;
  token: TokenEntity;
}

export interface ListingEntity {
  listingId: number;
  name: string;
  image: string;
  description: string;
  token: TokenEntity;
  isActive: boolean;
}

export interface OrderEntity {
  orderId: number;
  invoice: string;
  seller: string;
  buyer: string;
  listingIds: number[];
  itemIds?: number[];
  name: string;
  image: string;
}
