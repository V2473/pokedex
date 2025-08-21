import React from 'react';
import { X } from 'lucide-react';
import { useFilterStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { SortOptions } from './SortOptions';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { 
    searchQuery, 
    selectedTypes, 
    selectedGenerations, 
    favoritesOnly,
    resetFilters,
    setFavoritesOnly
  } = useFilterStore();

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedGenerations.length > 0 || favoritesOnly;

  const handleResetFilters = () => {
    resetFilters();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-background w-full max-w-md h-full overflow-y-auto p-6 animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Favorites Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Show Favorites Only</h3>
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className="h-8"
            >
              {favoritesOnly ? "Showing Favorites" : "Show All"}
            </Button>
          </div>

          {/* Type Filter */}
          <TypeFilter />

          {/* Generation Filter */}
          <GenerationFilter />
          
          {/* Sort Options */}
          <SortOptions />

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Active Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Reset All
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                {searchQuery && (
                  <div className="flex items-center justify-between">
                    <span>Search: "{searchQuery}"</span>
                  </div>
                )}
                
                {selectedTypes.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Types: {selectedTypes.join(', ')}</span>
                  </div>
                )}
                
                {selectedGenerations.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Generations: {selectedGenerations.join(', ')}</span>
                  </div>
                )}
                
                {favoritesOnly && (
                  <div className="flex items-center justify-between">
                    <span>Favorites Only</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-2">
          <Button onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};