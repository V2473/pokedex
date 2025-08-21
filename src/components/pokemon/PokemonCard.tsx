import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Pokemon } from '@/types';
import { useFavoritesStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { formatPokemonName, getPokemonImageUrl, getTypeColor, calculateTotalStats } from '@/services';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  showStats?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onClick,
  showStats = false 
}) => {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = favorites[pokemon.id] || false;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={handleFavoriteToggle}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <h3 className="text-lg font-bold mt-1">
              {formatPokemonName(pokemon.name)}
            </h3>
          </div>
          <div className="relative h-16 w-16">
            <Image
              src={getPokemonImageUrl(pokemon)}
              alt={formatPokemonName(pokemon.name)}
              fill
              className="object-contain"
              sizes="64px"
              priority={pokemon.id <= 10} // Prioritize loading for first 10 Pokémon
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {pokemon.types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(typeInfo.type.name)}`}
            >
              {formatPokemonName(typeInfo.type.name)}
            </span>
          ))}
        </div>

        {showStats && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Stats</span>
              <span className="font-medium">{calculateTotalStats(pokemon)}</span>
            </div>
            
            {pokemon.stats.slice(0, 3).map((stat) => (
              <div key={stat.stat.name} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">
                  {formatPokemonName(stat.stat.name)}
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-6 text-right">
                  {stat.base_stat}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Skeleton component for loading state
export const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-8 bg-muted rounded"></div>
              <div className="h-6 w-6 bg-muted rounded-full"></div>
            </div>
            <div className="h-6 w-3/4 bg-muted rounded mt-2"></div>
          </div>
          <div className="h-16 w-16 bg-muted rounded-full"></div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          <div className="h-6 w-16 bg-muted rounded-full"></div>
          <div className="h-6 w-16 bg-muted rounded-full"></div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-muted rounded"></div>
            <div className="h-4 w-8 bg-muted rounded"></div>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-16 bg-muted rounded"></div>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"></div>
              <div className="h-3 w-6 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};