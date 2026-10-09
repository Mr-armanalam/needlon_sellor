export type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  updatedAt: Date;
};

export type GuestWishlistItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
};

export interface WishlistState {
  wishlist: WishlistItem[];
  guestWishlist: GuestWishlistItem[];
  loading: boolean;
  userId?: string;
}