import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Pokemon, PokemonWithComputed, PokemonListResponse, FilterOptions, SortOptions, PaginationOptions } from '@/types';

interface PokemonState {
  // Data
  pokemonList: Pokemon[];
  pokemonDetails: Record<number, PokemonWithComputed>;
  filteredPokemon: PokemonWithComputed[];
  
  // Loading states
  loading: 'idle' | 'loading' | 'success' | 'error';
  loadingDetails: Record<number, 'idle' | 'loading' | 'success' | 'error'>;
  
  // Error states
  error: string | null;
  detailsError: Record<number, string | null>;
  
  // Pagination
  count: number;
  pagination: PaginationOptions;
  
  // Filters and sorting
  filters: FilterOptions;
  sort: SortOptions;
  
  // Actions
  fetchPokemonList: () => Promise<void>;
  fetchPokemonDetails: (id: number) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSort: (sort: SortOptions) => void;
  setPagination: (pagination: Partial<PaginationOptions>) => void;
  applyFiltersAndSort: () => void;
  clearError: () => void;
  clearDetailsError: (id: number) => void;
  reset: () => void;
}

const initialPagination: PaginationOptions = {
  limit: 20,
  offset: 0,
};

const initialFilters: FilterOptions = {
  search: '',
  types: [],
  generation: undefined,
  favoritesOnly: false,
};

const initialSort: SortOptions = {
  field: 'id',
  direction: 'asc',
};

export const usePokemonStore = create<PokemonState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        pokemonList: [],
        pokemonDetails: {},
        filteredPokemon: [],
        loading: 'idle',
        loadingDetails: {},
        error: null,
        detailsError: {},
        count: 0,
        pagination: initialPagination,
        filters: initialFilters,
        sort: initialSort,

        // Actions
        fetchPokemonList: async () => {
          set({ loading: 'loading', error: null });
          
          try {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon?limit=${get().pagination.limit}&offset=${get().pagination.offset}`
            );
            
            if (!response.ok) {
              throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
            }
            
            const data: PokemonListResponse = await response.json();
            
            // Fetch details for each Pokémon in the list
            const pokemonPromises = data.results.map(async (pokemon) => {
              const detailResponse = await fetch(pokemon.url);
              if (!detailResponse.ok) {
                throw new Error(`Failed to fetch Pokémon details: ${detailResponse.status}`);
              }
              return (await detailResponse.json()) as Pokemon;
            });
            
            const pokemonList = await Promise.all(pokemonPromises);
            
            set({
              pokemonList,
              count: data.count,
              loading: 'success',
            });
            
            // Apply filters and sorting after fetching
            get().applyFiltersAndSort();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            set({ loading: 'error', error: errorMessage });
          }
        },

        fetchPokemonDetails: async (id: number) => {
          set((state) => ({
            loadingDetails: {
              ...state.loadingDetails,
              [id]: 'loading',
            },
            detailsError: {
              ...state.detailsError,
              [id]: null,
            },
          }));
          
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch Pokémon details: ${response.status}`);
            }
            
            const pokemon: Pokemon = await response.json();
            
            // Compute additional properties
            const pokemonWithComputed: PokemonWithComputed = {
              ...pokemon,
              isFavorite: false, // This will be updated by the favorites store
              formattedName: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
              formattedId: `#${pokemon.id.toString().padStart(3, '0')}`,
              formattedHeight: `${(pokemon.height / 10).toFixed(1)} m`,
              formattedWeight: `${(pokemon.weight / 10).toFixed(1)} kg`,
              totalStats: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
              primaryType: pokemon.types[0]?.type.name || '',
              secondaryType: pokemon.types[1]?.type.name || null,
            };
            
            set((state) => ({
              pokemonDetails: {
                ...state.pokemonDetails,
                [id]: pokemonWithComputed,
              },
              loadingDetails: {
                ...state.loadingDetails,
                [id]: 'success',
              },
            }));
            
            // Re-apply filters and sorting to include the new details
            get().applyFiltersAndSort();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            set((state) => ({
              loadingDetails: {
                ...state.loadingDetails,
                [id]: 'error',
              },
              detailsError: {
                ...state.detailsError,
                [id]: errorMessage,
              },
            }));
          }
        },

        setFilters: (filters: Partial<FilterOptions>) => {
          set((state) => ({
            filters: {
              ...state.filters,
              ...filters,
            },
          }));
          
          // Apply filters and sorting after updating filters
          get().applyFiltersAndSort();
        },

        setSort: (sort: SortOptions) => {
          set({ sort });
          
          // Apply filters and sorting after updating sort
          get().applyFiltersAndSort();
        },

        setPagination: (pagination: Partial<PaginationOptions>) => {
          set((state) => ({
            pagination: {
              ...state.pagination,
              ...pagination,
            },
          }));
        },

        applyFiltersAndSort: () => {
          const { pokemonList, pokemonDetails, filters, sort } = get();
          
          // Convert pokemonList to PokemonWithComputed if not already in details
          const pokemonWithComputed: PokemonWithComputed[] = pokemonList.map((pokemon) => {
            if (pokemonDetails[pokemon.id]) {
              return pokemonDetails[pokemon.id];
            }
            
            // Create a basic computed version if details aren't loaded yet
            return {
              ...pokemon,
              isFavorite: false,
              formattedName: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
              formattedId: `#${pokemon.id.toString().padStart(3, '0')}`,
              formattedHeight: `${(pokemon.height / 10).toFixed(1)} m`,
              formattedWeight: `${(pokemon.weight / 10).toFixed(1)} kg`,
              totalStats: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
              primaryType: pokemon.types[0]?.type.name || '',
              secondaryType: pokemon.types[1]?.type.name || null,
            };
          });
          
          // Apply filters
          let filtered = pokemonWithComputed;
          
          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
              (pokemon) =>
                pokemon.name.toLowerCase().includes(searchLower) ||
                pokemon.id.toString().includes(searchLower)
            );
          }
          
          // Type filter
          if (filters.types && filters.types.length > 0) {
            filtered = filtered.filter((pokemon) =>
              filters.types!.some(
                (type) =>
                  pokemon.primaryType === type || pokemon.secondaryType === type
              )
            );
          }
          
          // Favorites filter (will be handled by the favorites store)
          
          // Apply sorting
          filtered = [...filtered].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;
            
            switch (sort.field) {
              case 'name':
                aValue = a.formattedName;
                bValue = b.formattedName;
                break;
              case 'id':
                aValue = a.id;
                bValue = b.id;
                break;
              case 'base_experience':
                aValue = a.base_experience;
                bValue = b.base_experience;
                break;
              case 'height':
                aValue = a.height;
                bValue = b.height;
                break;
              case 'weight':
                aValue = a.weight;
                bValue = b.weight;
                break;
              default:
                aValue = a.id;
                bValue = b.id;
            }
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sort.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            
            return sort.direction === 'asc'
              ? (aValue as number) - (bValue as number)
              : (bValue as number) - (aValue as number);
          });
          
          set({ filteredPokemon: filtered });
        },

        clearError: () => set({ error: null }),
        
        clearDetailsError: (id: number) =>
          set((state) => ({
            detailsError: {
              ...state.detailsError,
              [id]: null,
            },
          })),
        
        reset: () =>
          set({
            pokemonList: [],
            pokemonDetails: {},
            filteredPokemon: [],
            loading: 'idle',
            loadingDetails: {},
            error: null,
            detailsError: {},
            count: 0,
            pagination: initialPagination,
            filters: initialFilters,
            sort: initialSort,
          }),
      }),
      {
        name: 'pokemon-storage',
        partialize: (state) => ({
          filters: state.filters,
          sort: state.sort,
          pagination: state.pagination,
        }),
      }
    ),
    {
      name: 'pokemon-store',
    }
  )
);