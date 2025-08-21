import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, setCurrentTheme } = useUIStore();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(systemPrefersDark ? 'dark' : 'light');
    } else {
      setCurrentTheme(newTheme);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('light')}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('dark')}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('system')}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
};