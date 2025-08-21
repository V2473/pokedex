// Base Pokemon type
export interface Pokemon {
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
}

// Pokemon sprites
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    dream_world: {
      front_default: string | null;
    };
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

// Pokemon type
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

// Pokemon ability
export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

// Pokemon stat
export interface PokemonStat {
  stat: {
    name: string;
    url: string;
  };
  effort: number;
  base_stat: number;
}

// Pokemon species reference
export interface PokemonSpeciesReference {
  name: string;
  url: string;
}

// Pokemon move
export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    version_group: {
      name: string;
      url: string;
    };
    move_learn_method: {
      name: string;
      url: string;
    };
  }[];
}

// Pokemon species
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: {
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  egg_groups: {
    name: string;
    url: string;
  }[];
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
}

// Evolution chain
export interface EvolutionChain {
  id: number;
  baby_trigger_item: {
    name: string;
    url: string;
  } | null;
  chain: EvolutionChainLink;
}

// Evolution chain link
export interface EvolutionChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

// Evolution detail
export interface EvolutionDetail {
  item: {
    name: string;
    url: string;
  } | null;
  trigger: {
    name: string;
    url: string;
  };
  gender: number | null;
  held_item: {
    name: string;
    url: string;
  } | null;
  known_move: {
    name: string;
    url: string;
  } | null;
  known_move_type: {
    name: string;
    url: string;
  } | null;
  location: {
    name: string;
    url: string;
  } | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: {
    name: string;
    url: string;
  } | null;
  party_type: {
    name: string;
    url: string;
  } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: {
    name: string;
    url: string;
  } | null;
  turn_upside_down: boolean;
}

// Move detail
export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number | null;
  priority: number;
  power: number | null;
  contest_combos: {
    normal: {
      use_before: {
        name: string;
        url: string;
      } | null;
      use_after: {
        name: string;
        url: string;
      } | null;
    } | null;
    super: {
      use_before: {
        name: string;
        url: string;
      } | null;
      use_after: {
        name: string;
        url: string;
      } | null;
    } | null;
  };
  contest_type: {
    name: string;
    url: string;
  } | null;
  contest_effect: {
    url: string;
  } | null;
  super_contest_effect: {
    url: string;
  } | null;
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  effect_changes: {
    version_group: {
      name: string;
      url: string;
    };
    effect_entries: {
      effect: string;
      language: {
        name: string;
        url: string;
      };
    }[];
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
  generation: {
    name: string;
    url: string;
  };
  machines: {
    machine: {
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  meta: {
    ailment: {
      name: string;
      url: string;
    };
    ailment_chance: number;
    category: {
      name: string;
      url: string;
    };
    crit_rate: number;
    drain: number;
    flinch_chance: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
    stat_chance: number;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  past_values: {
    accuracy: number | null;
    effect_chance: number | null;
    power: number | null;
    pp: number | null;
    type: {
      name: string;
      url: string;
    } | null;
    version_group: {
      name: string;
      url: string;
    };
  }[];
  stat_changes: {
    change: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  target: {
    name: string;
    url: string;
  };
  type: {
    name: string;
    url: string;
  };
}

// Pokemon list response
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

// Type color mapping
export const TYPE_COLORS: Record<string, string> = {
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

// Stat names
export const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};