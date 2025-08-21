import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FilterOptions, SortOptions, PaginationOptions } from '@/types';

interface FilterState {
  // Filters
  searchQuery: string;
  selectedTypes: string[];
  selectedGenerations: number[];
  favoritesOnly: boolean;
  
  // Sorting
  sortBy: SortOptions;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  
  // Advanced filters
  minStats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  maxStats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedTypes: (types: string[]) => void;
  toggleType: (type: string) => void;
  setSelectedGenerations: (generations: number[]) => void;
  toggleGeneration: (generation: number) => void;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  setSortBy: (sortBy: SortOptions) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setMinStats: (stats: Partial<FilterState['minStats']>) => void;
  setMaxStats: (stats: Partial<FilterState['maxStats']>) => void;
  resetFilters: () => void;
  resetStatsFilters: () => void;
  getFilterOptions: () => FilterOptions;
  getPaginationOptions: () => PaginationOptions;
}

const initialSortBy: SortOptions = {
  field: 'id',
  direction: 'asc',
};

const initialMinStats = {
  hp: 0,
  attack: 0,
  defense: 0,
  'special-attack': 0,
  'special-defense': 0,
  speed: 0,
};

const initialMaxStats = {
  hp: 255,
  attack: 255,
  defense: 255,
  'special-attack': 255,
  'special-defense': 255,
  speed: 255,
};

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        searchQuery: '',
        selectedTypes: [],
        selectedGenerations: [],
        favoritesOnly: false,
        sortBy: initialSortBy,
        currentPage: 1,
        itemsPerPage: 20,
        minStats: initialMinStats,
        maxStats: initialMaxStats,

        // Actions
        setSearchQuery: (searchQuery: string) => {
          set({ searchQuery, currentPage: 1 });
        },

        setSelectedTypes: (selectedTypes: string[]) => {
          set({ selectedTypes, currentPage: 1 });
        },

        toggleType: (type: string) => {
          const { selectedTypes } = get();
          const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];
          
          set({ selectedTypes: newTypes, currentPage: 1 });
        },

        setSelectedGenerations: (selectedGenerations: number[]) => {
          set({ selectedGenerations, currentPage: 1 });
        },

        toggleGeneration: (generation: number) => {
          const { selectedGenerations } = get();
          const newGenerations = selectedGenerations.includes(generation)
            ? selectedGenerations.filter((g) => g !== generation)
            : [...selectedGenerations, generation];
          
          set({ selectedGenerations: newGenerations, currentPage: 1 });
        },

        setFavoritesOnly: (favoritesOnly: boolean) => {
          set({ favoritesOnly, currentPage: 1 });
        },

        setSortBy: (sortBy: SortOptions) => {
          set({ sortBy });
        },

        setCurrentPage: (currentPage: number) => {
          set({ currentPage });
        },

        setItemsPerPage: (itemsPerPage: number) => {
          set({ itemsPerPage, currentPage: 1 });
        },

        setMinStats: (stats: Partial<FilterState['minStats']>) => {
          set((state) => ({
            minStats: {
              ...state.minStats,
              ...stats,
            },
            currentPage: 1,
          }));
        },

        setMaxStats: (stats: Partial<FilterState['maxStats']>) => {
          set((state) => ({
            maxStats: {
              ...state.maxStats,
              ...stats,
            },
            currentPage: 1,
          }));
        },

        resetFilters: () => {
          set({
            searchQuery: '',
            selectedTypes: [],
            selectedGenerations: [],
            favoritesOnly: false,
            sortBy: initialSortBy,
            currentPage: 1,
            minStats: initialMinStats,
            maxStats: initialMaxStats,
          });
        },

        resetStatsFilters: () => {
          set({
            minStats: initialMinStats,
            maxStats: initialMaxStats,
            currentPage: 1,
          });
        },

        getFilterOptions: () => {
          const { searchQuery, selectedTypes, selectedGenerations, favoritesOnly } = get();
          
          return {
            search: searchQuery || undefined,
            types: selectedTypes.length > 0 ? selectedTypes : undefined,
            generation: selectedGenerations.length === 1 ? selectedGenerations[0] : undefined,
            favoritesOnly: favoritesOnly || undefined,
          };
        },

        getPaginationOptions: () => {
          const { currentPage, itemsPerPage } = get();
          
          return {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          };
        },
      }),
      {
        name: 'filter-storage',
        partialize: (state) => ({
          sortBy: state.sortBy,
          itemsPerPage: state.itemsPerPage,
        }),
      }
    ),
    {
      name: 'filter-store',
    }
  )
);