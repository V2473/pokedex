import React from 'react';
import { useFilterStore } from '@/stores';
import { Button } from '@/components/ui/Button';

// List of Pokémon generations
const POKEMON_GENERATIONS = [
  { id: 1, name: "Kanto", range: "1-151" },
  { id: 2, name: "Johto", range: "152-251" },
  { id: 3, name: "Hoenn", range: "252-386" },
  { id: 4, name: "Sinnoh", range: "387-493" },
  { id: 5, name: "Unova", range: "494-649" },
  { id: 6, name: "Kalos", range: "650-721" },
  { id: 7, name: "Alola", range: "722-809" },
  { id: 8, name: "Galar", range: "810-898" },
  { id: 9, name: "Paldea", range: "899-1010" }
];

export const GenerationFilter: React.FC = () => {
  const { 
    selectedGenerations, 
    setSelectedGenerations, 
    toggleGeneration 
  } = useFilterStore();

  const handleGenerationClick = (generationId: number) => {
    toggleGeneration(generationId);
  };

  const clearAllGenerations = () => {
    setSelectedGenerations([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Filter by Generation</h3>
        {selectedGenerations.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllGenerations}
            className="h-6 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {POKEMON_GENERATIONS.map((generation) => {
          const isSelected = selectedGenerations.includes(generation.id);
          
          return (
            <Button
              key={generation.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenerationClick(generation.id)}
              className="h-8 text-xs flex flex-col items-center justify-center"
            >
              <span className="font-medium">Gen {generation.id}</span>
              <span className="text-[10px] opacity-80">{generation.name}</span>
            </Button>
          );
        })}
      </div>
      
      {selectedGenerations.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedGenerations.length} generation{selectedGenerations.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};