import React from 'react';
import { Button } from '@/components/ui/Button';

interface LoadingErrorProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
}

export const LoadingError: React.FC<LoadingErrorProps> = ({
  loading = false,
  error = null,
  onRetry,
  loadingComponent,
  errorComponent,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        {loadingComponent || (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        {errorComponent || (
          <div className="flex flex-col items-center space-y-4 max-w-md text-center">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h3 className="text-xl font-semibold">Something went wrong</h3>
            <p className="text-muted-foreground">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};