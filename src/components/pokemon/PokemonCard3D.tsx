import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Pokemon } from '@/types';
import { useFavoritesStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { formatPokemonName, getPokemonImageUrl, getTypeColor, calculateTotalStats } from '@/services';

interface PokemonCard3DProps {
  pokemon: Pokemon;
  onClick?: () => void;
  showStats?: boolean;
}

export const PokemonCard3D: React.FC<PokemonCard3DProps> = ({
  pokemon,
  onClick,
  showStats = false
}) => {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = favorites[pokemon.id] || false;
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = (x - centerX) / 20;
    const rotateX = (centerY - y) / 20;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg cursor-pointer transform-gpu"
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
        scale: 1.03,
        boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
        z: 10
      }}
      whileTap={{ scale: 0.98 }}
      layout
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? '20px' : '0px'})`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
          mixBlendMode: 'overlay'
        }}
      ></div>
      
      {/* 3D Depth Effect with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Card Content */}
      <div className="relative z-10 p-4">
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
          
          {/* 3D Pokemon Image Container */}
          <div className="relative h-16 w-16 transform-gpu group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            <Image
              src={getPokemonImageUrl(pokemon)}
              alt={formatPokemonName(pokemon.name)}
              fill
              className="object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
              sizes="64px"
              priority={pokemon.id <= 10}
              style={{
                transform: `translateZ(${isHovered ? '10px' : '0px'})`,
                transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {pokemon.types.map((typeInfo, index) => (
            <span
              key={typeInfo.type.name}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(typeInfo.type.name)} transform-gpu group-hover:scale-105 transition-all duration-300`}
              style={{
                transform: `translateZ(${isHovered ? '5px' : '0px'}) translateY(${isHovered ? '-2px' : '0'})`,
                transitionDelay: `${index * 50}ms`
              }}
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
            
            {pokemon.stats.slice(0, 3).map((stat, index) => (
              <div key={stat.stat.name} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">
                  {formatPokemonName(stat.stat.name)}
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transform-gpu origin-left group-hover:scale-x-105 transition-all duration-500"
                    style={{
                      width: `${(stat.base_stat / 255) * 100}%`,
                      transform: `translateZ(${isHovered ? '3px' : '0px'})`,
                      transitionDelay: `${index * 100}ms`
                    }}
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
      
      {/* 3D Edge Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

// Skeleton component for loading state
export const PokemonCard3DSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg">
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