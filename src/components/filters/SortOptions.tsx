import React from 'react';
import { useFilterStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Sort field options
const SORT_FIELDS = [
  { id: 'id', name: 'Number' },
  { id: 'name', name: 'Name' },
  { id: 'base_experience', name: 'Base Experience' },
  { id: 'height', name: 'Height' },
  { id: 'weight', name: 'Weight' }
];

export const SortOptions: React.FC = () => {
  const { 
    sortBy, 
    setSortBy 
  } = useFilterStore();

  const handleSortFieldChange = (field: string) => {
    // If the same field is selected, toggle the direction
    const newDirection = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    
    setSortBy({
      field: field as 'id' | 'name' | 'base_experience' | 'height' | 'weight',
      direction: newDirection
    });
  };

  const toggleSortDirection = () => {
    setSortBy({
      ...sortBy,
      direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortIcon = (field: string) => {
    if (sortBy.field !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    
    return sortBy.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3" /> 
      : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Sort By</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSortDirection}
          className="h-6 text-xs flex items-center gap-1"
        >
          {sortBy.direction === 'asc' ? 'Ascending' : 'Descending'}
          {sortBy.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SORT_FIELDS.map((field) => (
          <Button
            key={field.id}
            variant={sortBy.field === field.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortFieldChange(field.id)}
            className="h-8 text-xs flex items-center justify-between"
          >
            <span>{field.name}</span>
            {getSortIcon(field.id)}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Currently sorted by: {SORT_FIELDS.find(f => f.id === sortBy.field)?.name} ({sortBy.direction === 'asc' ? 'A-Z' : 'Z-A'})
      </div>
    </div>
  );
};