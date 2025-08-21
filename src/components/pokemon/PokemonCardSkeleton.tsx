import React from 'react';

export const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-10 bg-muted rounded"></div>
              <div className="h-6 w-6 bg-muted rounded-full"></div>
            </div>
            <div className="h-6 w-24 bg-muted rounded"></div>
          </div>
          <div className="h-16 w-16 bg-muted rounded-lg"></div>
        </div>

        <div className="flex flex-wrap gap-1">
          {[1, 2].map((i) => (
            <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-muted rounded"></div>
            <div className="h-4 w-8 bg-muted rounded"></div>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-16 bg-muted rounded"></div>
              <div className="flex-1 h-1.5 bg-muted rounded-full"></div>
              <div className="h-3 w-6 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};