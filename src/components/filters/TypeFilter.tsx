import React from 'react';
import { useFilterStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { getTypeColor } from '@/services';

// List of all Pokémon types
const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const TypeFilter: React.FC = () => {
  const { 
    selectedTypes, 
    setSelectedTypes, 
    toggleType 
  } = useFilterStore();

  const handleTypeClick = (type: string) => {
    toggleType(type);
  };

  const clearAllTypes = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Filter by Type</h3>
        {selectedTypes.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllTypes}
            className="h-6 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const typeColorClass = getTypeColor(type);
          
          return (
            <Button
              key={type}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeClick(type)}
              className={`h-8 text-xs capitalize ${
                isSelected 
                  ? typeColorClass.replace('bg-', 'bg-').replace('text-', 'text-')
                  : `${typeColorClass} hover:opacity-90`
              }`}
            >
              {type}
            </Button>
          );
        })}
      </div>
      
      {selectedTypes.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};