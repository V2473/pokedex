import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useFilterStore } from '@/stores';

interface PaginationProps {
  totalItems: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  totalItems, 
  className = '' 
}) => {
  const { 
    currentPage, 
    itemsPerPage, 
    setCurrentPage,
    setItemsPerPage 
  } = useFilterStore();

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If there are fewer pages than the max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);
      
      // Calculate the start and end of the page range around the current page
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
      
      // Adjust the start if we're near the end
      if (end === totalPages - 1) {
        start = Math.max(2, end - maxVisiblePages + 3);
      }
      
      // Add ellipsis if there's a gap between the first page and the start
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add the pages in the range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if there's a gap between the end and the last page
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show the last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Items per page:</span>
        <select 
          value={itemsPerPage} 
          onChange={handleItemsPerPageChange}
          className="border rounded px-2 py-1 bg-background"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      
      <motion.div className="flex items-center gap-1" layout>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Go to first page"
            aria-disabled={currentPage === 1}
          >
            &laquo;
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          >
            &lsaquo;
          </Button>
        </motion.div>
        
        <div className="flex gap-1" role="group" aria-label="Pagination">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                <span className="h-8 w-8 flex items-center justify-center" aria-hidden="true">...</span>
              ) : (
                <motion.div
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={() => handlePageChange(page as number)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          >
            &rsaquo;
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Go to last page"
            aria-disabled={currentPage === totalPages}
          >
            &raquo;
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </div>
    </div>
  );
};