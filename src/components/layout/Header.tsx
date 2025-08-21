import React from 'react';
import { Search, Menu, Settings, Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const Header: React.FC = () => {
  const { 
    theme, 
    currentTheme, 
    setTheme, 
    setCurrentTheme,
    mobileMenuOpen, 
    setMobileMenuOpen,
    openModal 
  } = useUIStore();

  const handleThemeToggle = () => {
    if (theme === 'system') {
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      setCurrentTheme(newTheme);
    } else {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      setCurrentTheme(newTheme);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Pokédex
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Pokémon
            </a>
            <a
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Types
            </a>
            <a
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Generations
            </a>
            <a
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Favorites
            </a>
          </nav>
        </div>
        
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Search Pokémon..."
                  className="pl-8"
                />
              </div>
            </form>
          </div>
          
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {currentTheme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal('settings')}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};