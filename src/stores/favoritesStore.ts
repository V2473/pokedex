import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PokemonWithComputed } from '@/types';

interface FavoritesState {
  // Data
  favorites: Record<number, boolean>;
  favoritePokemon: PokemonWithComputed[];
  
  // Actions
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  setFavoritePokemon: (pokemon: PokemonWithComputed[]) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        favorites: {},
        favoritePokemon: [],

        // Actions
        addFavorite: (id: number) => {
          set((state) => ({
            favorites: {
              ...state.favorites,
              [id]: true,
            },
          }));
        },

        removeFavorite: (id: number) => {
          set((state) => {
            const newFavorites = { ...state.favorites };
            delete newFavorites[id];
            
            return {
              favorites: newFavorites,
              favoritePokemon: state.favoritePokemon.filter(
                (pokemon) => pokemon.id !== id
              ),
            };
          });
        },

        toggleFavorite: (id: number) => {
          const isCurrentlyFavorite = get().isFavorite(id);
          
          if (isCurrentlyFavorite) {
            get().removeFavorite(id);
          } else {
            get().addFavorite(id);
          }
        },

        isFavorite: (id: number) => {
          return get().favorites[id] || false;
        },

        setFavoritePokemon: (pokemon: PokemonWithComputed[]) => {
          set({ favoritePokemon: pokemon });
        },

        clearFavorites: () => {
          set({
            favorites: {},
            favoritePokemon: [],
          });
        },
      }),
      {
        name: 'favorites-storage',
      }
    ),
    {
      name: 'favorites-store',
    }
  )
);