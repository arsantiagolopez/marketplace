export interface UserEntity {
  id: string;
  walletAddress: string;
  name: string;
  signature?: string;
  isSeller: boolean;
  createdAt: Date;
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
  price: number;
  description: string;
  image: string;
  seller: string;
  tokenContract: string;
  tokenId: number;
  items: ItemEntity[];
  createdAt: Date;
  userId: string;
}

export interface ItemEntity {
  id: string;
  name: string;
  price: number;
  image: string;
  createdAt: Date;
  userId: string;
}
