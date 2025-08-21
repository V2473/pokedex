import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col"
        initial={{
          opacity: 0,
          scale: 0.8,
          rotateX: 15,
          y: 50
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          rotateX: -15,
          y: -50
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.5
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
      >
        {/* 3D Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md z-10 border-b p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-3xl font-bold capitalize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {pokemon.name}
            </motion.div>
            <motion.div
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              #{pokemon.id.toString().padStart(3, '0')}
            </motion.div>
          </div>
          <div className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className="text-rose-500 hover:text-rose-600 hover:scale-110 transition-transform"
              >
                {favorite ? <Heart className="h-5 w-5 fill-current" /> : <HeartOff className="h-5 w-5" />}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:scale-110 transition-transform"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Image */}
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, z: -50 }}
              animate={{ opacity: 1, z: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative w-64 h-64">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-50 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                ></motion.div>
                <Image
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || ''}
                  alt={pokemon.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="256px"
                  priority
                  style={{ transform: 'translateZ(20px)' }}
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="mb-6">
                <motion.h3
                  className="text-xl font-semibold mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Information
                </motion.h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Ruler className="h-5 w-5 text-primary" />
                    <span>Height:</span>
                    <span className="font-medium">{formatHeight(pokemon.height)}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Scale className="h-5 w-5 text-primary" />
                    <span>Weight:</span>
                    <span className="font-medium">{formatWeight(pokemon.weight)}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Base Exp:</span>
                    <span className="font-medium">{pokemon.base_experience}</span>
                  </motion.div>
                </div>
              </div>

              {/* Types */}
              <div className="mb-6">
                <motion.h3
                  className="text-xl font-semibold mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  Types
                </motion.h3>
                <div className="flex gap-3">
                  {pokemon.types.map((typeInfo, index) => (
                    <motion.span
                      key={typeInfo.type.name}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getTypeColor(typeInfo.type.name)}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {typeInfo.type.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <motion.h3
                  className="text-xl font-semibold mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  Abilities
                </motion.h3>
                <div className="flex flex-wrap gap-3">
                  {pokemon.abilities.map((abilityInfo, index) => (
                    <motion.span
                      key={abilityInfo.ability.name}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                        abilityInfo.is_hidden
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {abilityInfo.ability.name}
                      {abilityInfo.is_hidden && ' (Hidden)'}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            className="border-b mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="flex gap-6">
              {(['about', 'stats', 'evolution', 'moves'] as const).map((tab, index) => (
                <motion.button
                  key={tab}
                  className={`pb-3 px-1 capitalize relative ${
                    activeTab === tab
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="mb-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <motion.div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <h3 className="text-xl font-semibold mb-4">Pokédex Data</h3>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-lg bg-card border border-border/50"
                        whileHover={{ y: -3 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <h4 className="font-medium text-muted-foreground mb-2">Description</h4>
                        <p className="mt-1">
                          No description available.
                        </p>
                      </motion.div>
                      <div className="grid grid-cols-2 gap-4">
                        {['Species', 'Color', 'Habitat', 'Shape'].map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-4 rounded-lg bg-card border border-border/50"
                            whileHover={{ y: -3 }}
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <h4 className="font-medium text-muted-foreground">{item}</h4>
                            <p className="capitalize mt-1">Unknown</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <h3 className="text-xl font-semibold mb-4">Base Stats</h3>
                    <div className="space-y-4">
                      {Object.entries(STAT_NAMES).map(([statKey, statName], index) => {
                        const value = getStatValue(statKey);
                        return (
                          <motion.div
                            key={statKey}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="p-3 rounded-lg bg-card border border-border/50"
                            whileHover={{ y: -3 }}
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{statName}</span>
                              <span className="font-bold">{value}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${getStatColor(value)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (value / 255) * 100)}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                              ></motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-3 border-t"
                      >
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-bold text-lg">
                            {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Evolution Tab */}
                {activeTab === 'evolution' && (
                  <motion.div
                    key="evolution"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <h3 className="text-xl font-semibold mb-4">Evolution Chain</h3>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Evolution chain data would be displayed here</p>
                    </div>
                  </motion.div>
                )}

                {/* Moves Tab */}
                {activeTab === 'moves' && (
                  <motion.div
                    key="moves"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <h3 className="text-xl font-semibold mb-4">Moves</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pokemon.moves.slice(0, 8).map((moveInfo, index) => {
                        const moveDetail = moveDetails[moveInfo.move.name];
                        return (
                          <motion.div
                            key={moveInfo.move.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="border rounded-xl p-4 bg-card"
                            whileHover={{
                              y: -5,
                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <div className="font-bold capitalize text-lg mb-2">
                              {moveInfo.move.name.replace('-', ' ')}
                            </div>
                            {moveDetail && (
                              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                <div className="flex justify-between">
                                  <span>Power:</span>
                                  <span className="font-medium">{moveDetail.power || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Accuracy:</span>
                                  <span className="font-medium">{moveDetail.accuracy || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>PP:</span>
                                  <span className="font-medium">{moveDetail.pp || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Type:</span>
                                  <span className="font-medium capitalize">{moveDetail.type.name}</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};