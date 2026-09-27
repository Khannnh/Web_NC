import { create } from 'zustand';
import { Product } from '../Buoi3/BTVN/features/products/type';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (product) => {
    const exists = get().favorites.some((item) => item.id === product.id);
    if (exists) {
      set({ favorites: get().favorites.filter((item) => item.id !== product.id) });
    } else {
      set({ favorites: [...get().favorites, product] });
    }
  },
  isFavorite: (id) => get().favorites.some((item) => item.id === id),
}));