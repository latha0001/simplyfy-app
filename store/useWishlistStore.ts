import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product';

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  addToWishlist: (product) => {
    set((state) => {
      const newItems = [...state.items, product];
      AsyncStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  removeFromWishlist: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      AsyncStorage.setItem('wishlist', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  isInWishlist: (productId) => {
    const state = get();
    return state.items.some((item) => item.id === productId);
  },
}));

export default useWishlistStore;