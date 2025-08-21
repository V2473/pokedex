import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/types';
import { usePokemonStore, useFilterStore, useUIStore } from '@/stores';
import { PokemonCard3D, PokemonCard3DSkeleton } from '@/components/pokemon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination, LoadingError } from '@/components/ui';

interface PokemonGridProps {
  limit?: number;
  showStats?: boolean;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  limit = 20,
  showStats = false
}) => {
  const {
    pokemonList,
    filteredPokemon,
    loading,
    error,
    fetchPokemonList,
    setFilters,
    setPagination,
    count
  } = usePokemonStore();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    selectedGenerations,
    setSelectedGenerations,
    sortBy,
    setSortBy,
    getFilterOptions,
    getPaginationOptions,
    currentPage,
    itemsPerPage
  } = useFilterStore();
  
  const { openModal } = useUIStore();
  
  const [isSearching, setIsSearching] = useState(false);

  // Load initial Pokémon data
  useEffect(() => {
    const loadInitialPokemon = async () => {
      // Set pagination options
      setPagination({ limit: itemsPerPage, offset: 0 });
      
      // Fetch the Pokémon list
      await fetchPokemonList();
    };

    loadInitialPokemon();
  }, [itemsPerPage, fetchPokemonList, setPagination]);

  // Handle search and filters
  useEffect(() => {
    const applyFilters = () => {
      // Update filters in the PokemonStore
      setFilters({
        search: searchQuery || undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        generation: selectedGenerations.length === 1 ? selectedGenerations[0] : undefined,
      });
    };

    applyFilters();
  }, [searchQuery, selectedTypes, selectedGenerations, setFilters]);

  // Handle page change
  useEffect(() => {
    const handlePageChange = async () => {
      const pagination = getPaginationOptions();
      setPagination(pagination);
      await fetchPokemonList();
    };

    handlePageChange();
  }, [currentPage, itemsPerPage, fetchPokemonList, setPagination, getPaginationOptions]);

  // Handle Pokémon card click
  const handlePokemonClick = (pokemon: Pokemon) => {
    openModal('pokemon', pokemon);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <PokemonCard3DSkeleton key={`skeleton-${index}`} />
    ));
  };

  // Handle retry function
  const handleRetry = () => {
    fetchPokemonList();
  };

  // Determine which list to display
  const displayList = searchQuery || selectedTypes.length > 0 || selectedGenerations.length > 0 
    ? filteredPokemon 
    : pokemonList;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2" role="search" aria-label="Search Pokémon">
        <Input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          aria-label="Search Pokémon by name"
        />
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setSelectedTypes([]);
            setSelectedGenerations([]);
          }}
          aria-label="Clear all filters"
        >
          Clear
        </Button>
      </div>

      {/* Active Filters */}
      {(selectedTypes.length > 0 || selectedGenerations.length > 0) && (
        <div className="flex flex-wrap gap-2" role="region" aria-label="Active filters">
          {selectedTypes.map(type => (
            <span
              key={type}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              role="status"
              aria-label={`Filter: ${type} type`}
            >
              {type}
              <button
                onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                className="rounded-full hover:bg-blue-200"
                aria-label={`Remove ${type} type filter`}
              >
                ×
              </button>
            </span>
          ))}
          {selectedGenerations.map(gen => (
            <span
              key={gen}
              className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
              role="status"
              aria-label={`Filter: Generation ${gen}`}
            >
              Generation {gen}
              <button
                onClick={() => setSelectedGenerations(selectedGenerations.filter(g => g !== gen))}
                className="rounded-full hover:bg-green-200"
                aria-label={`Remove Generation ${gen} filter`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Loading and Error Handling */}
      <LoadingError
        loading={loading === 'loading' && displayList.length === 0}
        error={error}
        onRetry={handleRetry}
        loadingComponent={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderSkeletons()}
          </div>
        }
      />

      {/* Pokémon Grid */}
      {loading !== 'loading' && !error && displayList.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-xl bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm border border-border/50 shadow-lg"
            style={{
              transform: 'perspective(1500px) rotateX(2deg)',
              transformStyle: 'preserve-3d'
            }}
            layout
            role="list"
            aria-label="Pokémon list"
          >
            <AnimatePresence>
              {displayList.map((p: Pokemon, index) => (
                <motion.div
                  key={p.id}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotateY: -15,
                    z: -50
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    z: 0
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    rotateY: 15,
                    z: -50
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  layout
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                  role="listitem"
                >
                  <PokemonCard3D
                    pokemon={p}
                    onClick={() => handlePokemonClick(p)}
                    showStats={showStats}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <motion.div
            className="pt-6 flex justify-center"
            initial={{
              opacity: 0,
              y: 20,
              rotateX: 10
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0
            }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            role="navigation"
            aria-label="Pagination"
          >
            <div className="transform-gpu hover:scale-105 transition-transform duration-300">
              <Pagination totalItems={count} />
            </div>
          </motion.div>
        </>
      )}

      {/* No Results Message */}
      {loading !== 'loading' && !error && displayList.length === 0 && (
        <div className="text-center py-8" role="status" aria-live="polite">
          <p className="text-muted-foreground">No Pokémon found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};