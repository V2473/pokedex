import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Heart, HeartOff, Scale, Ruler, Zap } from 'lucide-react';
import { Pokemon, MoveDetail } from '@/types';
import { useFavoritesStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { getTypeColor } from '@/services';
import { STAT_NAMES } from '@/types/pokemon';

interface PokemonModalProps {
  pokemon: Pokemon;
  isOpen: boolean;
  onClose: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  isOpen,
  onClose
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { closeModal } = useUIStore();
  
  const [moveDetails, setMoveDetails] = useState<Record<string, MoveDetail>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'evolution' | 'moves'>('about');

  const favorite = isFavorite(pokemon.id);

  useEffect(() => {
    const loadAdditionalData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      
      try {
        // Load move details for the first 4 moves
        const movesToLoad = pokemon.moves.slice(0, 4);
        const moveDetailsMap: Record<string, MoveDetail> = {};
        
        for (const move of movesToLoad) {
          const response = await fetch(move.move.url);
          if (response.ok) {
            const moveDetail = await response.json() as MoveDetail;
            moveDetailsMap[move.move.name] = moveDetail;
          }
        }
        
        setMoveDetails(moveDetailsMap);
      } catch (error) {
        console.error('Failed to load additional Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdditionalData();
  }, [pokemon, isOpen]);

  const handleClose = () => {
    onClose();
    closeModal();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon.id);
  };

  const formatHeight = (height: number) => {
    const meters = height / 10;
    const feet = Math.floor(meters * 3.28084);
    const inches = Math.round((meters * 3.28084 - feet) * 12);
    return `${meters}m (${feet}'${inches}")`;
  };

  const formatWeight = (weight: number) => {
    const kg = weight / 10;
    const lbs = Math.round(kg * 2.20462);
    return `${kg}kg (${lbs}lbs)`;
  };

  const getStatValue = (statName: string) => {
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  const getStatColor = (value: number) => {
    if (value >= 150) return 'bg-green-500';
    if (value >= 120) return 'bg-green-400';
    if (value >= 90) return 'bg-yellow-400';
    if (value >= 60) return 'bg-orange-400';
    return 'bg-red-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold capitalize">{pokemon.name}</div>
            <div className="text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleFavorite}
              className="text-rose-500 hover:text-rose-600"
            >
              {favorite ? <Heart className="h-5 w-5 fill-current" /> : <HeartOff className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || ''}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  sizes="256px"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Height:</span>
                    <span className="font-medium">{formatHeight(pokemon.height)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span>Weight:</span>
                    <span className="font-medium">{formatWeight(pokemon.weight)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>Base Exp:</span>
                    <span className="font-medium">{pokemon.base_experience}</span>
                  </div>
                </div>
              </div>

              {/* Types */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Types</h3>
                <div className="flex gap-2">
                  {pokemon.types.map((typeInfo) => (
                    <span 
                      key={typeInfo.type.name}
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(typeInfo.type.name)}`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((abilityInfo) => (
                    <span 
                      key={abilityInfo.ability.name}
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        abilityInfo.is_hidden 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {abilityInfo.ability.name}
                      {abilityInfo.is_hidden && ' (Hidden)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-4">
            <div className="flex gap-4">
              {(['about', 'stats', 'evolution', 'moves'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 px-1 capitalize ${
                    activeTab === tab 
                      ? 'border-b-2 border-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Pokédex Data</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-muted-foreground">Description</h4>
                        <p className="mt-1">
                          No description available.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="font-medium text-muted-foreground">Species</h4>
                          <p className="capitalize">Unknown</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-muted-foreground">Color</h4>
                          <p className="capitalize">Unknown</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-muted-foreground">Habitat</h4>
                          <p className="capitalize">Unknown</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-muted-foreground">Shape</h4>
                          <p className="capitalize">Unknown</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Base Stats</h3>
                    <div className="space-y-3">
                      {Object.entries(STAT_NAMES).map(([statKey, statName]) => {
                        const value = getStatValue(statKey);
                        return (
                          <div key={statKey}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{statName}</span>
                              <span>{value}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getStatColor(value)}`} 
                                style={{ width: `${Math.min(100, (value / 255) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Total</span>
                          <span>{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evolution Tab */}
                {activeTab === 'evolution' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Evolution Chain</h3>
                    <div className="text-center">
                      <p className="text-muted-foreground">Evolution chain data would be displayed here</p>
                    </div>
                  </div>
                )}

                {/* Moves Tab */}
                {activeTab === 'moves' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Moves</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pokemon.moves.slice(0, 8).map((moveInfo) => {
                        const moveDetail = moveDetails[moveInfo.move.name];
                        return (
                          <div key={moveInfo.move.name} className="border rounded-lg p-3">
                            <div className="font-medium capitalize">{moveInfo.move.name.replace('-', ' ')}</div>
                            {moveDetail && (
                              <div className="text-sm text-muted-foreground mt-1">
                                <div>Power: {moveDetail.power || '-'}</div>
                                <div>Accuracy: {moveDetail.accuracy || '-'}</div>
                                <div>PP: {moveDetail.pp || '-'}</div>
                                <div>Type: <span className="capitalize">{moveDetail.type.name}</span></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};