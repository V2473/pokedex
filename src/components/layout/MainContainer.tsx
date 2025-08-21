import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContainer: React.FC<MainContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <main className={`flex-1 ${className}`}>
      <div className="container py-6 md:py-8">
        {children}
      </div>
    </main>
  );
};