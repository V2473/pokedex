import {
  Pokemon,
  PokemonSprites,
  PokemonType,
  PokemonAbility,
  PokemonStat,
  PokemonSpeciesReference,
  PokemonMove,
  EvolutionDetail,
  MoveDetail,
} from './pokemon';

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// API error response
export interface ApiError {
  message: string;
  status: number;
  statusText: string;
}

// Pagination options
export interface PaginationOptions {
  limit: number;
  offset: number;
}

// Filter options
export interface FilterOptions {
  search?: string;
  types?: string[];
  generation?: number;
  favoritesOnly?: boolean;
}

// Sort options
export interface SortOptions {
  field: 'name' | 'id' | 'base_experience' | 'height' | 'weight';
  direction: 'asc' | 'desc';
}

// Pokemon list with filters
export interface PokemonListWithFilters {
  pokemon: Pokemon[];
  count: number;
  filters: FilterOptions;
  sort: SortOptions;
  pagination: PaginationOptions;
}

// Pokemon evolution chain with details
export interface PokemonEvolutionChainWithDetails {
  id: number;
  species: {
    name: string;
    url: string;
  };
  evolutionDetails: EvolutionDetail[];
  evolvesTo: PokemonEvolutionChainWithDetails[];
  pokemonDetails?: Pokemon;
}

// Pokemon move with details
export interface PokemonMoveWithDetails {
  move: {
    name: string;
    url: string;
  };
  versionGroupDetails: {
    levelLearnedAt: number;
    versionGroup: {
      name: string;
      url: string;
    };
    moveLearnMethod: {
      name: string;
      url: string;
    };
  }[];
  moveDetails?: MoveDetail;
}

// Pokemon ability with details
export interface PokemonAbilityWithDetails {
  ability: {
    name: string;
    url: string;
  };
  isHidden: boolean;
  slot: number;
  abilityDetails?: {
    effect_entries: {
      effect: string;
      short_effect: string;
      language: {
        name: string;
        url: string;
      };
    }[];
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  };
}

// Pokemon with additional computed properties
export interface PokemonWithComputed {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: PokemonSpeciesReference;
  moves: PokemonMove[];
  order: number;
  base_experience: number;
  isFavorite: boolean;
  formattedName: string;
  formattedId: string;
  formattedHeight: string;
  formattedWeight: string;
  totalStats: number;
  primaryType: string;
  secondaryType: string | null;
}

// Pokemon type effectiveness
export interface PokemonTypeEffectiveness {
  double_damage_from: string[];
  double_damage_to: string[];
  half_damage_from: string[];
  half_damage_to: string[];
  no_damage_from: string[];
  no_damage_to: string[];
}

// Pokemon species with flavor text
export interface PokemonSpeciesWithFlavorText {
  id: number;
  name: string;
  flavorText: string;
  generation: string;
  evolutionChain: string;
  evolvesFrom: string | null;
  color: string;
  shape: string;
  habitat: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  genderRate: number;
  captureRate: number;
  baseHappiness: number;
  hatchCounter: number;
  hasGenderDifferences: boolean;
  growthRate: string;
  pokedexNumbers: {
    entryNumber: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  eggGroups: {
    name: string;
    url: string;
  }[];
}