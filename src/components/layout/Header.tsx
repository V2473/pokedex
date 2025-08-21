'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Settings } from 'lucide-react';
import { useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme';

export const Header: React.FC = () => {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    openModal
  } = useUIStore();

  return (
    <motion.header
      className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="container flex h-14 items-center">
        <motion.div
          className="mr-4 hidden md:flex"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.a
            className="mr-6 flex items-center space-x-2"
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.span
              className="hidden font-bold sm:inline-block text-xl"
              whileHover={{
                textShadow: '0 0 8px rgba(var(--primary), 0.5)',
                y: -2
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              Pokédex
            </motion.span>
          </motion.a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {['Pokémon', 'Types', 'Generations', 'Favorites'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className={`transition-colors ${
                  index === 0
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{
                  y: -3,
                  scale: 1.05,
                  textShadow: '0 0 5px rgba(var(--primary), 0.3)'
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </motion.div>
        
        <motion.div
          className="flex flex-1 items-center justify-end space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <nav className="flex items-center space-x-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openModal('settings')}
                aria-label="Settings"
                whileHover={{
                  scale: 1.1,
                  rotate: -15,
                  y: -3
                }}
                whileTap={{ scale: 0.9 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
};