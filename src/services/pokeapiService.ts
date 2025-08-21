import { Pokemon, PokemonSpecies, EvolutionChain, MoveDetail, PokemonListResponse } from '@/types';

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new Error(`API Error: ${error.message}`);
  }
  throw new Error('Unknown API error occurred');
};

// Get a list of Pokémon with pagination
export const getPokemonList = async (
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get details for a specific Pokémon by ID or name
export const getPokemonDetails = async (identifier: number | string): Promise<Pokemon> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get species information for a Pokémon
export const getPokemonSpecies = async (identifier: number | string): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon species: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get evolution chain for a Pokémon
export const getEvolutionChain = async (chainId: number): Promise<EvolutionChain> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${chainId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get move details
export const getMoveDetails = async (identifier: number | string): Promise<MoveDetail> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${identifier}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch move details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get ability details
export const getAbilityDetails = async (identifier: number | string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${identifier}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ability details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get type details
export const getTypeDetails = async (identifier: number | string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${identifier}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch type details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a list of Pokémon by type
export const getPokemonByType = async (type: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon by type: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pokemon;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a list of Pokémon by generation
export const getPokemonByGeneration = async (generation: number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon by generation: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pokemon_species;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a list of all Pokémon types
export const getAllTypes = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a list of all generations
export const getAllGenerations = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/generation');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch generations: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a list of Pokémon by name or ID with search
export const searchPokemon = async (query: string, limit: number = 10) => {
  try {
    // First try to get by name if it's an exact match
    try {
      const pokemon = await getPokemonDetails(query.toLowerCase());
      return [pokemon];
    } catch {
      // If not found by name, get a list and filter
      const response = await getPokemonList(1000, 0);
      const filtered = response.results.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      
      // Get details for the first few matches
      const detailsPromises = filtered
        .slice(0, limit)
        .map((p) => getPokemonDetails(p.name));
      
      return await Promise.all(detailsPromises);
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Get multiple Pokémon details by IDs
export const getMultiplePokemon = async (ids: number[]): Promise<Pokemon[]> => {
  try {
    const promises = ids.map((id) => getPokemonDetails(id));
    return await Promise.all(promises);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get Pokémon with full details including species and evolution chain
export const getPokemonWithFullDetails = async (identifier: number | string) => {
  try {
    const pokemon = await getPokemonDetails(identifier);
    const species = await getPokemonSpecies(pokemon.species.name);
    
    // Extract evolution chain ID from species URL
    const evolutionChainId = parseInt(
      species.evolution_chain.url.split('/').filter(Boolean).pop() || '0'
    );
    
    const evolutionChain = await getEvolutionChain(evolutionChainId);
    
    return {
      pokemon,
      species,
      evolutionChain,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Utility function to format Pokémon name
export const formatPokemonName = (name: string): string => {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

// Utility function to get Pokémon image URL
export const getPokemonImageUrl = (
  pokemon: Pokemon,
  type: 'default' | 'shiny' | 'official' = 'default'
): string => {
  if (type === 'official') {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default ||
      '/placeholder.png'
    );
  } else if (type === 'shiny') {
    return (
      pokemon.sprites.front_shiny ||
      pokemon.sprites.other?.['official-artwork']?.front_shiny ||
      pokemon.sprites.front_default ||
      '/placeholder.png'
    );
  } else {
    return (
      pokemon.sprites.front_default ||
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      '/placeholder.png'
    );
  }
};

// Utility function to calculate Pokémon's total stats
export const calculateTotalStats = (pokemon: Pokemon): number => {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
};

// Utility function to get Pokémon's primary type color
export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-200 text-gray-800',
    fire: 'bg-red-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-gray-800',
    grass: 'bg-green-500 text-white',
    ice: 'bg-blue-200 text-blue-800',
    fighting: 'bg-red-700 text-white',
    poison: 'bg-purple-500 text-white',
    ground: 'bg-yellow-700 text-white',
    flying: 'bg-indigo-300 text-indigo-800',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-green-400 text-white',
    rock: 'bg-yellow-600 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-600 text-white',
    dark: 'bg-gray-800 text-white',
    steel: 'bg-gray-400 text-gray-800',
    fairy: 'bg-pink-300 text-pink-800',
  };
  
  return typeColors[type] || 'bg-gray-200 text-gray-800';
};