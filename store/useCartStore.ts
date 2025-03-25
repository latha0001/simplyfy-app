import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product';

interface CartStore {
  items: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  total: number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      const newItems = existingItem
        ? state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { product, quantity: 1 }];
      
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      AsyncStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems, total: newTotal };
    });
  },
  removeFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      AsyncStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems, total: newTotal };
    });
  },
  clearCart: () => {
    AsyncStorage.removeItem('cart');
    set({ items: [], total: 0 });
  },
}));

export default useCartStore;